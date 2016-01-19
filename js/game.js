var game = new Phaser.Game(960, 540, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var velocity = 3500;
var enemies = [];
var current = 0;

function preload() {
	game.load.image('tile', 'assets/tile.png');
	game.load.image('enemy', 'assets/enemy.png');
}

function create() {
	game.add.tileSprite(0, 0, 960, 540, 'tile');
	for (var i = 6; i >= 0; i--){
		enemies[i] = game.add.sprite(-150, -150, 'enemy');
		enemies[i].anchor.x = enemies[i].anchor.y = 0.5;
		enemies[i].inputEnabled = true;
		enemies[i].events.onInputDown.add(enemyClick, this);
		enemies[i].number = i;
		enemies[i].correct = false;
		var txt = this.game.add.text(0, 0, i, {font:"45px Arial", fill:"#ffffff", fontWeight:"bold", boundsAlignH:"center", boundsAlignV:"middle"});
		txt.setTextBounds(-enemies[i].width/2, -enemies[i].height/2, enemies[i].width, enemies[i].height);
		enemies[i].addChild(txt);
		startTravel(enemies[i]);
	}
}

function update() {

}

function enemyClick(target){
	if (target.number == current){
		target.movTween.pause();
		target.getChildAt(0).addColor('#00ff00', 0);
		target.events.onInputDown.remove(enemyClick, this);
		target.correct = true;
		game.world.addChildAt(target, 1);
		velocity -= 500;
		current++;
	} else {
		target.movTween.pause();
		target.getChildAt(0).addColor('#ff0000', 0);
		velocity += 300;
		setTimeout(function(){
			current = 0;
			target.movTween.resume();
			target.getChildAt(0).addColor('#ffffff', 0);
			for (var i = 0; i < enemies.length; i++){
				if (enemies[i].correct){
					enemies[i].correct = false;
					enemies[i].movTween.resume();
					enemies[i].events.onInputDown.add(enemyClick, this);
					enemies[i].getChildAt(0).addColor('#ffffff', 0);
				}
			}
		}, 500);
	}
}

function startTravel(enemy) {
	setTimeout(function(){
		var orig = generateLocation(enemy);
		var dest = generateLocation(enemy);
		var anchorOrig = generatePointInScreen();
		var anchorDest = generatePointInScreen();
		var pointsTo = {
			x: [orig.x, anchorOrig.x, anchorDest.x, dest.x],
			y: [orig.y, anchorOrig.y, anchorDest.y, dest.y]
		}

		enemy.x = orig.x;
		enemy.y = orig.y;
		enemy.movTween = game.add.tween(enemy)
						.to(pointsTo, velocity, Phaser.Easing.Quadratic.InOut, true)
						.interpolation(function(v, k){return Phaser.Math.bezierInterpolation(v, k)});
		enemy.movTween.onComplete.add(function(){ startTravel(enemy) }, this);
	}, 200);
}

function generateLocation(target){
	var point = {x:0, y:0, loc:0};
	point.loc = Math.floor(Math.random() * 4);
	return generatePointWithLocation(point, target, point.loc);
}

function generatePointWithLocation(point, target, loc){
	if (loc <= 1){
		point.x = getRandomInt(target.width, game.width - target.width);
		point.y = (point.loc == 0)? -target.height : game.height + target.height;
	} else {
		point.x = (point.loc == 2)? -target.width : game.width + target.width;
		point.y = getRandomInt(target.height, game.height - target.height);
	}
	return point;
}

function generatePointInScreen(){
	var point = {x:0, y:0};
	point.x = getRandomInt(0, game.width);
	point.y = getRandomInt(0, game.height);
	return point;
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}