// Create the canvas
let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 800;
document.body.appendChild(canvas);

// Background image
let backgroundReady = false;
let backgroundImage = new Image();
backgroundImage.onload = function () {
    backgroundReady = true;
};
backgroundImage.src = "images/background.png";

// Border image
let borderReady = false;
let borderImage = new Image();
borderImage.onload = function () {
    borderReady = true;
};
borderImage.width = 32;
borderImage.height = 32;
borderImage.src = "images/border.png";

// Hero image
let heroReady = false;
let heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "images/hero.png";

// Monster image
let monsterReady = false;
let monsterImage = new Image();
monsterImage.onload = function () {
    monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Coin image
let coinReady = false;
let coinImage = new Image();
coinImage.onload = function () {
    coinReady = true;
};
coinImage.src = "images/coin.png";

// Bolt image
let boltReady = false;
let boltImage = new Image();
boltImage.onload = function () {
    boltReady = true;
};
boltImage.src = "images/bolt.png";

// Found sound
let foundSound = new Audio("sounds/found.mp3");
foundSound.preload = "auto";
foundSound.load();

// Crash sound
let crashSound = new Audio("sounds/crash.mp3");
crashSound.preload = "auto";
crashSound.load();

// Win sound
let winSound = new Audio("sounds/win.mp3");
winSound.preload = "auto";
winSound.load();

//  ***************************************************************************************
//  ***************************************************************************************
// Game objects
let hero = {
    speed: 256,
    x: 0,
    y: 0
};

let monster = {
    speed: 256,
    x: 0,
    y: 0
};

let coin = {
    x: 0,
    y: 0
};

let bolt = {
    speed: 256,
    x: 0,
    y: 0
};

//  ***************************************************************************************
//  ***************************************************************************************
// Variables to keep track of sprite geometry
let rows = 4;
let cols = 4;

let trackRight = 2;
let trackLeft = 1;
let trackUp = 3;
let trackDown = 0;

let spriteWidth = 256;
let spriteHeight = 256;

let width = spriteWidth / cols;
let height = spriteHeight / rows;

let curXFrame = 0;
let frameCount = 4;

let srcX = 0;
let srcY = 0;

let left = false;
let right = true;
let up = false;
let down = false;

//  ***************************************************************************************
//  ***************************************************************************************
let coinsFound = 0;
let gameOver = false;
let rateCounter = 0;

//  ***************************************************************************************
//  ***************************************************************************************
// Handle keyboard controls
let keysDown = {};

addEventListener("keydown", function (e) {
   keysDown[e.code] = true; 
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.code]; 
 }, false);

//  ***************************************************************************************
//  ***************************************************************************************
// Update game objects
let update = function (modifier) {
    ctx.clearRect(hero.x, hero.y, width, height); // clear last image position

    if ("ArrowUp" in keysDown && hero.y > 24) {
        left = false;
        right = false;
        up = true;
        down = false;
        hero.y -= hero.speed * modifier;
    }
    if ("ArrowDown" in keysDown && hero.y < (800 - 96)) {
        left = false;
        right = false;
        up = false;
        down = true;
        hero.y += hero.speed * modifier;
    }
    if ("ArrowLeft" in keysDown && hero.x > 20) {
        left = true;
        right = false;
        up = false;
        down = false;
        hero.x -= hero.speed * modifier;
    }
    if ("ArrowRight" in keysDown && hero.x < (800 - 80)) {
        left = false;
        right = true;
        up = false;
        down = false;
        hero.x += hero.speed * modifier;
    }
    // Did the hero find coins?
    if (hero.x <= (coin.x + 32) && coin.x <= (hero.x + 32) && hero.y <= (coin.y + 32) && coin.y <= (hero.y + 32)) {
        ++coinsFound;
        foundSound.play();

        if (coinsFound > 3) {
            winSound.play();
            alert("You won!");
            gameOver = true;
        }
        reset();
    }
    if (monsterAttack(hero)) {
        crashSound.play();
        alert("You've been attacked, game over!");
        gameOver = true;
        reset();
    }
    if (heroOverlap(bolt)) {
        crashSound.play();
        alert("You've been shocked, game over!");
        gameOver = true;
        reset();
    }
    
    if (bolt.y > (canvas.height - borderImage.height)) {
        bolt.x = 32 + (Math.random() * (canvas.width - 96));
        bolt.y = 32;
    }
    if (coinsFound == 0) {
        bolt.y += 2;
    }
    if (coinsFound == 1) {
        bolt.y += 4;
    }
    if (coinsFound == 2) {
        bolt.y += 6;
    }
    if (coinsFound == 3) {
        bolt.y += 8;
    }

    srcX = curXFrame * width;
    if (left) {
        srcY = trackLeft * height;
    }
    if (right) {
        srcY = trackRight * height;
    }
    if (up) {
        srcY = trackUp * height;
    }
    if (down) {
        srcY = trackDown * height;
    }
};

