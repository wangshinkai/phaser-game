define([
  'game',
  'groups/bullets'
], function (game, bullets) {

  var SPEED = 1000;
  var LIFESPAN = 800;

  function Bullet(opts) {
    var x = opts.x || 0;
    var y = opts.y || 0;
    var angle = opts.angle || 0;

    var sprite = this.sprite = game.add.sprite(x, y, 'bullet');
    sprite.anchor.setTo(.5);
    sprite.angle = angle;
    sprite.update = this.update.bind(this);
    sprite.events.onDestroy.addOnce(this.destroy, this);
    sprite.lifespan = LIFESPAN;

    game.physics.arcade.enable(sprite);
    game.physics.arcade.velocityFromRotation(sprite.rotation, SPEED, sprite.body.velocity);
    bullets.add(sprite);
  };

  Bullet.create = function (opts) {
    return new Bullet(opts || {});
  };

  bullet = Bullet.prototype;

  bullet.destroy = function () {
    this.sprite.update = null;
  };

  bullet.update = function () {
    game.world.wrap(this.sprite, 0, true);
  };

  return Bullet;

});
