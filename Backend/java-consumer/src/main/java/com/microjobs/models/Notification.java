package com.microjobs.models;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Notification 
{
    @JsonProperty("user_id")
    private Long usuarioId;

    @JsonProperty("type")
    private String tipo;

    @JsonProperty("message")
    private String mensaje;

    @JsonProperty("read")
    private boolean read;

    @JsonProperty("date")
    private String date;

    private Notification(){}

    public static Notification forOwner(EventoPostulacion event){
        return builder()
                .userId(event.ownerId())
                .type(event.eventType())
                .message(event.applicantName() + " se postuló a tu trabajo '" + event.jobTitle() + "'")
                .date(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                .build();
    }

    public static Notification forApplicantAccepted(EventoPostulacion event){
        return builder()
                .userId(event.applicantId())
                .type(event.eventType())
                .message("Tu postulación al trabajo '" + event.jobTitle() + "' ha sido " + event.status())
                .date(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                .build();
    }

    public static Notification forApplicantRejected(EventoPostulacion evento) {
        return builder()
                .userId(evento.applicantId())
                .type(evento.eventType())
                .message("Tu postulación para '" + evento.jobTitle() + "' fue rechazada")
                .date(LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                .build();
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private final Notification notification = new Notification();

        public Builder userId(Long userId){
            notification.usuarioId = userId;
            return this;
        }

        public Builder type(String  type){
            notification.tipo = type;
            return this;
        }

        public Builder message(String message){
            notification.mensaje = message;
            return this;
        }

        public Builder date(String date){
            notification.date = date;
            return this;
        }

        public Notification build(){
            notification.read = false;
            return notification;
        }
    }

    public Long getUserId() {
        return usuarioId;
    }

    public String getType() {
        return tipo;
    }

    public String getMessage() {
        return mensaje;
    }

    public boolean isRead() {
        return read;
    }

    public String getDate() {
        return date;
    }

    @Override
    public String toString(){
        return "Notification{"+
                "userId=" + usuarioId +
                ", type='" + tipo + '\'' +
                ", message='" + mensaje + '\'' +
                ", read=" + read +
                ", date='" + date + '\'' +
                '}';
    }
}