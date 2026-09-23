package com.cloudmart.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI / Swagger documentation configuration for the CloudMart API.
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI cloudMartOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("CloudMart API")
                        .version("1.0")
                        .description("Cloud-native marketplace REST API"));
    }
}
