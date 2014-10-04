define([
  'game',
  'actors/bullet'
], function (game, bullet) {

  var ROTATION_SPEED = 300;
  var MAX_SPEED = 200;
  var ACCEL = 400;
  var COOLING_TIME = 200;
  var DRAG = 2;
  var RETRO = 200;

  function Ship() {
    var sprite = this.sprite = game.add.sprite(game.width / 2, game.height / 2, 'ship');
    sprite.anchor.setTo(.5);
    sprite.angle = -90;
    sprite.update = this.update.bind(this);
    sprite.events.onDestroy.addOnce(this.destroy, this);

    game.physics.arcade.enable(sprite);
    sprite.body.maxVelocity.setTo(MAX_SPEED);
    sprite.body.drag.setTo(DRAG);

    this.cursors = game.input.keyboard.createCursorKeys();
    this.fireKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.resetKey = game.input.keyboard.addKey(Phaser.Keyboard.R);
    this.resetKey.onDown.add(reset, this);
    this.bulletTime = 0;

    this.fireSe = game.add.audio('fire');
  };

  function reset() {
    window.location.reload();
  }

  Ship.create = function () {
    return new Ship();
  };

  var ship = Ship.prototype;

  ship.destroy = function () {
    this.sprite.update = null;
  };

  ship.update = function () {
    if (this.sprite.alive) {

      if (this.cursors.up.isDown) {
        game.physics.arcade.accelerationFromRotation(this.sprite.rotation, ACCEL, this.sprite.body.acceleration);
        this.sprite.frame = 1;
      } else {
        this.sprite.body.acceleration.setTo(0);
        this.sprite.frame = 0;
      }

      if (this.cursors.left.isDown) {
        this.sprite.body.angularVelocity = -ROTATION_SPEED;
      } else if (this.cursors.right.isDown) {
        this.sprite.body.angularVelocity = ROTATION_SPEED;
      } else {
        this.sprite.body.angularVelocity = 0;
      }

      game.world.wrap(this.sprite, 0, true);

      if (this.fireKey.isDown) {
        if (game.time.now < this.bulletTime + COOLING_TIME) {
          return;
        }
        this.fire();
      }
    }
  };

  ship.fire = function () {
    this.bulletTime = game.time.now;

    this.fireSe.play();

    game.physics.arcade.accelerationFromRotation(this.sprite.rotation + Math.PI, RETRO, this.sprite.body.acceleration);

    bullet.create({
      x: this.sprite.x + 16 * Math.cos(this.sprite.rotation),
      y: this.sprite.y + 16 * Math.sin(this.sprite.rotation),
      angle: this.sprite.angle
    });

    // bullet.create({
    //   x: this.sprite.x + 16 * Math.cos(this.sprite.rotation),
    //   y: this.sprite.y + 16 * Math.sin(this.sprite.rotation),
    //   angle: this.sprite.angle - 10
    // });
    //
    // bullet.create({
    //   x: this.sprite.x + 16 * Math.cos(this.sprite.rotation),
    //   y: this.sprite.y + 16 * Math.sin(this.sprite.rotation),
    //   angle: this.sprite.angle + 10
    // });
    //
    // bullet.create({
    //   x: this.sprite.x + 16 * Math.cos(this.sprite.rotation),
    //   y: this.sprite.y + 16 * Math.sin(this.sprite.rotation),
    //   angle: this.sprite.angle - 5
    // });
    //
    // bullet.create({
    //   x: this.sprite.x + 16 * Math.cos(this.sprite.rotation),
    //   y: this.sprite.y + 16 * Math.sin(this.sprite.rotation),
    //   angle: this.sprite.angle + 5
    // });
  };

  return Ship
});
