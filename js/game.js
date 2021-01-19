class Game {
    static TILES = 8;
    static COLOR_DARK = "black";
    static COLOR_LIGHT = "white";
    static EASY = 8;
    static MED = 2;
    static HARD = 1;
    constructor() {
        this.pieces = []
        this.highlights = []
        this.game_started = false
        this.selected = "";
        this.targets = []
        this.player = "light"
        this.turns = 0
        this.back = false
        this.canTurn = true
        this.killKing = true
    }
    start() {
        // Funkce vytvoří všechny
        this.end()
        this.game_started = true
        let loc_string = ["light", "dark"]
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < Game.EASY; j++) {
                this.pieces.push(new Pawn(j * (canvas.width / Game.TILES), ((i == 0) ? 6 : 1) * (canvas.height / Game.TILES), canvas.width / Game.TILES, canvas.height / Game.TILES, eval(`${loc_string[i]}_pawn`), loc_string[i]))
            }
            for (let k = 0; k < Game.MED; k++) {
                this.pieces.push(new Bishop((k * (canvas.width / Game.TILES) * 3) + (canvas.width / Game.TILES) * 2, ((i == 0) ? 7 : 0) * (canvas.height / Game.TILES), canvas.width / Game.TILES, canvas.height / Game.TILES, eval(`${loc_string[i]}_bishop`), loc_string[i]))
                this.pieces.push(new Rook(k * (canvas.width - (canvas.width / Game.TILES)), ((i == 0) ? 7 : 0) * (canvas.height / Game.TILES), canvas.width / Game.TILES, canvas.height / Game.TILES, eval(`${loc_string[i]}_rook`), loc_string[i]))
                this.pieces.push(new Knight((k * (canvas.width / Game.TILES) * 5) + (canvas.width / Game.TILES) * 1, ((i == 0) ? 7 : 0) * (canvas.height / Game.TILES), canvas.width / Game.TILES, canvas.height / Game.TILES, eval(`${loc_string[i]}_knight`), loc_string[i]))
            }
            for (let l = 0; l < Game.HARD; l++) {
                this.pieces.push(new Queen((canvas.width / Game.TILES) * 3, ((i == 0) ? 7 : 0) * (canvas.height / Game.TILES), canvas.width / Game.TILES, canvas.height / Game.TILES, eval(`${loc_string[i]}_queen`), loc_string[i]))
                this.pieces.push(new King((canvas.width / Game.TILES) * 4, ((i == 0) ? 7 : 0) * (canvas.height / Game.TILES), canvas.width / Game.TILES, canvas.height / Game.TILES, eval(`${loc_string[i]}_king`), loc_string[i]))
            }
        }
    }
    end() {
        // Resertuje vše
        this.turns = 0
        this.player = "light"
        this.pieces = []
        this.game_started = false
        document.getElementById("console").innerHTML = ''
    }
    tiles() {
        // Vykreslí šachovnici
        for (let i = 0; i < Game.TILES; i++) {
            for (let j = 0; j < Game.TILES; j++) {
                let color = ((j + i) % 2 != 0) ? Game.COLOR_DARK : Game.COLOR_LIGHT;
                ctx.fillStyle = color
                ctx.fillRect(j * canvas.width / Game.TILES, i * canvas.height / Game.TILES, canvas.width / Game.TILES, canvas.height / Game.TILES)
            }
        }
    }
    update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        this.tiles()
        this.pieces.forEach(function (obj) {
            obj.draw();
        });
        this.highlights.forEach(function (obj) {
            obj.draw();
        })
        if (this.highlights.length == 0 && this.selected) {
            this.selected.moves()
        }
        ctx.drawImage(highlight, mouse.gridX * (canvas.width / Game.TILES), mouse.gridY * (canvas.height / Game.TILES), 200, 200)
        this.win()
    }
    win() {
        let i = [0, "side"];
        this.pieces.forEach(function (obj) {
            if (obj.name == "king") {
                i = [i[0] + 1, obj.side]
            }
        })
        if (i[0] < 2) {
            let text = `${this.player.charAt(0).toUpperCase()}${this.player.slice(1)}`
            ctx.font = "156px Verdana";
            ctx.lineWidth = 5;
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black"
            ctx.textAlign = "center";
            ctx.fillText(text + ' won!', canvas.width/2, canvas.height/2);
            ctx.strokeText(text + ' won!', canvas.width/2, canvas.height/2);
            this.game_started = false
        }
    }
}

// Vytvoří objekt game podle classy Game
let game = new Game();

// Objekt ukládá pozice miši
let mouse = {
    posX: 0,
    posY: 0,
    gridX: 0,
    gridY: 0,
}

let timeOne = 0;

// Update každých 5ms
function update() {
    if ((Date.now() - timeOne) >= 5) {
        timeOne = Date.now()
        game.update()
    }
    if (game.game_started) {
        requestAnimationFrame(update)
    }
}

// Event při pohnutí miši, zapíše do objektu mouse, informace o miši
canvas.addEventListener("mousemove", function (position) {
    if (game.game_started) {
        let space = canvas.getBoundingClientRect();
        mouse.posX = Math.round((position.clientX - space.left) * (canvas.width / canvas.clientWidth));
        mouse.posY = Math.round(position.clientY - space.top) * (canvas.height / canvas.clientHeight);
        mouse.gridX = Math.floor(mouse.posX / (canvas.width / Game.TILES))
        mouse.gridY = Math.floor(mouse.posY / (canvas.width / Game.TILES))
    }
});

