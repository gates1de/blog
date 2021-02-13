const path = require('path')

module.exports = {
  env: {
    APP_ENV: process.env.APP_ENV
  },
  images: {
    domains: ['s3.us-west-2.amazonaws.com'],
  },
  webpack: config => {
    // path setting
    config.resolve.modules = [...config.resolve.modules, './src']
    return config
  }
}
