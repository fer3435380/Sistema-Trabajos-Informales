package com.microjobs.utils;

import com.microjobs.models.ApplicationDetails;
import com.microjobs.models.ApplicationEvent;

public final class ApplicationEventMapper {

    private ApplicationEventMapper() {}

    public static ApplicationEvent enrichWithApplicationDetails(
            ApplicationEvent originalEvent,
            ApplicationDetails applicationDetails
    ) {
        if (originalEvent == null) {
            return null;
        }

        if (applicationDetails == null) {
            return originalEvent;
        }

        return new ApplicationEvent(
                originalEvent.eventType(),
                firstNonNull(originalEvent.applicationId(), applicationDetails.id()),
                firstNonNull(originalEvent.jobId(), applicationDetails.job()),
                firstNonBlank(originalEvent.jobTitle(), applicationDetails.jobTitle()),
                firstNonNull(originalEvent.applicantId(), applicationDetails.applicant()),
                originalEvent.ownerId(),
                firstNonBlank(originalEvent.status(), applicationDetails.status()),
                firstNonBlank(originalEvent.applicantName(), applicationDetails.applicantName())
        );
    }

    private static <T> T firstNonNull(T preferred, T fallback) {
        return preferred != null ? preferred : fallback;
    }

    private static String firstNonBlank(String preferred, String fallback) {
        return preferred != null && !preferred.isBlank() ? preferred : fallback;
    }
}
