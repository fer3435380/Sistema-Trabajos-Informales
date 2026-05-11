package com.microjobs.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ApplicationDetails(

        @JsonProperty("id")
        Long id,

        @JsonProperty("job")
        Long job,

        @JsonProperty("job_title")
        String jobTitle,

        @JsonProperty("applicant")
        Long applicant,

        @JsonProperty("applicant_name")
        String applicantName,

        @JsonProperty("status")
        String status,

        @JsonProperty("cover_letter")
        String coverLetter,

        @JsonProperty("created_at")
        String createdAt,

        @JsonProperty("updated_at")
        String updatedAt

) {}
