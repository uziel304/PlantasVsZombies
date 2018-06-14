
var tiempo;
var cont;
var activar = document.getElementById('activar');
function tiempoFuncion() {
	cont++;
    tiempo = setTimeout(function(){
     activar.classList.remove("oculto"); 
     if (cont==9000) {
     	pararTiempo()
     }
 	}, 9000);
}

tiempoFuncion()

function pararTiempo() {
    clearTimeout(tiempo);
    console.log("se termino");
}


$('.abrir').on('click',function(){
		$('.container').hide();
		$('.menu').show();
});