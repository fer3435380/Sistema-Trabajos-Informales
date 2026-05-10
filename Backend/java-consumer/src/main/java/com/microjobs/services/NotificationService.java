package com.microjobs.services;

import com.microjobs.models.EventoPostulacion;
import com.microjobs.models.Notification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);
    private static final String EMAIL_PREFIX = "[EMAIL]";
    private static final String PUSH_PREFIX = "[PUSH]";
    private static final String SECTION_LINE = "----------------------------------------";

    public Notification generarParaDueno(EventoPostulacion evento) {
        Notification notificacion = Notification.forOwner(evento);

        logger.info(
                "Notificacion creada para el duenio | recipient={} | tipo='{}' | mensaje='{}'",
                notificacion.getRecipient(),
                notificacion.getType(),
                notificacion.getMessage()
        );

        return notificacion;
    }

    public Notification generarParaPostulanteAceptado(EventoPostulacion evento) {
        Notification notificacion = Notification.forApplicantAccepted(evento);

        logger.info(
                "Notificacion creada para postulante aceptado | recipient={} | tipo='{}' | mensaje='{}'",
                notificacion.getRecipient(),
                notificacion.getType(),
                notificacion.getMessage()
        );

        return notificacion;
    }

    public Notification generarParaPostulanteRechazado(EventoPostulacion evento) {
        Notification notificacion = Notification.forApplicantRejected(evento);

        logger.info(
                "Notificacion creada para postulante rechazado | recipient={} | tipo='{}' | mensaje='{}'",
                notificacion.getRecipient(),
                notificacion.getType(),
                notificacion.getMessage()
        );

        return notificacion;
    }

    public void simularEnvio(Notification notificacion) {
        logger.info(SECTION_LINE);
        logger.info("Simulando envio de notificacion");
        logger.info("Destinatario : {}", notificacion.getRecipient());
        logger.info("Tipo         : {}", notificacion.getType());
        logger.info("Mensaje      : {}", notificacion.getMessage());
        logger.info(SECTION_LINE);

        simularEmail(notificacion);
        simularPush(notificacion);
    }

    private void simularEmail(Notification notificacion) {
        logger.info(
                "{} recipient={} | Asunto='{}' | Cuerpo='{}'",
                EMAIL_PREFIX,
                notificacion.getRecipient(),
                construirAsunto(notificacion),
                notificacion.getMessage()
        );
    }

    private void simularPush(Notification notificacion) {
        logger.info(
                "{} recipient={} | Titulo='{}' | Cuerpo='{}'",
                PUSH_PREFIX,
                notificacion.getRecipient(),
                construirTituloPush(notificacion),
                notificacion.getMessage()
        );
    }

    private String construirAsunto(Notification notificacion) {
        return switch (notificacion.getType()) {
            case EventoPostulacion.CREATED_TYPE -> "Nueva postulacion recibida";
            case EventoPostulacion.ACCEPTED_TYPE -> "Tu postulacion fue aceptada";
            case EventoPostulacion.REJECTED_TYPE -> "Actualizacion sobre tu postulacion";
            default -> "Notificacion de Microjobs";
        };
    }

    private String construirTituloPush(Notification notificacion) {
        return switch (notificacion.getType()) {
            case EventoPostulacion.CREATED_TYPE -> "Nueva postulacion";
            case EventoPostulacion.ACCEPTED_TYPE -> "Postulacion aceptada";
            case EventoPostulacion.REJECTED_TYPE -> "Postulacion rechazada";
            default -> "Microjobs";
        };
    }
}
