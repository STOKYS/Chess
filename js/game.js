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
        this.player = "light"
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
        if (this.highlights.length == 0 && this.selected){
            this.selected.moves()
        }
        ctx.drawImage(highlight, mouse.gridX * (canvas.width / Game.TILES), mouse.gridY * (canvas.height / Game.TILES), 200, 200)
    }
    next(){

    }
}

let game = new Game();

let mouse = {
    posX: 0,
    posY: 0,
    gridX: 0,
    gridY: 0,
}

/*function update() {
    if ((Date.now() - timeOne) >= 10) {
        timeOne = Date.now()
        game.cycle()
        playerup.update()
        for (let i = 0; i <= 1; i++){
            obstacles[i].update()
        }
    }
    if (gameover != true){
        requestAnimationFrame(update)
    }
}*/

let timeOne = 0;

function update() {
    if ((Date.now() - timeOne) >= 5) {
        timeOne = Date.now()
        game.update()
    }
    if (game.game_started){
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
                message(`You've selected ${obj.side} ${obj.name}`)
            }
        });
        if (game.selected == "") {
            message(`None were selected`)
        } else {
            console.log(game.selected)
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
    game.pieces.forEach(function (obj) {
        if (colision_select(obj)) {
            second = obj
        }
    });
    game.highlights.forEach(function (obj) {
        if (colision_select(obj)) {

            high = obj
        }
    })
    if (second != "" && high == "" && second.side == game.selected.side){
        message(`You want to change played`)
        game.highlights = []
        game.selected = second
        second.moves()
    }
    else if (second == "" && high != ""){
        change = true
        message(`You want to change pos`)
        game.highlights = []
        game.selected.x = high.x
        game.selected.y = high.y
        game.selected = ""
    }
    if (change) {
        /* nefunguje

        ((game.player == "light") ? "dark" : "light")
        
        */
        if (game.player == "light"){
            game.player = "dark"
        } else {
            game.player = "light"
        }
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