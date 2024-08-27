const express = require('express');
const router = express.Router();
const syllabusController = require('../../controllers/syllabusController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(syllabusController.getAllSyllabus)
    .post(syllabusController.createNewSyllabu)

router.route('/:id')
    .get(syllabusController.getSyllabu)
    .put(syllabusController.updateSyllabu);

module.exports = router;