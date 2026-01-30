const express = require('express');
const router = express.Router();
const {
  submitApplication,
  getMyApplication,
  updateApplication,
  deleteApplication,
  uploadDocument,
  getApplicationDocuments,
  deleteDocument
} = require('../controllers/applicationController');
const { protect, isStudent, checkOwnership } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

// All routes require authentication and student role
router.use(protect);
router.use(isStudent);

// Application CRUD
// router.route('/')
//   .post(submitApplication)
//   .get(getMyApplication);
router.post('/', submitApplication)
router.get('/my-application', getMyApplication)


router.route('/:id')
  .put(checkOwnership('Application'), updateApplication)
  .delete(checkOwnership('Application'), deleteApplication);

// Document routes
router.route('/:id/documents')
  .post(checkOwnership('Application'), upload.single('file'), uploadDocument)
  .get(checkOwnership('Application'), getApplicationDocuments);

router.delete('/documents/:docId', checkOwnership('Document'), deleteDocument);

module.exports = router;