package com.microjobs.config;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;
import io.github.cdimascio.dotenv.Dotenv;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class RabbitMQConfig {

    private static final Logger logger = LoggerFactory.getLogger(RabbitMQConfig.class);

    private final String host;
    private final int port;
    private final String username;
    private final String password;
    private final String queueName;
    private final int prefetchCount;

    private Connection connection;

    public RabbitMQConfig() {
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()
                .load();

        this.host = dotenv.get("RABBITMQ_HOST", "localhost");
        this.port = Integer.parseInt(dotenv.get("RABBITMQ_PORT", "5672"));
        this.username = dotenv.get("RABBITMQ_USER", "guest");
        this.password = dotenv.get("RABBITMQ_PASSWORD", "guest");
        this.queueName = dotenv.get("RABBITMQ_QUEUE", "job_events");
        this.prefetchCount = Integer.parseInt(
                dotenv.get("RABBITMQ_PREFETCH_COUNT", dotenv.get("THREAD_POOL_SIZE", "10"))
        );

        logger.info(
                "Configuracion RabbitMQ cargada | host={} | puerto={} | cola={} | prefetch={}",
                host,
                port,
                queueName,
                prefetchCount
        );
    }

    public void connect() throws Exception {
        if (connection != null && connection.isOpen()) {
            logger.warn("Ya existe una conexion RabbitMQ abierta. Se reutilizara.");
            return;
        }

        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost(host);
        factory.setPort(port);
        factory.setUsername(username);
        factory.setPassword(password);
        factory.setAutomaticRecoveryEnabled(true);
        factory.setNetworkRecoveryInterval(5000);

        this.connection = factory.newConnection("java-consumer");
        logger.info("Conexion RabbitMQ establecida en {}:{}.", host, port);
    }

    public Channel createChannel() throws Exception {
        if (connection == null || !connection.isOpen()) {
            throw new IllegalStateException("No hay una conexion RabbitMQ abierta. Llama a connect() primero.");
        }

        Channel channel = connection.createChannel();
        channel.queueDeclare(queueName, true, false, false, null);
        channel.basicQos(prefetchCount);
        return channel;
    }

    public void close() {
        try {
            if (connection != null && connection.isOpen()) {
                connection.close();
                logger.info("Conexion RabbitMQ cerrada correctamente.");
            }
        } catch (Exception e) {
            logger.error("Error al cerrar la conexion RabbitMQ: {}", e.getMessage(), e);
        }
    }

    public String getQueueName() {
        return queueName;
    }

    public Connection getConnection() {
        return connection;
    }
}
