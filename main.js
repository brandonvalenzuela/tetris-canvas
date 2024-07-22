import './style.css'
import { BLOCK_SIZE, BOARD_HEIGHT, BOARD_WIDTH, EVENT_MOVEMENTS } from './const'

// 1.- Inicializar el canvas
const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
const $score = document.querySelector('span')

let score = 0

canvas.width = BLOCK_SIZE * BOARD_WIDTH
canvas.height = BLOCK_SIZE * BOARD_HEIGHT

context.scale(BLOCK_SIZE, BLOCK_SIZE)

// 3.- Board
const board = createBoard(BOARD_WIDTH, BOARD_HEIGHT)

function createBoard (width, height)  {
  return Array(height).fill().map(() => Array(width).fill(0))
}

// 4.- Pieza player
const piece = {
  position: { x: 5, y: 5 },
  shape: [
    [1, 1] ,
    [1, 1]
  ]
}

// 10.- Random pieces
const PIECES = [
  [
    [1, 1],
    [1, 1]
  ],
  [
    [1, 1, 1, 1]
  ],
  [
    [1, 1, 0],
    [0, 1, 1]
  ],
  [
    [0, 1, 0],
    [1, 1, 1]
  ],
  [
    [0, 1, 1],
    [1, 1, 0]
  ],
  [
    [0, 1],
    [0, 1],
    [1, 1]
  ],
  [
    [1, 0],
    [1, 0],
    [1, 1]
  ]
]



// 2.- Game loop
// function update() {
//  draw()
//  window.requestAnimationFrame(update)
// }

// 9.- Caida automatica
let dropCounter = 0
let lastTime = 0

function update(time = 0) {
  const deltaTime = time - lastTime
  lastTime = time

  dropCounter += deltaTime

  if (dropCounter > 1000){
    piece.position.y++
    dropCounter = 0

    if (checkCollisions()) {
      piece.position.y--
      solidifyPiece()
      removeRow()
    }
  }

  draw()
  window.requestAnimationFrame(update)
}

function draw(){
  context.fillStyle = '#000'
  context.fillRect(0, 0, canvas.width, canvas.height)

  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        context.fillStyle = 'yellow'
        context.fillRect(x, y, 1, 1)
      }
    })
  })

  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value){
        context.fillStyle = 'red'
        context.fillRect(x + piece.position.x , y + piece.position.y, 1, 1 )
      }
    })
  })

  $score.innerText = score 
}

// 5.- Mover pieza player
document.addEventListener('keydown', event => {
  if (event.key === EVENT_MOVEMENTS.LEFT) {
    piece.position.x--
    if (checkCollisions()){
      piece.position.x++

    }
  }

  if (event.key === EVENT_MOVEMENTS.RIGHT) {
    piece.position.x++
    if (checkCollisions()) {
      piece.position.x--
    }
  }
  if (event.key === EVENT_MOVEMENTS.DOWN){
    piece.position.y++
    if (checkCollisions()) {
      piece.position.y--
      solidifyPiece()
      removeRow()
    }
  }

  if(event.key === 'ArrowUp'){
    const rotated = []

    for (let i = 0; i < piece.shape[0].length; i++){
      const row = []

      for (let j = piece.shape.length - 1; j >= 0; j--){
        row.push(piece.shape[j][i])
      }

      rotated.push(row)
    }

    const previusShape = piece.shape
    piece.shape = rotated
    if(checkCollisions()){
      piece.shape = previusShape
    }

  }
})

// 6.- Detectar las colisiones
function checkCollisions(){
  return piece.shape.find((row, y) => {
    return row.find((value, x) => {
      return(
        value !== 0 && 
        board[y + piece.position.y]?.[x + piece.position.x] !== 0
      )
    })
  })
}

// 7.- Solidificar las piezas al llegar al fondo
function solidifyPiece(){
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1){
        board[y + piece.position.y][x + piece.position.x] = 1
      }
    })
  })

  // reset de la posicion de la pieza
  piece.position.x = Math.floor(BOARD_WIDTH / 2 - 1 )
  piece.position.y = 0

  // get random shape
  piece.shape = PIECES[Math.floor(Math.random() * PIECES.length)]
  // game over
  if (checkCollisions()){
    window.alert('Game Over!! You Died...')
    board.forEach((row) => row.fill(0))
  }
}

// 8.- Quitar las filas al completarse
function removeRow(){
  const rowsToRemove = []

  board.forEach((row, y) => {
    if (row.every(value => value === 1)) {
      rowsToRemove.push(y)
    }
  })

  rowsToRemove.forEach(y => {
    board.splice(y, 1)
    const newRow = Array(BOARD_WIDTH).fill(0)
    board.unshift(newRow)
    score += 10
  });
}

const $section = document.querySelector('section')

$section.addEventListener('click', () => {
  update()

  $section.remove()
  const audio = new Audio('./tetris.mp3')
  audio.volume = 0.5
  audio.play()
})


