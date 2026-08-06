-- IMPORTANT: Pehle ka data delete ho jayega kyunki hum purani tables hata kar nayi Auto-Increment wali bana rahe hain.
-- Apne phpMyAdmin mein jao, "upvc_databse" select karo, aur yeh pura code SQL tab mein run karo:

DROP TABLE IF EXISTS project_products;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS clients;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS admins;

-- 1. Admins Table
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Settings Table
CREATE TABLE settings (
    id INT PRIMARY KEY DEFAULT 1,
    name VARCHAR(150),
    logo_url TEXT,
    email VARCHAR(150),
    phone VARCHAR(50),
    address TEXT,
    gst_number VARCHAR(50),
    footer_text TEXT,
    signature_url TEXT,
    currency_symbol VARCHAR(10) DEFAULT '₹'
);

-- 3. Clients Table
CREATE TABLE clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    company_name VARCHAR(150),
    email VARCHAR(150),
    phone VARCHAR(50),
    alt_phone VARCHAR(50),
    gst_number VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_projects INT DEFAULT 0
);

-- 4. Projects Table
-- Project ID humne VARCHAR hi rakha hai taaki Quotation number "PRJ-2024-XXX" format mein hi rahe
CREATE TABLE projects (
    id VARCHAR(50) PRIMARY KEY,
    project_name VARCHAR(150) NOT NULL,
    project_date DATE,
    client_id INT,
    status VARCHAR(50) DEFAULT 'Pending',
    total_amount DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- 5. Project Products Table (Quotation Items)
CREATE TABLE project_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id VARCHAR(50) NOT NULL,
    type VARCHAR(100),
    width INT,
    height INT,
    quantity INT,
    glass_type VARCHAR(100),
    frame_color VARCHAR(100),
    hardware VARCHAR(100),
    remarks TEXT,
    unit_price DECIMAL(10,2),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
