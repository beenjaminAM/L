const express = require('express');
const router = express.Router();
const syllabusController = require('../../controllers/syllabusController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(syllabusController.getAllSyllabus)
    .post(syllabusController.createNewSyllabu)
    .put(syllabusController.updateSyllabu);

router.route('/:id')
    .get(syllabusController.getSyllabu)

module.exports = router;