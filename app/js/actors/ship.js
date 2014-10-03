define([
  'game'
], function (game) {

  var ROTATION_SPEED = 300;
  var MAX_SPEED = 300;

  function Ship() {
    var sprite = this.sprite = game.add.sprite(game.width / 2, game.height / 2, 'ship');
    sprite.anchor.setTo(.5);
    sprite.angle = -90;
    sprite.update = this.update.bind(this);

    game.physics.arcade.enable(sprite);

    sprite.body.maxVelocity.setTo(MAX_SPEED);

    this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
  };

  Ship.preload = function () {
    game.load.spritesheet('ship', 'assets/gfx/ship.png', 32, 32);
  };

  Ship.create = function () {
    return new Ship();
  };

  var ship = Ship.prototype;

  ship.update = function () {

    if (this.upKey.isDown) {
      game.physics.arcade.accelerationFromRotation(this.sprite.rotation, 200, this.sprite.body.acceleration);
      this.sprite.frame = 1;
    } else {
      this.sprite.body.acceleration.setTo(0);
      this.sprite.frame = 0;
    };

    var xSpeed = Math.abs(this.sprite.body.velocity.x);
    this.sprite.body.acceleration.y -= xSpeed / 2;

    if (this.leftKey.isDown) {
      this.sprite.body.angularVelocity = -ROTATION_SPEED;
    } else if (this.rightKey.isDown) {
      this.sprite.body.angularVelocity = ROTATION_SPEED;
    } else {
      this.sprite.body.angularVelocity = 0;
    };
  };

  ship.focus = function () {
    game.camera.follow(this.sprite);
  };

  return Ship
});
