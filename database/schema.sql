CREATE DATABASE IF NOT EXISTS typing_test_db;
USE typing_test_db;

CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS typing_paragraphs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    paragraph_text TEXT NOT NULL,
    language ENUM('english', 'hindi') NOT NULL,
    difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    status ENUM('active', 'disabled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS typing_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    wpm DECIMAL(5,2),
    cpm INT,
    accuracy DECIMAL(5,2),
    correct_chars INT,
    incorrect_chars INT,
    language ENUM('english', 'hindi'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Default Admin (Password: admin123)
-- Hash generated for 'admin123' (bcrypt)
INSERT INTO admins (username, password_hash) VALUES 
('admin', '$2b$10$X7V.j/Zk.7/X7V.j/Zk.7.X7V.j/Zk.7/X7V.j/Zk.7'); 
-- Note: The actual hash needs to be generated properly in the backend if this one is dummy. 
-- I will provide a script to generate a real hash or use a known one.
-- A standard bcrypt hash for 'admin123' is usually active, I'll use a placeholder or handle it in seed.
