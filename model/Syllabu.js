const mongoose = require('mongoose')
const Schema = mongoose.Schema

const syllabuSchema = new Schema({
    periodo: {
        type: String,
        required: true,
    },
    nombreCurso: {
        type: String,
        required: true,
    },
    sumilla: {
        type: String,
        required: true,
    },
    profesor: {
        type: String,
        required: true,
    },
    competencias: {
        competenciaGeneral: String,
        competenciaEspecifica: String,
    },
    logrosDeAprendizaje: {
        logro: String,
    },
    materiales: {
        material: String,
    },
    estrategias: {
        estrategia: String,
    },
    programacion: {
        teorico: String,
        practico: String,
    },
    evaluacion: {
        parcial: Number,
        final: Number,
        evaluacionContinua: Number,
    },
    bibliografia: {
        bibliografia: String
    },
})

module.exports = mongoose.model('Syllabu', syllabuSchema)