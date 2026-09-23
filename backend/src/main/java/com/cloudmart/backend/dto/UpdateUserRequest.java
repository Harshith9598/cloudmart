package com.cloudmart.backend.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * Request body for updating the authenticated user's profile. Only the
 * display-name fields are editable here; password changes use
 * {@link ChangePasswordRequest}.
 */
@Getter
@Setter
public class UpdateUserRequest {

    private String firstName;
    private String lastName;
}
