-- Database Schema for AI-Based Food Waste Prediction and Redistribution Platform

-- Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('Donor', 'Volunteer', 'NGO') NOT NULL
);

-- Donations Table
CREATE TABLE donations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    donor_id INT,
    donor_name VARCHAR(255) NOT NULL,
    food_name VARCHAR(255) NOT NULL,
    quantity VARCHAR(100) NOT NULL,
    contact VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    pickup_time DATETIME NOT NULL,
    status ENUM('Available', 'Accepted', 'Cancelled', 'Delivered') DEFAULT 'Available',
    FOREIGN KEY (donor_id) REFERENCES users(id)
);

-- Deliveries Table
CREATE TABLE deliveries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    donation_id INT,
    volunteer_id INT,
    delivery_status ENUM('Accepted', 'Out for Delivery', 'Delivered') DEFAULT 'Accepted',
    FOREIGN KEY (donation_id) REFERENCES donations(id),
    FOREIGN KEY (volunteer_id) REFERENCES users(id)
);

-- Food Waste Data (for AI Training)
CREATE TABLE food_waste_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    food_prepared DECIMAL(10,2) NOT NULL,
    food_sold DECIMAL(10,2) NOT NULL,
    waste DECIMAL(10,2) NOT NULL
);
