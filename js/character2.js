const SCALE = 2; // escala del pj
const WIDTH = 16; // píxeles para las casillas del sprite eje X
const HEIGHT = 18; // píxeles para las casillas del sprite eje Y
const SCALED_WIDTH = SCALE * WIDTH;
const SCALED_HEIGHT = SCALE * HEIGHT;
const CYCLE_LOOP = [0, 1, 2]; // bucle para el sprite del personaje eje X
const FACING_DOWN = 0; // posición del sprite eje Y
const FACING_UP = 1; // posición del sprite eje Y
const FACING_LEFT = 2; // posición del sprite eje Y
const FACING_RIGHT = 3; // posición del sprite eje Y
const FRAME_LIMIT = 12;

let MOVEMENT_SPEED = 1.2; // constante de velocidad de movimiento para el pj
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
let keyPresses = {};
let currentDirection = FACING_DOWN; // posición inicial del sprite
let currentLoopIndex = 0;
let frameCount = 0;
let positionX = 360; // posición inicial del pj dentro del mapa en px
let positionY = 105; // posición inicial del pj dentro del mapa en px
let img = new Image();

document.addEventListener("keydown", event => {
  if (event.isComposing || event.keyCode !== 32) { // al apretar spacebar modificamos la variable MOVEMENT_SPEED
    return;
  }
  boost();
});
function boost() {
  MOVEMENT_SPEED = 2;
}
document.addEventListener("keydown", event => {
  if (event.isComposing || event.keyCode !== 66) { // al apretar b modificamos la variable MOVEMENT_SPEED
    return;
  }
  boostOff();
});
function boostOff() {
  MOVEMENT_SPEED = 1.2;
}

window.addEventListener('keydown', keyDownListener);
function keyDownListener(event) {
    keyPresses[event.key] = true;
}

window.addEventListener('keyup', keyUpListener);
function keyUpListener(event) {
    keyPresses[event.key] = false;
}

function loadImage() {
  img.src = "../img/enemy.png"; // cargamos la img del pj
  img.onload = function() {
    window.requestAnimationFrame(gameLoop);
  };
}

function drawFrame(frameX, frameY, canvasX, canvasY) {
  ctx.drawImage(img,
                frameX * WIDTH, frameY * HEIGHT, WIDTH, HEIGHT,
                canvasX, canvasY, SCALED_WIDTH, SCALED_HEIGHT);
}

loadImage();

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let hasMoved = false;

  if (keyPresses.w) {
    moveCharacter(0, -MOVEMENT_SPEED, FACING_UP); // movimiento arriba con w
    hasMoved = true;
  } else if (keyPresses.s) {
    moveCharacter(0, MOVEMENT_SPEED, FACING_DOWN); // movimiento abajo con s
    hasMoved = true;
  }

  if (keyPresses.a) {
    moveCharacter(-MOVEMENT_SPEED, 0, FACING_LEFT); // movimiento izquierda con a
    hasMoved = true;
  } else if (keyPresses.d) {
    moveCharacter(MOVEMENT_SPEED, 0, FACING_RIGHT); // movimiento derecha con d
    hasMoved = true;
  }

  if (hasMoved) {
    frameCount++;
    if (frameCount >= FRAME_LIMIT) {
      frameCount = 0;
      currentLoopIndex++;
      if (currentLoopIndex >= CYCLE_LOOP.length) {
        currentLoopIndex = 0;
      }
    }
  }

  if (!hasMoved) {
    currentLoopIndex = 0;
  }

  drawFrame(CYCLE_LOOP[currentLoopIndex], currentDirection, positionX, positionY);
  window.requestAnimationFrame(gameLoop);
}

function moveCharacter(deltaX, deltaY, direction) {
  if (positionX + deltaX > 0 && positionX + SCALED_WIDTH + deltaX < canvas.width) {
    positionX += deltaX;
  }
  if (positionY + deltaY > 0 && positionY + SCALED_HEIGHT + deltaY < canvas.height) {
    positionY += deltaY;
  }
  currentDirection = direction;
}
