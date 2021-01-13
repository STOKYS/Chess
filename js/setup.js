const canvas = document.getElementById("game")
const ctx = canvas.getContext('2d');
ctx.globalCompositeOperation = "source-over";

const light_pawn = new Image()
light_pawn.src = "img/light/pawn.png"
const light_bishop = new Image()
light_bishop.src = "img/light/bishop.png"
const light_king = new Image()
light_king.src = "img/light/king.png"
const light_queen = new Image()
light_queen.src = "img/light/queen.png"
const light_knight = new Image()
light_knight.src = "img/light/knight.png"
const light_rook = new Image()
light_rook.src = "img/light/rook.png"

const dark_pawn = new Image()
dark_pawn.src = "img/dark/pawn.png"
const dark_bishop = new Image()
dark_bishop.src = "img/dark/bishop.png"
const dark_king = new Image()
dark_king.src = "img/dark/king.png"
const dark_queen = new Image()
dark_queen.src = "img/dark/queen.png"
const dark_knight = new Image()
dark_knight.src = "img/dark/knight.png"
const dark_rook = new Image()
dark_rook.src = "img/dark/rook.png"

const highlight = new Image()
highlight.src = "img/highlight.png"

const move = new Image()
move.src = "img/move.png"
const attack = new Image()
attack.src = "img/attack.png"

const btn_start = document.getElementById("start")
const btn_end = document.getElementById("end")

document.getElementById("back").addEventListener("click", function(){
    game.back = !game.back
    this.innerText = `Can move back: ${game.back}`
})

document.getElementById("turnpawn").addEventListener("click", function(){
    game.canTurn = !game.canTurn
    this.innerText = `Turn pawn on the other end: ${game.canTurn}`
})

document.getElementById("ending").addEventListener("click", function(){
    game.killKing = !game.killKing
    this.innerText = `Turn pawn on the other end: ${game.killKing}`
})