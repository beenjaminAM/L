const Syllabu = require('../model/Syllabu');

const getAllSyllabus = async (req, res) => {
    const syllabus = await Syllabu.find();
    if (!syllabus) return res.status(204).json({ 'message': 'No syllabus found.' });
    res.json(syllabus);
}

const createNewSyllabu = async (req, res) => {
    const { 
        periodo,
        nombreCurso,
        sumilla,
        profesor,
        competenciaGeneral,
        competenciaEspecifica,
        logro,
        /* material,
        estrategia,
        teorico,
        practico,
        parcial,
        final,
        evaluacionContinua,
        bibliografia, */
     } = req.body;

    // Validar campos requeridos
    if ( 
        !periodo ||
        !nombreCurso ||
        !sumilla ||
        !profesor ||
        !competenciaGeneral ||
        !competenciaEspecifica ||
        !logro      
    ) {
        return res.status(400).json({ message: 'Periodo, nombreCurso, sumilla, profesor, competenciaGeneral, competenciaEspecifica and logro are required' });
    }

    try {
        const result = await Syllabu.create({
            periodo,
            nombreCurso,
            sumilla,
            profesor,
            competencias: {
                competenciaGeneral,
                competenciaEspecifica
            },
            logrosDeAprendizaje: {
                logro
            }
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

const getSyllabu = async (req, res) => {
    if (!req?.params?.id || !req?.params?.id.match(/^[0-9a-fA-F]{24}$/)) return res.status(400).json({ 'message': 'Syllabu ID required.' });

    const syllabu = await Syllabu.findOne({ _id: req.params.id }).exec();
    if (!syllabu) {
        return res.status(204).json({ "message": `No syllabu matches ID ${req.params.id}.` });
    }
    res.json(syllabu);
}

const updateSyllabu = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ message: 'ID parameter is required.' });
    }

    try {
        const syllabu = await Syllabu.findOne({ _id: req.body.id }).exec();
        if (!syllabu) {
            return res.status(204).json({ message: `No syllabu matches ID ${req.body.id}.` });
        }

        // Actualizar los campos solo si existen
        /* if (req.body?.periodo) syllabu.periodo = req.body.periodo; */
        if (req.body?.nombreCurso) syllabu.nombreCurso = req.body.nombreCurso;
        /* if (req.body?.sumilla) syllabu.sumilla = req.body.sumilla; */
        if (req.body?.profesor) syllabu.profesor = req.body.profesor;

        // Verificar existencia de objetos anidados antes de asignar valores
        if (req.body?.competenciaGeneral) {
            syllabu.competencias = syllabu.competencias || {};
            syllabu.competencias.competenciaGeneral = req.body.competenciaGeneral;
        }
        if (req.body?.competenciaEspecifica) {
            syllabu.competencias = syllabu.competencias || {};
            syllabu.competencias.competenciaEspecifica = req.body.competenciaEspecifica;
        }
        if (req.body?.logro) {
            syllabu.logrosDeAprendizaje = syllabu.logrosDeAprendizaje || {};
            syllabu.logrosDeAprendizaje.logro = req.body.logro;
        }
        if (req.body?.material) {
            syllabu.materiales = syllabu.materiales || {};
            syllabu.materiales.material = req.body.material;
        }
        if (req.body?.estrategia) {
            syllabu.estrategias = syllabu.estrategias || {};
            syllabu.estrategias.estrategia = req.body.estrategia;
        }
        if (req.body?.teorico) {
            syllabu.programacion = syllabu.programacion || {};
            syllabu.programacion.teorico = req.body.teorico;
        }
        if (req.body?.practico) {
            syllabu.programacion = syllabu.programacion || {};
            syllabu.programacion.practico = req.body.practico;
        }

        // Validación de enteros
        const esEntero = (valor) => Number.isInteger(valor);
        
        // Validar parcial
        if (req.body?.parcial !== undefined) {
            const parcial = parseInt(req.body.parcial, 10);
            if (esEntero(parcial)) {
                syllabu.evaluacion = syllabu.evaluacion || {};
                syllabu.evaluacion.parcial = parcial;
            } else {
                return res.status(400).json({ message: 'El campo "parcial" debe ser un número entero.' });
            }
        }
        // Validar final
        if (req.body?.final !== undefined) {
            const final = parseInt(req.body.final, 10);
            if (esEntero(final)) {
                syllabu.evaluacion = syllabu.evaluacion || {};
                syllabu.evaluacion.final = final;
            } else {
                return res.status(400).json({ message: 'El campo "final" debe ser un número entero.' });
            }
        }
        // Validar evaluacionContinua
        if (req.body?.evaluacionContinua !== undefined) {
            const evaluacionContinua = parseInt(req.body.evaluacionContinua, 10);
            if (esEntero(evaluacionContinua)) {
                syllabu.evaluacion = syllabu.evaluacion || {};
                syllabu.evaluacion.evaluacionContinua = evaluacionContinua;
            } else {
                return res.status(400).json({ message: 'El campo "evaluacionContinua" debe ser un número entero.' });
            }
        }
        if (req.body?.bibliografia) {
            syllabu.bibliografia = syllabu.bibliografia || {};
            syllabu.bibliografia.bibliografia = req.body.bibliografia;
        }

        // Guardar los cambios
        const result = await syllabu.save();
        res.json(result);

    } catch (err) {
        console.error(err)
    }
}

module.exports = {
    getAllSyllabus,
    createNewSyllabu,
    getSyllabu,
    updateSyllabu
}