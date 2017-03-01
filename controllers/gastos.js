var mongoose = require('mongoose');
var Gasto  = mongoose.model('Gasto');

//GET - Return all gastos in the DB
exports.findAllGastos = function(req, res) {
    var desde = req.query.desde;
    var hasta = req.query.hasta;
    var categoria = req.query.categoria;

    var data = {"provider_id":req.user.provider_id};

    if(desde != ""){
        if (hasta != ""){
            if (categoria != ""){
                data = {"fecha" : {"$gte" : desde, "$lte" : hasta}, "categoria" : categoria};
            }else{
                data = {"fecha" : {"$gte" : desde, "$lte" : hasta}}
            }
        }else if(categoria != ""){
            data = {"fecha" : {"$gte" : desde}, "categoria" : categoria};
        }else{
            data = {"fecha" : {"$gte" : desde}};
        }
    }else if(hasta != ""){
        if (categoria != ""){
            data = {"fecha" : {"$lte" : hasta}, "categoria" : categoria};
        }else{
            data = {"fecha" : {"$lte" : hasta}}
        }
    }else if(categoria != ""){
        data = {"categoria" : categoria};
    }
    Gasto.find(data,function(err, gastos) {
        if(err) res.send(500, err.message);
        console.log('GET /gasto');
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

exports.findMensual = function(req,res) {
    console.log('GET');
    var provider_id = req.user.provider_id;

    if (provider_id != null && provider_id != ""){
        data = {"provider_id" : provider_id};
        Gasto.aggregate([{$match : data} ,{"$group" : {_id:"$categoria", y:{$sum:"$importe"}}}], function(err, resultado){
            if (err) return res.status(500).send(err.message);
            res.status(200).jsonp(resultado);
        });
    }
};
