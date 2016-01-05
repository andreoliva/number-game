var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var enemy;

function preload() {
	game.load.image('floor', 'assets/floor.png');
	game.load.image('enemy', 'assets/enemy.png');
}

function create() {
	game.add.sprite(0, 0, 'floor');
	enemy = game.add.sprite(-150, -150, 'enemy');
	enemy.anchor.x = enemy.anchor.y = 0.5;
	enemy.inputEnabled = true;
	enemy.events.onInputDown.add(enemyClick, this);
	startTravel();
}

function update() {

}

function enemyClick(target){
	if (target.movTween.isPaused){
		target.movTween.resume();
	} else {
		target.movTween.pause();
	}
}

function startTravel() {
	setTimeout(function(){
		var orig = generateOrigPoint(enemy);
		var dest = generateDestPoint(enemy, orig);
		var time = getRandomInt(2000, 2500);
		enemy.x = orig.x;
		enemy.y = orig.y;

		enemy.movTween = game.add.tween(enemy).to({x: dest.x, y: dest.y}, time, Phaser.Easing.None, true);
		enemy.movTween.onComplete.add(startTravel, this);
	}, 500);
}

function generateOrigPoint(target){
	var point = {x:0, y:0, loc:0};
	point.loc = Math.floor(Math.random() * 4);
	return generatePoint(point, target, point.loc);
}

function generateDestPoint(target, orig){
	var point = {x:0, y:0, loc:0, locName:null};
	do {
		point.loc = Math.floor(Math.random() * 4);
	} while (point.loc == orig.loc);
	return generatePoint(point, target, point.loc);
}

function generatePoint(point, target, loc){
	if (point.loc <= 1){
		point.x = getRandomInt(target.width, game.width - target.width);
		point.y = (point.loc == 0)? -target.height : game.height + target.height;
	} else {
		point.x = (point.loc == 2)? -target.width : game.width + target.width;
		point.y = getRandomInt(target.height, game.height - target.height);
	}
	return point;
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}