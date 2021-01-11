class Pawn {
    constructor(x, y, width, height, image, side) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.image = image
        this.side = side
        this.name = "pawn"
    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
    moves() {
        for (let i = 1; i < 3; i++) {
            game.highlights.push(new Tile(this.x, this.y - (i * this.height), this.width, this.height, move))
            game.highlights.push(new Tile(this.x, this.y + (i * this.height), this.width, this.height, move))
        }
    }
    attack() {
        /*game.highlights.push(new Tile(this.x - this.width, this.y - this.height, this.width, this.height, move))
        game.highlights.push(new Tile(this.x + this.width, this.y - this.height, this.width, this.height, move))
        game.highlights.push(new Tile(this.x + this.width, this.y + this.height, this.width, this.height, move))
        game.highlights.push(new Tile(this.x - this.width, this.y + this.height, this.width, this.height, move))*/
    }
}

class Bishop {
    constructor(x, y, width, height, image, side) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.image = image
        this.side = side
        this.name = "bishop"
    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
    moves() {
        game.highlights.push(new Tile(this.x - this.width, this.y - this.height, this.width, this.height, move))
        game.highlights.push(new Tile(this.x - this.width, this.y + this.height, this.width, this.height, move))
        game.highlights.push(new Tile(this.x + this.width, this.y - this.height, this.width, this.height, move))
        game.highlights.push(new Tile(this.x + this.width, this.y + this.height, this.width, this.height, move))
    }
}

class Rook {
    constructor(x, y, width, height, image, side) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.image = image
        this.side = side
        this.name = "rook"
    }
    update() {

    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
    moves() {
        for (let i = 1; i <= Game.TILES; i++) {
            game.highlights.push(new Tile(this.x, this.y - (i * this.height), this.width, this.height, move))
            game.highlights.push(new Tile(this.x, this.y + (i * this.height), this.width, this.height, move))
            game.highlights.push(new Tile(this.x - (i * this.height), this.y, this.width, this.height, move))
            game.highlights.push(new Tile(this.x + (i * this.height), this.y, this.width, this.height, move))
        }
    }
}

class Knight {
    constructor(x, y, width, height, image, side) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.image = image
        this.side = side
        this.name = "knight"
    }
    update() {

    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
    moves() {
        game.highlights.push(new Tile(this.x - this.width, this.y - (2 * this.height), this.width, this.height, move))
        game.highlights.push(new Tile(this.x + this.width, this.y - (2 * this.height), this.width, this.height, move))
        game.highlights.push(new Tile(this.x - this.width, this.y + (2 * this.height), this.width, this.height, move))
        game.highlights.push(new Tile(this.x + this.width, this.y + (2 * this.height), this.width, this.height, move))
        game.highlights.push(new Tile(this.x - (2 * this.height), this.y - this.height, this.width, this.height, move))
        game.highlights.push(new Tile(this.x - (2 * this.height), this.y + this.height, this.width, this.height, move))
        game.highlights.push(new Tile(this.x + (2 * this.height), this.y - this.height, this.width, this.height, move))
        game.highlights.push(new Tile(this.x + (2 * this.height), this.y + this.height, this.width, this.height, move))
    }
}

class Queen {
    constructor(x, y, width, height, image, side) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.image = image
        this.side = side
        this.name = "queen"
    }
    update() {

    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
    moves() {

    }
}

class King {
    constructor(x, y, width, height, image, side) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.image = image
        this.side = side
        this.name = "king"
    }
    update() {

    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
    moves() {
        game.highlights.push(new Tile(this.x - this.width, this.y - this.height, this.width, this.height, move))
        game.highlights.push(new Tile(this.x + this.width, this.y - this.height, this.width, this.height, move))
        game.highlights.push(new Tile(this.x - this.width, this.y + this.height, this.width, this.height, move))
        game.highlights.push(new Tile(this.x + this.width, this.y + this.height, this.width, this.height, move))
        game.highlights.push(new Tile(this.x - this.height, this.y, this.width, this.height, move))
        game.highlights.push(new Tile(this.x + this.height, this.y, this.width, this.height, move))
        game.highlights.push(new Tile(this.x, this.y - this.height, this.width, this.height, move))
        game.highlights.push(new Tile(this.x, this.y + this.height, this.width, this.height, move))
    }
}

class Tile {
    constructor(x, y, width, height, image) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.image = image
        this.name = "highlight"
    }
    update() {

    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
    moves() {

    }
}