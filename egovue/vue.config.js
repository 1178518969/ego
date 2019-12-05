module.exports = {
    devServer: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000/',
          ws: true,
          changeOrigin: true,
          pathRewrite: {
                '^/api': '/'
          }
        },
        '/product_api': {
          target: 'http://121.42.14.194:9011/',
          ws: true,
          changeOrigin: true,
          pathRewrite: {
                '^/product_api': '/'
          }
        },
        '/content_api': {
          target: 'http://121.42.14.194:9021/',
          ws: true,
          changeOrigin: true,
          pathRewrite: {
                '^/content_api': '/'
          }
        }
      }
    }
  }