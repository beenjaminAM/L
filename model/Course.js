const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    hours: {
        type: Number,
        required: true
    },
    requirement: {
        type: String,
        enum: ['Required', 'Elective']
    },
    sumilla: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Course', courseSchema);