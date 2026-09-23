package com.cloudmart.backend.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * Public representation of an audit log entry, used for admin oversight of
 * sensitive actions across the platform.
 */
@Getter
@Setter
public class AuditLogDto {

    private Long id;
    private Long userId;
    private String userEmail;
    private String action;
    private String entity;
    private String entityId;
    private String details;
    private String ipAddress;
    private String createdAt;
}
