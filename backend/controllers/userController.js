const db = require('../config/db');

// Get User Reports (For logged-in user)
exports.getMyReports = async (req, res) => {
    try {
        const userId = req.user.id;
        const [reports] = await db.execute(
            'SELECT * FROM user_reports WHERE user_id = ? ORDER BY test_date DESC',
            [userId]
        );
        res.json(reports);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Save a new report
exports.saveReport = async (req, res) => {
    try {
        const userId = req.user.id;
        const { wpm, accuracy, errors, duration, source } = req.body;

        await db.execute(
            'INSERT INTO user_reports (user_id, wpm, accuracy, errors, duration, source) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, wpm, accuracy, errors || 0, duration || 60, source || 'default']
        );

        res.status(201).json({ message: 'Report saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get All Reports (For Admin)
exports.getAllReports = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const [reports] = await db.execute(`
            SELECT r.*, u.username, u.email 
            FROM user_reports r 
            JOIN users u ON r.user_id = u.id 
            ORDER BY r.test_date DESC
        `);
        res.json(reports);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get Custom Paragraphs
exports.getMyCustomParagraphs = async (req, res) => {
    try {
        const userId = req.user.id;
        const [paragraphs] = await db.execute(
            'SELECT * FROM custom_paragraphs WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        res.json(paragraphs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create Custom Paragraph (Upload Text)
exports.createCustomParagraph = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, content } = req.body;

        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }

        await db.execute(
            'INSERT INTO custom_paragraphs (user_id, title, content) VALUES (?, ?, ?)',
            [userId, title || 'Untitled', content]
        );

        res.status(201).json({ message: 'Custom paragraph saved' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
