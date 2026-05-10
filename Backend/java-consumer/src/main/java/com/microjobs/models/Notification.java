package com.microjobs.models;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Notification {

    @JsonProperty("recipient")
    private Long recipient;

    @JsonProperty("type")
    private String type;

    @JsonProperty("message")
    private String message;

    @JsonProperty("dedupe_key")
    private String dedupeKey;

    @JsonProperty("extra_data")
    private ExtraData extraData;

    private Notification() {}

    public static class ExtraData {
        @JsonProperty("application_id")
        private Long applicationId;

        @JsonProperty("job_id")
        private Long jobId;

        public ExtraData(Long applicationId, Long jobId) {
            this.applicationId = applicationId;
            this.jobId = jobId;
        }

        public Long getApplicationId() {
            return applicationId;
        }

        public Long getJobId() {
            return jobId;
        }
    }

    public static Notification forOwner(EventoPostulacion evento) {
        return builder()
                .recipient(evento.ownerId())
                .type(evento.eventType())
                .message(evento.applicantName() + " se postulo a tu trabajo '" + evento.jobTitle() + "'")
                .dedupeKey(buildDedupeKey(evento.ownerId(), evento.eventType(), evento.applicationId()))
                .extraData(new ExtraData(evento.applicationId(), evento.jobId()))
                .build();
    }

    public static Notification forApplicantAccepted(EventoPostulacion evento) {
        return builder()
                .recipient(evento.applicantId())
                .type(evento.eventType())
                .message("Tu postulacion para '" + evento.jobTitle() + "' fue aceptada")
                .dedupeKey(buildDedupeKey(evento.applicantId(), evento.eventType(), evento.applicationId()))
                .extraData(new ExtraData(evento.applicationId(), evento.jobId()))
                .build();
    }

    public static Notification forApplicantRejected(EventoPostulacion evento) {
        return builder()
                .recipient(evento.applicantId())
                .type(evento.eventType())
                .message("Tu postulacion para '" + evento.jobTitle() + "' fue rechazada")
                .dedupeKey(buildDedupeKey(evento.applicantId(), evento.eventType(), evento.applicationId()))
                .extraData(new ExtraData(evento.applicationId(), evento.jobId()))
                .build();
    }

    private static String buildDedupeKey(Long recipientId, String eventType, Long applicationId) {
        return eventType + ":" + applicationId + ":" + recipientId;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final Notification notification = new Notification();

        public Builder recipient(Long recipient) {
            notification.recipient = recipient;
            return this;
        }

        public Builder type(String type) {
            notification.type = type;
            return this;
        }

        public Builder message(String message) {
            notification.message = message;
            return this;
        }

        public Builder dedupeKey(String dedupeKey) {
            notification.dedupeKey = dedupeKey;
            return this;
        }

        public Builder extraData(ExtraData extraData) {
            notification.extraData = extraData;
            return this;
        }

        public Notification build() {
            return notification;
        }
    }

    public Long getRecipient() {
        return recipient;
    }

    public String getType() {
        return type;
    }

    public String getMessage() {
        return message;
    }

    public String getDedupeKey() {
        return dedupeKey;
    }

    public ExtraData getExtraData() {
        return extraData;
    }

    @Override
    public String toString() {
        return "Notification{" +
                "recipient=" + recipient +
                ", type='" + type + '\'' +
                ", message='" + message + '\'' +
                ", dedupeKey='" + dedupeKey + '\'' +
                ", extraData={application_id=" + extraData.getApplicationId() +
                ", job_id=" + extraData.getJobId() + "}" +
                '}';
    }
}
