const mongoose = require("mongoose");

const UsuariosSchema = mongoose.Schema({
  puntaje: Number,
  email: String,
  tiempo: Number,
  tiempoRespuestas: [Number],
  erroresRespuestas: [{ id: String, errno: Number }],
});

module.exports = mongoose.model("Usuarios", UsuariosSchema);
