/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import { mainHttpClient } from '../../../../src/httpClient'
import { expect } from 'chai'
import { v4 as uuidv4 } from 'uuid'
import { TAG_LATEST } from '../../../../src/constants'

const REACT_APP_MLRUN_API_URL = 'http://localhost:3000/api/v1'
const REACT_APP_MLRUN_API_URL_V2 = 'http://localhost:3000/api/v2'

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
    metadata: {
      credentials: {
        access_key: '$generate'
      }
    },
    spec: { preemption_mode: '', priority_class_name: '' }
  }
}

export const deleteAPIMLProject =  async (
    driver,
    mlProjectName,
    expectedStatusCode,
    deleteNonEmpty = false
  ) => {
    await driver.sleep(1000)
    await mainHttpClient
      .delete(
        `${REACT_APP_MLRUN_API_URL}/projects/${mlProjectName}`,
        deleteNonEmpty && {
          headers: {
            'x-mlrun-deletion-strategy': 'cascade'
          }
        }
      )
      .then(res => {
        expect(res.status).equal(expectedStatusCode)
      })
      .catch(error => {
        if (error.response?.status === 412) {
          deleteAPIMLProject(
            driver,
            mlProjectName,
            expectedStatusCode,
            true
          )
        }
      })
  }

export const deleteAPIFeatureSet = async (
    projectName,
    featureSetName,
    expectedStatusCode
  ) => {
    await mainHttpClient
      .delete(
        `${REACT_APP_MLRUN_API_URL}/projects/${projectName}/feature-sets/${featureSetName}`
      )
      .then(res => {
        expect(res.status).equal(expectedStatusCode)
      })
  }

export const deleteAPIFeatureVector = async (
    projectName,
    featureVectorName,
    expectedStatusCode
  ) => {
    await mainHttpClient
      .delete(
        `${REACT_APP_MLRUN_API_URL}/projects/${projectName}/feature-vectors/${featureVectorName}`
      )
      .then(res => {
        expect(res.status).equal(expectedStatusCode)
      })
  }

export const deleteAPIFunction = async (
    projectName,
    functionName,
    expectedStatusCode
  ) => {
    await mainHttpClient
      .delete(
        `${REACT_APP_MLRUN_API_URL_V2}/projects/${projectName}/functions/${functionName}`
      )
      .then(res => {
        expect(res.status).equal(expectedStatusCode)
      })
  }

export const deleteAPISchedule = async (
    projectName,
    scheduleName,
    expectedStatusCode
  ) => {
    await mainHttpClient
      .delete(
        `${REACT_APP_MLRUN_API_URL}/projects/${projectName}/schedules/${scheduleName}`
      )
      .then(res => {
        expect(res.status).equal(expectedStatusCode)
      })
  }

export const deleteAPIArtifact = async (
    projectName,
    artifactName,
    expectedStatusCode
  ) => {
    await mainHttpClient
      .delete(
        `${REACT_APP_MLRUN_API_URL}/artifacts?project=${projectName}&name=${artifactName}`
      )
      .then(res => {
        expect(res.status).equal(expectedStatusCode)
      })
  }

export const createAPIMLProject = async (mlProjectName, expectedStatusCode) => {
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
  }

export const createAPISchedule = async (
    mlProjectName,
    mlScheduleName,
    expectedStatusCode
  ) => {
    const data = newJobTemplate
    data.task.metadata.name = mlScheduleName
    data.task.metadata.project = mlProjectName
    data.schedule = '0 0 1 * *'
    await mainHttpClient
      .post(`${REACT_APP_MLRUN_API_URL}/submit_job`, data)
      .then(res => {
        expect(res.status).equal(expectedStatusCode)
      })
  }

export const createAPIFunction = async (
    mlProjectName,
    mlFunctionKind,
    mlFunctionTag,
    mlFunctionName,
    expectedStatusCode
  ) => {
    const data = {
      kind: mlFunctionKind,
      metadata: {
        credentials: {
          access_key: '$generate'
        },
        labels: {},
        name: mlFunctionName,
        tag: mlFunctionTag,
        project: mlProjectName
      },
      spec: {
        priority_class_name: 'igz-workload-medium',
        preemption_mode: 'prevent',
        graph: {
          kind: 'router'
        }
      }
    }

    await mainHttpClient
      .post(
        `${REACT_APP_MLRUN_API_URL}/projects/${mlProjectName}/functions/${mlFunctionName}?tag=&versioned=true`,
        data
      )
      .then(res => {
        expect(res.status).equal(expectedStatusCode)
      })
  }

export const createAPIFeatureSet = async (
    mlProjectName,
    mlFeatureSetName,
    expectedStatusCode
  ) => {
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
  }

export const createAPIFeatureVector = async (
    mlProjectName,
    mlFeatureVectorName,
    expectedStatusCode
  ) => {
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
  }

export const createAPIArtifact = async (
    mlProjectName,
    mlArtifactName,
    mlArtifactTag,
    mlArtifactType,
    expectedStatusCode
  ) => {
    const uid = uuidv4()

    const data = {
      kind: mlArtifactType === 'file' ? '' : mlArtifactType,
      metadata: {
        labels:{},
        key: mlArtifactName,
        project: mlProjectName,
        tree: uid,
        tag: mlArtifactTag
      },
      project: mlProjectName,
      spec: {
        db_key: mlArtifactName,
        producer: {
          kind: 'api',
          uri: 'localhost:3000'
        },
        target_path:''
      },
      status: {},
      uid: uid
    }

    if (mlArtifactType === 'model') {
      data.feature_stats = {
        amount_avg_2h: {
          count: 7513,
          mean: 37.78356759394827,
          std: 89.9085313117771,
          min: -52.58999999999999,
          max: 3843.72
        }
      }
      data.inputs = [
        {
          name: 'amount_max_2h',
          value_type: 'float'
        }
      ]
    }

    await mainHttpClient
      .post(
        `${REACT_APP_MLRUN_API_URL_V2}/projects/${mlProjectName}/artifacts`,
        data
      )
      .then(res => {
        expect(res.status).equal(expectedStatusCode)
      })
  }

export const getProjects = async () => {
    const res = await mainHttpClient.get(`${REACT_APP_MLRUN_API_URL}/projects`)
  
    return res.data.projects
  }
