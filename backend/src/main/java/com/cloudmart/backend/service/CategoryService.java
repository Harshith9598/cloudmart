package com.cloudmart.backend.service;

import com.cloudmart.backend.dto.CategoryDto;
import com.cloudmart.backend.dto.CreateCategoryRequest;
import com.cloudmart.backend.exception.BadRequestException;
import com.cloudmart.backend.exception.ResourceNotFoundException;
import com.cloudmart.backend.mapper.CategoryMapper;
import com.cloudmart.backend.repository.CategoryRepository;
import com.cloudmart.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CategoryMapper categoryMapper;

    @Cacheable(value = "categories", key = "'all'")
    @Transactional(readOnly = true)
    public List<CategoryDto> listCategories() {
        return categoryRepository.findAll().stream()
                .map(categoryMapper::toDto)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "categories", key = "'tree'")
    @Transactional(readOnly = true)
    public List<CategoryDto> getCategoryTree() {
        return categoryRepository.findByParentIsNull().stream()
                .map(categoryMapper::toDto)
                .collect(Collectors.toList());
    }

    @Cacheable(value = "category", key = "#idOrSlug")
    @Transactional(readOnly = true)
    public CategoryDto getCategory(String idOrSlug) {
        Category category = categoryRepository.findBySlug(idOrSlug)
                .orElseGet(() -> {
                    try {
                        return categoryRepository.findById(Long.parseLong(idOrSlug))
                                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + idOrSlug));
                    } catch (NumberFormatException e) {
                        throw new ResourceNotFoundException("Category not found: " + idOrSlug);
                    }
                });
        return categoryMapper.toDto(category);
    }

    @CacheEvict(value = {"categories", "category"}, allEntries = true)
    @Transactional
    public CategoryDto createCategory(CreateCategoryRequest req) {
        Category category = new Category();
        category.setName(req.getName());
        category.setSlug(generateSlug(req.getName()));
        category.setDescription(req.getDescription());

        if (req.getParentId() != null) {
            Category parent = categoryRepository.findById(req.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent category not found"));
            category.setParent(parent);
        }

        category = categoryRepository.save(category);
        return categoryMapper.toDto(category);
    }

    @CacheEvict(value = {"categories", "category"}, allEntries = true)
    @Transactional
    public CategoryDto updateCategory(Long id, CreateCategoryRequest req) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        if (req.getName() != null) category.setName(req.getName());
        if (req.getDescription() != null) category.setDescription(req.getDescription());
        category = categoryRepository.save(category);
        return categoryMapper.toDto(category);
    }

    @CacheEvict(value = {"categories", "category"}, allEntries = true)
    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        if (productRepository.findByActiveTrueAndCategoryId(id, org.springframework.data.domain.Pageable.ofSize(1)).getTotalElements() > 0) {
            throw new BadRequestException("Cannot delete category with active products");
        }
        categoryRepository.delete(category);
    }

    private String generateSlug(String name) {
        return name.toLowerCase().replaceAll("[^a-z0-9\\s]", "").replaceAll("\\s+", "-")
                + "-" + System.currentTimeMillis();
    }
}
