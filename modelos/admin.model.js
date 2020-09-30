const mongoose = require('mongoose');

const Admin = mongoose.Schema({    
    email: String,
    nombre: String    
});

module.exports = mongoose.model('Admin', Admin);