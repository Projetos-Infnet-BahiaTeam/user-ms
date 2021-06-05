const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var UsuarioSchema = new Schema({
   nome: String,
   email: String,
   password: String
});

module.exports = mongoose.model('usuario', UsuarioSchema);