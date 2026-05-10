package com.microjobs.processor;

import com.microjobs.models.EventoPostulacion;
import com.microjobs.models.Notification;
import com.microjobs.services.NotificationService;
import com.microjobs.services.PythonApiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class EventProcessor {

    private static final Logger logger = LoggerFactory.getLogger(EventProcessor.class);

    private final NotificationService notificationService;
    private final PythonApiService pythonApiService;

    public EventProcessor(
            NotificationService notificationService,
            PythonApiService pythonApiService
    ) {
        this.notificationService = notificationService;
        this.pythonApiService = pythonApiService;
    }

    public void procesar(EventoPostulacion evento) throws Exception {
        logger.info(
                "Procesando evento | tipo='{}' | application_id={} | job_id={}",
                evento.eventType(),
                evento.applicationId(),
                evento.jobId()
        );

        switch (evento.eventType()) {
            case EventoPostulacion.CREATED_TYPE -> procesarPostulacionCreada(evento);
            case EventoPostulacion.ACCEPTED_TYPE -> procesarPostulacionAceptada(evento);
            case EventoPostulacion.REJECTED_TYPE -> procesarPostulacionRechazada(evento);
            default -> logger.warn("Tipo de evento desconocido '{}'. Se descartara el mensaje.", evento.eventType());
        }
    }

    private void procesarPostulacionCreada(EventoPostulacion evento) throws Exception {
        logger.info(
                "Flujo postulacion creada | applicant_id={} | job_id={} | owner_id={}",
                evento.applicantId(),
                evento.jobId(),
                evento.ownerId()
        );

        Notification notificacion = notificationService.generarParaDueno(evento);
        pythonApiService.guardarNotificacion(notificacion);

        logger.info("Flujo de postulacion creada completado | owner_id={}", evento.ownerId());
    }

    private void procesarPostulacionAceptada(EventoPostulacion evento) throws Exception {
        logger.info(
                "Flujo postulacion aceptada | application_id={} | applicant_id={}",
                evento.applicationId(),
                evento.applicantId()
        );

        Notification notificacion = notificationService.generarParaPostulanteAceptado(evento);
        pythonApiService.guardarNotificacion(notificacion);

        logger.info("Flujo de postulacion aceptada completado | applicant_id={}", evento.applicantId());
    }

    private void procesarPostulacionRechazada(EventoPostulacion evento) throws Exception {
        logger.info(
                "Flujo postulacion rechazada | application_id={} | applicant_id={}",
                evento.applicationId(),
                evento.applicantId()
        );

        Notification notificacion = notificationService.generarParaPostulanteRechazado(evento);
        pythonApiService.guardarNotificacion(notificacion);

        logger.info("Flujo de postulacion rechazada completado | applicant_id={}", evento.applicantId());
    }
}
