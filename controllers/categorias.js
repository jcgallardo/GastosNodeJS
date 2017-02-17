var mongoose = require('mongoose');
var Categoria  = mongoose.model('Categoria');

//GET - Return all categorias in the DB
exports.findAllCategorias = function(req, res) {
    Categoria.find(function(err, categorias) {
        if(err) res.send(500, err.message);

        console.log('GET /categorias')
            res.status(200).jsonp(categorias);
    });
};
