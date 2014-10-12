module.exports = {
  html: {
    src: '<%= config.framework %>/index.html',
    dest: '<%= config.dist %>/index.html'
  },
  manifest: {
    src: '<%= config.framework %>/manifest.appcache',
    dest: '<%= config.dist %>/manifest.appcache'
  },
  assetsManifest: {
    src: '<%= config.framework %>/assets.json',
    dest: '<%= config.dist %>/assets.json'
  },
  assets: {
    expand: true,
    cwd: '<%= config.assets %>',
    src: '**/*.*',
    dest: '<%= config.dist %>/assets'
  }
};
