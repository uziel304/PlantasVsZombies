let fondoImg
let marcadoresImg
let solImg
let soles=50
let cartaArrastrarImg 

const zombies=[]
const zombieNormal=[]
const zombieCono=[]
const zombieCubeta=[]
const zombieJefe=[]
const plantas=[]
const cartasImg=[]
const podadoras=[]
let banderaPodadoras=false

let zombiesEliminados=0
let ctdZombiesElimitar=15
let Estado=0

let presione=0
let SeleccionadoPlanta=false
let cartaSeleccionada

let numeroCartas=5
let numeroZombies=4

let ximg=800

let play=true

let nivel=1

let Cpala
let pala
let palaActiva=false

let gameComplete
let gameOver

const sonidos=[]

function setup() {

	createCanvas(windowWidth, windowHeight);
}

function draw()
{
	if(play && document.getElementById("jugar").value==1)
		init()
	else
		pintarTablero(true)


	playSonidos()
	   setInterval(function() {
     	if (ximg>0) {
     		ximg-=20
     	}
     	if (ximg==0) {
     		banderaPodadoras=true
     	}
	}, 3000); 
}

function init()
{
	
	definirNivel()
	pintarTablero()
	pintarCartas()
	pintarPodadoras()
	pintarPlantas()
	pintarZombies()
	pintarSolAleatorio()
	arrastrarCarta()
	activarZombieParaDisparar()
	disparoDePlantas()
	comerPlantas() 

}


function definirNivel()
{
	switch(document.getElementById("nivelJugar").value)
	{
		case '1':
		ctdZombiesElimitar=15
		nivel=1
		break

		case '2':
		ctdZombiesElimitar=25
		nivel=2
		break

		case '3':
		ctdZombiesElimitar=35
		nivel=3
		break
	}
}


function preload()
{
	fondoImg=loadImage("img/Otras/fondo3.png")

	marcadoresImg={
		marcador1: loadImage("img/Otras/marcadores.png")
	}

	for(let s=0; s<7; s++)
	{
		let sonido={
			audio: loadSound(`sounds/${s}.mp3`),
			sonar: true,
			volumen: 1,
		}
		sonidos.push(sonido)
	}
	
	cargarSol()
	cargarPlanta() 

	for(let x=0; x<numeroCartas; x++)
	{
		cargarCarta(x)
	}

	for(let x=0; x<numeroZombies; x++)
	{
		cargarZombie()
	}

	for(let x=0; x<16; x++)
	{
		zombieNormal[x]=loadImage(`img/Zombies/Zombie Simple/${x}.png`);
	}

	for(let x=0; x<51; x++)
	{
		zombieCono[x]=loadImage(`img/Zombies/Zombie con Cono/${x}.png`);
	}

	for(let x=0; x<31; x++)
	{
		zombieCubeta[x]=loadImage(`img/Zombies/Zombie Cubeta/${x}.png`);
	}

	for(let x=0; x<38; x++)
	{
		zombieJefe[x]=loadImage(`img/Zombies/Zombie Grandote/${x}.png`);
	}

	for(let x=0; x<5; x++)
	{
		cargarPodadoras(x)
	}

	gameComplete={
		img: loadImage("img/Otras/gameComplete.png"),
		activo: false,
	}
	gameOver={
		img: loadImage("img/Otras/gameOver.png"),
		activo: false,
	}
	Cpala=loadImage("img/cuadropala.jpg")
	pala=loadImage("img/pala.png")
}


function pintarCartas()
{
	for(let x=0; x<cartasImg.length; x++)
	{
		image(cartasImg[x].img, cartasImg[x].posX, cartasImg[x].posY, cartasImg[x].tamX, cartasImg[x].tamY)
	}
}

 
// function quitarPlanta(){

// 	for(let x=0; x<plantas.length; x++)
// 	{
// 		 if (plantas[x].posX==mouseX && plantas[x].posY==mouseY && plantas[x].plantaActivada==true) {
// 		 	plantas.[x].plantaActivada=false
// 		 }

