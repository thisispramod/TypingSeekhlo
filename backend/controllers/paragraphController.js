const db = require('../config/db');

// Get all paragraphs (Admin)
exports.getAllParagraphs = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM typing_paragraphs ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single random active paragraph for test
exports.getTestParagraph = async (req, res) => {
    try {
        const { language, difficulty } = req.query;
        let query = 'SELECT * FROM typing_paragraphs WHERE status = "active"';
        const params = [];

        if (language) {
            query += ' AND language = ?';
            params.push(language);
        }
        if (difficulty) {
            query += ' AND difficulty = ?';
            params.push(difficulty);
        }

        query += ' ORDER BY RAND() LIMIT 1';

        const [rows] = await db.execute(query, params);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No paragraphs found for these criteria.' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Create new paragraph
exports.createParagraph = async (req, res) => {
    try {
        const { paragraph_text, language, difficulty, status } = req.body;

        if (!paragraph_text || !language) {
            return res.status(400).json({ message: 'Text and language are required' });
        }

        const [result] = await db.execute(
            'INSERT INTO typing_paragraphs (paragraph_text, language, difficulty, status) VALUES (?, ?, ?, ?)',
            [paragraph_text, language, difficulty || 'medium', status || 'active']
        );

        res.status(201).json({ message: 'Paragraph created', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update paragraph
exports.updateParagraph = async (req, res) => {
    try {
        const { id } = req.params;
        const { paragraph_text, language, difficulty, status } = req.body;

        await db.execute(
            'UPDATE typing_paragraphs SET paragraph_text = ?, language = ?, difficulty = ?, status = ? WHERE id = ?',
            [paragraph_text, language, difficulty, status, id]
        );

        res.json({ message: 'Paragraph updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete paragraph
exports.deleteParagraph = async (req, res) => {
    try {
        const { id } = req.params;
        await db.execute('DELETE FROM typing_paragraphs WHERE id = ?', [id]);
        res.json({ message: 'Paragraph deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
