require([
  'game',
  'states/second'
], function (game, second) {
  'use strict';
  game.state.add('game', second);
  game.state.start('game');
});
