package com.microjobs.services;

import com.microjobs.models.ApplicationDetails;
import com.microjobs.models.Notification;
import com.microjobs.utils.JsonUtil;
import io.github.cdimascio.dotenv.Dotenv;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class PythonApiService {

    private static final Logger logger = LoggerFactory.getLogger(PythonApiService.class);

    private final HttpClient httpClient;
    private final String baseUrl;
    private final String apiKey;

    public PythonApiService() {
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()
                .load();

        this.baseUrl = dotenv.get("PYTHON_API_URL", "http://localhost:8000").replaceAll("/+$", "");
        this.apiKey = dotenv.get("INTERNAL_API_KEY", "dev-internal-key");
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .build();

        logger.info("PythonApiService iniciado | base_url={}", baseUrl);
    }

    public void saveNotification(Notification notification) throws Exception {
        String json = JsonUtil.toJson(notification);
        if (json == null) {
            throw new IllegalStateException("No se pudo serializar la notificacion para enviarla a Python.");
        }

        logger.info(
                "Enviando notificacion a Python | recipient={} | dedupe_key={} | body={}",
                notification.getRecipient(),
                notification.getDedupeKey(),
                json
        );

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/api/v1/notifications/"))
                .header("Content-Type", "application/json")
                .header("X-Internal-Api-Key", apiKey)
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .timeout(Duration.ofSeconds(10))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200 || response.statusCode() == 201) {
            logger.info(
                    "Notificacion guardada en Python | recipient={} | dedupe_key={} | status={}",
                    notification.getRecipient(),
                    notification.getDedupeKey(),
                    response.statusCode()
            );
            return;
        }

        logger.error(
                "Error guardando notificacion en Python | status={} | body={}",
                response.statusCode(),
                response.body()
        );
        throw new Exception("Error al guardar notificacion, status: " + response.statusCode());
    }

    public ApplicationDetails getApplicationDetails(Long applicationId) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/api/v1/applications/" + applicationId + "/"))
                .header("Content-Type", "application/json")
                .header("X-Internal-Api-Key", apiKey)
                .GET()
                .timeout(Duration.ofSeconds(10))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200) {
            ApplicationDetails applicationDetails = JsonUtil.fromJson(response.body(), ApplicationDetails.class);
            if (applicationDetails == null) {
                logger.error(
                        "La respuesta de Python no pudo convertirse a ApplicationDetails | application_id={} | body={}",
                        applicationId,
                        response.body()
                );
                throw new IllegalStateException("Respuesta invalida al obtener la postulacion " + applicationId);
            }

            logger.info(
                    "Datos de postulacion obtenidos | application_id={} | job_id={} | applicant_id={} | status={}",
                    applicationId,
                    applicationDetails.job(),
                    applicationDetails.applicant(),
                    applicationDetails.status()
            );
            return applicationDetails;
        }

        logger.error(
                "Error obteniendo datos de postulacion | application_id={} | status={} | body={}",
                applicationId,
                response.statusCode(),
                response.body()
        );
        throw new Exception("Error al obtener datos, status: " + response.statusCode());
    }
}
