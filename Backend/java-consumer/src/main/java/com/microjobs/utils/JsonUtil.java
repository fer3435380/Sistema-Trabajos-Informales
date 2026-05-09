package com.microjobs.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

public class JsonUtil {
    private static final Logger logger = LoggerFactory.getLogger(JsonUtil.class);

    private static final ObjectMapper mapper = new ObjectMapper()
            .configure(com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    private JsonUtil() {}
    
    public static <T> T fromJson(String json, Class<T> clase) {
        
        try{
            return mapper.readValue(json, clase);
        }catch (JsonProcessingException e) {
            logger.error("Error deserializando JSON a {}: {}", clase.getSimpleName(), e.getMessage());
            return null;
        }
    }

    public static String toJson(Object obj){
        try{
            return mapper.writeValueAsString(obj);
        }catch (JsonProcessingException e) {
            logger.error("Error serializando objeto a JSON: {}", e.getMessage());
            return null;
        }
    }

    public static String toJsonPretty(Object obj){
        try{
            return mapper.writerWithDefaultPrettyPrinter().writeValueAsString(obj);
        }catch (JsonProcessingException e) {
            logger.error("Error serializando objeto a JSON (pretty): {}", e.getMessage());
            return null;
        }
    }

    public static <T> T fromBytes(byte[] bytes, Class<T> clase){
        try {
            return mapper.readValue(bytes, clase);
        } catch (Exception e){
            logger.error("Error deserializando bytes a {}: {}", clase.getSimpleName(), e.getMessage());
            return null;
        }
    }

}
