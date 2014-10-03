define([
  'game',
  'actors/ship'
], function (game, ship) {

  function State() {
  };

  var state = State.prototype;

  state.preload = function () {
    ship.preload();
  };

  state.create = function () {
    game.physics.arcade.gravity.y = 100;
    this.ship = ship.create();
  };

  state.update = function () {
    this.ship.focus();
  };

  state.render = function () {
    game.debug.spriteInfo(this.ship.sprite, 0, 32);
  };

  return State;
});
