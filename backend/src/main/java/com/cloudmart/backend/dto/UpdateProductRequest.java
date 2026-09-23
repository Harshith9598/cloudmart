package com.cloudmart.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UpdateProductRequest extends CreateProductRequest {
    private Boolean active;
}
