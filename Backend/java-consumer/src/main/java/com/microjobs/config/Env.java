package com.microjobs.config;

import io.github.cdimascio.dotenv.Dotenv;

public final class Env {

    private static final Dotenv DOTENV = Dotenv.configure()
            .ignoreIfMissing()
            .load();

    private Env() {
    }

    public static String get(String key, String defaultValue) {
        String value = System.getenv(key);
        if (value != null && !value.isBlank()) {
            return value;
        }
        return DOTENV.get(key, defaultValue);
    }
}
