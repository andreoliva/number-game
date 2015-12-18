var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var enemy;

function preload() {
  game.load.image('floor', 'assets/floor.png');
  game.load.image('enemy', 'assets/enemy.png');
}

function create() {
  game.add.sprite(0, 0, 'floor');
  enemy = game.add.sprite(0, 0, 'enemy');
  enemy.anchor.x = enemy.anchor.y = 0.5
  startTravel();
}

function update() {

}

function startTravel() {
	setTimeout(function(){
		var orig = generateOrigPoint(enemy);
		var dest = generateDestPoint(enemy, orig);
		var time = getRandomInt(1500, 2500);
		enemy.x = orig.x;
		enemy.y = orig.y;

		var tween = game.add.tween(enemy).to({x: dest.x, y: dest.y}, time, Phaser.Easing.None, true);
		tween.onComplete.add(startTravel, this);
	}, 500);
}

function generateOrigPoint(target){
	var point = {};
	if (Math.random() >= 0.5){
		point.x = getRandomInt(-target.width, (game.width + target.width));
		point.y = (Math.random() >= 0.5) ? -target.height : (game.height + target.height);
	} else {
		point.y = getRandomInt(-target.height, (game.height + target.height));
		point.x = (Math.random() >= 0.5) ? -target.width : (game.width + target.width);
	}
	return point;
}

function generateDestPoint(target, orig){
	var point = {};
	point.x = 0;
	point.y = 0;
	return point;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}