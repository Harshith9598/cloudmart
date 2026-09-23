package com.cloudmart.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

/**
 * Standard error envelope returned by the global exception handler. For field
 * validation failures, {@code errors} maps each invalid field name to its
 * first error message.
 */
@Getter
@Setter
public class ErrorResponse {

    private String message;
    private int status;
    private String timestamp;
    private Map<String, String> errors;
}
