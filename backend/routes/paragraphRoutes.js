const express = require('express');
const router = express.Router();
const paragraphController = require('../controllers/paragraphController');
const verifyToken = require('../middleware/authMiddleware');

// Public route to fetch test paragraph
router.get('/test', paragraphController.getTestParagraph);

// Protected Admin Routes
router.get('/', verifyToken, paragraphController.getAllParagraphs);
router.post('/', verifyToken, paragraphController.createParagraph);
router.put('/:id', verifyToken, paragraphController.updateParagraph);
router.delete('/:id', verifyToken, paragraphController.deleteParagraph);

module.exports = router;
