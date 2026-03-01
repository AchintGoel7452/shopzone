-- ========================================
-- ShopZone Database Setup
-- ========================================

CREATE DATABASE IF NOT EXISTS shopzone_db;
USE shopzone_db;

-- Insert default categories (run after application starts)
INSERT IGNORE INTO categories (name, description, icon) VALUES
('Electronics', 'Phones, Laptops, TVs and more', '💻'),
('Fashion', 'Clothing, Shoes, Accessories', '👗'),
('Home & Kitchen', 'Furniture, Appliances, Decor', '🏠'),
('Sports & Outdoors', 'Sports equipment and outdoor gear', '⚽'),
('Books', 'Books, E-books, Stationery', '📚'),
('Beauty & Health', 'Skincare, Makeup, Wellness', '💄'),
('Automotive', 'Car accessories and parts', '🚗'),
('Toys & Games', 'Toys, Board games, Puzzles', '🎮');

-- Insert default admin user (password: Admin@123)
INSERT IGNORE INTO users (full_name, email, password, phone, role, enabled, email_verified, created_at, updated_at)
VALUES ('Admin User', 'admin@shopzone.com',
        '$2a$10$rS5YjHpHlqWWNJajfGjQ8eFz3v0s5z0BIH0rGMxkHaSLOxqFE7T1G',
        '0000000000', 'ADMIN', true, true, NOW(), NOW());
