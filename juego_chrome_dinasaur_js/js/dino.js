//Variables board 
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

//Variables dino
let dinoWidth = 88;
let dinoHeight = 88;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg; // Referenciará a la imagen del dino


//Creamos el objeto dino
let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight
};

//Creamos variables para el cactus
let cactusArray = [];

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

//Definimos varibles de Fisica del juego
let velocityX = -8; //Velocidad para mover los cactus a la izquierda
let velocityY = 0;
let gravity = 0.4; //Gravedad para que el dino caiga

let gameOver = false;
let score = 0;


window.onload = function () {
  //Identificamos el elemento canvas board por su id
  board = document.getElementById('board');

  //Cambiamos el alto y ancho del canvas
  board.width = boardWidth;
  board.height = boardHeight;

  //Obtenemos el contexto del canvas
  context = board.getContext('2d'); //usado para dibujar en el canvas

  //Cargamos la imagen del dino
  dinoImg = new Image();
  dinoImg.src = 'images/dino.png';
 
  //Al cargar la imagen la dibujamos en el canvas
  dinoImg.onload = function () {
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
  };

  //Cargamos las imagenes de los cactus
  cactus1Img = new Image();
  cactus1Img.src = 'images/cactus1.png';

  cactus2Img = new Image();
  cactus2Img.src = 'images/cactus2.png';

  cactus3Img = new Image();
  cactus3Img.src = 'images/cactus3.png';

  //Llamamos a la función update para redibujar el canvas
  requestAnimationFrame(update);

  //Generamos los cactus cada segundo con un setInterval
  setInterval(placeCactus, 1000); //1000 milisegundos = 1 segundo

  //Agregamos un evento para que el dino salte
  document.addEventListener('keydown', moveDino);

};  

function update() {
  requestAnimationFrame(update);
  
  //Verificamos si no perdi el juego
  if (gameOver) {
    return;
  }

  context.clearRect(0, 0, boardWidth, boardHeight); //Limpiamos el canvas
   

  //Agregamos gravedad al dinosaurio
  velocityY += gravity;
  //Agregamos gravedad al dino en el eje Y, verficamos que no se pase del suelo
  dino.y = Math.min(dino.y + velocityY, dinoY);  

  //Dibujamos al dino
  context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

  //Dibujamos los cactus en el canvas
  for (let i = 0; i < cactusArray.length; i++) {
    let cactus = cactusArray[i];
    //Hacemos que el cactus se mueva a la izquierda de acuerdo a la velocidad que le asignamos
    cactus.x += velocityX;

    //Dibuja el cactus en el canvas
    context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

    //Verificamos si el dino choca con algun cactus
    if (detectCollision(dino, cactus)) {
      gameOver = true;
      alert('Perdiste!!');

      dinoImg.src = 'images/dino-dead.png';
      
      dinoImg.onload = function () {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
      }
    }
  }

  //Agregamos el puntaje al canvas
  context.fillStyle="black";
  context.font="20px courier";
  score++;
  context.fillText(score, 5, 20);
}

function moveDino(e) {
  //Verificamos si no perdi el juego
  if (gameOver) {
    return;
  }

  //Si el usuario apreta la tecla de espacio o flecha arriba el dino esta en el suelo y no esta saltando 
  if ((e.code == 'Space' || e.code == 'ArrowUp') && dino.y == dinoY) {
    //El dinosaurio Salta
    velocityY = -10;
  }
}


function placeCactus() {
  //Verificamos si no perdi el juego
  if (gameOver) {
    return;
  }
  let cactus = {
    img: null,
    x: cactusX,
    y: cactusY,
    width: null,
    height: cactusHeight
  };

  let placeCactusChance = Math.random(); //Generamos un numero aleatorio entre 0 y 0.99999


  if (placeCactusChance > .90) { //10% de que salga cactus3
    cactus.img = cactus3Img;
    cactus.width = cactus3Width;
    cactusArray.push(cactus);
  } else if (placeCactusChance > .70) { //30% de que salga cactus2
    cactus.img = cactus2Img;
    cactus.width = cactus2Width;
    cactusArray.push(cactus);
  } else if (placeCactusChance > .50) { //50% de que salga cactus1
    cactus.img = cactus1Img;
    cactus.width = cactus1Width;
    cactusArray.push(cactus);
  }

  //Definimos maximo de obtaculos 
  if (cactusArray.length > 5) {
    cactusArray.shift(); // Elimina el primer elemento del array de cactus para no llenar la memoria
  }
}

function detectCollision(a, b) {
  return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
         a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
         a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
         a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}