import axios from 'axios'

const ENV = process.env.NODE_ENV

let util

switch (ENV) {
  case 'production': // 正式环境
    util = {
      contextPath: '/api',
      ajax: axios.create({
        baseURL: '/api',
        timeout: 30000
      }),
      response: {
        code: {
          Success: '1'
        }
      }
    }
    break
  default: // 开发环境
    const proxy = require('../../config/index.js').dev.proxyTable
    for (var key in proxy) {
      util = {
        contextPath: key,
        ajax: axios.create({
          baseURL: key,
          timeout: 30000
        }),
        response: {
          code: {
            Success: '1'
          }
        }
      }
      break
    }
    break
}

export default util
