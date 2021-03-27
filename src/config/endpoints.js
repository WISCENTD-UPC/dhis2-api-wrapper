
export default {
  RESOURCES: {
    GET: () => '/resources'
  },
  ORGANISATION_UNITS: {
    GET_ALL: () => '/organisationUnits',
    CREATE_ORGUNITS: () => '/metadata',
    GET: (id) => `/organisationUnits/${id}`
  },
  TRACKED_ENTITIES: {
    GET_INSTANCES: () => '/trackedEntityInstances',
    CREATE_INSTANCES: () => '/trackedEntityInstances',
    GET_INSTANCE: (id) => `/trackedEntityInstances/${id}`,
    GET_TYPES: () => '/trackedEntityTypes',
    GET_ATTRIBUTES: () => '/trackedEntityAttributes',
    GET_RELATIONSHIPS: () => '/relationships'
  },
  EVENTS: {
    GET_TRACKED_ENTITY_EVENTS: () => '/events',
    GET_REPORTS: () => '/eventReports'
  },
  PROGRAMS: {
    GET_PROGRAMS: () => '/programs',
    GET_PROGRAM: (id) => `/programs/${id}`,
    GET_STAGES: () => '/programStages',
    GET_STAGE: (id) => `/programStages/${id}`,
    GET_INDICATOR: (id) => `/programIndicators/${id}`
  },
  DATA_ELEMENTS: {
    GET_DATA_ELEMENTS: () => '/dataElements'
  },
  RELATIONSHIPS: {
    GET_TYPES: () => '/relationshipTypes'
  },
  OPTIONS: {
    GET_SETS: () => '/optionSets',
    GET_SET: (id) => `/optionSets/${id}`,
    GET_OPTIONS: () => '/options'
  },
  SYSTEM: {
    GET_IDS: () => '/system/id'
  }
}

