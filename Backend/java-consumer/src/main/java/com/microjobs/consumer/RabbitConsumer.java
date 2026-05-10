package com.microjobs.consumer;

import com.microjobs.config.RabbitMQConfig;
import com.microjobs.models.ApplicationEvent;
import com.microjobs.processor.EventProcessor;
import com.microjobs.threads.ThreadPoolManager;
import com.microjobs.utils.JsonUtil;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.DeliverCallback;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RabbitConsumer {

    private static final Logger logger = LoggerFactory.getLogger(RabbitConsumer.class);

    private final RabbitMQConfig rabbitMQConfig;
    private final ThreadPoolManager threadPoolManager;
    private final EventProcessor eventProcessor;

    private Channel channel;
    private final Object channelLock = new Object();

    public RabbitConsumer(
            RabbitMQConfig rabbitMQConfig,
            ThreadPoolManager threadPoolManager,
            EventProcessor eventProcessor
    ) {
        this.rabbitMQConfig = rabbitMQConfig;
        this.threadPoolManager = threadPoolManager;
        this.eventProcessor = eventProcessor;
    }

    public void start() throws Exception {
        this.channel = rabbitMQConfig.createChannel();

        logger.info("RabbitConsumer escuchando la cola '{}'.", rabbitMQConfig.getQueueName());

        DeliverCallback deliverCallback = (consumerTag, delivery) -> {
            long deliveryTag = delivery.getEnvelope().getDeliveryTag();
            String receivedJson = new String(delivery.getBody());

            logger.info("Mensaje recibido [tag={}]: {}", deliveryTag, receivedJson);

            ApplicationEvent event = JsonUtil.fromBytes(delivery.getBody(), ApplicationEvent.class);

            if (event == null || event.eventType() == null) {
                logger.error("Mensaje invalido o mal formado. Se descartara [tag={}].", deliveryTag);
                try {
                    rejectMessage(deliveryTag);
                } catch (Exception nackException) {
                    logger.error("Error enviando NACK para mensaje invalido [tag={}]: {}", deliveryTag, nackException.getMessage(), nackException);
                }
                return;
            }

            logger.info(
                    "Mensaje [tag={}] asignado al pool | event_type='{}' | application_id={}",
                    deliveryTag,
                    event.eventType(),
                    event.applicationId()
            );

            threadPoolManager.submit(() -> processEvent(event, deliveryTag));
        };

        channel.basicConsume(
                rabbitMQConfig.getQueueName(),
                false,
                deliverCallback,
                consumerTag -> logger.warn("Consumer cancelado por RabbitMQ: {}", consumerTag)
        );
    }

    private void processEvent(ApplicationEvent event, long deliveryTag) {
        try {
            logger.info(
                    "Procesando mensaje [tag={}] | tipo='{}' | application_id={}",
                    deliveryTag,
                    event.eventType(),
                    event.applicationId()
            );

            Thread.sleep(5000);

            eventProcessor.process(event);

            acknowledgeMessage(deliveryTag);
            logger.info("Mensaje procesado y confirmado con ACK [tag={}].", deliveryTag);
        } catch (Exception e) {
            logger.error("Error procesando mensaje [tag={}]: {}", deliveryTag, e.getMessage(), e);

            try {
                rejectMessage(deliveryTag);
                logger.warn("Mensaje rechazado con NACK [tag={}].", deliveryTag);
            } catch (Exception nackException) {
                logger.error("Error enviando NACK [tag={}]: {}", deliveryTag, nackException.getMessage(), nackException);
            }
        }
    }

    private void acknowledgeMessage(long deliveryTag) throws Exception {
        synchronized (channelLock) {
            channel.basicAck(deliveryTag, false);
        }
    }

    private void rejectMessage(long deliveryTag) throws Exception {
        synchronized (channelLock) {
            channel.basicNack(deliveryTag, false, false);
        }
    }

    public void close() {
        try {
            synchronized (channelLock) {
                if (channel != null && channel.isOpen()) {
                    channel.close();
                    logger.info("Canal RabbitMQ cerrado correctamente.");
                }
            }
        } catch (Exception e) {
            logger.error("Error al cerrar el canal RabbitMQ: {}", e.getMessage(), e);
        }
    }
}
