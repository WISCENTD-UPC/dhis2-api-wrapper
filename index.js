
// Thrid-party libraries
const fetch = require('node-fetch')
const R = require('ramda')

// Project modules
const Base = require('./src/base')
//const { autoLogin } = require('./src/middleware')
const ENDPOINTS = require('./config/endpoints')

module.exports = class {
  constructor (opts = {}) {
    this.baseURL = opts.baseURL || ''
    this.credentials = opts.credentials || {}
    this.debug = opts.debug || false
    this.fetch = opts.fetch || fetch
    this._base = opts._base || new Base({
      baseURL: this.baseURL,
      fetch: this.fetch,
      debug: this.debug
    })
    this._Date = opts._Date || Date
  }

  createRequest (config = {}) {
    config.api = this
    const { user, password } = this.credentials
    config.token = Buffer.from(`${user}:${password}`).toString('base64')
    return config
  }

  getResources () {
    return this._base.get(ENDPOINTS.RESOURCES.GET(), this.createRequest())
  }

  async resourcesSummary () {
    const resources = (await this.getResources()).resources
    console.log()
    console.log('RESOURCES'.padStart(20))
    R.map(_ => console.log(`${_.displayName.padEnd(45, '.')} ${_.href}`), resources)
  }

  getOrganisationUnits (query) {
    const request = this.createRequest({ query })
    return this._base.get(ENDPOINTS.ORGANISATION_UNITS.GET_ALL(), request)
  }

  getOrganisationUnit (id) {
    return this._base.get(ENDPOINTS.ORGANISATION_UNITS.GET(id), this.createRequest())
  }

  getTrackedEntityTypes () {
    return this._base.get(ENDPOINTS.TRACKED_ENTITIES.GET_TYPES(), this.createRequest())
  }

  getTrackedEntityInstances (ouID, filters = {}) {
    const request = this.createRequest({
      query: { ou: ouID, ...filters }
    })
    return this._base.get(ENDPOINTS.TRACKED_ENTITIES.GET_INSTANCES(), request)
  }

  getTrackedEntityInstance (id) {
    return this._base.get(ENDPOINTS.TRACKED_ENTITIES.GET_INSTANCE(id), this.createRequest())
  }

  getEventsReports () {
    return this._base.get(ENDPOINTS.EVENTS.GET_REPORTS(), this.createRequest())
  }

  async programsSummary () {
    const programs = (await this.getPrograms()).programs
    console.log()
    console.log('PROGRAMS'.padStart(20))
    R.map(_ => console.log(`${_.displayName.padEnd(45, '.')} ${_.id}`), programs)
  }

  getPrograms () {
    return this._base.get(ENDPOINTS.PROGRAMS.GET_PROGRAMS(), this.createRequest())
  }

  getProgram (id) {
    return this._base.get(ENDPOINTS.PROGRAMS.GET_PROGRAM(id), this.createRequest())
  }

  getProgramStages () {
    return this._base.get(ENDPOINTS.PROGRAMS.GET_STAGES(), this.createRequest())
  }

  getProgramStage (id) {
    return this._base.get(ENDPOINTS.PROGRAMS.GET_STAGE(id), this.createRequest())
  }

  getProgramIndicator (id) {
    return this._base.get(ENDPOINTS.PROGRAMS.GET_INDICATOR(id), this.createRequest())
  }
}

