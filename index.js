
// Thrid-party libraries
const fetch = require('isomorphic-fetch')
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
    this._log = opts._log || console.log.bind(console)
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

  async getResources () {
    const request = this.createRequest({
      query: { paging: false }
    })
    return (await this._base.get(ENDPOINTS.RESOURCES.GET(), request)).resources
  }

  async resourcesSummary () {
    const resources = await this.getResources()
    this._log()
    this._log('RESOURCES'.padStart(20))
    R.map(_ => this._log(`${_.displayName.padEnd(45, '.')} ${_.href}`), resources)
  }

  async getOrganisationUnits () {
    const request = this.createRequest({
      query: { paging: false }
    })
    return (await this._base.get(ENDPOINTS.ORGANISATION_UNITS.GET_ALL(), request)).organisationUnits
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

  async getTrackedEntityTypes () {
    const request = this.createRequest({
      query: { paging: false }
    })
    return (await this._base.get(ENDPOINTS.TRACKED_ENTITIES.GET_TYPES(), request)).trackedEntityTypes
  }

  getTrackedEntityInstances (ouID, filters = {}) {
    const request = this.createRequest({
      query: { ou: ouID, paging: false, ...filters }
    })
    return this._getAllPages(ENDPOINTS.TRACKED_ENTITIES.GET_INSTANCES(), request, 'trackedEntityInstances')
  }

  getTrackedEntityInstance (id) {
    return this._base.get(ENDPOINTS.TRACKED_ENTITIES.GET_INSTANCE(id), this.createRequest())
  }

  async getTrackedEntitiesAttributes () {
    const request = this.createRequest({
      query: { paging: false }
    })
    return (await this._base.get(ENDPOINTS.TRACKED_ENTITIES.GET_ATTRIBUTES(), request)).trackedEntityAttributes
  }

  async getEventsReports () {
    const request = this.createRequest({
      query: { paging: false }
    })
    return (await this._base.get(ENDPOINTS.EVENTS.GET_REPORTS(), request)).eventReports
  }

  async programsSummary () {
    const programs = await this.getPrograms()
    this._log()
    this._log('PROGRAMS'.padStart(20))
    R.map(_ => this._log(`${_.displayName.padEnd(45, '.')} ${_.id}`), programs)
  }

  async getPrograms () {
    const request = this.createRequest({
      query: { paging: false }
    })
    return (await this._base.get(ENDPOINTS.PROGRAMS.GET_PROGRAMS(), request)).programs
  }

  getProgram (id) {
    return this._base.get(ENDPOINTS.PROGRAMS.GET_PROGRAM(id), this.createRequest())
  }

  async getProgramStages () {
    const request = this.createRequest({
      query: { paging: false }
    })
    return (await this._base.get(ENDPOINTS.PROGRAMS.GET_STAGES(), request)).programStages
  }

  async programStagesSummary () {
    const programStages = await this.getProgramStages()
    this._log()
    this._log('PROGRAMS STAGES'.padStart(20))
    R.map(_ => this._log(`${_.displayName.padEnd(45, '.')} ${_.id}`), programStages)
  }

  getProgramStage (id) {
    return this._base.get(ENDPOINTS.PROGRAMS.GET_STAGE(id), this.createRequest())
  }

  async dataElementsSummaryForProgramStage (programStageID) {
    const [ dataElements, programStage ] = await Promise.all([
      this.getDataElements(),
      this.getProgramStage(programStageID)
    ])
    this._log()
    this._log('PROGRAMS DATA ELEMENTS'.padStart(20))
    R.pipe(
      R.prop('programStageDataElements'),
      R.defaultTo([]),
      R.pluck('dataElement'),
      R.pluck('id'),
      R.innerJoin(
        (dataElement, id) => dataElement.id === id,
        dataElements
      ),
      R.forEach(_ => this._log(`${_.displayName.padEnd(45, '.')} ${_.id}`))
    )(programStage)
  }

  getProgramIndicator (id) {
    return this._base.get(ENDPOINTS.PROGRAMS.GET_INDICATOR(id), this.createRequest())
  }

  async getTrackedEntityEvents (id) {
    const request = this.createRequest({
      query: { paging: false, trackedEntityInstance: id }
    })
    return (await this._base.get(ENDPOINTS.EVENTS.GET_TRACKED_ENTITY_EVENTS(), request)).events
  }

  async getDataElements () {
    const request = this.createRequest({
      query: { paging: false }
    })
    return (await this._base.get(ENDPOINTS.DATA_ELEMENTS.GET_DATA_ELEMENTS(), request)).dataElements
  }

  getTrackedEntityRelationships (id) {
    const request = this.createRequest({
      query: { paging: false, tei: id }
    })
    return this._base.get(ENDPOINTS.TRACKED_ENTITIES.GET_RELATIONSHIPS(), request)
  }

  async getRelationshipTypes () {
    const request = this.createRequest({
      query: { paging: false }
    })
    return (await this._base.get(ENDPOINTS.RELATIONSHIPS.GET_TYPES(), request)).relationshipTypes
  }

  async getOptionSets () {
    const request = this.createRequest({
      query: { paging: false }
    })
    return (await this._base.get(ENDPOINTS.OPTIONS.GET_SETS(), request)).optionSets
  }

  async getOptionSet (id) {
    return (await this._base.get(ENDPOINTS.OPTIONS.GET_SET(id), this.createRequest()))
  }

  async getOptions () {
    const request = this.createRequest({
      query: { paging: false }
    })
    return (await this._base.get(ENDPOINTS.OPTIONS.GET_OPTIONS(), request)).options
  }
}

