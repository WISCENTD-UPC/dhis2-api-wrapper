
// Node.js modules
const FormData = require('form-data')

// Third-party libraries
const fetch = require('node-fetch')
const qs = require('query-string')

// Project modules
const applyMiddleware = require('./apply-middleware')

module.exports = class Base {
  constructor (opts = {}) {
    this.baseURL = opts.baseURL || ''
    this.fetch = opts.fetch || fetch
    this.debug = opts.debug || false
  }

  logRequest (method, path, config) {
    if (this.debug === true) {
      const { query = {} } = config
      const strQuery = qs.stringify(query)
      console.log(`${method} ${path}${strQuery.length > 0 ? '?' : ''}${strQuery}`)
    }
  }

  url (path) {
    return `${this.baseURL}${path}`
  }

  async _get (path, config = {}) {
    const { query = {} } = config
    const token = this.token
    const headers = {
      'Accept': 'application/json'
    }
    if (token != null) {
      headers['Authorization'] = `Basic ${token}`
    }
    const response = await this.fetch(this.url(`${path}?${qs.stringify(query)}`), {
      credentials: 'include',
      headers
    })
    return response.json()
  }

  async _bodyVerbs (method = 'POST', path, body = {}, query = {}, headers = {}) {
    const token = this.token
    const headersConfig = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...headers
    }
    if (token != null) {
      headersConfig['Authorization'] = `Basic ${token}`
    }
    if (headers['Content-Type'] === null) {
      delete headersConfig['Content-Type']
    }
    const response = await this.fetch(this.url(`${path}?${qs.stringify(query)}`), {
      method,
      headers: headersConfig,
      credentials: 'include',
      body: body instanceof FormData ? body : JSON.stringify(body)
    })
    return response.json()
  }

  _request (method, path, config) {
    this.logRequest(method, path, config)
    this.token = config.token || this.token
    if (method === 'GET') {
      return this._get(path, config)
    } else {
      const { body, query, headers } = config
      return this._bodyVerbs(method, path, body, query, headers)
    }
  }

  request (method, path, config = {}) {
    const { middleware = [] } = config
    config.query = config.query || {}
    config.body = config.body || {}
    return applyMiddleware(middleware, method, path, config, this)
  }

  get (path, config) {
    return this.request('GET', path, config)
  }

  post (path, config) {
    return this.request('POST', path, config)
  }

  put (path, config) {
    return this.request('PUT', path, config)
  }

  delete (path, config) {
    return this.request('DELETE', path, config)
  }
}