// 	}

// }


function pintarTablero(tinte)
{
	if(tinte)
		tint(0, 153, 204, 126)
	else
		noTint()
	 
     
 	//fondo ecena de camara
	image(fondoImg,0, 0, windowWidth+1200, windowHeight,ximg)
	//barra de cartas
	image(marcadoresImg.marcador1, 200, 0) 

	//cuadro de pala
	image(Cpala, 675, 5,80,80) 

	if (palaActiva==true) {
		image(pala,mouseX,mouseY,80,90)
	}

	//cantidad de soles juntados
	fill("BLACK")
	textSize(18)
	text(soles, 225, 83)

	//validacion si el juego esta actualmente activo y ademas verificamos se gano o perdio
	if(gameOver.activo)
	{
		if(!sonidos[6].audio.isPlaying() && sonidos[6].sonar)
		{
			//sonido actual del juego
			sonidos[6].audio.play()
			sonidos[6].sonar=false
		}
		// Mostramos mensaje en pantalla que perdio
		textFont('dracula')
		textSize(120)
		fill("white")
		stroke("red")
		text("Perdiste!!!",windowWidth/2-300, windowHeight/2)
	}
	else{
		if(gameComplete.activo)
		{
			// Mostramos mensaje en pantalla que gano
			textFont('dracula')
			textSize(120)
			fill("white")
			stroke("red")
			text("Nivel Completado",windowWidth/2-500, windowHeight/2)	 
		}
	}
}

//Funcion de posicionar y mostrar las podadoras
function pintarPodadoras()
{
	for(let x=0; x<podadoras.length; x++)
	{
		for(let y=0; y<zombies.length; y++)
		{
			if(!podadoras[x].utilizado && banderaPodadoras==true)
				image(podadoras[x].img, podadoras[x].posX, podadoras[x].posY, podadoras[x].tamX, podadoras[x].tamY)		

			if(zombies[y].posX<=220 && zombies[y].zombieActivado && !podadoras[x].utilizado)
			{
				let p=0

				while(p<podadoras.length && podadoras[p].posLineaPodadora!=zombies[y].posLineaZombie)
				{
					p++
				}

				podadoras[p].activar=true
			}

			if(podadoras[x].posLineaPodadora==zombies[y].posLineaZombie && podadoras[x].activar && !podadoras[x].utilizado)
			{
				if(podadoras[x].posX>=zombies[y].posX && zombies[y].zombieActivado)
				{
					let zombiesActivosActuales=0

					for(let j=0; j<zombies.length; j++)
					{
						if(zombies[j].zombieActivado)
							zombiesActivosActuales++
					}

					if(zombiesEliminados+zombiesActivosActuales<ctdZombiesElimitar)
						zombies[y]=inicializarZombie()
					else
						zombies[y].zombieActivado=false				

					Estado=Math.floor(++zombiesEliminados*100/ctdZombiesElimitar)

					if(Estado>=100)
					{
						gameComplete.activo=true
						play=false
					}
				}
			}
			if(podadoras[x].activar && podadoras[x].posX<=1000 && !podadoras[x].utilizado)
				podadoras[x].posX+=podadoras[x].velocidad
			
			if(podadoras[x].posX>1000)
				podadoras[x].utilizado=true
		}
	}
}

//Funcion del posicionamiento y visualizacion de plantas en el mapa

