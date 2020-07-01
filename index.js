
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

  async _getAllPages (endpoint, request, responsePropName) {
    const result = []
    const response = await this._base.get(endpoint, request)
    const pager = response.pager
    result.push(response)

    if (pager != null && pager.pageCount > 1) {
      for (let i = 2; i <= pager.pageCount; i++) {
        result.push(this._base.get(endpoint, R.mergeDeepRight(request, { query: { page: i } })))
      }
    }

    return R.pipe(
      R.map(R.prop(responsePropName)),
      R.flatten
    )(await Promise.all(result))
  }

  getResources () {
    return this._getAllPages(ENDPOINTS.RESOURCES.GET(), this.createRequest(), 'resources')
  }

  async resourcesSummary () {
    const resources = await this.getResources()
    console.log()
    console.log('RESOURCES'.padStart(20))
    R.map(_ => console.log(`${_.displayName.padEnd(45, '.')} ${_.href}`), resources)
  }

  getOrganisationUnits (query = {}) {
    const request = this.createRequest({ query })
    return this._getAllPages(ENDPOINTS.ORGANISATION_UNITS.GET_ALL(), request, 'organisationUnits')
  }

  getOrganisationUnit (id) {
    return this._base.get(ENDPOINTS.ORGANISATION_UNITS.GET(id), this.createRequest())
  }

  async getOrganisationUnitsFromParent (id) {
    const request = this.createRequest({
      query: { paging: false, includeDescendants: true }
    })
    return (await this._base.get(ENDPOINTS.ORGANISATION_UNITS.GET(id), request)).organisationUnits
  }

  getTrackedEntityTypes () {
    return this._getAllPages(ENDPOINTS.TRACKED_ENTITIES.GET_TYPES(), this.createRequest(), 'trackedEntityTypes')
  }

  getTrackedEntityInstances (ouID, filters = {}) {
    const request = this.createRequest({
      query: { ou: ouID, ...filters }
    })
    return this._getAllPages(ENDPOINTS.TRACKED_ENTITIES.GET_INSTANCES(), request, 'trackedEntityInstances')
  }

  getTrackedEntityInstance (id) {
    return this._base.get(ENDPOINTS.TRACKED_ENTITIES.GET_INSTANCE(id), this.createRequest())
  }

  getEventsReports () {
    return this._getAllPages(ENDPOINTS.EVENTS.GET_REPORTS(), this.createRequest(), 'eventsReports')
  }

  async programsSummary () {
    const programs = await this.getPrograms()
    console.log()
    console.log('PROGRAMS'.padStart(20))
    R.map(_ => console.log(`${_.displayName.padEnd(45, '.')} ${_.id}`), programs)
  }

  getPrograms () {
    return this._getAllPages(ENDPOINTS.PROGRAMS.GET_PROGRAMS(), this.createRequest(), 'programs')
  }

  getProgram (id) {
    return this._base.get(ENDPOINTS.PROGRAMS.GET_PROGRAM(id), this.createRequest())
  }

  getProgramStages () {
    return this._getAllPages(ENDPOINTS.PROGRAMS.GET_STAGES(), this.createRequest(), 'programStages')
  }

  getProgramStage (id) {
    return this._base.get(ENDPOINTS.PROGRAMS.GET_STAGE(id), this.createRequest())
  }

  getProgramIndicator (id) {
    return this._base.get(ENDPOINTS.PROGRAMS.GET_INDICATOR(id), this.createRequest())
  }
}

