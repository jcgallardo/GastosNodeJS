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

    var provider_id = req.user.provider_id;
    var descripcion = req.body.descripcion;
    var fecha = req.body.fecha;
    var categoria = req.body.categoria;
    var importe = req.body.importe;

    if (provider_id != null && provider_id != "" && descripcion != null && descripcion != "" && fecha != null && fecha != "" && categoria != null  && categoria != "" && importe != null && importe != "") {
        var gasto = new Gasto({
            provider_id:    provider_id,
            descripcion:     descripcion,
            fecha:  fecha,
            categoria:   categoria,
            importe:  importe
        });

        gasto.save(function (err, resultado) {
            if (err) return res.status(500).send(err.message);
            res.status(200).jsonp(resultado);
        });
    }else{
        res.status(201).jsonp({error: "Campos obligatorios"});
    }
};
