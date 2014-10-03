define([
  'game',
  'states/first'
], function (game, first) {

  game.state.add('game', first, true);

});
