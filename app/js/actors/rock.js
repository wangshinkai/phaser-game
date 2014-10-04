define([
  'game',
  'groups/rocks'
], function (game, rocks) {

  var SPLIT = 1;

  function Rock(opts) {
    var x = opts.x || 0;
    var y = opts.y || 0;
    var scale = opts.scale || 1;
    var angle = opts.angle || 0;
    var angularVelocity = opts.angularVelocity || 0;
    var velocity = opts.velocity || {x: 0, y: 0};

    this.scale = scale;

    var sprite = this.sprite = game.add.sprite(x, y, 'rock');
    sprite.name = 'rock';
    sprite.anchor.setTo(.5);
    sprite.scale.setTo(scale);
    sprite.angle = angle;
    sprite.update = this.update.bind(this);
    sprite.events.onDestroy.addOnce(this.destroy, this);
    sprite.controller = this;

    game.physics.arcade.enable(sprite);
    sprite.body.velocity = velocity;
    sprite.body.angularVelocity = angularVelocity;

    rocks.add(sprite);
  };

  Rock.create = function (opts) {
    return new Rock(opts || {});
  };

  var rock = Rock.prototype;

  rock.destroy = function () {
    this.sprite.update = null;
  };

  rock.update = function () {
    game.world.wrap(this.sprite, 0, true);
  };

  rock.split = function () {
    if (this.scale > .25) {

      var lu = rotation(-this.sprite.width / 4, -this.sprite.height / 4, this.sprite.rotation);
      var ru = rotation(this.sprite.width / 4, -this.sprite.height / 4, this.sprite.rotation);
      var ld = rotation(-this.sprite.width / 4, this.sprite.height / 4, this.sprite.rotation);
      var rd = rotation(this.sprite.width / 4, this.sprite.height / 4, this.sprite.rotation);

      var dv1 = game.physics.arcade.velocityFromRotation(this.sprite.rotation - Math.PI * 1 / 4, this.sprite.body.angularVelocity * SPLIT);
      var dv2 = game.physics.arcade.velocityFromRotation(this.sprite.rotation + Math.PI * 1 / 4, this.sprite.body.angularVelocity * SPLIT);
      var dv3 = game.physics.arcade.velocityFromRotation(this.sprite.rotation - Math.PI * 3 / 4, this.sprite.body.angularVelocity * SPLIT);
      var dv4 = game.physics.arcade.velocityFromRotation(this.sprite.rotation + Math.PI * 3 / 4, this.sprite.body.angularVelocity * SPLIT);

      Rock.create({
        x: this.sprite.x + lu.x,
        y: this.sprite.y + lu.y,
        angle: this.sprite.angle,
        angularVelocity: this.sprite.body.angularVelocity,
        velocity: {
          x: this.sprite.body.velocity.x + dv1.x,
          y: this.sprite.body.velocity.y + dv1.y
        },
        scale: this.scale / 2
      });

      Rock.create({
        x: this.sprite.x + ru.x,
        y: this.sprite.y + ru.y,
        angle: this.sprite.angle,
        angularVelocity: this.sprite.body.angularVelocity,
        velocity: {
          x: this.sprite.body.velocity.x + dv2.x,
          y: this.sprite.body.velocity.y + dv2.y
        },
        scale: this.scale / 2
      });

      Rock.create({
        x: this.sprite.x + ld.x,
        y: this.sprite.y + ld.y,
        angle: this.sprite.angle,
        angularVelocity: this.sprite.body.angularVelocity,
        velocity: {
          x: this.sprite.body.velocity.x + dv3.x,
          y: this.sprite.body.velocity.y + dv3.y
        },
        scale: this.scale / 2
      });

      Rock.create({
        x: this.sprite.x + rd.x,
        y: this.sprite.y + rd.y,
        angle: this.sprite.angle,
        angularVelocity: this.sprite.body.angularVelocity,
        velocity: {
          x: this.sprite.body.velocity.x + dv4.x,
          y: this.sprite.body.velocity.y + dv4.y
        },
        scale: this.scale / 2
      });
    };

    this.sprite.destroy();
  };

  function rotation(x, y, rotation) {
    return {
      x: Math.cos(rotation) * x - Math.sin(rotation) * y,
      y: Math.sin(rotation) * x + Math.cos(rotation) * y
    };
  };

  return Rock;
});
