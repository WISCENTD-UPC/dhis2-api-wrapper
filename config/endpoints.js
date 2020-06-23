
module.exports = {
  RESOURCES: {
    GET: () => '/resources'
  },
  ORGANISATION_UNITS: {
    GET_ALL: () => '/organisationUnits',
    GET: (id) => `/organisationUnits/${id}`
  },
  TRACKED_ENTITIES: {
    GET_INSTANCES: () => '/trackedEntityInstances',
    GET_INSTANCE: (id) => `/trackedEntityInstances/${id}`,
    GET_TYPES: () => '/trackedEntityTypes'
  },
  EVENTS: {
    GET_REPORTS: () => '/eventReports'
  },
  PROGRAMS: {
    GET_PROGRAMS: () => '/programs',
    GET_PROGRAM: (id) => `/programs/${id}`,
    GET_STAGES: () => '/programStages',
    GET_STAGE: (id) => `/programStages/${id}`,
    GET_INDICATOR: (id) => `/programIndicators/${id}`
  }
}

