package com.microjobs.consumer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.microjobs.config.RabbitMQConfig;
import com.microjobs.models.EventoPostulacion;
import com.microjobs.processor.EventProcessor;
import com.microjobs.threads.ThreadPoolManager;
import com.microjobs.utils.JsonUtil;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.DeliverCallback;

public class RabbitConsumer {

    private static final Logger logger = LoggerFactory.getLogger(RabbitConsumer.class);

    private final RabbitMQConfig    rabbitMQConfig;
    private final ThreadPoolManager threadPoolManager;
    private final EventProcessor    eventProcessor;

    private Channel channel;

    public RabbitConsumer(RabbitMQConfig rabbitMQConfig,
                          ThreadPoolManager threadPoolManager,
                          EventProcessor eventProcessor) {
        this.rabbitMQConfig    = rabbitMQConfig;
        this.threadPoolManager = threadPoolManager;
        this.eventProcessor    = eventProcessor;
    }

    public void iniciar() throws Exception {
        this.channel = rabbitMQConfig.createChannel();

        logger.info("👂 RabbitConsumer escuchando cola '{}'...", rabbitMQConfig.getQueueName());

        DeliverCallback deliverCallback = (consumerTag, delivery) -> {
            long deliveryTag    = delivery.getEnvelope().getDeliveryTag();
            String jsonRecibido = new String(delivery.getBody());

            logger.info("📨 Mensaje recibido [tag={}]: {}", deliveryTag, jsonRecibido);

            EventoPostulacion evento = JsonUtil.fromBytes(delivery.getBody(), EventoPostulacion.class);

            if (evento == null || evento.eventType() == null) {
                logger.error("❌ Mensaje inválido o mal formado, descartando [tag={}]", deliveryTag);
                channel.basicNack(deliveryTag, false, false);
                return;
            }

            threadPoolManager.submit(() -> procesarEvento(evento, deliveryTag));
        };

        channel.basicConsume(
                rabbitMQConfig.getQueueName(),
                false,
                deliverCallback,
                consumerTag -> logger.warn("⚠ Consumer cancelado por RabbitMQ: {}", consumerTag)
        );
    }

    private void procesarEvento(EventoPostulacion evento, long deliveryTag) {
        try {
            logger.info("⚙ Procesando evento [tag={}] tipo='{}' application_id={}",
                    deliveryTag, evento.eventType(), evento.applicationId());

            eventProcessor.procesar(evento);

            channel.basicAck(deliveryTag, false);
            logger.info("✅ Evento procesado y confirmado [tag={}]", deliveryTag);

        } catch (Exception e) {
            logger.error("❌ Error procesando evento [tag={}]: {}", deliveryTag, e.getMessage(), e);

            try {
                channel.basicNack(deliveryTag, false, false);
                logger.warn("⚠ Mensaje rechazado (NACK) [tag={}]", deliveryTag);
            } catch (Exception nackEx) {
                logger.error("❌ Error enviando NACK [tag={}]: {}", deliveryTag, nackEx.getMessage());
            }
        }
    }

    public void cerrar() {
        try {
            if (channel != null && channel.isOpen()) {
                channel.close();
                logger.info("Canal RabbitMQ cerrado correctamente.");
            }
        } catch (Exception e) {
            logger.error("Error cerrando canal RabbitMQ: {}", e.getMessage());
        }
    }
}