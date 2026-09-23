package com.cloudmart.backend.config;

import com.cloudmart.backend.entity.Role;
import com.cloudmart.backend.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Seeds the three default roles (CUSTOMER, SELLER, ADMIN) into the database
 * on application startup if they do not already exist.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) {
        String[] defaultRoles = {"CUSTOMER", "SELLER", "ADMIN"};
        for (String roleName : defaultRoles) {
            if (roleRepository.findByName(roleName).isEmpty()) {
                Role role = Role.builder().name(roleName).build();
                roleRepository.save(role);
                log.info("Seeded default role: {}", roleName);
            }
        }
    }
}
