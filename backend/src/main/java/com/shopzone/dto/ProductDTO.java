package com.shopzone.dto;

import com.shopzone.entity.Product;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class ProductDTO {

    @Data
    public static class Request {
        @NotBlank private String name;
        private String description;
        @NotNull private BigDecimal price;
        private BigDecimal originalPrice;
        @NotNull @Min(0) private Integer stockQuantity;
        private String brand;
        private String model;
        private String color;
        private String size;
        private String weight;
        private String dimensions;
        private String specifications;
        private String warrantyPeriod;
        private String guaranteeDetails;
        private String warrantyTerms;
        @NotNull private Long categoryId;
    }

    @Data
    public static class Response {
        private Long id;
        private String name;
        private String description;
        private BigDecimal price;
        private BigDecimal originalPrice;
        private Integer stockQuantity;
        private String brand;
        private String model;
        private String color;
        private String size;
        private String weight;
        private String dimensions;
        private String specifications;
        private String warrantyPeriod;
        private String guaranteeDetails;
        private String warrantyTerms;
        private Product.ProductStatus status;
        private Double rating;
        private Integer reviewCount;
        private List<String> images;
        private String categoryName;
        private Long categoryId;
        private String sellerName;
        private Long sellerId;
        private LocalDateTime createdAt;
    }
}