//  ***************************************************************************************
//  ***************************************************************************************
// Draw everything in the render function
let render = function () {
    if (backgroundReady) {
        ctx.drawImage(backgroundImage, 0, 0);
    }
    if (borderReady) {
        for (let i = 0; i < canvas.width; i = i += borderImage.width) {
            ctx.drawImage(borderImage, i, 0);
            ctx.drawImage(borderImage, i, canvas.width - borderImage.width);         
        }
        for (let i = 0; i < canvas.height - (borderImage.height * 2); i = i += borderImage.height) {
            ctx.drawImage(borderImage, 0, borderImage.height + i);
            ctx.drawImage(borderImage, canvas.height - borderImage.height, borderImage.height + i);
        }
    }
    if (!gameOver) {
        if (boltReady) {
            ctx.drawImage(boltImage, bolt.x, bolt.y);
        }
        if (coinReady) {
            ctx.drawImage(coinImage, coin.x, coin.y);
        }
        if (monsterReady) {
            ctx.drawImage(monsterImage, monster.x, monster.y);
        }
        if (heroReady) {
            ctx.drawImage(heroImage, srcX, srcY, width, height, hero.x, hero.y, width, height);
        }
        // Display coins remaining
        ctx.fillStyle = "rgb(250, 250, 250)";
        ctx.font = "24px Arial";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillText("Coins Remaining: " + (4 - coinsFound), 50, 50);
    }

};

//  ***************************************************************************************
//  ***************************************************************************************
// Reset the game
let reset = function () {
    hero.x = (canvas.width / 2);
    hero.y = (canvas.height / 2);
    
    let notGood = true;
    while (notGood) {
        monster.x = 32 + (Math.random() * (canvas.width - 96));
        monster.y = 32 + (Math.random() * (canvas.height - 96));
        coin.x = 32 + (Math.random() * (canvas.width - 96));
        coin.y = 32 + (Math.random() * (canvas.height - 96));
        bolt.x = 32 + (Math.random() * (canvas.width - 96));
        bolt.y = 32;

        if (!monsterAttack(hero) && !heroOverlap(coin)) {
            notGood = false;
        }
    }    
};


//  ***************************************************************************************
//  ***************************************************************************************
function monsterAttack(who) {
    if (
        (who.x <= (monster.x + 32) && monster.x <= (who.x + 32) && who.y <= (monster.y + 32) && monster.y <= (who.y + 32))
    )
    return true;
}

function heroOverlap(who) {
    if (
        (who.x <= (hero.x + 32) && hero.x <= (who.x + 32) && who.y <= (hero.y + 32) && hero.y <= (who.y + 32))
    )
    return true;
}

//  ***************************************************************************************
//  ***************************************************************************************
// Main game loop
let main = function () {
    let now = Date.now();
    let delta = (now - then);
    update(delta / 1000);
    render();
    then = now;
    // Request to run the main game loop again
    requestAnimationFrame(main);
};

//  ***************************************************************************************
//  ***************************************************************************************
// Start the playing the game
let then = Date.now();
reset();
main();
