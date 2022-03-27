let CANVAS_WIDTH = window.innerWidth;
let CANVAS_HEIGHT = window.innerHeight;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

var config = {
    type: Phaser.AUTO,
    width: 1920,
    height: CANVAS_HEIGHT,
    parent: 'container',
    backgroundColor : '#ffffff',
    physics: {
        default: 'matter',
        matter : {
            gravity : 3000,
            debug : false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var blackCow;
var blackCube = new Array();
var redCube = new Array();
var addiCube = new Array();
var royal = new Array();
var apple = new Array();


var game = new Phaser.Game(config);

function preload() {
    this.load.image("blackCow", "./img/흑우.png");
    this.load.image("redCube", "./img/레드큐브.png");
    this.load.image("blackCube", "./img/블랙큐브.png");
    this.load.image("addiCube", "./img/에디셔널큐브.png");
    this.load.image("royal", "./img/Royal.png");
    this.load.image("apple", "./img/독사과.png");
}

function create() {
    blackCow = this.matter.add.image(
        parseInt(CANVAS_WIDTH / 2),
        300,
        'blackCow', null,
        {
            shape : 'circle',
            mass : 30, 
            ignorGravity : true
        }
    );
    blackCow.setFixedRotation();
    blackCow.setBounce(1);
    blackCow.setInteractive();
    this.matter.world.setBodyRenderStyle(blackCow, lineOpacity=0);

    createItem(this, blackCube, "blackCube", 10);
    createItem(this, redCube, "redCube", 10);
    createItem(this, addiCube, "addiCube", 10);
    createItem(this, royal, "royal", 10);
    createItem(this, apple, "apple", 10);
}

function createItem(e, itemArray, name, mobCount) {
    for(let i = 0; i < mobCount; i ++) {
        let randX = getRandomInt(10, CANVAS_WIDTH - 10);
        let randY = getRandomInt(10, 30);
        let item = e.matter.add.image(randX, randY, name, null, { shape : 'circle', mass : 1});
        item.setBounce(1);
        item.setInteractive();

        itemArray.push(item);
    }
}

function update() {

    if(parseInt(CANVAS_WIDTH / 2) !== blackCow.x || 300 !== blackCow.y) {
        let vX = (blackCow.x - parseInt(CANVAS_WIDTH / 2));
        let vY = (blackCow.y - 300)
        if(vX > 10) {
            vX  = 20;
        }
        if(vY > 10) {
            vY  = 20;
        }
        if(vX < -10) {
            vX  = -20;
        }
        if(vY < -10) {
            vY  = -20;
        }
        blackCow.setVelocityX(-vX);
        blackCow.setVelocityY(-vY);
    }

    position_reset(blackCube);
    position_reset(redCube);
    position_reset(addiCube);
    position_reset(royal);
    position_reset(apple);

}

function position_reset(itemArray){
    for(let i = 0; i < itemArray.length; i++) {
        if(itemArray[i].y > CANVAS_HEIGHT + 10) {
            itemArray[i].y = 10;
            itemArray[i].x = getRandomInt(10, CANVAS_WIDTH - 10);
        }
    }
}


window.onresize = function(e) {
    CANVAS_WIDTH = window.innerWidth;
    CANVAS_HEIGHT = window.innerHeight;

    document.querySelector("canvas").width = window.innerWidth;
}