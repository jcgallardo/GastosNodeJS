// Modelo Gasto para la base de datos

// Mongoose es una libreria de Node que nos permite
// conectarnos a una base de datos MongoDB y modelar un esquema
// para ella.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Campos que vamos a guardar en la base de datos
var CategoriaSchema = new Schema({
	name			 : String
});

// Exportamos el modelo 'categoria' para usarlo en otras partes de la aplicación
var Categoria = mongoose.model('Categoria', CategoriaSchema);
