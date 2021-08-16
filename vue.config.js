module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://111.229.233.21:8080/',
        ws: true,
        changeOrigin: true
      }
    }
  }
}
