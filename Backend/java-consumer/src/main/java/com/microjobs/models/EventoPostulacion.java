package com.microjobs.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown=true)
public record EventoPostulacion (

    @JsonProperty("event_type")
    String eventType,

    @JsonProperty("application_id")
    Long applicationId,

    @JsonProperty("job_id")
    Long jobId,

    @JsonProperty("job_title")
    String jobTitle,

    @JsonProperty("applicant_id")
    Long applicantId,

    @JsonProperty("owner_id")
    Long ownerId,

    @JsonProperty("status")
    String status,

    @JsonProperty("applicant_name")
    String applicantName

) {
    public static final String CREATED_TYPE = "application_created";
    public static final String ACCEPTED_TYPE = "application_accepted";
    public static final String REJECTED_TYPE = "application_rejected";

    public static final String STATUS_PENDING  = "pending";
    public static final String STATUS_ACCEPTED = "accepted";
    public static final String STATUS_REJECTED = "rejected";
}
