// Modelo Usuario para la base de datos

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Campos que vamos a guardar en la base de datos
var UserSchema = new Schema({
	name		: String, // Nombre
	provider	: String, // Cuenta (Twitter, Facebook, etc)
	provider_id : {type: String, unique: true}, // ID único
	photo		: String, // Avatar
	createdAt	: {type: Date, default: Date.now} // Fecha creación
});

// Exportamos el modelo User
var User = mongoose.model('User',UserSchema);