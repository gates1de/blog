const path = require('path')

module.exports = {
  env: {
    APP_ENV: process.env.APP_ENV
  },
  webpack: config => {
    // path setting
    config.resolve.modules = [...config.resolve.modules, './src']
    return config
  }
}