// Event na kliknutí uvnitř canvasu
canvas.addEventListener("click", function () {
    if (game.game_started && game.selected == "") {
        game.pieces.forEach(function (obj) {
            if (colision_select(obj)) {
                game.selected = obj
                obj.moves()
                message(`${game.selected.side} selected ${obj.side} ${obj.name}`)
            }
        });
        if (game.selected == "") {
            message(`None`)
        }
    }
    // this is selecting either a new one or moving the current one
    else if (game.game_started && game.selected != "") {
        let option = colision_option()
    }
})

btn_start.addEventListener("click", function () {
    game.end()
    if (!game.game_started) gamestart()
})

function colision_select(obj) {
    if ((obj.x < mouse.posX && (obj.width + obj.x) > mouse.posX && obj.y < mouse.posY && (obj.height + obj.y) > mouse.posY) && ((obj.side == game.player) || obj.name == "highlight")) {
        return true
    } else {
        return false
    }
}

function colision_option() {
    // change player
    let second = ""
    let high = ""
    let change = false
    // Select if you want to change to friendly unit
    game.pieces.forEach(function (obj) {
        if (colision_select(obj)) {
            // second = new unit
            second = obj
        }
    });
    // Selects highlight which has been clicked 
    game.highlights.forEach(function (obj) {
        if (colision_select(obj)) {
            // high = clicked highlight
            high = obj
        }
    })
    if (second == "" && high != "" && high.image == attack) {
        scoreboard()
        game.targets.forEach(function (obj, index) {
            game.pieces.forEach(function (obji, indexi) {
                if (obj.x == high.x && high.x == obji.x && obj.y == high.y && high.y == obji.y && high.side != game.selected.side) {
                    message(`${game.selected.side} ${game.selected.name} is attacking ${obj.side} ${obj.name}`)
                    game.selected.x = obj.x
                    game.selected.y = obj.y
                    game.pieces.splice(indexi, 1)
                    game.highlights = []
                    game.selected = ""
                    change = true
                }
            })
        });
    } else if (second != "" && high == "" && second.side == game.selected.side) {
        message(`${game.selected.side} player changes from ${game.selected.side} ${game.selected.name} to ${second.side} ${second.name}`)
        game.highlights = []
        game.selected = second
        second.moves()
    } else if (second == "" && high != "") {
        scoreboard()
        change = true
        if (game.selected.name == "pawn") game.selected.moved = true
        message(`${game.selected.side} player moves ${game.selected.side} ${game.selected.name}`)
        game.highlights = []
        game.selected.x = high.x
        game.selected.y = high.y
        game.selected = ""
    }
    if (change) {
        if (game.player == "light") {
            game.player = "dark"
        } else {
            game.player = "light"
        }
    }
}

function scoreboard() {
    game.turns++
    document.getElementById("turn").innerText = `Turns: ${Math.floor(game.turns / 2)}`
    if (game.turns % 2 == 1) {
        document.getElementById("player").innerText = `Dark turn`
    } else {
        document.getElementById("player").innerText = `Light turn`
    }
}

function gamestart() {
    game.start()
    update()
}

function message(text) {
    let textF = `${text.charAt(0).toUpperCase()}${text.slice(1)}`
    let d = new Date();
    let h = d.getHours();
    let m = d.getMinutes();
    let s = d.getSeconds();
    let para = document.createElement("p");
    let node = document.createTextNode(`-- (${((h < 10) ? "0" + h : h) + ":" + ((m < 10) ? "0" + m : m) + ":" + ((s < 10) ? "0" + s : s)}) : [${textF}]`);
    para.appendChild(node);
    let element = document.getElementById("console");
    element.appendChild(para);
    document.getElementById("console").scroll(0, 999999)
}

function switchPawn(side) {
    let select = 0
    let buttons = document.querySelectorAll(".turning > button")
    for (let i = 0; i < 4; i++) {
        buttons[i].disabled = false
    }
    game.pieces.forEach(function (obj, index) {
        if (obj.x == game.selected.x && obj.y == game.selected.y) {
            select = index
        }
    })
    console.log(select, buttons)
    buttons[0].addEventListener("click", function () {
        fortnite(select, buttons)
        game.pieces.push(new Bishop(game.selected.x, game.selected.y, 200, 200, eval(`${side}_bishop`), side))
    })
    buttons[1].addEventListener("click", function () {
        fortnite(select, buttons)
        game.pieces.push(new Knight(game.selected.x, game.selected.y, canvas.width / Game.TILES, canvas.height / Game.TILES, eval(`${side}_knight`), side))
    })
    buttons[2].addEventListener("click", function () {
        fortnite(select, buttons)
        game.pieces.push(new Rook(game.selected.x, game.selected.y, canvas.width / Game.TILES, canvas.height / Game.TILES, eval(`${side}_rook`), side))
    })
    buttons[3].addEventListener("click", function () {
        fortnite(select, buttons)
        game.pieces.push(new Queen(game.selected.x, game.selected.y, canvas.width / Game.TILES, canvas.height / Game.TILES, eval(`${side}_queen`), side))
    })
}

function fortnite(select, buttons){
    game.pieces.splice(select, 1)
    for (let i = 0; i < 4; i++) {
        buttons[i].disabled = true
    }
}