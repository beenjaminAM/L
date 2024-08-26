const Course = require('../model/Course');

const getAllCourses = async (req, res) => {
    const courses = await Course.find();
    if (!courses) return res.status(204).json({ 'message': 'No courses found.' });
    res.json(courses);
}

const createNewCourse = async (req, res) => {
    const { name, hours, requirement } = req.body;

    // Validar campos requeridos
    if (!name || !hours) {
        return res.status(400).json({ message: 'Name and hours are required' });
    }

    // Validar requirement
    if (!['Required', 'Elective'].includes(requirement)) {
        return res.status(400).json({ message: 'Requirement must be either Required or Elective' });
    }

    try {
        const result = await Course.create({
            name: name,
            hours: hours,
            requirement: requirement
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

const getCourse = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Course ID required.' });

    const course = await Course.findOne({ _id: req.params.id }).exec();
    if (!course) {
        return res.status(204).json({ "message": `No course matches ID ${req.params.id}.` });
    }
    res.json(course);
}

module.exports = {
    getAllCourses,
    createNewCourse,
    getCourse
}