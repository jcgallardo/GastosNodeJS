// Modelo Gasto para la base de datos

// Mongoose es una libreria de Node que nos permite
// conectarnos a una base de datos MongoDB y modelar un esquema
// para ella.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Campos que vamos a guardar en la base de datos
var GastoSchema = new Schema({
	provider_id			 : String,
	descripcion			 : String, // Avatar o foto del usuario
	fecha	             : Date,
	categoria		     : String,
    importe              : Number
});

// Exportamos el modelo 'gasto' para usarlo en otras partes de la aplicación
var Gasto = mongoose.model('Gasto', GastoSchema);
