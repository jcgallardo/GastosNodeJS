// Rutas de la aplicación
exports.index = function(req, res){
  // Renderiza la plantilla 'index' cuando en el navegador
  // nos encontremos en la raiz '/' --> http://localhost:puerto/
    var mongoose = require('mongoose');
    var Categoria  = mongoose.model('Categoria');
    Categoria.find().exec(function (err, categorias) {
        res.render('index', { title: 'Expensy', user: req.user, categorias: categorias });
    });

};
