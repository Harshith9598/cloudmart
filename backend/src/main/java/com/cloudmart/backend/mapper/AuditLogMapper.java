package com.cloudmart.backend.mapper;

import com.cloudmart.backend.dto.AuditLogDto;
import com.cloudmart.backend.entity.AuditLog;
import org.springframework.stereotype.Component;

/**
 * Manual mapper between {@link AuditLog} entities and {@link AuditLogDto}.
 * Resolves the user's email from the associated {@code User} entity.
 */
@Component
public class AuditLogMapper {

    public AuditLogDto toDto(AuditLog log) {
        if (log == null) {
            return null;
        }

        AuditLogDto dto = new AuditLogDto();
        dto.setId(log.getId());

        if (log.getUser() != null) {
            dto.setUserId(log.getUser().getId());
            dto.setUserEmail(log.getUser().getEmail());
        }

        dto.setAction(log.getAction());
        dto.setEntity(log.getEntity());
        dto.setEntityId(log.getEntityId());
        dto.setDetails(log.getDetails());
        dto.setIpAddress(log.getIpAddress());

        if (log.getCreatedAt() != null) {
            dto.setCreatedAt(log.getCreatedAt().toString());
        }
        return dto;
    }
}
