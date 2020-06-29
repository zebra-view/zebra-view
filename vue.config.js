module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:7001',
        chanageOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
};