function pintarPlantas()
{
	for(let x=0; x<plantas.length; x++)
	{
		if(plantas[x].plantaActivada)
		{
			image(plantas[x].img, plantas[x].posX, plantas[x].posY, plantas[x].tamX, plantas[x].tamY)

			//Este tipo de plantas son los girasoles
			if(plantas[x].tipoPlanta==0)
			{
				plantas[x].tiempoRecargaSol--
				
				if(plantas[x].tiempoRecargaSol<=0)
				{
					plantas[x].mostrarSol=true
					image(plantas[x].imgBala, plantas[x].posXBala, plantas[x].posYBala, plantas[x].tamXbala, plantas[x].tamYbala)
				}

				if(plantas[x].mostrarSol)
				{
					plantas[x].tiempoMostrarSol--
					
					if(plantas[x].tiempoMostrarSol<=0)
					{
						plantas[x].mostrarSol=false
						plantas[x].tiempoRecargaSol=plantas[x].tiempoRecargaSolAux
						plantas[x].tiempoMostrarSol=plantas[x].tiempoMostrarSolAux
					}
				}
			}
		}
	}

	for(let x=0; x<plantas.length; x++)
	{
		if(plantas[x].plantaActivada)
		{
			//Plantar el chile
			if(plantas[x].tipoPlanta==6)
			{
				plantas[x].tiempoRecargaChile--

				if(plantas[x].tiempoRecargaChile<=0)
				{
					if(!sonidos[3].audio.isPlaying())
						sonidos[3].audio.play()

					plantas[x].mostrarChile=true
					image(plantas[x].imgBala, plantas[x].posXBala, plantas[x].posYBala, plantas[x].tamXbala, plantas[x].tamYbala)
				}

				if(plantas[x].mostrarChile)
				{
					for(let y=0; y<zombies.length; y++)
					{
						if(plantas[x].posLineaPlanta==zombies[y].posLineaZombie && !plantas[x].plantaUsada && zombies[y].listoParaDisparar && zombies[y].zombieActivado)
						{
							zombies[y].vida-=plantas[x].danio

							if(zombies[y].vida<=0)
							{
								let zombiesActivos=0

								for(let j=0; j<zombies.length; j++)
								{
									if(zombies[j].zombieActivado)
										zombiesActivos++
								}

								if(zombiesEliminados+zombiesActivos<ctdZombiesElimitar)
									zombies[y]=inicializarZombie()
								else
									zombies[y].zombieActivado=false

								Estado=Math.floor(++zombiesEliminados*100/ctdZombiesElimitar)

								if(Estado>=100)
								{
									gameComplete.activo=true
									play=false
								}
							}
						}
					}
					plantas[x].plantaUsada=true

					plantas[x].tiempoMostrarChile--
					
					if(plantas[x].tiempoMostrarChile<=0)
					{
						plantas[x].mostrarChile=false
						plantas[x].plantaActivada=false
					}
				}
			}
		}
	}
}

//Funcion de inicializacion e posicionamiento de los zombies
function pintarZombies()
{
	for(let x=0; x<zombies.length; x++)
	{
		if(zombies[x].zombieActivado )
		{
			if((zombies[x].posSprites<zombies[x].sprites) && banderaPodadoras==true)
				zombies[x].posSprites++
			else
				zombies[x].posSprites=0

			switch(zombies[x].tipoZombie)
			{
				case 0:
				image(zombieNormal[zombies[x].posSprites], zombies[x].posX, zombies[x].posY, zombies[x].tamX, zombies[x].tamY)
				break

				case 1:
				image(zombieCono[zombies[x].posSprites], zombies[x].posX, zombies[x].posY, zombies[x].tamX, zombies[x].tamY)
				break

				case 2:
				image(zombieCubeta[zombies[x].posSprites], zombies[x].posX, zombies[x].posY, zombies[x].tamX, zombies[x].tamY)
				break

				case 3:
				image(zombieJefe[zombies[x].posSprites], zombies[x].posX, zombies[x].posY, zombies[x].tamX, zombies[x].tamY)
				break
			}
		}

		if(zombies[x].posX<=190 && zombies[x].zombieActivado)
		{
			for(let y=0; y<podadoras.length; y++)
			{
				if(podadoras[y].posLineaPodadora==zombies[x].posLineaZombie && podadoras[y].utilizado)
				{
					gameOver.activo=true
					play=false
				}
			}
		}

		if(zombies[x].posX<=1350 && sonidos[5].sonar)
		{
			sonidos[5].audio.play()
			sonidos[5].sonar=false
		}

		zombies[x].posX-=zombies[x].velocidadMovimiento
	}
}

