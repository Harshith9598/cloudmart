package com.cloudmart.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

/**
 * Entry point for the CloudMart Spring Boot backend.
 */
@SpringBootApplication
@EnableCaching
public class CloudMartApplication {

    public static void main(String[] args) {
        SpringApplication.run(CloudMartApplication.class, args);
    }
}
