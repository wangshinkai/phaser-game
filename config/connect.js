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
          connect.static(config.wrapper),
          connect().use('/app', connect.static(config.app)),
          connect().use('/app/bower_components', connect.static('./bower_components')),
          connect().use('/bower_components', connect.static('./bower_components'))
        ];
      }
    }
  }
};