//Genera soles aleatoriamente
function pintarSolAleatorio()
{
	image(solImg.img, solImg.posX, solImg.posY, solImg.tamX, solImg.tamY)

	if(solImg.posY<solImg.limite)
		solImg.posY+=solImg.velocidad

	if(solImg.posY>=solImg.limite)
	{
		solImg.tiempoMostrarSol--
		
		if(solImg.tiempoMostrarSol<=0)
			cargarSol()
	}
}

//funcion que muestra una carta que se arrastra una vez que se dio clic en una carta
function arrastrarCarta()
{
	if(cartaArrastrarImg.activada)
	{
		image(cartaArrastrarImg.img, cartaArrastrarImg.posX, cartaArrastrarImg.posY, cartaArrastrarImg.tamX, cartaArrastrarImg.tamY)
		cartaArrastrarImg.posX=mouseX-cartaArrastrarImg.tamX/2
		cartaArrastrarImg.posY=mouseY-cartaArrastrarImg.tamY/2
	}
}


//Nos ayuda a controlar el clic en la posicion que demos
function mouseClicked()
{
	//Valida que solo se realize una accion a la vez
	let accion=false

	//Click a un sol
	if(accion==false) 
	{
		if(mouseX>solImg.posX && mouseX<solImg.posX+50 && mouseY>solImg.posY && mouseY<solImg.posY+50)
		{
			accion=true
			cargarSol()
			soles+=25
		}
	}

	if(accion==false)
	{
		if(mouseX>=900 && mouseX<=965 && mouseY>=10 && mouseY<=35 && !gameComplete.activo && !gameOver.activo)
		{
			accion=true

			if(play)
				play=false
			else
				play=true

			if(sonidos[1].volumen==1)
			{
				sonidos[1].audio.setVolume(0)
				sonidos[1].volumen=0
			}
			else
			{
				sonidos[1].audio.setVolume(1)
				sonidos[1].volumen=1
			}
		}
	}

	//pala

	if (accion==false && (mouseX>675 && mouseX<755) && (mouseY>5 && mouseY<85) ) {
		accion=true
		alert("Pala")
	} 

	//Click a un sol de un girasol
	if(accion==false)
	{
		let salir=false

		for(let x=0; x<plantas.length; x++)
		{
			if(plantas[x].tipoPlanta==0 && plantas[x].mostrarSol && !salir)
			{
				if(mouseX>plantas[x].posXBala && mouseX<plantas[x].posXBala+50 && mouseY>plantas[x].posYBala && mouseY<plantas[x].posYBala+50)
				{
					accion=true
					salir=true
					plantas[x].mostrarSol=false
					plantas[x].tiempoRecargaSol=plantas[x].tiempoRecargaSolAux
					soles+=25
				}
			}
		}
	}

	//Click a una carta
	if(accion==false)
	{
		let encontrePlanta=false 
		let x=0
		presione++

		while(x<cartasImg.length && encontrePlanta==false)
		{
			if(mouseX>cartasImg[x].posX && mouseX<cartasImg[x].posX+70 && mouseY>cartasImg[x].posY && mouseY<cartasImg[x].posY+70)
			{
				accion=true
				encontrePlanta=true
				SeleccionadoPlanta=true
				presione=1

				cartaSeleccionada={
					nombre: cartasImg[x].nombre,
					costo: cartasImg[x].costo,
				}

				if(soles>=cartasImg[x].costo)
				{
					cartaArrastrarImg.activada=true
					cartaArrastrarImg.img=loadImage("img/Cartas/"+cartasImg[x].nombre+".png");
					cartaArrastrarImg.posX=mouseX-cartaArrastrarImg.tamX/2
					cartaArrastrarImg.posY=mouseY-cartaArrastrarImg.tamY/2
				}
				
			}
			x++
		}

		if(SeleccionadoPlanta && presione>=2)
		{
			if(soles>=cartaSeleccionada.costo)
				inicializarPlanta(mouseX, mouseY, cartaSeleccionada.nombre, cartaSeleccionada.costo)

			SeleccionadoPlanta=false
			presione=0
			cartaArrastrarImg.activada=false
		}
	}
}

