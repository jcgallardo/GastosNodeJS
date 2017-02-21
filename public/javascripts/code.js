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
        div_icono.append("<p>"+gasto.categoria[0]+gasto.categoria[1]+"</p>");
        var div_cuerpo = $("<div>");
        div_cuerpo.addClass("columna-cuerpo col-xs-12 col-md-9");
        var div_descripcion = $("<div>");
        div_descripcion.addClass("cont-descripcion");
        div_descripcion.append("<span class='strong'>Descripcion: </span>");
        div_descripcion.append("<p>"+gasto.descripcion+"</p>");
        var div_footer = $("<div>");
        div_footer.addClass("row gato-footer");
        var div_fecha = $("<div>");
        var div_importe = $("<div>");
        div_fecha.addClass("col-md-6");
        div_importe.addClass("col-md-6");
        var fecha = new Date(gasto.fecha);
        div_fecha.append("<p class='fecha'>Insertado el "+fecha.toLocaleDateString()+" </p>");
        div_importe.append("<p class='precio'>"+gasto.importe.toFixed(2)+"&euro;</p>");
        div_footer.append(div_fecha);
        div_footer.append(div_importe);
        div_cuerpo.append(div_descripcion);
        div_cuerpo.append(div_footer);
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
                    $("#titulo-modal").html("¡ENHORABUENA!");
                    $("#titulo-modal-2").html("Estos son los gastos que has insertado hoy");
                    gasto = new Gasto(msg.descripcion, msg.categoria, msg.fecha, msg.importe);

                    $("#cuerpo-modal").append(VistaGasto.printGasto(gasto));
                    $("#myModal").modal();
                }
            }
        });
    });
});
