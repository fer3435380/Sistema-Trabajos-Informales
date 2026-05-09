package com.microjobs;

import com.microjobs.config.RabbitMQConfig;
import com.microjobs.consumer.RabbitConsumer;
import com.microjobs.processor.EventProcessor;
import com.microjobs.services.NotificationService;
import com.microjobs.services.PythonApiService;
import com.microjobs.threads.ThreadPoolManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Main {

    private static final Logger logger = LoggerFactory.getLogger(Main.class);

    public static void main(String[] args) {
        logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        logger.info("  🚀 Iniciando Java Consumer - Microjobs ");
        logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

        RabbitMQConfig    rabbitMQConfig    = new RabbitMQConfig();
        ThreadPoolManager threadPoolManager = new ThreadPoolManager();
        NotificationService notificationService = new NotificationService();
        PythonApiService    pythonApiService    = new PythonApiService();
        EventProcessor      eventProcessor      = new EventProcessor(notificationService, pythonApiService);
        RabbitConsumer      rabbitConsumer      = new RabbitConsumer(rabbitMQConfig, threadPoolManager, eventProcessor);

        registrarShutdownHook(rabbitMQConfig, threadPoolManager, rabbitConsumer);

        try {
            rabbitMQConfig.connect();
            rabbitConsumer.iniciar();
        } catch (Exception e) {
            logger.error("❌ Error fatal iniciando el consumer: {}", e.getMessage(), e);
            System.exit(1);
        }
    }

    private static void registrarShutdownHook(RabbitMQConfig rabbitMQConfig,
                                               ThreadPoolManager threadPoolManager,
                                               RabbitConsumer rabbitConsumer) {
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            logger.info("  ⏳ Apagando Java Consumer - Microjobs  ");
            logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            rabbitConsumer.cerrar();
            threadPoolManager.shutdown();
            rabbitMQConfig.close();
            logger.info("✅ Sistema apagado correctamente.");
        }));
    }
}