function comerPlantas()
{
	for(let x=0; x<plantas.length; x++)
	{
		for(let y=0; y<zombies.length; y++)
		{
			//Comer plantas
			if(zombies[y].posLineaZombie==plantas[x].posLineaPlanta && zombies[y].posX-50<=plantas[x].posX && zombies[y].posX+50>=plantas[x].posX && plantas[x].plantaActivada && zombies[y].zombieActivado)
			{
				if(!sonidos[4].audio.isPlaying())
					sonidos[4].audio.play()

				zombies[y].velocidadMovimiento=0
				plantas[x].vida-=zombies[y].danio

				if(plantas[x].vida<=0 && plantas[x].plantaActivada )
				{			
					//Volver a permitir que caminen todos los zombies
					for(let z=0; z<zombies.length; z++)
					{
						if(zombies[z].posLineaZombie==plantas[x].posLineaPlanta)
							zombies[z].velocidadMovimiento=zombies[z].velocidadMovimientoAux
					}
					plantas[x].plantaActivada=false
				}
			}
		}
	}
}

function activarZombieParaDisparar()
{
	for(let y=0; y<zombies.length; y++)
	{
		//Reestablecer daños no vistos
		if(zombies[y].posX<=1000 && zombies[y].zombieActivado)
		{
			if(!zombies[y].listoParaDisparar)
				zombies[y].vida=zombies[y].auxVida

			//Activar todas las plantas de la linea
			for(let z=0; z<plantas.length; z++)
			{
				if(plantas[z].posLineaPlanta==zombies[y].posLineaZombie && plantas[z].tipoPlanta!=0 && plantas[z].plantaActivada)
				{
					if(!plantas[z].listoParaDisparar)
						plantas[z].posXBala=plantas[z].posXBalaAux

					plantas[z].listoParaDisparar=true
				}
			}
			zombies[y].listoParaDisparar=true
		}
	}
}

function disparoDePlantas()
{
	for(let x=0; x<plantas.length; x++)
	{
		for(let y=0; y<zombies.length; y++)
		{
			//Disparar bala
			if(plantas[x].tipoPlanta!=0 && plantas[x].tipoPlanta!=6 && plantas[x].posLineaPlanta==zombies[y].posLineaZombie && plantas[x].tiempoRecarga==plantas[x].tiempoRecargaAux && zombies[y].posX>=plantas[x].posX && plantas[x].listoParaDisparar && zombies[y].listoParaDisparar && plantas[x].plantaActivada && zombies[y].zombieActivado)
			{	 	
				image(plantas[x].imgBala, plantas[x].posXBala, plantas[x].posYBala, plantas[x].tamXbala, plantas[x].tamYbala)
			}
			if(plantas[x].listoParaDisparar && plantas[x].tiempoRecarga==plantas[x].tiempoRecargaAux)
				plantas[x].posXBala+=plantas[x].velocidadBala

			//Validar disparo a zombie
			if(plantas[x].tipoPlanta!=0 && plantas[x].tipoPlanta!=6 && plantas[x].posLineaPlanta==zombies[y].posLineaZombie && plantas[x].tiempoRecarga==plantas[x].tiempoRecargaAux && zombies[y].posX>=plantas[x].posX && plantas[x].posXBala-25>=zombies[y].posX && zombies[y].listoParaDisparar && plantas[x].listoParaDisparar && plantas[x].plantaActivada && zombies[y].zombieActivado)
			{
				plantas[x].posXBala=plantas[x].posXBalaAux
				plantas[x].tiempoRecarga=0
				plantas[x].tiempoRecargaAux+=8
				zombies[y].vida-=plantas[x].danio

				
				

				if(plantas[x].plantaHielo && !zombies[y].congelado)
				{
					zombies[y].velocidadMovimiento-=0.1
					zombies[y].congelado=true
				}

				if(zombies[y].vida<=0 && zombies[y].listoParaDisparar) 
				{
					plantas[x].listoParaDisparar=false
					plantas[x].tiempoRecargaAux=plantas[x].tiempoRecargaOriginal

					let zombiesActivos=0

					for(let j=0; j<zombies.length; j++)
					{
						if(zombies[j].zombieActivado)
							zombiesActivos++
					}

					if(zombiesEliminados+zombiesActivos<ctdZombiesElimitar)
						zombies[y]=inicializarZombie()
					else
						zombies[y].zombieActivado=false

					Estado=Math.floor(++zombiesEliminados*100/ctdZombiesElimitar)

					if(Estado>=100)
					{
						gameComplete.activo=true
						play=false
					}
				}
			}

			if(plantas[x].tiempoRecarga<plantas[x].tiempoRecargaAux)
				plantas[x].tiempoRecarga++
		}
	}
}



