define(function (require, exports, module) {
  'use strict';

  var State = module.exports = function State() {
  };

  var state = State.prototype;

  state.preload = function (game) {
    this.load.pack('asteroid', 'assets.json');
  };

  var ship, flash, rocks, bullets, explosions, gunfires;
  var spacebar, cursors;

  var MAX_SPEED = 300;

  state.create = function (game) {
    // bg
    this.stage.backgroundColor = 0x333333;
    this.world.setBounds(-10, -10, game.width + 20, game.height + 20);

    // player
    ship = this.add.sprite(game.width / 2, game.height / 2, 'ship');
    ship.anchor.setTo(0.5);
    game.physics.arcade.enable(ship);
    ship.body.maxVelocity.setTo(MAX_SPEED);

    // groups
    rocks = this.add.group();
    bullets = this.add.group();
    explosions = this.add.group();
    gunfires = this.add.group();

    // effect
    flash = this.add.graphics();
    flash.beginFill(0xffffff, 1);
    flash.drawRect(-10, -10, game.width + 20, game.height + 20);
    flash.endFill();
    flash.alpha = 0;

    // controls
    cursors = this.input.keyboard.createCursorKeys();
    spacebar = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    // level
    for (var i = 0; i < 3; ++i) {
      placeRock(game, (game.world.randomX - 100) / 2, game.world.randomY, 4);
    }
  };

  var ROTATION_SPEED = 300;
  var ACCEL = 200;

  state.update = function (game) {
    // player control
    if (ship.exists) {
      if (cursors.up.isDown) {
        game.physics.arcade.accelerationFromRotation(ship.rotation, ACCEL, ship.body.acceleration);
        ship.frame = 1;
      } else {
        ship.body.acceleration.setTo(0);
        ship.frame = 0;
      }

      if (cursors.left.isDown) {
        ship.body.angularVelocity = -ROTATION_SPEED;
      } else if (cursors.right.isDown) {
        ship.body.angularVelocity = ROTATION_SPEED;
      } else {
        ship.body.angularVelocity = 0;
      }

      if (spacebar.isDown) {
        fire.call(this);
      }
    }

    // nature
    game.physics.arcade.overlap(ship, rocks, shipHitRock, null, this);
    game.physics.arcade.overlap(bullets, rocks, bulletHitRock, null, this);
    game.world.wrap(ship, 0, true);
    bullets.forEachExists(function (bullet) {
      game.world.wrap(bullet, 0, true);
    });
    rocks.forEachExists(function (rock) {
      game.world.wrap(rock, 0, true);
    });
  };

  var lastFireTime = 0;
  var COOLING_TIME = 200;
  var LIFESPAN = 1000;
  var BULLET_SPEED = 800;

  function fire() {
    if (this.time.now < lastFireTime + COOLING_TIME) {
      return;
    }
    lastFireTime = this.time.now;

    poolAcquire.call(this, bullets, ship.x + Math.cos(ship.rotation) * 32, ship.y + Math.sin(ship.rotation) * 32, 'bullet', function (sprite) {
      sprite.anchor.setTo(.5);
      this.physics.arcade.enable(sprite);
    }, function (sprite) {
      sprite.lifespan = LIFESPAN;
      sprite.rotation = ship.rotation;
      this.physics.arcade.velocityFromRotation(sprite.rotation, BULLET_SPEED, sprite.body.velocity);
    });

    poolAcquire.call(this, gunfires, ship.x + Math.cos(ship.rotation) * 32, ship.y + Math.sin(ship.rotation) * 32, 'gunfire', function (sprite) {
      sprite.anchor.setTo(.5);
      sprite.scale.setTo(2);
    }, function (sprite) {
      sprite.lifespan = 10;
      sprite.rotation = ship.rotation;
    });
  }

  function poolAcquire(group, x, y, key, init, reinit) {
    var sprite = group.getFirstExists(false);
    if (!sprite) {
      sprite = group.create(0, 0, key);
      init.call(this, sprite);
    };
    sprite.reset(x, y);
    reinit.call(this, sprite);
  }

  // function placeRock2() {
  //   create(rocks, 'rock', function (sprite) {
  //     sprite.anchor.setTo(.5);
  //     game.physics.arcade.enable(sprite);
  //   }, function (sprite) {
  //     sprite.reset(x, y);
  //     sprite.body.angularVelocity = 10;
  //     sprite.scale.setTo(scale);
  //   });
  // }

  function placeRock(game, x, y, scale) {
    var rock = rocks.getFirstExists(false);
    if (!rock) {
      rock = rocks.create(0, 0, 'rock');
      rock.anchor.setTo(.5);
      game.physics.arcade.enable(rock);
    }
    rock.reset(x, y);
    rock.body.angularVelocity = 10;
    rock.scale.setTo(scale);
  }

  function shipHitRock(ship) {
    ship.kill();
  }

  function bulletHitRock(bullet, rock) {
    bullet.kill();

    flash.alpha = 1;
    this.add.tween(flash).to({alpha: 0}, 100, Phaser.Easing.Cubic.In, true);

    this.camera.y = 0;
    this.add.tween(this.camera)
      .to({y: -10}, 40, Phaser.Easing.Sinusoidal.InOut, true, 0, 5, true);

    explosion(this.game, bullet);
    split(this.game, rock)
    rock.kill();
  }

  function split(game, rock) {
    if (rock.scale.x < .5) {
      return;
    }
    placeRock(game, rock.x - 10, rock.y - 10, rock.scale.x / 2);
    placeRock(game, rock.x + 10, rock.y + 10, rock.scale.x / 2);
    placeRock(game, rock.x - 10, rock.y + 10, rock.scale.x / 2);
    placeRock(game, rock.x + 10, rock.y - 10, rock.scale.x / 2);
  }

  function explosion(game, bullet) {
    var explosion = explosions.getFirstExists(false);
    if (!explosion) {
      explosion = explosions.create(0, 0, 'explosion');
      explosion.anchor.setTo(.5);
      var animation = explosion.animations.add('boom', [0, 1, 2, 3], 60, false);
      animation.killOnComplete = true;
    }
    explosion.reset(bullet.x, bullet.y);
    explosion.angle = game.rnd.integerInRange(0, 360);
    explosion.animations.play('boom');
  }

});
