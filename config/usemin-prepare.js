var path = require('path');
var config = require('./config');

module.exports = {
  html: '<%= config.framework %>/index.html',
  options: {
    dest: '<%= config.dist %>',
    flow: {
      steps: {
        js: ['concat', 'uglifyjs'],
        requirejs: [{
          name: 'requirejs',
          createConfig: function (context, block) {
            var file = context.inFiles[0];
            var extname = path.extname(file);
            var basename = path.basename(file, extname);
            var paths = {};
            paths[basename] = '../' + config.framework + '/' + basename;

            var generated = context.options.generated;
            generated.options = {
              baseUrl: config.app,
              out: context.outDir + '/' + block.dest,
              name: basename,
              paths: paths
            };
            return {};
          }
        }]
      },
      post: {}
    }
  }
};
