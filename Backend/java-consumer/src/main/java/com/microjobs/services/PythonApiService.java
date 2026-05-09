package com.microjobs.services;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.microjobs.models.Notification;
import com.microjobs.utils.JsonUtil;

import io.github.cdimascio.dotenv.Dotenv;

public class PythonApiService {

    private static final Logger logger = LoggerFactory.getLogger(PythonApiService.class);

    private final HttpClient httpClient;
    private final String     baseUrl;

    public PythonApiService() {
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()
                .load();

        this.baseUrl = dotenv.get("PYTHON_API_URL", "http://localhost:8000");

        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .build();

        logger.info("PythonApiService iniciado → {}", baseUrl);
    }

    public void guardarNotificacion(Notification notificacion) throws Exception {
        String json = JsonUtil.toJson(notificacion);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/api/v1/notifications/"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .timeout(Duration.ofSeconds(10))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200 || response.statusCode() == 201) {
            logger.info("Notificación guardada\nusuario_id={}\nstatus={}",
                    notificacion.getUserId(), response.statusCode());
        } else {
            logger.error("Error guardando notificación\nstatus={}\nbody={}",
                    response.statusCode(), response.body());
            throw new Exception("Error al guardar notificación, status: " + response.statusCode());
        }
    }

    public void actualizarEstadoPostulacion(Long applicationId, String status) throws Exception {
        String json = String.format("{\"status\": \"%s\"}", status);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/api/v1/applications/" + applicationId + "/status/"))
                .header("Content-Type", "application/json")
                .PUT(HttpRequest.BodyPublishers.ofString(json))
                .timeout(Duration.ofSeconds(10))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200) {
            logger.info("Estado actualizado\napplication_id={}\nstatus={}",
                    applicationId, status);
        } else {
            logger.error("Error actualizando estado\napplication_id={}\nstatus={}\nbody={}",
                    applicationId, response.statusCode(), response.body());
            throw new Exception("Error al actualizar estado, status: " + response.statusCode());
        }
    }

    public String obtenerDatosPostulacion(Long applicationId) throws Exception {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/api/v1/applications/" + applicationId + "/"))
                .header("Content-Type", "application/json")
                .GET()
                .timeout(Duration.ofSeconds(10))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200) {
            logger.info("Datos obtenidos\napplication_id={}", applicationId);
            return response.body();
        } else {
            logger.error("Error obteniendo datos\napplication_id={}\nstatus={}",
                    applicationId, response.statusCode());
            throw new Exception("Error al obtener datos, status: " + response.statusCode());
        }
    }
}