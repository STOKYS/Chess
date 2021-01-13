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
        this.pieces = []
        this.game_started = false
    }
    tiles() {
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
    win(){
        let i = [0, "side"];
        this.pieces.forEach(function (obj) {
            if (obj.name == "king"){
                i = [i[0] + 1, obj.side] 
            } 
        })
        if (i[0] < 2){
            document.getElementById("player").innerText = `${i[1]} player won!`
            this.game_started = false
        }
    }
}

let game = new Game();

let mouse = {
    posX: 0,
    posY: 0,
    gridX: 0,
    gridY: 0,
}

let timeOne = 0;

function update() {
    if ((Date.now() - timeOne) >= 5) {
        timeOne = Date.now()
        game.update()
    }
    if (game.game_started) {
        requestAnimationFrame(update)
    }
}

canvas.addEventListener("mousemove", function (position) {
    if (game.game_started) {
        let space = canvas.getBoundingClientRect();
        mouse.posX = Math.round((position.clientX - space.left) * (canvas.width / canvas.clientWidth));
        mouse.posY = Math.round(position.clientY - space.top) * (canvas.height / canvas.clientHeight);
        mouse.gridX = Math.floor(mouse.posX / (canvas.width / Game.TILES))
        mouse.gridY = Math.floor(mouse.posY / (canvas.width / Game.TILES))
    }
});

canvas.addEventListener("click", function () {
    // This means selecting for the first time
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
    if (!game.game_started) gamestart()
})

btn_end.addEventListener("click", function () {
    game.end()
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

function scoreboard(){
    game.turns++
    document.getElementById("turn").innerText = `Turns: ${Math.floor(game.turns / 2)}`
    if (game.turns % 2 == 1){
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
    let d = new Date();
    let h = d.getHours();
    let m = d.getMinutes();
    let s = d.getSeconds();
    let para = document.createElement("p");
    let node = document.createTextNode(`-- (${((h < 10) ? "0" + h : h) + ":" + ((m < 10) ? "0" + m : m) + ":" + ((s < 10) ? "0" + s : s)}) : [${text}]`);
    para.appendChild(node);
    let element = document.getElementById("console");
    element.appendChild(para);
    document.getElementById("console").scroll(0, 999999)
}