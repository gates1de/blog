const path = require('path')

module.exports = {
  webpack: config => {
    // path setting
    config.resolve.modules = [...config.resolve.modules, './src']
    return config
  }
}
