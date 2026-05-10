package com.microjobs.processor;

import com.microjobs.models.ApplicationDetails;
import com.microjobs.models.ApplicationEvent;
import com.microjobs.models.Notification;
import com.microjobs.services.NotificationService;
import com.microjobs.services.PythonApiService;
import com.microjobs.utils.ApplicationEventMapper;
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

    public void process(ApplicationEvent event) throws Exception {
        ApplicationEvent enrichedEvent = enrichEvent(event);

        logger.info(
                "Procesando evento | tipo='{}' | application_id={} | job_id={} | applicant_id={} | owner_id={}",
                enrichedEvent.eventType(),
                enrichedEvent.applicationId(),
                enrichedEvent.jobId(),
                enrichedEvent.applicantId(),
                enrichedEvent.ownerId()
        );

        switch (enrichedEvent.eventType()) {
            case ApplicationEvent.CREATED_TYPE -> processCreatedApplication(enrichedEvent);
            case ApplicationEvent.ACCEPTED_TYPE -> processAcceptedApplication(enrichedEvent);
            case ApplicationEvent.REJECTED_TYPE -> processRejectedApplication(enrichedEvent);
            default -> logger.warn("Tipo de evento desconocido '{}'. Se descartara el mensaje.", enrichedEvent.eventType());
        }
    }

    private ApplicationEvent enrichEvent(ApplicationEvent event) throws Exception {
        if (event == null) {
            throw new IllegalArgumentException("El evento no puede ser nulo.");
        }

        if (!requiresEnrichment(event)) {
            validateReadyForProcessing(event);
            logger.info(
                    "Evento con datos suficientes. No se consultara Python | application_id={} | event_type='{}'",
                    event.applicationId(),
                    event.eventType()
            );
            return event;
        }

        if (event.applicationId() == null) {
            throw new IllegalArgumentException("Faltan datos en el evento y no puede enriquecerse sin application_id.");
        }

        ApplicationDetails applicationDetails = pythonApiService.getApplicationDetails(event.applicationId());
        ApplicationEvent enrichedEvent = ApplicationEventMapper.enrichWithApplicationDetails(
                event,
                applicationDetails
        );

        validateReadyForProcessing(enrichedEvent);

        logger.info(
                "Evento enriquecido desde Python | application_id={} | job_id={} | applicant_id={} | status='{}'",
                enrichedEvent.applicationId(),
                enrichedEvent.jobId(),
                enrichedEvent.applicantId(),
                enrichedEvent.status()
        );

        return enrichedEvent;
    }

    private boolean requiresEnrichment(ApplicationEvent event) {
        return event.applicationId() == null
                || event.jobId() == null
                || isBlank(event.jobTitle())
                || event.applicantId() == null
                || isBlank(event.applicantName())
                || isBlank(event.status());
    }

    private void validateReadyForProcessing(ApplicationEvent event) {
        if (event.applicationId() == null) {
            throw new IllegalArgumentException("El evento no contiene application_id.");
        }

        if (event.jobId() == null) {
            throw new IllegalArgumentException("El evento no contiene job_id.");
        }

        if (isBlank(event.jobTitle())) {
            throw new IllegalArgumentException("El evento no contiene job_title.");
        }

        if (event.applicantId() == null) {
            throw new IllegalArgumentException("El evento no contiene applicant_id.");
        }

        if (isBlank(event.applicantName())) {
            throw new IllegalArgumentException("El evento no contiene applicant_name.");
        }

        if (event.eventType() == null) {
            throw new IllegalArgumentException("El evento no contiene event_type.");
        }

        if (ApplicationEvent.CREATED_TYPE.equals(event.eventType()) && event.ownerId() == null) {
            throw new IllegalArgumentException("El evento de postulacion_creada no contiene owner_id.");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private void processCreatedApplication(ApplicationEvent event) throws Exception {
        logger.info(
                "Flujo postulacion creada | applicant_id={} | job_id={} | owner_id={}",
                event.applicantId(),
                event.jobId(),
                event.ownerId()
        );

        Notification notification = notificationService.buildForOwner(event);
        pythonApiService.saveNotification(notification);

        logger.info("Flujo de postulacion creada completado | owner_id={}", event.ownerId());
    }

    private void processAcceptedApplication(ApplicationEvent event) throws Exception {
        logger.info(
                "Flujo postulacion aceptada | application_id={} | applicant_id={}",
                event.applicationId(),
                event.applicantId()
        );

        Notification notification = notificationService.buildForAcceptedApplicant(event);
        pythonApiService.saveNotification(notification);

        logger.info("Flujo de postulacion aceptada completado | applicant_id={}", event.applicantId());
    }

    private void processRejectedApplication(ApplicationEvent event) throws Exception {
        logger.info(
                "Flujo postulacion rechazada | application_id={} | applicant_id={}",
                event.applicationId(),
                event.applicantId()
        );

        Notification notification = notificationService.buildForRejectedApplicant(event);
        pythonApiService.saveNotification(notification);

        logger.info("Flujo de postulacion rechazada completado | applicant_id={}", event.applicantId());
    }
}
