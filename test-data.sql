-- Insert product categories
INSERT INTO product_category (name, icon, sort, status, createTime, updateTime) VALUES
('Miao Silver Jewelry', 'https://via.placeholder.com/100', 1, 1, NOW(), NOW()),
('Miao Embroidery', 'https://via.placeholder.com/100', 2, 1, NOW(), NOW()),
('Batik Products', 'https://via.placeholder.com/100', 3, 1, NOW(), NOW()),
('Ethnic Clothing', 'https://via.placeholder.com/100', 4, 1, NOW(), NOW());

-- Insert products
INSERT INTO product (merchantId, categoryId, name, coverImage, price, stock, description, status, createTime, updateTime) VALUES
(1, 1, 'Silver Bracelet', 'https://via.placeholder.com/300', 299.00, 50, 'Handmade traditional silver bracelet', 1, NOW(), NOW()),
(1, 1, 'Silver Necklace', 'https://via.placeholder.com/300', 499.00, 30, 'Beautiful silver necklace', 1, NOW(), NOW()),
(1, 2, 'Embroidered Scarf', 'https://via.placeholder.com/300', 128.00, 100, 'Handmade embroidered scarf', 1, NOW(), NOW()),
(1, 2, 'Embroidered Bag', 'https://via.placeholder.com/300', 168.00, 80, 'Ethnic style embroidered bag', 1, NOW(), NOW()),
(1, 3, 'Batik Tablecloth', 'https://via.placeholder.com/300', 88.00, 60, 'Traditional batik tablecloth', 1, NOW(), NOW()),
(1, 3, 'Batik Wall Hanging', 'https://via.placeholder.com/300', 158.00, 40, 'Beautiful batik wall hanging', 1, NOW(), NOW()),
(1, 4, 'Miao Traditional Dress', 'https://via.placeholder.com/300', 888.00, 20, 'Authentic Miao traditional dress', 1, NOW(), NOW()),
(1, 4, 'Ethnic Style Dress', 'https://via.placeholder.com/300', 268.00, 50, 'Modern ethnic style dress', 1, NOW(), NOW());

-- Insert restaurants
INSERT INTO restaurant (merchantId, name, coverImage, address, phone, businessHours, avgPrice, specialty, description, status, longitude, latitude, createTime, updateTime) VALUES
(1, 'Miao Flavor Restaurant', 'https://via.placeholder.com/400', 'Xijiang Miao Village, Leishan County', '0855-3348888', '08:00-22:00', 68, 'Sour Fish Soup, Bacon, Rice Wine', 'Authentic Miao cuisine', 1, 108.132, 26.583, NOW(), NOW()),
(1, 'Thousand Households Restaurant', 'https://via.placeholder.com/400', 'Xijiang Business Street', '0855-3348666', '07:30-21:30', 58, 'Long Table Feast, Sticky Rice', 'Traditional Miao long table feast', 1, 108.135, 26.585, NOW(), NOW()),
(1, 'Wudong Farm Restaurant', 'https://via.placeholder.com/400', 'Wudong Village, Leishan County', '0855-3347777', '08:00-20:00', 48, 'Free-range Chicken, Wild Vegetables', 'Farm-style local cuisine', 1, 108.128, 26.580, NOW(), NOW()),
(1, 'Mountain Delicacy House', 'https://via.placeholder.com/400', 'Leishan County Center', '0855-3345555', '09:00-21:00', 78, 'Wild Mushrooms, Bamboo Shoots', 'Specialty wild ingredients', 1, 108.125, 26.575, NOW(), NOW());

