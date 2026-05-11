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
    private static final String BANNER_LINE = "========================================";

    public static void main(String[] args) {
        logBanner("Iniciando Java Consumer - Microjobs");

        RabbitMQConfig rabbitConfig = new RabbitMQConfig();
        ThreadPoolManager threadPool = new ThreadPoolManager();
        NotificationService notificationService = new NotificationService();
        PythonApiService pythonApiService = new PythonApiService();
        EventProcessor eventProcessor = new EventProcessor(notificationService, pythonApiService);
        RabbitConsumer rabbitConsumer = new RabbitConsumer(rabbitConfig, threadPool, eventProcessor);

        registerShutdownHook(rabbitConfig, threadPool, rabbitConsumer);

        try {
            rabbitConfig.connect();
            rabbitConsumer.start();
        } catch (Exception e) {
            logger.error("Error fatal al iniciar el consumer: {}", e.getMessage(), e);
            System.exit(1);
        }
    }

    private static void registerShutdownHook(
            RabbitMQConfig rabbitConfig,
            ThreadPoolManager threadPool,
            RabbitConsumer rabbitConsumer
    ) {
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            logBanner("Deteniendo Java Consumer - Microjobs");
            rabbitConsumer.close();
            threadPool.shutdown();
            rabbitConfig.close();
            logger.info("Sistema detenido correctamente.");
        }));
    }

    private static void logBanner(String title) {
        logger.info(BANNER_LINE);
        logger.info("  {}", title);
        logger.info(BANNER_LINE);
    }
}
