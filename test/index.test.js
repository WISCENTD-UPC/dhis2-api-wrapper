
const { v4: uuid } = require('uuid')

const API = require('../')
const autoLogin = require('../src/middleware')
const ENDPOINTS = require('../config/endpoints')

test('API is created correctly', () => {
  const { APIConfig, api } = createAPI()
  expect(api.baseURL).toBe(APIConfig.baseURL)
  expect(api.credentials.user).toBe(APIConfig.credentials.user)
  expect(api.credentials.password).toBe(APIConfig.credentials.password)
  expect(api._base.baseURL).toBe(APIConfig.baseURL)
  expect(api._base.debug).toBe(APIConfig.debug)
})

test('API createRequest should add extra info to config', () => {
  const { APIConfig, api } = createAPI()
  const { user, password } = APIConfig.credentials
  const request = api.createRequest({})
  expect(request.api).toBe(api)
  expect(request.token).toBe(Buffer.from(`${user}:${password}`).toString('base64'))
})

test('Get resources should call correct endpoint', simpleRouteTest({
  apiHandler: 'getResources',
  path: ENDPOINTS.RESOURCES.GET,
  responseProp: 'resources'
}))

test('resources summary', summaryTest({
  apiHandler: 'resourcesSummary',
  path: ENDPOINTS.RESOURCES.GET,
  headerValue: 'RESOURCES',
  mockedValue: { resources: [ { displayName: 'Resource', href: 'http://resource' } ] },
  expectedValue: `${'Resource'.padEnd(45, '.')} http://resource`
}))

test('Get organisation units', simpleRouteTest({
  apiHandler: 'getOrganisationUnits',
  path: ENDPOINTS.ORGANISATION_UNITS.GET_ALL,
  responseProp: 'organisationUnits'
}))

test('Get Organisation Unit by id', routeWithIDTest({
  apiHandler: 'getOrganisationUnit',
  path: ENDPOINTS.ORGANISATION_UNITS.GET
}))

test('Get organisation units from parent id', async () => {
  const id = uuid()
  const responseValue = {
    organisationUnits: [ uuid(), uuid() ]
  }
  const get = jest.fn().mockReturnValue(Promise.resolve(responseValue))
  const base = { get }
  const { api } = createAPI({ base })

  const response = await api.getOrganisationUnitsFromParent(id)

  expect(response).toStrictEqual(responseValue.organisationUnits)
  const request = api.createRequest({
    query: { paging: false, includeDescendants: true }
  })
  expect(get).toHaveBeenCalledWith(ENDPOINTS.ORGANISATION_UNITS.GET(id), request)
})

test('Get tracked entity types', simpleRouteTest({
  apiHandler: 'getTrackedEntityTypes',
  path: ENDPOINTS.TRACKED_ENTITIES.GET_TYPES,
  responseProp: 'trackedEntityTypes'
}))

test('Get tracked entity instances given the organisation unit ID', async () => {
  const id = uuid()
  const additionalFilter = uuid()
  const responseValue = {
    trackedEntityInstances: [ uuid(), uuid() ]
  }
  const get = jest.fn().mockReturnValue(Promise.resolve(responseValue))
  const base = { get }
  const { api } = createAPI({ base })

  const response = await api.getTrackedEntityInstances(id, { filter: additionalFilter })

  expect(response).toStrictEqual(responseValue.trackedEntityInstances)
  const request = api.createRequest({
    query: { ou: id, paging: false, filter: additionalFilter }
  })
  expect(get).toHaveBeenCalledWith(ENDPOINTS.TRACKED_ENTITIES.GET_INSTANCES(), request)
})

test('Get tracked entity instance by id', routeWithIDTest({
  apiHandler: 'getTrackedEntityInstance',
  path: ENDPOINTS.TRACKED_ENTITIES.GET_INSTANCE
}))

test('Get events reports', simpleRouteTest({
  apiHandler: 'getEventsReports',
  path: ENDPOINTS.EVENTS.GET_REPORTS,
  responseProp: 'eventReports'
}))

test('Programs summary', summaryTest({
  apiHandler: 'programsSummary',
  path: ENDPOINTS.PROGRAMS.GET_PROGRAMS,
  headerValue: 'PROGRAMS',
  mockedValue: { programs: [ { displayName: 'Program', id: '__id__' } ] },
  expectedValue: `${'Program'.padEnd(45, '.')} __id__`
}))

test('Get programs', simpleRouteTest({
  apiHandler: 'getPrograms',
  path: ENDPOINTS.PROGRAMS.GET_PROGRAMS,
  responseProp: 'programs'
}))

