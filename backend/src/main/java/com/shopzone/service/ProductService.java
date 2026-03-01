package com.shopzone.service;

import com.shopzone.dto.ProductDTO;
import com.shopzone.entity.*;
import com.shopzone.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired private ProductRepository productRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private UserRepository userRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public ProductDTO.Response createProduct(ProductDTO.Request request, List<MultipartFile> images, String sellerEmail) {
        User seller = userRepository.findByEmail(sellerEmail)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .originalPrice(request.getOriginalPrice() != null ? request.getOriginalPrice() : request.getPrice())
                .stockQuantity(request.getStockQuantity())
                .brand(request.getBrand())
                .model(request.getModel())
                .color(request.getColor())
                .size(request.getSize())
                .weight(request.getWeight())
                .dimensions(request.getDimensions())
                .specifications(request.getSpecifications())
                .warrantyPeriod(request.getWarrantyPeriod())
                .guaranteeDetails(request.getGuaranteeDetails())
                .warrantyTerms(request.getWarrantyTerms())
                .category(category)
                .seller(seller)
                .build();

        if (images != null && !images.isEmpty()) {
            List<String> imagePaths = saveImages(images);
            product.setImages(String.join(",", imagePaths));
        }

        product = productRepository.save(product);
        return toResponse(product);
    }

    public ProductDTO.Response updateProduct(Long id, ProductDTO.Request request, List<MultipartFile> images, String sellerEmail) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getSeller().getEmail().equals(sellerEmail)) {
            throw new RuntimeException("Unauthorized");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setOriginalPrice(request.getOriginalPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setBrand(request.getBrand());
        product.setModel(request.getModel());
        product.setColor(request.getColor());
        product.setSize(request.getSize());
        product.setWeight(request.getWeight());
        product.setDimensions(request.getDimensions());
        product.setSpecifications(request.getSpecifications());
        product.setWarrantyPeriod(request.getWarrantyPeriod());
        product.setGuaranteeDetails(request.getGuaranteeDetails());
        product.setWarrantyTerms(request.getWarrantyTerms());
        product.setCategory(category);

        if (images != null && !images.isEmpty()) {
            List<String> imagePaths = saveImages(images);
            product.setImages(String.join(",", imagePaths));
        }

        return toResponse(productRepository.save(product));
    }

    public Page<ProductDTO.Response> getAllProducts(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).descending());
        return productRepository.findByStatus(Product.ProductStatus.ACTIVE, pageable)
                .map(this::toResponse);
    }

    public Page<ProductDTO.Response> searchProducts(String keyword, Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.searchProducts(keyword, categoryId, pageable)
                .map(this::toResponse);
    }

    public ProductDTO.Response getProduct(Long id) {
        return toResponse(productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found")));
    }

    public List<ProductDTO.Response> getSellerProducts(String sellerEmail) {
        User seller = userRepository.findByEmail(sellerEmail)
                .orElseThrow(() -> new RuntimeException("Seller not found"));
        return productRepository.findBySeller(seller).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    public void deleteProduct(Long id, String sellerEmail) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        if (!product.getSeller().getEmail().equals(sellerEmail)) throw new RuntimeException("Unauthorized");
        product.setStatus(Product.ProductStatus.INACTIVE);
        productRepository.save(product);
    }

    private List<String> saveImages(List<MultipartFile> files) {
        List<String> paths = new ArrayList<>();
        try {
            Path uploadPath = Paths.get(uploadDir + "/products");
            Files.createDirectories(uploadPath);
            for (MultipartFile file : files) {
                String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
                Files.copy(file.getInputStream(), uploadPath.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
                paths.add("/uploads/products/" + filename);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to save images: " + e.getMessage());
        }
        return paths;
    }

    public ProductDTO.Response toResponse(Product p) {
        ProductDTO.Response r = new ProductDTO.Response();
        r.setId(p.getId());
        r.setName(p.getName());
        r.setDescription(p.getDescription());
        r.setPrice(p.getPrice());
        r.setOriginalPrice(p.getOriginalPrice());
        r.setStockQuantity(p.getStockQuantity());
        r.setBrand(p.getBrand());
        r.setModel(p.getModel());
        r.setColor(p.getColor());
        r.setSize(p.getSize());
        r.setWeight(p.getWeight());
        r.setDimensions(p.getDimensions());
        r.setSpecifications(p.getSpecifications());
        r.setWarrantyPeriod(p.getWarrantyPeriod());
        r.setGuaranteeDetails(p.getGuaranteeDetails());
        r.setWarrantyTerms(p.getWarrantyTerms());
        r.setStatus(p.getStatus());
        r.setRating(p.getRating());
        r.setReviewCount(p.getReviewCount());
        r.setCreatedAt(p.getCreatedAt());
        if (p.getImages() != null && !p.getImages().isEmpty()) {
            r.setImages(Arrays.asList(p.getImages().split(",")));
        }
        if (p.getCategory() != null) {
            r.setCategoryName(p.getCategory().getName());
            r.setCategoryId(p.getCategory().getId());
        }
        if (p.getSeller() != null) {
            r.setSellerName(p.getSeller().getFullName());
            r.setSellerId(p.getSeller().getId());
        }
        return r;
    }
}