-- Insert dishes
INSERT INTO dish (restaurantId, name, image, price, category, description, isRecommended, status, createTime, updateTime) VALUES
(1, 'Signature Sour Fish Soup', 'https://via.placeholder.com/250', 88.00, 'Main Course', 'Fresh fish in sour soup', 1, 1, NOW(), NOW()),
(1, 'Miao Bacon', 'https://via.placeholder.com/250', 48.00, 'Specialty', 'Smoked bacon', 1, 1, NOW(), NOW()),
(1, 'Sticky Rice', 'https://via.placeholder.com/250', 15.00, 'Staple', 'Traditional sticky rice', 1, 1, NOW(), NOW()),
(1, 'Rice Wine', 'https://via.placeholder.com/250', 28.00, 'Beverage', 'Homemade rice wine', 0, 1, NOW(), NOW()),
(2, 'Long Table Feast Set', 'https://via.placeholder.com/250', 68.00, 'Set Menu', '8 dishes for 10+ people', 1, 1, NOW(), NOW()),
(2, 'Chicken Congee', 'https://via.placeholder.com/250', 38.00, 'Staple', 'Free-range chicken congee', 1, 1, NOW(), NOW()),
(3, 'Free-range Chicken Soup', 'https://via.placeholder.com/250', 68.00, 'Soup', 'Nutritious chicken soup', 1, 1, NOW(), NOW()),
(3, 'Seasonal Vegetables', 'https://via.placeholder.com/250', 18.00, 'Vegetable', 'Fresh garden vegetables', 0, 1, NOW(), NOW()),
(4, 'Wild Mushroom Hot Pot', 'https://via.placeholder.com/250', 128.00, 'Main Course', 'Multiple wild mushrooms', 1, 1, NOW(), NOW()),
(4, 'Bamboo Fungus with Ribs', 'https://via.placeholder.com/250', 88.00, 'Stew', 'Premium bamboo fungus', 1, 1, NOW(), NOW());

-- Insert farm product categories
INSERT INTO farm_product_category (name, icon, sort, status, createTime, updateTime) VALUES
('Fresh Vegetables', 'https://via.placeholder.com/100', 1, 1, NOW(), NOW()),
('Seasonal Fruits', 'https://via.placeholder.com/100', 2, 1, NOW(), NOW()),
('Local Specialties', 'https://via.placeholder.com/100', 3, 1, NOW(), NOW()),
('Poultry & Eggs', 'https://via.placeholder.com/100', 4, 1, NOW(), NOW());

-- Insert farm products
INSERT INTO farm_product (merchantId, categoryId, name, coverImage, price, unit, origin, stock, description, status, createTime, updateTime) VALUES
(1, 1, 'Organic Greens', 'https://via.placeholder.com/300', 8.00, 'kg', 'Wudong Village', 100, 'Organic vegetables', 1, NOW(), NOW()),
(1, 1, 'Farm Potatoes', 'https://via.placeholder.com/300', 5.00, 'kg', 'Leishan Mountain', 200, 'Mountain-grown potatoes', 1, NOW(), NOW()),
(1, 2, 'Wild Kiwi', 'https://via.placeholder.com/300', 15.00, 'kg', 'Mountain Area', 50, 'Wild kiwi fruit', 1, NOW(), NOW()),
(1, 2, 'Fresh Strawberries', 'https://via.placeholder.com/300', 25.00, 'kg', 'Wudong Farm', 80, 'Greenhouse strawberries', 1, NOW(), NOW()),
(1, 3, 'Wild Honey', 'https://via.placeholder.com/300', 128.00, 'bottle', 'Deep Mountain', 30, 'Pure wild honey', 1, NOW(), NOW()),
(1, 3, 'Smoked Bacon', 'https://via.placeholder.com/300', 58.00, 'kg', 'Wudong Village', 60, 'Traditional smoked bacon', 1, NOW(), NOW()),
(1, 4, 'Free-range Eggs', 'https://via.placeholder.com/300', 2.50, 'piece', 'Farm', 500, 'Free-range chicken eggs', 1, NOW(), NOW()),
(1, 4, 'Free-range Chicken', 'https://via.placeholder.com/300', 88.00, 'piece', 'Mountain Farm', 20, 'Mountain free-range chicken', 1, NOW(), NOW());
