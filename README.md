
# DHIS2-API-Wrapper

Javascript API wrapper around DHIS2. It handles authentication automatically given user credentials.

## Installation

This package is not currently in the npm ecosystem, so in order to install it in a project, it should be added as a git repository.

```{json}
  {
    "dependencies": {
      "dhis2-api-wrapper": "git+ssh://git@github.com/WISCENTD-UPC/dhis2-api-wrapper.git#develop"
    }
  }
```

After configuring the package.json ```{bash}npm install``` should be executed

## Usage

Creation of the api wrapper:

```{Javascript}
  const API = require('dhis2-api-wrapper')
  const api = new API({
    baseURL: '',
    credentials: {
      user: 'username',
      password: 'password'
    },
    debug: true // Log requests
  })
```

### API Doc

+ api.getResources(): Get a list of all the resources avaliable.

+ api.resourcesSummary(): Print a list with all the resources avaliable and their URLs.

+ api.getOrganisationUnits(query = {}): Get organisation units. Additional filters can be passed as an object that is going to be added as query parameters.

+ api.getOrganisationUnit(id): Get additional information of an organisation unit given its ID.

+ api.getOrganisationUnitsFromParent(id): Get an organisation unit by its ID and all its descendants.

+ api.getTrackedEntityTypes(): Get the different types of tracked entities defined.

+ api.getTrackedEntityInstances(organisationUnitID, filters = {}): Get tracked entity instances asociated with an organisation unit. Additional query filters can be added, if needed, as a second argument

+ api.getTrackedEntityInstance(id): Get additional information of a tracked entity instance.

+ api.getTrackedEntitiesAttributes(): Get all attributes defined for tracked entity instances.

+ api.getEventsReports(): Get events reports

+ api.programsSummary(): Print a list with all avaliable programs and their URLs.

+ api.getPrograms(): Get all the programs

+ api.getProgram(id): Get additional information of a program given its ID.

+ api.getProgramStages(): Get all program stages

+ api.getProgramStage(id): Get additional information of a program stage given its ID

+ api.getProgramIndicator(id): Get additional information of a program indeicator given its ID

+ api.getTrackedEntityEvents(id): Get events of a tracked entity instance given its ID.

+ api.getDataElements(): Get all data elements avaliable.

## Testing

```{bash}
npm test
```

