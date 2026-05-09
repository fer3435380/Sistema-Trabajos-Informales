package com.microjobs.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

import io.github.cdimascio.dotenv.Dotenv;

public class RabbitMQConfig {
    
    private static final Logger logger = LoggerFactory.getLogger(RabbitMQConfig.class);
    private final String host;
    private final int    port;
    private final String username;
    private final String password;
    private final String queueName;

    private Connection connection;

    public RabbitMQConfig(){
        Dotenv dotenv = Dotenv.configure()
                        .ignoreIfMissing()
                        .load();

        this.host = dotenv.get("RABBITMQ_HOST", "localhost");
        this.port = Integer.parseInt(dotenv.get("RABBITMQ_PORT", "5672"));
        this.username  = dotenv.get("RABBITMQ_USER",     "guest");
        this.password  = dotenv.get("RABBITMQ_PASSWORD", "guest");
        this.queueName = dotenv.get("RABBITMQ_QUEUE",    "microjobs_events");

        logger.info("Configuración de RabbitMQ cargada: host={}, port={} | Cola: {}", host, port, queueName);
    }

    public void connect() throws Exception {
        if (connection != null && connection.isOpen()){
            logger.warn("Ya existe una conexión abierta a RabbitMQ, reutilizando");
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
        logger.info("Conexión establecida con RabbitMQ en {}: {}", host, port);
    }

    public Channel createChannel() throws Exception {
        if (connection == null || !connection.isOpen()){
            throw new IllegalStateException("No hay conexión abierta a RabbitMQ. LLama a connect() primero.");
        }

        Channel channel = connection.createChannel();

        channel.queueDeclare(
            queueName,
            true,
            false,
            false,
            null
        );

        channel.basicQos(1);
        return channel;
    }

    public void close(){
        try{
            if (connection != null && connection.isOpen()){
                connection.close();
                logger.info("Conexión a RabbitMQ cerrada correctamente.");
            }
        } catch (Exception e) {
            logger.error("Error al cerrar la conexión a RabbitMQ: {}", e.getMessage());
        }
    }

    public String getQueueName() {
        return queueName;
    }

    public Connection getConnection() {
        return connection;
    }

}
