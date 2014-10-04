define([
  'game'
], function (game) {

  function Explosion(opts) {
    var x = opts.x || 0;
    var y = opts.y || 0;

    var sprite = this.sprite = game.add.sprite(x, y, 'explosion');
    sprite.anchor.setTo(.5);

    var animation = sprite.animations.add('boom', [0, 1, 2, 3], 60, false);
    animation.killOnComplete = true;

    sprite.angle = game.rnd.integerInRange(0, 360);
    sprite.animations.play('boom');
  }

  Explosion.create = function (opts) {
    return new Explosion(opts || {});
  };

  var explosion = Explosion.prototype;

  return Explosion;

});
