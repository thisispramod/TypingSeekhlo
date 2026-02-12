const bcrypt = require('bcrypt');
const db = require('../config/db');

const seedAdmin = async () => {
    try {
        const username = 'admin';
        const password = 'admin123';
        const saltRounds = 10;

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Check if admin exists
        const [rows] = await db.execute('SELECT * FROM admins WHERE username = ?', [username]);

        if (rows.length > 0) {
            console.log('Admin user already exists. Updating password...');
            await db.execute('UPDATE admins SET password_hash = ? WHERE username = ?', [hashedPassword, username]);
        } else {
            console.log('Creating admin user...');
            await db.execute('INSERT INTO admins (username, password_hash) VALUES (?, ?)', [username, hashedPassword]);
        }

        // Seed some sample paragraphs if empty
        const [paras] = await db.execute('SELECT count(*) as count FROM typing_paragraphs');
        if (paras[0].count === 0) {
            console.log('Seeding sample paragraphs...');
            const sampleEnglish = "The quick brown fox jumps over the lazy dog. This is a classic typing test sentence used to practice touch typing skills.";
            const sampleHindi = "भारत एक विशाल देश है। यहाँ विभिन्न धर्मों और संस्कृतियों के लोग रहते हैं।"; // Basic Hindi text

            await db.execute(
                'INSERT INTO typing_paragraphs (paragraph_text, language, difficulty, status) VALUES (?, ?, ?, ?)',
                [sampleEnglish, 'english', 'medium', 'active']
            );
            await db.execute(
                'INSERT INTO typing_paragraphs (paragraph_text, language, difficulty, status) VALUES (?, ?, ?, ?)',
                [sampleHindi, 'hindi', 'medium', 'active']
            );
        }

        console.log('Database seeded successfully.');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedAdmin();
