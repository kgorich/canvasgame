// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);
var gameOver = false; 

//Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {    
    bgReady = true;
};
bgImage.src = "images/background.png";

//Hero img
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "images/ash.png";

//Monster img
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {    
    monsterReady = true;
};
monsterImage.src = "images/pikachu.png";

//Rocket img
var rocketReady = false;
var rocketImage = new Image(); {
    rocketReady = true;
};
rocketImage.src = "images/rocket1.png";

// Game objects
var hero = {   
    speed: 256,  // movement in pixels per second
    x: 0,  // where on the canvas are they?    
    y: 0   // where on the canvas are they?
};
var monster = {
        // for this version, the monster does not move, so just and x and y    
    x: 0,    y: 0
};
var rocket1 = {
x:200,
y: 200
};
var rocket2 = {
x:100,
y:40
};
var rocket3 = {
x:40,
y:300
};

var rows = 4;
var cols = 4;

var trackRight = 2;
var trackLeft = 1;
var trackUp = 3;
var trackDown = 0;

var spriteWidth = 272;
var spriteHeight = 288;
var width = spriteWidth / cols;
var height = spriteHeight / rows;
var curXFrame = 0;
var frameCount = 4; //4 frames per row 

varsrcX = 0;
varsrcY = 0;

var left = false;
var right = true;
var up = false;
var down = false;

var counter = 0;

var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {};
//object were we properties when keys go down 
// and then delete them when the key goes up
// so the object tells us if any key is down when that keycode
// is down.  In our game loop, we will move the hero image if when
// we go thru render, a key is down

addEventListener("keydown", function (e) {
    //console.log(e.keyCode + " down")
    keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {    
    //console.log(e.keyCode + " up")    
    delete keysDown[e.keyCode];
}, false);

// Update game objects
var update = function (modifier) {  
    left = false;
    right = false;
    up = false;
    down = false; 

    if (38 in keysDown && hero.y > 0){ //up
        left = false; 
        right = false; 
        up = true;
        down = false; 
        hero.y -= hero.speed * modifier;
    }


    if (40 in keysDown && hero.y < 960 - 64){ //down
        left = false;
        right = false;
        up =  false;
        down = true;
        hero.y += hero.speed * modifier;
    }


    if (37 in keysDown && hero.y > 0){ //left
        left = true;
        right = false;
        up =  false;
        down = false; 
        hero.x -= hero.speed * modifier;
    }


    if (39 in keysDown && hero.y > 1024-64){ //right
        left = false;
        right = true;
        up =  false;
        down = false; 
        hero.x += hero.speed * modifier;
    }

        
    // Are they touching?    
    if (
        hero.x <= (monster.x + 64)
        && monster.x <= (hero.x + 64)
        && hero.y <= (monster.y + 64)
        && monster.y <= (hero.y + 64)
    ) {       
        ++monstersCaught;       // keep track of our “score” 
        if (monsterCaught > 4)
        {
            alert("You Won!");
            gameOver = true;
        }
        reset();       // start a new cycle    
    }  
    
    if (touchingRocket(hero)) {
        alert("Oh no! Team Rocket has captured you. Its game over!")
        gameOver = true;
    }


if (counter == 5) {
    curXFrame = ++curXFrame % frameCount;
    counter = 0;
} else {
    counter++;
}

srcX = curXFrame * width;

if (left) {

    srcY = trackLeft * height;     
}

if  (right) {

    srcY = trackRight * height;
}

if (up) {

    srcY = trackUp * height; 
}

if (down) {

    srcY = trackDown * height;    
}

if (left == false && right == false && up == false && down == false) {
srcX = 0 * width;
srcY = 0 * height;    
}

};

//=============================================

// Draw everything in the main render function
var render = function () {
    if (bgReady) {     
      ctx.drawImage(bgImage, 0, 0);   
    }    
    if (heroReady) {
        ctx.drawImage(heroImage, srcX, srcY, spriteWidth, spriteHeight, hero.x, hero.y, spriteWidth, spriteHeight);
    }    
    if (monsterReady) {        
        ctx.drawImage(monsterImage, monster.x, monster.y);    
    } 
    if (rocketReady) {
        ctx.drawImage(rocketImage, rocket1.x, rocket1.y);
        ctx.drawImage(rocketImage, rocket2.x, rocket2.y);
        ctx.drawImage(rocketImage, rocket3.x, rocket3.y);
    }

    // Score    
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Pokemon saved: " + monstersCaught, 32, 32); 
}
//Reset the game when the player catches a monster
var reset = function () {     
    hero.x = canvas.width / 2;    
    hero.y = canvas.height / 2;
    //Place the monster somewhere on the screen randomly
    // but not in the hedges, Article in wrong, the 64 needs to be 
    // hedge 32 + hedge 32 + char 32 = 96  

    //monster.x = 32 + (Math.random() * (canvas.width - 96));    
    //monster.y = 32 + (Math.random() * (canvas.height - 96));

    let noGood = true;
    while (noGood) {
        monster.x = 32 + (Math.random() * (canvas.width - 96));    
        monster.y = 32 + (Math.random() * (canvas.height - 96));

        if (!touchingRocket(monster)) {
            noGood = false;
        }
    }
};

//The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;

    update(delta / 1000);
    render();    

    then = now;

    // Request to do this again ASAP using the Canvas method,
    // it’s much like the JS timer function “setInterval, it will
    // call the main method over and over again so our players 
    // can move and be re-drawn    
    requestAnimationFrame(main); 
};

//cross browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();  // call the main game loop.

function touchingRocket(who) {
if (
    (who.x <= (rocket1.x+64)
       && rocket1.x <= (who.x + 32)
       && who.y <= (rocket1 + 64)
       && rocket2.y (who.y + 32)) ||
    (who.x <= (rocket1.x+64)
       && rocket2.x <= (who.x + 32)
       && who.y <= (rocket2 + 64)
       && rocket2.y (who.y + 32)) ||
    (who.x <= (rocket3.x+64)
       && rocket3.x <= (who.x + 32)
       && who.y <= (rocket3 + 64)
       && rocket3.y (who.y + 32))

    )
        return true;
}