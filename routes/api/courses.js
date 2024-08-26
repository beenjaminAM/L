const express = require('express');
const router = express.Router();
const coursesController = require('../../controllers/coursesController');
const ROLES_LIST = require('../../config/roles_list');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(coursesController.getAllCourses)
    .post(coursesController.createNewCourse)

router.route('/:id')
    .get(coursesController.getCourse);

module.exports = router;