class Gasto{
     constructor(descripcion, categoria, fecha, importe) {
        this.descripcion = descripcion;
        this.categoria = categoria;
        this.fecha = fecha;
        this.importe = importe;
    }
};

class VistaGasto{
    static printGasto(gasto){
        var div_cont = $("<div>");
        div_cont.addClass("row cont-gasto");
        var div_icono = $("<div>");
        div_icono.addClass("columna-icono col-xs-12 col-md-3");
        var div_cuerpo = $("<div>");
        div_cuerpo.addClass("columna-cuerpo col-xs-12 col-md-9");
        div_cuerpo.html(gasto.descripcion);
        div_cont.append(div_icono);
        div_cont.append(div_cuerpo);

        return div_cont;
    }
};

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
                    $("#titulo-modal").html("¡ENHORABUENA! Tu gasto se ha podido guardar correctamente");
                    gasto = new Gasto(msg.descripcion, msg.categoria, msg.fecha, msg.importe);

                    $("#cuerpo-modal").append(VistaGasto.printGasto(gasto));
                    $("#myModal").modal();
                }
            }
        });
    });
});
