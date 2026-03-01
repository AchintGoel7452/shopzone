package com.shopzone.controller;

import com.shopzone.dto.ProductDTO;
import com.shopzone.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired private ProductService productService;

    // PUBLIC ENDPOINTS
    @GetMapping("/products")
    public ResponseEntity<Page<ProductDTO.Response>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy) {
        return ResponseEntity.ok(productService.getAllProducts(page, size, sortBy));
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<?> getProduct(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(productService.getProduct(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/products/search")
    public ResponseEntity<Page<ProductDTO.Response>> searchProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(productService.searchProducts(keyword, categoryId, page, size));
    }

    // SELLER ENDPOINTS
    @PostMapping("/seller/products")
    @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
    public ResponseEntity<?> createProduct(
            @RequestPart("product") String productJson,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            Principal principal) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            ProductDTO.Request request = mapper.readValue(productJson, ProductDTO.Request.class);
            ProductDTO.Response response = productService.createProduct(request, images, principal.getName());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/seller/products/{id}")
    @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestPart("product") String productJson,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            Principal principal) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            ProductDTO.Request request = mapper.readValue(productJson, ProductDTO.Request.class);
            ProductDTO.Response response = productService.updateProduct(id, request, images, principal.getName());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/seller/products")
    @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
    public ResponseEntity<List<ProductDTO.Response>> getSellerProducts(Principal principal) {
        return ResponseEntity.ok(productService.getSellerProducts(principal.getName()));
    }

    @DeleteMapping("/seller/products/{id}")
    @PreAuthorize("hasAnyRole('SELLER','ADMIN')")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id, Principal principal) {
        try {
            productService.deleteProduct(id, principal.getName());
            return ResponseEntity.ok(Map.of("message", "Product deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
