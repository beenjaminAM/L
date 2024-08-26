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
    }
});

module.exports = mongoose.model('Course', courseSchema);