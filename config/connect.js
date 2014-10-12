var config = require('./config');

module.exports = {
  options: {
    port: 9000,
    keepalive: true
  },
  dev: {
    options: {
      middleware: function (connect) {
        return [
          connect.static(config.framework),
          connect.static(config.app),
          connect().use('/assets', connect.static(config.assets)),
          connect().use('/bower_components', connect.static(config.bower))
        ];
      }
    }
  },
  dist: {
    options: {
      base: '<%= config.dist %>'
    }
  }
};
