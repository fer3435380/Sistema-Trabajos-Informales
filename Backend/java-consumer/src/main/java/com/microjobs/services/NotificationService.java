package com.microjobs.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.microjobs.models.EventoPostulacion;
import com.microjobs.models.Notification;

public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    private static final String EMAIL_PREFIX = "📧 [EMAIL]";
    private static final String PUSH_PREFIX  = "📱 [PUSH] ";

    public Notification generarParaDueno(EventoPostulacion evento) {
        Notification notificacion = Notification.forOwner(evento);

        logger.info("🔔 Notificación generada para dueño | usuario_id={} | tipo='{}' | mensaje='{}'",
                notificacion.getUserId(),
                notificacion.getType(),
                notificacion.getMessage());

        return notificacion;
    }

    public Notification generarParaPostulanteAceptado(EventoPostulacion evento) {
        Notification notificacion = Notification.forApplicantAccepted(evento);

        logger.info("🔔 Notificación generada para postulante aceptado | usuario_id={} | tipo='{}' | mensaje='{}'",
                notificacion.getUserId(),
                notificacion.getType(),
                notificacion.getMessage());

        return notificacion;
    }

    public Notification generarParaPostulanteRechazado(EventoPostulacion evento) {
        Notification notificacion = Notification.forApplicantRejected(evento);

        logger.info("🔔 Notificación generada para postulante rechazado | usuario_id={} | tipo='{}' | mensaje='{}'",
                notificacion.getUserId(),
                notificacion.getType(),
                notificacion.getMessage());

        return notificacion;
    }

    public void simularEnvio(Notification notificacion) {
        logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        logger.info("📤 Simulando envío de notificación");
        logger.info("   Usuario  : {}", notificacion.getUserId());
        logger.info("   Tipo     : {}", notificacion.getType());
        logger.info("   Mensaje  : {}", notificacion.getMessage());
        logger.info("   Fecha    : {}", notificacion.getDate());
        logger.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

        simularEmail(notificacion);
        simularPush(notificacion);
    }

    private void simularEmail(Notification notificacion) {
        logger.info("{} Para usuario_id={} | Asunto: '{}' | Cuerpo: '{}'",
                EMAIL_PREFIX,
                notificacion.getUserId(),
                construirAsunto(notificacion),
                notificacion.getMessage());
    }

    private void simularPush(Notification notificacion) {
        logger.info("{} Para usuario_id={} | Título: '{}' | Cuerpo: '{}'",
                PUSH_PREFIX,
                notificacion.getUserId(),
                construirTituloPush(notificacion),
                notificacion.getMessage());
    }

    private String construirAsunto(Notification notificacion) {
        return switch (notificacion.getType()) {
            case EventoPostulacion.CREATED_TYPE    -> "Nueva postulación recibida";
            case EventoPostulacion.ACCEPTED_TYPE  -> "¡Tu postulación fue aceptada!";
            case EventoPostulacion.REJECTED_TYPE -> "Actualización sobre tu postulación";
            default                               -> "Notificación de Microjobs";
        };
    }

    private String construirTituloPush(Notification notificacion) {
        return switch (notificacion.getType()) {
            case EventoPostulacion.CREATED_TYPE    -> "📋 Nueva postulación";
            case EventoPostulacion.ACCEPTED_TYPE  -> "🎉 ¡Postulación aceptada!";
            case EventoPostulacion.REJECTED_TYPE -> "❌ Postulación rechazada";
            default                               -> "🔔 Microjobs";
        };
    }
}