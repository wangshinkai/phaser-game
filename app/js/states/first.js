define([
  'game',
  'actors/ship',
  'actors/rock',
  'actors/bullet',
  'actors/explosion',
  'groups/rocks',
  'groups/bullets'
], function (game, ship, rock, bullet, explosion, rocks, bullets) {

  var COMBO_INTERVAL = 1000;
  var SCORE_BASE = 10;

  function State() {
  };

  var state = State.prototype;

  state.preload = function () {
    game.load.image('rock', 'assets/gfx/block.png');
    game.load.image('bullet', 'assets/gfx/bullet.png');
    game.load.spritesheet('explosion', 'assets/gfx/explosion.png', 128, 128);
    game.load.spritesheet('ship', 'assets/gfx/ship.png', 32, 32);
    game.load.audio('fire', 'assets/sfx/Zap_FX_007.ogg');
    game.load.audio('hit', 'assets/sfx/se_maoudamashii_retro12.ogg');
    game.load.audio('explosion', 'assets/sfx/se_maoudamashii_retro30.ogg');
    game.load.audio('bgm', 'assets/sfx/ouka_beni.mp3');
  };

  state.create = function () {
    game.world.setBounds(-10, -10, game.width + 20, game.height + 20);

    this.flash = game.add.graphics(0, 0);
    this.flash.beginFill(0xffffff, 1);
    this.flash.drawRect(-10, -10, game.width + 20, game.height + 20);
    this.flash.endFill();
    this.flash.alpha = 1;

    // this.bg = game.add.graphics(0, 0);
    // this.bg.beginFill(0x663333, 1);
    // this.bg.drawRect(-10, -10, game.width + 20, game.height + 20);
    // this.bg.endFill();
    // game.world.sendToBack(this.bg);

    game.add.tween(this.flash)
      .to({alpha: 0}, 2000)
      .start();

    game.stage.backgroundColor = 0x333333;
    game.add.audio('bgm').play();

    this.hitSe = game.add.audio('hit');
    this.explosionSe = game.add.audio('explosion');

    // score
    this.score = 0;
    this.scoreText = game.add.text(32, 32, '', {
      fill: '#ffffff'
    });

    // combo
    this.comboCounter = 0;
    this.lastHitTime = 0;
    this.comboText = game.add.text(game.width - 32, 32, '', {
      fill: '#ffffff'
    });
    this.comboText.anchor.x = 1;
    this.comboText.alpha = 0;

    this.ship = ship.create();

    for (var i = 0; i < 4; ++i) {
      var x = Math.random() * (game.width / 2 - 100);
      if (Math.random() > .5) {
        x += game.width / 2 + 100
      };

      rock.create({
        x: x,
        y: Math.random() * game.height,
        scale: 4,
        velocity: {
          x: Math.random() * 10,
          y: Math.random() * 10
        },
        angularVelocity: 10
      });
    };

  };

  state.collision = function (bullet, rock) {
    explosion.create({
      x: bullet.x,
      y: bullet.y
    });
    this.hitSe.play();
    bullet.kill();
    rock.controller.split();

    this.score += 10 * (1 + this.comboCounter * .2);

    if (game.time.now < this.lastHitTime + COMBO_INTERVAL) {
      this.comboCounter++;
      this.comboText.alpha = 1;
      game.add.tween(this.comboText)
        .to({alpha: 0}, COMBO_INTERVAL, Phaser.Easing.Exponential.In)
        .start();
    } else {
      this.comboCounter = 0;
    };


    this.flash.alpha = .5;
    game.add.tween(this.flash)
      .to({alpha: 0}, 100, Phaser.Easing.Cubic.In)
      .start();

    game.camera.y = 0;
    game.add.tween(this.game.camera)
      .to({y: -10}, 40, Phaser.Easing.Sinusoidal.InOut, false, 0, 5, true)
      .start();

    this.lastHitTime = game.time.now;
  };

  state.death = function (player, rock) {
    player.kill();

    rocks.forEach(function (rock) {
      if (rock && rock.controller) {
        rock.controller.split();
      }
    });

    this.explosionSe.play();
    this.scoreText.x = game.width / 2;
    this.scoreText.y = game.height / 2;
    this.scoreText.anchor.setTo(.5);

    this.flash.alpha = 1;
    game.add.tween(this.flash)
      .to({alpha: 0}, 4000, Phaser.Easing.Cubic.In)
      .start();
  };

  state.update = function () {
    game.physics.arcade.overlap(bullets, rocks, this.collision, null, this);
    game.physics.arcade.overlap(this.ship.sprite, rocks, this.death, null, this);
    this.comboText.setText('combo: ' + Number(this.comboCounter + 1));
    this.scoreText.setText('score: ' + this.score);
  };

  state.render = function () {
    //game.debug.body(this.ship.sprite);
  };

  return State;
});
