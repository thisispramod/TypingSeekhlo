const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware');

// User Reports
router.get('/reports', verifyToken, userController.getMyReports);
router.post('/reports', verifyToken, userController.saveReport);

// Admin: Get All Reports
router.get('/admin/reports', verifyToken, userController.getAllReports);

// Custom Paragraphs
router.get('/custom-paragraphs', verifyToken, userController.getMyCustomParagraphs);
router.post('/custom-paragraphs', verifyToken, userController.createCustomParagraph);

module.exports = router;
