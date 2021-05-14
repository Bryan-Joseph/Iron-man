//variables
var game = true;
var score = 0;
var enemies = 0;

//Define values of walk cycle


var walk = 0;

var UP = 3;
var DOWN = 0;
var RIGHT = 2;

var currentDirection = RIGHT;
var hM = false;

//Draw enemy

function drawE(img, x, y, width, height) {
    ctx.drawImage(img, x, y, width, height);
}

// Create Canvas

var canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

document.body.appendChild(canvas);

// Define hero

let heroImg = new Image();
heroImg.src = "./assets/hero.png";

let hero = {
    x: 0,
    y: 40,
    speed: 14,
    width: 32,
    height: 48
}

scale = 2;
scaled_height = scale * hero.height;
scaled_width = scale * hero.width;

var bombImage = new Image();
bombImage.src = "./assets/bomb.png";
var bahamutImg = new Image();
bahamutImg.src = "./assets/bahamut.png";
var bombSound = new Audio();
bombSound.src = "./Sounds/Explosion.mp3";
// Define attack

let attackImg = new Image();
attackImg.src = "./assets/fire.png";

var attack = {
    width: 45,
    height: 23,
    x: canvas.width,
    y: 0,
    speed: 30
}

// Define enemy class
class Enemy {
    constructor() {
        this.height = 96;
        this.width = 96;
        this.y = Math.random() * ((canvas.height - 40) - this.height - 20) + 40;
        this.x = canvas.width - this.width;
        this.speed = 10;
        this.img = bahamutImg;
        this.enemy = true;
        this.coll = true;
        this.walkCycle = 0;
    }
    draw() {
        if (this.img == bahamutImg) {
            draw(this.img, this.walkCycle * this.width, 1 * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
        }else{
            drawE(this.img,this.x ,this.y ,this.width , this.height);
        }
    }
    update() {

        if (this.x - this.speed > 60) {
            if (this.enemy == true) {
                this.x -= this.speed;
            }

            //console.log("running if");
        } else {
            game = false;
        }
        if (this.img == bahamutImg) {
            this.walkCycle++;

            if (this.walkCycle >= 3) {
                this.walkCycle = 0;
            }
        }


        //console.log("running function");
    }
}

//enemy

var time = 5000;

var enemy = [];
function addEnemy() {

    for (let i = 0; i <= enemies; i++) {
        enemy.push(new Enemy());
    }
    if (time >= 5000) {
        time -= 1000;
    } /*else if (time >= 2000) {
        time -= (Math.random() * 50) + 30;
    }*/


    setTimeout(addEnemy, time);
}
addEnemy();

//console.log( " fghgfd" + enemy[0].x);

//collisions


function collision(fireX, fireY, fireW, fireH, enemyX, enemyY, enemyW, enemyH, go) {
    if (enemy[go].coll == true) {
        if (fireX <= enemyX + enemyW && enemyX <= fireX + fireW) {
            if (fireY <= enemyY + enemyH && enemyY <= fireY + fireH) {
                enemy[go].coll = false;

                bombSound.pause();
                bombSound.currentTime = 0;

                bombSound.play();
                //bombSound.src = "./Sounds/Explosion.mp3";

                attack.x = canvas.width + 120 / 3 + 4;

                score++;

                enemy[go].enemy = false;

                enemy[go].img = bombImage;
                enemy[go].width += 30;

                console.log("gogogogogog");

                setTimeout(function () {
                    enemy[go].height = 0;
                    enemy[go].width = 0;
                }, 2000);
            }
        }
    }
}




// Define Background

function loadBackground() {
    ctx.beginPath();
    ctx.fillStyle = "yellow";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
// function to draw sprites from spriteSheets

function draw(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}

// movement events

var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
    console.log(keysDown);
    console.log(e.keyCode);
});
addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
    currentDirection = RIGHT;
    hM = false;
});

// function to move

function movement() {
    if (38 in keysDown && hero.y - hero.speed > 30) {
        moveChar(0, -1, UP);
        hM = true;
    }
    if (40 in keysDown && hero.y + scaled_height + hero.speed < canvas.height) {
        moveChar(0, 1, DOWN);
        hM = true;
    }

    if (!hM) {
        walk = 0;
    }

    if (hM) {
        walk++;
        if (walk > 3) {
            walk = 0;
        }
    }


    draw(heroImg, walk * hero.width, currentDirection * hero.height, hero.width, hero.height, hero.x, hero.y, scaled_width, scaled_height);
    //console.log("sdfgfdsasdfcxsdfd")
}

// events for attack
var keysPress = {};
addEventListener("keypress", function (e) {
    if (attack.x >= canvas.width) {
        keysPress[e.keyCode] = true;
        attack.x = hero.x + scaled_width + 3;
        attack.y = hero.y + hero.height - 9;
    }
});
var checkReady = true;
function attackH() {

    console.log("running");
    if (checkReady) {
        if (keysPress[13]) {
            drawE(attackImg, attack.x, attack.y, attack.width, attack.height);
        }
    }
}

function attackMove() {
    attack.x += attack.speed;
}

function moveChar(deltaX, deltaY, direction) {
    hero.x += deltaX * hero.speed;
    hero.y += deltaY * hero.speed;

    currentDirection = direction;
}

// Game Loop

var fps, fpsI, then, startTime, now, elapsed, timeCheck;

function startAnimating(fps) {
    fpsI = 1000 / fps;
    then = Date.now();
    startTime = then;
    animate();
}

function animate() {
    if (game) {
        requestAnimationFrame(animate);
    }
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsI) {
        then = now - (elapsed % fpsI);
        timeCheck = now - startTime;
        timeCheck /= 1000;
        console.log(timeCheck.toFixed(1));



        // code that should be looped
        loadBackground();
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.font = "20px Arial";
        ctx.fillText("Time : " + timeCheck.toFixed(1), 20, 30);

        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.fillText("Score : " + score, 300, 30);




        movement();

        for (let i = 0; i < enemy.length; i++) {
            enemy[i].draw();
            enemy[i].update();
        }

        attackH();
        attackMove();


        //drawE(attackImg , attack.x , attack.y , attack.width , attack.height);

        //test draw()
        //draw(heroImg , hero.x , hero.y,hero.width,hero.height,hero.x , hero.y,hero.width * 2, hero.height * 2);
        //its working

        for (let i = 0; i < enemy.length; i++) {
            collision(attack.x, attack.y, attack.width, attack.height, enemy[i].x, enemy[i].y, enemy[i].width, enemy[i].height, i);
        }

        if (timeCheck <= 10.0) {
            enemies = 0;
        } else if (timeCheck >= 20.0) {
            enemies = 2;
            console.log("Enemies : 1");
        } else if (timeCheck >= 10.0) {
            enemies = 1;
            console.log("Enemies : 2");
        }
    }
}

startAnimating(10);