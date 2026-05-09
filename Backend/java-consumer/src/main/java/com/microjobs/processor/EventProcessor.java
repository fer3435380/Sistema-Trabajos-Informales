package com.microjobs.processor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.microjobs.models.EventoPostulacion;
import com.microjobs.models.Notification;
import com.microjobs.services.NotificationService;
import com.microjobs.services.PythonApiService;

public class EventProcessor {

    private static final Logger logger = LoggerFactory.getLogger(EventProcessor.class);

    private final NotificationService notificationService;
    private final PythonApiService    pythonApiService;

    public EventProcessor(NotificationService notificationService,
                          PythonApiService pythonApiService) {
        this.notificationService = notificationService;
        this.pythonApiService    = pythonApiService;
    }

    public void procesar(EventoPostulacion evento) throws Exception {
        logger.info("🔄 Procesando evento tipo='{}' | application_id={} | job_id={}",
                evento.eventType(), evento.applicationId(), evento.jobId());

        switch (evento.eventType()) {
            case EventoPostulacion.CREATED_TYPE    -> procesarPostulacionCreada(evento);
            case EventoPostulacion.ACCEPTED_TYPE  -> procesarPostulacionAceptada(evento);
            case EventoPostulacion.REJECTED_TYPE -> procesarPostulacionRechazada(evento);
            default -> logger.warn("Tipo de evento desconocido: '{}' — descartando", evento.eventType());
        }
    }

    private void procesarPostulacionCreada(EventoPostulacion evento) throws Exception {
        logger.info("Postulación creada | applicant_id={} → job_id={} (owner_id={})",
                evento.applicantId(), evento.jobId(), evento.ownerId());

        Notification notificacion = notificationService.generarParaDueno(evento);
        pythonApiService.guardarNotificacion(notificacion);
        notificationService.simularEnvio(notificacion);

        logger.info("postulacion_creada procesada | Notificación enviada a owner_id={}",
                evento.ownerId());
    }

    private void procesarPostulacionAceptada(EventoPostulacion evento) throws Exception {
        logger.info("Postulación aceptada | application_id={} | applicant_id={}",
                evento.applicationId(), evento.applicantId());

        Notification notificacion = notificationService.generarParaPostulanteAceptado(evento);
        pythonApiService.guardarNotificacion(notificacion);
        pythonApiService.actualizarEstadoPostulacion(evento.applicationId(), evento.status());
        notificationService.simularEnvio(notificacion);

        logger.info("postulacion_aceptada procesada | Notificación enviada a applicant_id={}",
                evento.applicantId());
    }

    private void procesarPostulacionRechazada(EventoPostulacion evento) throws Exception {
        logger.info("Postulación rechazada | application_id={} | applicant_id={}",
                evento.applicationId(), evento.applicantId());

        Notification notificacion = notificationService.generarParaPostulanteRechazado(evento);
        pythonApiService.guardarNotificacion(notificacion);
        pythonApiService.actualizarEstadoPostulacion(evento.applicationId(), evento.status());
        notificationService.simularEnvio(notificacion);

        logger.info("Postulacion_rechazada procesada | Notificación enviada a applicant_id={}",
                evento.applicantId());
    }
}