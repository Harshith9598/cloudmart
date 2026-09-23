package com.cloudmart.backend.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.Page;

import java.util.List;

/**
 * Generic paginated response envelope wrapping a Spring Data {@link Page}.
 *
 * @param <T> the type of content contained in each page
 */
@Getter
@Setter
public class PaginatedResponse<T> {

    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private boolean hasNext;
    private boolean hasPrevious;

    /**
     * Build a {@link PaginatedResponse} from a Spring Data {@link Page}.
     *
     * @param page the source page
     * @param <T>  the content type
     * @return a fully populated paginated response
     */
    public static <T> PaginatedResponse<T> from(Page<T> page) {
        PaginatedResponse<T> response = new PaginatedResponse<>();
        response.setContent(page.getContent());
        response.setPage(page.getNumber());
        response.setSize(page.getSize());
        response.setTotalElements(page.getTotalElements());
        response.setTotalPages(page.getTotalPages());
        response.setHasNext(page.hasNext());
        response.setHasPrevious(page.hasPrevious());
        return response;
    }
}
