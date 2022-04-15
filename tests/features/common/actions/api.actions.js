import { mainHttpClient } from '../../../../src/httpClient'
import { expect } from 'chai'
import { v4 as uuidv4 } from 'uuid'
import { TAG_LATEST } from '../../../../src/constants'

const REACT_APP_MLRUN_API_URL = 'http://localhost:3000/api/v1'

const newJobTemplate = {
  task: {
    spec: {
      parameters: {},
      inputs: {},
      hyperparams: {},
      secret_sources: [],
      param_file: '',
      tuning_strategy: 'list',
      function: 'hub://aggregate',
      handler: 'aggregate',
      input_path: '',
      output_path: 'v3io:///projects/{{run.project}}/artifacts/{{run.uid}}'
    },
    metadata: {
      labels: {}
    }
  },
  function: {
    metadata: {},
    spec: {}
  }
}

const action = {
  deleteAPIMLProject: async function(
    driver,
    mlProjectName,
    expectedStatusCode
  ) {
    await driver.sleep(1000)
    await mainHttpClient
      .delete(`${REACT_APP_MLRUN_API_URL}/projects/${mlProjectName}`)
      .then(res => {
        expect(res.status).equal(expectedStatusCode)
      })
  },
  deleteAPIFeatureSet: async function(
    projectName,
    featureSetName,
    expectedStatusCode
  ) {
    await mainHttpClient
      .delete(
        `${REACT_APP_MLRUN_API_URL}/projects/${projectName}/feature-sets/${featureSetName}`
      )
      .then(res => {
        expect(res.status).equal(expectedStatusCode)
      })
  },
  deleteAPIFeatureVector: async function(
    projectName,
    featureVectorName,
    expectedStatusCode
  ) {
    await mainHttpClient
      .delete(
        `${REACT_APP_MLRUN_API_URL}/projects/${projectName}/feature-vectors/${featureVectorName}`
      )
      .then(res => {
        expect(res.status).equal(expectedStatusCode)
      })
  },
  deleteAPIFunction: async function(
    projectName,
    functionName,
    expectedStatusCode
  ) {
    await mainHttpClient
      .delete(
        `${REACT_APP_MLRUN_API_URL}projects/${projectName}/functions/${functionName}`
      )
      .then(res => {
        expect(res.status).equal(expectedStatusCode)
      })
  },
  deleteAPISchedule: async function(
    projectName,
    scheduleName,
    expectedStatusCode
  ) {
    await mainHttpClient
      .delete(
        `${REACT_APP_MLRUN_API_URL}/projects/${projectName}/schedules/${scheduleName}`
      )
      .then(res => {
        expect(res.status).equal(expectedStatusCode)
      })
  },
  deleteAPIArtifact: async function(
    projectName,
    artifactName,
    expectedStatusCode
  ) {
    await mainHttpClient
      .delete(
        `${REACT_APP_MLRUN_API_URL}/artifacts?project=${projectName}&name=${artifactName}`
      )
      .then(res => {
        expect(res.status).equal(expectedStatusCode)
      })
  },
  createAPIMLProject: async function(mlProjectName, expectedStatusCode) {
    const project_data = {
      metadata: {
        name: mlProjectName
      },
      spec: {
        description: 'automation test description'
      }
    }

    await mainHttpClient
      .post(`${REACT_APP_MLRUN_API_URL}/projects`, project_data)
      .then(res => {
        expect(res.status).equal(expectedStatusCode)
      })
  },

  createAPISchedule: async function(
    mlProjectName,
    mlScheduleName,
    expectedStatusCode
  ) {
    const data = newJobTemplate
    data.task.metadata.name = mlScheduleName
    data.task.metadata.project = mlProjectName
    data.schedule = '0 0 * * *'
    await mainHttpClient
      .post(`${REACT_APP_MLRUN_API_URL}/submit_job`, data)
      .then(res => {
        expect(res.status).equal(expectedStatusCode)
      })
  },
  createAPIFunction: async function(
    mlProjectName,
    mlFunctionName,
    expectedStatusCode
  ) {
    const data = {
      kind: 'job',
      metadata: {
        credentials: {
          access_key: '$generate'
        },
        labels: {},
        name: mlFunctionName,
        tag: '',
        project: mlProjectName
      },
      spec: {}
    }

    await mainHttpClient
      .post(
        `${REACT_APP_MLRUN_API_URL}/func/${mlProjectName}/${mlFunctionName}?tag=&versioned=true`,
        data
      )
      .then(res => {
        expect(res.status).equal(expectedStatusCode)
      })
  },
  createAPIFeatureSet: async function(
    mlProjectName,
    mlFeatureSetName,
    expectedStatusCode
  ) {
    const data = {
      kind: 'FeatureSet',
      metadata: {
        labels: {},
        name: mlFeatureSetName,
        tag: TAG_LATEST
      },
      spec: {
        entities: [{ name: 'entity', value_type: 'str' }],
        features: []
      },
      status: {}
    }

    await mainHttpClient
      .post(
        `${REACT_APP_MLRUN_API_URL}/projects/${mlProjectName}/feature-sets`,
        data
      )
      .then(res => {
        expect(res.status).equal(expectedStatusCode)
      })
  },
  createAPIFeatureVector: async function(
    mlProjectName,
    mlFeatureVectorName,
    expectedStatusCode
  ) {
    const data = {
      kind: 'FeatureVector',
      metadata: {
        name: mlFeatureVectorName,
        project: mlProjectName,
        tag: TAG_LATEST,
        labels: {}
      },
      spec: { description: '', features: [], label_feature: '' },
      status: {}
    }

    await mainHttpClient
      .post(
        `${REACT_APP_MLRUN_API_URL}/projects/${mlProjectName}/feature-vectors`,
        data
      )
      .then(res => {
        expect(res.status).equal(expectedStatusCode)
      })
  },
  createAPIArtifact: async function(
    mlProjectName,
    mlArtifactName,
    mlArtifactType,
    expectedStatusCode
  ) {
    const uid = uuidv4()
    const data = {
      uid: uid,
      key: mlArtifactName,
      db_key: mlArtifactName,
      tree: uid,
      description: '',
      kind: mlArtifactType,
      project: mlProjectName,
      producer: {
        kind: 'api',
        uri: 'localhost:3000'
      }
    }
    await mainHttpClient
      .post(
        `${REACT_APP_MLRUN_API_URL}/artifact/${mlProjectName}/${uid}/${mlArtifactName}`,
        data
      )
      .then(res => {
        expect(res.status).equal(expectedStatusCode)
      })
  },
  getProjects: () => {
    return mainHttpClient
      .get(`${REACT_APP_MLRUN_API_URL}/projects`)
      .then(res => {
        return res.data.projects
      })
  }
}

module.exports = action
