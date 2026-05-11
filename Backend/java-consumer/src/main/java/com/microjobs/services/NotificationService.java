package com.microjobs.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.microjobs.models.ApplicationEvent;
import com.microjobs.models.Notification;

public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);
    private static final String SECTION_LINE = "----------------------------------------";

    public Notification buildForOwner(ApplicationEvent event) {
        Notification notification = Notification.forOwner(event);

        logger.info(
                "Notificacion creada para el duenio | recipient={} | tipo='{}' | mensaje='{}'",
                notification.getRecipient(),
                notification.getType(),
                notification.getMessage()
        );

        return notification;
    }

    public Notification buildForAcceptedApplicant(ApplicationEvent event) {
        Notification notification = Notification.forApplicantAccepted(event);

        logger.info(
                "Notificacion creada para postulante aceptado | recipient={} | tipo='{}' | mensaje='{}'",
                notification.getRecipient(),
                notification.getType(),
                notification.getMessage()
        );

        return notification;
    }

    public Notification buildForRejectedApplicant(ApplicationEvent event) {
        Notification notification = Notification.forApplicantRejected(event);

        logger.info(
                "Notificacion creada para postulante rechazado | recipient={} | tipo='{}' | mensaje='{}'",
                notification.getRecipient(),
                notification.getType(),
                notification.getMessage()
        );

        return notification;
    }

    public void simulateDelivery(Notification notification) {
        logger.info(SECTION_LINE);
        logger.info("Simulando envio de notificacion");
        logger.info("Destinatario : {}", notification.getRecipient());
        logger.info("Tipo         : {}", notification.getType());
        logger.info("Mensaje      : {}", notification.getMessage());
        logger.info(SECTION_LINE);
    }
}
