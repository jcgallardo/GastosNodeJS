class Gasto{
     constructor(descripcion, categoria, fecha, importe) {
        this.descripcion = descripcion;
        this.categoria = categoria;
        this.fecha = fecha;
        this.importe = importe;
    }
}
class VistaGasto{
    static printGasto(gasto){
        var div_cont = $("<div>");
        div_cont.addClass("row cont-gasto");
        var div_icono = $("<div>");
        div_icono.addClass("columna-icono col-xs-3 col-md-3");
        div_icono.append("<p>"+gasto.categoria[0]+gasto.categoria[1]+"</p>");
        var div_cuerpo = $("<div>");
        div_cuerpo.addClass("columna-cuerpo col-xs-9 col-md-9");
        var div_descripcion = $("<div>");
        div_descripcion.addClass("cont-descripcion");
        div_descripcion.append("<span class='strong'>Descripcion: </span>");
        div_descripcion.append("<p>"+gasto.descripcion+"</p>");
        var div_footer = $("<div>");
        div_footer.addClass("row gato-footer");
        var div_fecha = $("<div>");
        var div_importe = $("<div>");
        div_fecha.addClass("col-md-6 col-xs-6 col-sm-6");
        div_importe.addClass("col-md-6 col-xs-6 col-sm-6");
        var fecha = new Date(gasto.fecha);
        div_fecha.append("<p class='fecha'>"+fecha.toLocaleDateString()+" </p>");
        div_importe.append("<p class='precio'>"+gasto.importe.toFixed(2)+"&euro;</p>");
        div_footer.append(div_fecha);
        div_footer.append(div_importe);
        div_cuerpo.append(div_descripcion);
        div_cuerpo.append(div_footer);
        div_cont.append(div_icono);
        div_cont.append(div_cuerpo);

        return div_cont;
    }
}
class VistaGastos{
    static printGastosEtiquetas(gastos, por_fila){
        var cont = $("<div>");
        var tamanio = gastos.length;
        if (tamanio > 0 ) {
            cont.append("<h4>Se han encontrado un total de " + gastos.length + " gastos.");
        }else{
            cont.append("<h4>Aún no hay gastos con estas preferencias. ¡Ánimate y comienza cuanto antes!</h4>");
        }

        for (var i=0; i<gastos.length; i++){
            if (por_fila == 2) {
                var row = $("<div>"); row.addClass("row");
                var columna1 = $("<div>"); columna1.addClass("col-xs-12 col-md-6");
                columna1.append(VistaGasto.printGasto(gastos[i]));
                row.append(columna1);
                i++;

                if (i<gastos.length){
                    var columna2 = $("<div>"); columna2.addClass("col-xs-12 col-md-6");
                    var gasto2 = VistaGasto.printGasto(gastos[i]);
                    columna2.append(gasto2);
                    row.append(columna2);
                }
                cont.append(row);
            }else {
                cont.prepend(VistaGasto.printGasto(gastos[i]));
            }
        }
        return cont;
    }
}

function graficoMensual(data){
    // Gráfico
    Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function (color) {
        return {
            radialGradient: {
                cx: 0.5,
                cy: 0.3,
                r: 0.7
            },
            stops: [
                [0, color],
                [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
            ]
        };
    });

    // Build the chart
    Highcharts.chart('cont-graf-mensual', {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: 'Gasto mensual por categorías'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    },
                    connectorColor: 'silver'
                }
            }
        },
        series: [{
            name: 'Brands',
            data: data
        }]
    });
}

$(document).ready(function(){
    $("#b-guardar").click(function(){
        // cogemos los datos y los validamos
        var descripcion = $("#desc-gasto").val();
        var categoria = $("#cat-gasto").val();
        var fecha = $("#fecha-gasto").val();
        var importe = $("#importe-gasto").val();

        $.ajax({
            method: "POST",
            url: "/api/gastos",
            data: {
                descripcion: descripcion,
                categoria: categoria,
                fecha: fecha,
                importe: importe
            },
            statusCode: {
                404: function(){
                    alert("Página no encontrada");
                },
                201: function(msg){
                    $("#titulo-modal").html("ERROR");
                    $("#cuerpo-modal").html("<p>"+msg.error+"</p>");
                    $("#myModal").modal();
                },
                200: function(msg){
                    $("#titulo-modal").html("¡ENHORABUENA!");
                    $("#titulo-modal-2").html("Estos son los gastos que has insertado hoy");
                    gasto = new Gasto(msg.descripcion, msg.categoria, msg.fecha, msg.importe);

                    $("#cuerpo-modal").prepend(VistaGasto.printGasto(gasto));
                    $("#myModal").modal();
                }
            }
        });
    });

    // Botón mostrar etiquetas
    $("#b-etiquetas").click(function(){
        var desde = $("#fec_desde").val();
        var hasta = $("#fec_hasta").val();
        var categoria = $("#select_cat").val();

        $.ajax({
            method: "GET",
            url: "/api/gastos",
            data: {
                desde: desde,
                hasta: hasta,
                categoria: categoria
            },
            statusCode: {
                404: function(){
                    alert("Página no encontrada");
                },
                201: function(msg){
                    $("#titulo-modal").html("ERROR");
                    $("#cuerpo-modal").html("<p>"+msg.error+"</p>");
                    $("#myModal").modal();
                },
                200: function(msg){
                    $("#contenedor_etiquetas").html("");
                    $("#contenedor_etiquetas").append(VistaGastos.printGastosEtiquetas(msg,2));
                }
            }
        });
    });

    $("#b-g-mensual").click(function () {
        $.ajax({
            method: "GET",
            url: "/api/gastos/mensual",
            statusCode: {
                404: function(){
                    alert("Página no encontrada");
                },
                201: function(msg){
                    $("#cont-form-mensual").append("<h3>ERROR 201</h3>");
                    $("#cont-form-mensual").html("<p>"+msg.error+"</p>");
                },
                200: function(msg){
                    $("#cont-form-mensual").html("");
                    var arreglado = msg.map( item => {
                        // lo guardas temporalmente
                        var temporal = item._id;
                        // eliminas el valor que ya no quieres
                        delete item._id;
                        // creas el valor nuevo.
                        item.name = temporal;
                        return item;
                    });
                    graficoMensual(arreglado);
                }
            }
        });
    });


});
