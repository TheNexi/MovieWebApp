package com.example.moviewebapp.security;

public enum ApiEndpoint {
    API_ALL("/api/v1/**"),
    SWAGGER_UI("/swagger-ui/**"),
    SWAGGER_UI_HTML("/swagger-ui.html"),
    API_DOCS("/v3/api-docs"),
    API_DOCS_ALL("/v3/api-docs/**"),
    WEBJARS("/webjars/**"),
    ERROR("/error");

    private final String pattern;

    ApiEndpoint(String pattern) {
        this.pattern = pattern;
    }

    public String pattern() {
        return pattern;
    }

    public static String[] permitAllMatchers() {
        ApiEndpoint[] values = values();
        String[] patterns = new String[values.length];
        for (int i = 0; i < values.length; i++) {
            patterns[i] = values[i].pattern;
        }
        return patterns;
    }
}