function playSonidos()
{
	if(gameOver.activo || gameComplete.activo)
		sonidos[1].audio.stop()

	if(play && document.getElementById("jugar").value==1 && !gameOver.activo && !gameComplete.activo)
	{
		if(!sonidos[1].audio.isPlaying())
			sonidos[1].sonar=true

		if(sonidos[1].sonar)
		{
			sonidos[0].audio.stop()
			sonidos[1].audio.play()
			sonidos[1].sonar=false
		}
	}
	else
	{		
		if(play && document.getElementById("jugar").value!=1 && !gameOver.activo && !gameComplete.activo)
		{
			if(!sonidos[0].audio.isPlaying())
				sonidos[0].sonar=true

			if(sonidos[0].sonar)
			{
				sonidos[1].audio.stop()
				sonidos[0].audio.play()
				sonidos[0].sonar=false
			}
		}
	}
} 



function cargarPlanta()
{
	let cartaArrastrar={
		img: "",
		posX: mouseX-70/2,
		posY: mouseY-70/2,
		tamX: 70,
		tamY: 70,
		activada: false,
	}

	cartaArrastrarImg=cartaArrastrar
}

function cargarSol()
{
	solImg={
		img: loadImage("img/Otras/sol.png"),
		posX: Math.floor(random(200,1000)),
		posY: Math.floor(random(-150,-350)),
		tamX: 50,
		tamY: 50,
		velocidad: 0.4,
		tiempoMostrarSol: 600,
		limite: Math.floor(random(50,580)),
	}
}

function cargarPodadoras(x)
{
	let posX=210
	let posY
	let posLineaPodadora

	switch(x)
	{
		case 0:
		posY=103
		posLineaPodadora=1
		break

		case 1:
		posY=240
		posLineaPodadora=2
		break

		case 2:
		posY=360
		posLineaPodadora=3
		break

		case 3:
		posY=490
		posLineaPodadora=4
		break	

		case 4:
		posY=620
		posLineaPodadora=5
		break
	}
	let podadora={
		img: loadImage("img/Plantas/podadora.png"),
		posX: posX,
		posY: posY,
		posLineaPodadora: posLineaPodadora,
		tamX: 90,
		tamY: 70,
		velocidad: 0.8,
		limite: 1000,
		utilizado: false,
		activar: false,
	}
	podadoras.push(podadora)
}

function cargarCarta(x)
{
	let posX=285+x*75
	let posY=8
	let tamX=70
	let tamY=70

	switch(x)
	{
		case 0:
		costo=50
		break

		case 1:
		costo=100
		break

		case 2:
		costo=125
		break

		case 3:
		costo=175
		break

		case 4:
		costo=300
		break
		
	}

	let carta={
		img: loadImage(`img/Cartas/${x}.png`),
		posX: posX,
		posY: posY,
		tamX: tamX,
		tamY: tamY,
		nombre: x,
		costo: costo,
	}
	cartasImg.push(carta)
}



function cargarZombie()
{
	zombies.push(inicializarZombie())
}

