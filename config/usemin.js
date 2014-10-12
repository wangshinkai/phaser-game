module.exports = {
  html: '<%= config.dist %>/index.html',
  options: {
    blockReplacements: {
      requirejs: function (block) {
        return '<script src="' + block.dest + '"></script>';
      }
    }
  }
};
