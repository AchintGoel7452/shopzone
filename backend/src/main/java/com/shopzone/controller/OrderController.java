package com.shopzone.controller;

import com.shopzone.entity.*;
import com.shopzone.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired private OrderRepository orderRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private CartRepository cartRepository;

    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody Map<String, Object> body, Principal principal) {
        try {
            User user = userRepository.findByEmail(principal.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Map<String, Object>> items = (List<Map<String, Object>>) body.get("items");
            String shippingAddress = (String) body.get("shippingAddress");
            String paymentMethod = (String) body.get("paymentMethod");

            Order order = new Order();
            order.setUser(user);
            order.setShippingAddress(shippingAddress);
            order.setPaymentMethod(paymentMethod);
            order.setStatus(Order.OrderStatus.PENDING);
            order.setOrderNumber("ORD-" + System.currentTimeMillis());

            List<OrderItem> orderItems = new ArrayList<>();
            BigDecimal total = BigDecimal.ZERO;

            for (Map<String, Object> item : items) {
                Long productId = Long.valueOf(item.get("productId").toString());
                int quantity = Integer.parseInt(item.get("quantity").toString());

                Product product = productRepository.findById(productId)
                        .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

                OrderItem oi = new OrderItem();
                oi.setOrder(order);
                oi.setProduct(product);
                oi.setQuantity(quantity);
                oi.setUnitPrice(product.getPrice());
                oi.setTotalPrice(product.getPrice().multiply(BigDecimal.valueOf(quantity)));
                orderItems.add(oi);
                total = total.add(oi.getTotalPrice());
            }

            order.setItems(orderItems);
            order.setTotalAmount(total);
            order.setShippingCost(BigDecimal.valueOf(5.99));
            order.setDiscount(BigDecimal.ZERO);

            Order saved = orderRepository.save(order);
            return ResponseEntity.ok(Map.of("orderId", saved.getId(), "orderNumber", saved.getOrderNumber(), "status", saved.getStatus()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getUserOrders(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(orderRepository.findByUserOrderByCreatedAtDesc(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrder(@PathVariable Long id, Principal principal) {
        return orderRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