function inicializarZombie()
{
	let posXzombie=Math.floor(random(1350,1600))
	//let posXzombie=Math.floor(random(300,500))
	let posYzombie
	let lineaUbicadoZombie
	let vida
	let anchoZombie
	let altoZombie
	let congelado=false
	let tipoZombie
	let danio=1
	let sprites=15
	let posSprites=0

	switch(Math.floor(random(1,6)))
	{
		case 1:
		posYzombie=60
		lineaUbicadoZombie=1
		break

		case 2:
		posYzombie=200
		lineaUbicadoZombie=2
		break

		case 3:
		posYzombie=320
		lineaUbicadoZombie=3
		break

		case 4:
		posYzombie=460
		lineaUbicadoZombie=4
		break

		case 5:
		posYzombie=580
		lineaUbicadoZombie=5
		break
	}

	let auxNivel

	if(nivel==1)
		auxNivel=1
	else
		if(nivel==2)
			auxNivel=3
		else
			auxNivel=5

		switch(Math.floor(random(1, auxNivel)))
		{
			case 1:
			vida=8
			tipoZombie=0
			anchoZombie=70
			altoZombie=100
			// posYzombie+=13
			break

			case 2:
			vida=12
			tipoZombie=1
			anchoZombie=105
			altoZombie=120
			posSprites=0
			sprites=50
			break

			case 3:
			vida=16
			tipoZombie=2
			anchoZombie=90
			altoZombie=115
			sprites=30
			break

			case 4:
			vida=32
			tipoZombie=3
			posXzombie-=100
			posYzombie-=70
			anchoZombie=210
			altoZombie=210
			danio=1000
			sprites=37
			break
		}

		let zombie={
			vida: vida,
			auxVida: vida,
			posLineaZombie: lineaUbicadoZombie,
			posX: posXzombie,
			posY: posYzombie,
			tamX: anchoZombie,
			tamY: altoZombie,
			velocidadMovimiento: 0.3,
			velocidadMovimientoAux: 0.3,
			listoParaDisparar: false,
			tipoZombie: tipoZombie,
			congelado: congelado,
			danio: danio,
			sprites: sprites,
			posSprites: posSprites,
			zombieActivado: true,
		}

		return zombie
	}

	function inicializarPlanta(posX, posY, cartaNombre, cartaCosto)
	{
		let rutaImg="img/Plantas/"
		let rutaImgBala="img/Plantas/"
		let posPlantaX=191
		let posPlantaY
		let ubicacionPlantaMapa
		let tamX
		let tamY
		let costo
		let lineaUbicadaPlanta
		let vida
		let velocidadBala=0
		let tipoPlanta
		let plantaHielo=false
		let danio

		let posXBala
		let posYBala
		let tamXbala=25
		let tamYbala=25
		let tiempoRecarga=200

		if(posY<=196)
		{
			lineaUbicadaPlanta=1
			posPlantaY=103
		}
		else
		{
			if(posY<=298)
			{
				lineaUbicadaPlanta=2
				posPlantaY=240	
			}
			else
			{
				if(posY<=410)
				{
					lineaUbicadaPlanta=3
					posPlantaY=360
				}
				else
				{
					if(posY<=513)
					{
						lineaUbicadaPlanta=4
						posPlantaY=490
					}
					else
					{
						lineaUbicadaPlanta=5
						posPlantaY=620
					}
				}
			}
		}
		if(posX<=326)
		{
			ubicacionPlantaMapa=1
			posPlantaX=250
		}
		else
			if(posX<=397)
			{
				ubicacionPlantaMapa=2
				posPlantaX=330
			}
			else
				if(posX<=486)
				{
					ubicacionPlantaMapa=3
					posPlantaX=410
				}
				else
					if(posX<=561)
					{
						ubicacionPlantaMapa=4
						posPlantaX=490
					}
					else
						if(posX<=644)
						{
							ubicacionPlantaMapa=5
							posPlantaX=570
						}
						else
							if(posX<=719)
							{
								ubicacionPlantaMapa=6
								posPlantaX=650
							}
							else
								if(posX<=798)
								{
									ubicacionPlantaMapa=7
									posPlantaX=730
								}
								else
									if(posX<=872)
									{
										ubicacionPlantaMapa=8
										posPlantaX=810
									}
									else
									{
										ubicacionPlantaMapa=9
										posPlantaX=890
									}
									let cuadroOcupado=false

									for(let x=0; x<plantas.length; x++)
									{
										if(ubicacionPlantaMapa==plantas[x].ubicacionPlantaMapa && lineaUbicadaPlanta==plantas[x].posLineaPlanta && plantas[x].plantaActivada)
											cuadroOcupado=true
									}

									if(!cuadroOcupado)
									{
										soles-=cartaCosto
										sonidos[2].audio.play()

										switch(cartaNombre)
										{
											case 0:
											rutaImg+="girasol.png"
											rutaImgBala="img/Otras/sol.png"
											costo=50
											tamX=74
											tamY=73
											posXBala=posPlantaX+30
											posYBala=posPlantaY
											vida=180
											tipoPlanta=0
											tamXbala=50
											tamYbala=50
											tiempoRecarga=400
											break

											case 1:
											rutaImg+="lanzaguisantes.png"
											rutaImgBala+="ataqueGuisante.png"
											costo=100
											tamX=70
											tamY=70
											posXBala=posPlantaX+60
											posYBala=posPlantaY
											vida=180
											velocidadBala=1
											tipoPlanta=1
											danio=1
											break

											case 2:
											rutaImg+="nuez.png"
											costo=125
											tamX=120
											tamY=120
											posPlantaX-=20
											posPlantaY-=20
											posXBala=posPlantaX+60
											posYBala=posPlantaY
											vida=1500
											tipoPlanta=2
											break

											case 3:
											rutaImg+="lanzaguisantesHielo.png"
											rutaImgBala+="ataqueGuisanteHielo.png"
											costo=175
											tamX=70
											tamY=70
											posXBala=posPlantaX+60
											posYBala=posPlantaY
											vida=180
											velocidadBala=1
											tipoPlanta=3
											plantaHielo=true
											danio=1.2
											break

											case 4:
											rutaImg+="sandia.png"
											rutaImgBala+="ataqueSandia.png"
											costo=300
											tamX=125
											tamY=105
											posPlantaX-=28
											posPlantaY-=20
											posXBala=posPlantaX+60
											posYBala=posPlantaY+50
											vida=150
											velocidadBala=1
											tipoPlanta=4
											danio=1.4
											break
											
										}

										let planta={
											img: loadImage(rutaImg),
											posX: posPlantaX,
											posY: posPlantaY,
											ubicacionPlantaMapa: ubicacionPlantaMapa,
											tamX: tamX,
											tamY: tamY,
											posLineaPlanta: lineaUbicadaPlanta,
											costo: costo,
											vida: vida,
											tipoPlanta: tipoPlanta,
											plantaHielo: plantaHielo,
											imgBala: loadImage(rutaImgBala),
											posXBala: posXBala,
											posXBalaAux: posXBala,
											posYBala: posYBala,
											tamXbala: tamXbala,
											tamYbala: tamYbala,
											velocidadBala: velocidadBala,
											danio: danio,
											listoParaDisparar: false,
											plantaActivada: true,
											tiempoRecarga: tiempoRecarga,
											tiempoRecargaAux: tiempoRecarga,
											tiempoRecargaOriginal: tiempoRecarga,
											tiempoRecargaSol: tiempoRecarga,
											tiempoRecargaSolAux: tiempoRecarga,
											tiempoMostrarSol: 600,
											tiempoMostrarSolAux: 600,
											tiempoRecargaChile: tiempoRecarga,
											tiempoMostrarChile: 80,
											plantaUsada: false,		
											mostrarSol: false,
											mostrarChile: false,
										}

										plantas.push(planta)
									}
								}