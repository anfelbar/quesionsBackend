const mongoose = require('mongoose');

const PreguntasSchema = mongoose.Schema({
    /*id: Number,
    category: String,
    type: String,*/
    difficulty: Number,
    question: String,
    correct_answer: String,
    incorrect_answers: [{type: String}] 
});

module.exports = mongoose.model('Preguntas', PreguntasSchema);