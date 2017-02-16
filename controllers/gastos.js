var mongoose = require('mongoose');
var Gasto  = mongoose.model('Gasto');

//GET - Return all gastos in the DB
exports.findAllGastos = function(req, res) {
    Gasto.find(function(err, gastos) {
        if(err) res.send(500, err.message);

        console.log('GET /gasto')
            res.status(200).jsonp(gastos);
    });
};
exports.addGasto = function(req, res) {
    console.log('POST');
    console.log(req.body);

    var gasto = new Gasto({
        //provider_id:    req.user.name, --> necesito el usuario
        descripcion:     req.body.descripcion,
        //fecha:  req.body.fecha, // --> necesito una fecha válida
        categoria:   req.body.categoria,
        importe:  req.body.importe
    });

    gasto.save(function(err, resultado) {
        if(err) return res.status(500).send( err.message);
        res.status(200).jsonp(resultado);
    });
}
