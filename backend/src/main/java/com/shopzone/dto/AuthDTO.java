package com.shopzone.dto;

import com.shopzone.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

public class AuthDTO {

    @Data
    public static class RegisterRequest {
        @NotBlank private String fullName;
        @Email @NotBlank private String email;
        @NotBlank @Size(min = 6) private String password;
        @NotBlank private String phone;
        private String address;
        private String city;
        private String country;
        private User.Role role = User.Role.CUSTOMER;

        // Seller-specific
        private String businessName;
        private String businessDescription;
        private String taxId;
    }

    @Data
    public static class LoginRequest {
        @Email @NotBlank private String email;
        @NotBlank private String password;
    }

    @Data
    public static class AuthResponse {
        private String token;
        private String tokenType = "Bearer";
        private Long userId;
        private String email;
        private String fullName;
        private String role;
    }
}
