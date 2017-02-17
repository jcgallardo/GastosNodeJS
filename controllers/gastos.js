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
    //console.log(req.body);
    //console.log(req.session);
    var gasto = new Gasto({
        provider_id:    req.user.provider_id,
        descripcion:     req.body.descripcion,
        fecha:  req.body.fecha,
        categoria:   req.body.categoria,
        importe:  req.body.importe
    });

    gasto.save(function(err, resultado) {
        if(err) return res.status(500).send( err.message);
        res.status(200).jsonp(resultado);
    });
}