test('Get program by id', routeWithIDTest({
  apiHandler: 'getProgram',
  path: ENDPOINTS.PROGRAMS.GET_PROGRAM
}))

test('Get program stages', simpleRouteTest({
  apiHandler: 'getProgramStages',
  path: ENDPOINTS.PROGRAMS.GET_STAGES,
  responseProp: 'programStages'
}))

test('Get program stage by id', routeWithIDTest({
  apiHandler: 'getProgramStage',
  path: ENDPOINTS.PROGRAMS.GET_STAGE
}))

test('Get program indicator by id', routeWithIDTest({
  apiHandler: 'getProgramIndicator',
  path: ENDPOINTS.PROGRAMS.GET_INDICATOR
}))

test('Get tracked entity events given tracked entity id', async () => {
  const id = uuid()
  const responseValue = { events: [ uuid(), uuid() ] }
  const get = jest.fn().mockReturnValue(Promise.resolve(responseValue))
  const base = { get }
  const { api } = createAPI({ base })

  const response = await api.getTrackedEntityEvents(id)

  expect(response).toStrictEqual(responseValue.events)
  const request = api.createRequest({
    query: { paging: false, trackedEntityInstance: id }
  })
  expect(get).toHaveBeenCalledWith(ENDPOINTS.EVENTS.GET_TRACKED_ENTITY_EVENTS(), request)
})

test('Get data elements', simpleRouteTest({
  apiHandler: 'getDataElements',
  path: ENDPOINTS.DATA_ELEMENTS.GET_DATA_ELEMENTS,
  responseProp: 'dataElements'
}))

test('Get tracked entity relationships', async () => {
  const id = uuid()
  const responseValue = [ { id: uuid() } ]
  const get = jest.fn().mockReturnValue(Promise.resolve(responseValue))
  const base = { get }
  const { api } = createAPI({ base })

  const response = await api.getTrackedEntityRelationships(id)

  expect(response).toStrictEqual(responseValue)
  const request = api.createRequest({
    query: { paging: false, tei: id }
  })
  expect(get).toHaveBeenCalledWith(ENDPOINTS.TRACKED_ENTITIES.GET_RELATIONSHIPS(), request)
})

test('Get relationship types', simpleRouteTest({
  apiHandler: 'getRelationshipTypes',
  path: ENDPOINTS.RELATIONSHIPS.GET_TYPES,
  responseProp: 'relationshipTypes'
}))


function simpleRouteTest ({ apiHandler, path, responseProp } = {}) {
  return async () => {
    const responseValue = { [responseProp]: uuid() }
    const get = jest.fn().mockReturnValue(Promise.resolve(responseValue))
    const base = { get }
    const { APIConfig, api } = createAPI({ base })
  
    const response = await api[apiHandler]()

    expect(response).toBe(responseValue[responseProp])
    expect(get).toHaveBeenCalledWith(path(), api.createRequest({
      query: { paging: false }
    }))
  }
}

function routeWithIDTest ({ apiHandler, path } = {}) {
  return async () => {
    const id = uuid()
    const responseValue = uuid()
    const get = jest.fn().mockReturnValue(Promise.resolve(responseValue))
    const base = { get }
    const { APIConfig, api } = createAPI({ base })
  
    const response = await api[apiHandler](id)

    expect(response).toBe(responseValue)
    expect(get).toHaveBeenCalledWith(path(id), api.createRequest())
  }
}

function summaryTest ({ apiHandler, path, headerValue, mockedValue, expectedValue } = {}) {
  return async () => {
    const get = jest.fn().mockReturnValue(Promise.resolve(mockedValue))
    const log = jest.fn()
    const base = { get }
    const { api } = createAPI({ base, log })

    const response = await api[apiHandler]()

    expect(response).toBeUndefined()
    expect(get).toHaveBeenCalledWith(path(), api.createRequest({
      query: { paging: false }
    }))
    expect(log.mock.calls.length).toBe(3)
    expect(log.mock.calls[0].length).toBe(0)
    expect(log.mock.calls[1].length).toBe(1)
    expect(log.mock.calls[1][0]).toBe(headerValue.padStart(20))
    expect(log.mock.calls[2].length).toBe(1)
    expect(log.mock.calls[2][0]).toStrictEqual(expectedValue)
  }
}

function createAPI ({ base, log } = {}) {
  const APIConfig = {
    baseURL: uuid(),
    credentials: { user: uuid(), password: uuid() },
    debug: true
  }
  
  if (base != null) {
    APIConfig._base = base
  }

  if (log != null) {
    APIConfig._log = log
  }

  const api = new API(APIConfig)
  return { api, APIConfig }
}

