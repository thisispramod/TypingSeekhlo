const db = require('../config/db');

const updateSchema = async () => {
    try {
        console.log('Updating database schema...');

        // Create Users Table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                email VARCHAR(100) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Users table checked/created.');

        // Create User Reports Table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS user_reports (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                wpm INT NOT NULL,
                accuracy DECIMAL(5, 2) NOT NULL,
                errors INT DEFAULT 0,
                duration INT,
                test_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                source ENUM('default', 'custom') DEFAULT 'default',
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('User Reports table checked/created.');

        // Create Custom Paragraphs Table
        await db.execute(`
            CREATE TABLE IF NOT EXISTS custom_paragraphs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                title VARCHAR(100),
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('Custom Paragraphs table checked/created.');

        console.log('Schema update complete.');
        process.exit();
    } catch (error) {
        console.error('Error updating schema:', error);
        process.exit(1);
    }
};

updateSchema();
