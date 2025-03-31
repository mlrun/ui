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
// format data in accordance with ISO 8601 with ms

export function makeUID(length) {
  let result = ''
  const characters = 'abcdef0123456789'
  const charactersLength = characters.length

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }

  return result
}

export const generateArtifacts = existingArtifacts => {
  const artifactKinds = ['dataset', 'model', 'document', 'artifact']
  const getArtifactTemplate = i => ({
    kind: artifactKinds[i % 4],
    metadata: {
      project: 'auto-generated-data',
      uid: makeUID(40),
      key: 'test',
      iter: 0,
      tree: makeUID(32),
      updated: new Date(Date.now() - Math.random() * 600000 - 100000).toISOString(),
      created: new Date(Date.now() - Math.random() * 600000 - 700000).toISOString(),
      tag: 'latest'
    },
    spec: {
      target_path: 'v3io://artifacts/image_mock_data.png',
      size: 20480,
      db_key: 'test',
      producer: {
        name: 'download',
        kind: 'run',
        uri: 'cat-vs-dog-classification/9723e5a30b0e43b0b7cfda098445c446',
        owner: 'admin'
      },
      sources: [
        {
          name: 'archive_url',
          path: 'https://s3.wasabisys.com/iguazio/data/image-classification/catsndogs.zip'
        }
      ]
    },
    status: {}
  })
  const newArtifactsWithDiffKeys = new Array(40000).fill().map((_, i) => {
    const artifact = getArtifactTemplate(i)

    artifact.metadata.key = artifact.kind + artifact.metadata.uid
    artifact.spec.db_key = artifact.metadata.key

    return artifact
  })

  const newArtifactsWithSameKey = new Array(12000).fill().map((_, i) => {
    const artifact = getArtifactTemplate(i)

    artifact.metadata.key = artifact.kind + '-many-tags'
    artifact.spec.db_key = artifact.metadata.key
    artifact.metadata.tag = [0, 1, 2, 3].includes(i) ? 'latest' : makeUID(40)
    artifact.metadata.updated = new Date().toISOString()
    artifact.metadata.created = new Date().toISOString()

    return artifact
  })

  existingArtifacts.artifacts = [
    ...existingArtifacts.artifacts,
    ...newArtifactsWithDiffKeys,
    ...newArtifactsWithSameKey
  ]
}

export const generateFunctions = existingFunctions => {
  const getFunctionTemplate = () => ({
    kind: 'job',
    metadata: {
      labels: {},
      name: 'function' + makeUID(40),
      tag: 'latest',
      project: 'auto-generated-data',
      hash: makeUID(40),
      updated: new Date(Date.now() - Math.random() * 600000 - 10000).toISOString()
    },
    spec: {
      args: [],
      build: {
        base_image: '',
        commands: [],
        functionSourceCode:
          'ZGVmIGhhbmRsZXIoY29udGV4dCk6CiAgICBjb250ZXh0LmxvZ2dlci5pbmZvKCdIZWxsbyB3b3JsZCcp',
        image: ''
      },
      default_handler: 'dg',
      description: '',
      env: [],
      image: 'mlrun/mlrun',
      volume_mounts: [],
      volumes: [],
      resources: {
        limits: {},
        requests: {}
      },
      secret_sources: []
    },
    status: null
  })

  const newFunctionsWithDiffNames = new Array(10000).fill().map(() => {
    return getFunctionTemplate()
  })

  const newArtifactsWithSameKey = new Array(3000).fill().map((_, i) => {
    const newFunction = getFunctionTemplate()

    newFunction.metadata.name = 'function-many-tags'
    newFunction.metadata.tag = i === 0 ? 'latest' : makeUID(40)
    newFunction.metadata.updated = new Date().toISOString()

    return newFunction
  })

  existingFunctions.funcs = [
    ...existingFunctions.funcs,
    ...newFunctionsWithDiffNames,
    ...newArtifactsWithSameKey
  ]
}

export const generateRuns = existingRuns => {
  const getRunTemplate = () => ({
    kind: 'run',
    metadata: {
      name: 'job' + makeUID(40),
      uid: makeUID(40),
      iteration: 0,
      project: 'auto-generated-data',
      labels: {
        v3io_user: 'admin',
        owner: 'admin',
        kind: 'job',
        generated: 'auto',
        workflow: '1f8b29a5-cdab-4b84-aad7-7f9bc20daf0b'
      },
      annotations: {}
    },
    spec: {
      function: 'cat-vs-dog-classification/sef@9e535e175aebfbff61e4ca85506813e3287d1aab',
      log_level: 'info',
      parameters: {},
      handler: 'dg',
      outputs: [],
      output_path:
        'v3io:///projects/cat-vs-dog-classification/artifacts/f5751299ee21476e897dfd90d94c49c4',
      inputs: {},
      hyperparams: {},
      hyper_param_options: {},
      data_stores: []
    },
    status: {
      state: 'running',
      results: {},
      start_time: new Date(Date.now() - Math.random() * 600000 - 70000).toISOString(),
      last_update: new Date(Date.now() - Math.random() * 600000 - 60000).toISOString(),
      artifacts: []
    }
  })

  const newJobs = new Array(10000).fill().map(() => {
    return getRunTemplate()
  })

  const newRuns = new Array(3000).fill().map(() => {
    const run = getRunTemplate()

    run.metadata.name = 'job-many-runs'
    run.status.last_update = new Date().toISOString()
    run.status.start_time = new Date().toISOString()

    return run
  })

  existingRuns.runs = [...existingRuns.runs, ...newRuns, ...newJobs]
}

export const generateAlerts = existingAlerts => {
  const alerts = new Array(10000).fill().map((_, i) => {
    return {
      id: 1000 + i,
      name: 'alert' + makeUID(10),
      project: 'auto-generated-data',
      severity: 'low',
      activation_time: new Date(Date.now() - Math.random() * 600000 - 170000).toISOString(),
      entity_id: 'cat-vs-dog-classification.5a5b6f990d7b44ed96580e21cfcc433b',
      entity_kind: 'job',
      criteria: {
        count: 2,
        period: '10m'
      },
      event_kind: 'failed',
      number_of_events: 2,
      notifications: [
        {
          kind: 'webhook',
          err: '',
          summary: {
            failed: 0,
            succeeded: 2
          }
        }
      ],
      reset_time: new Date(Date.now() - Math.random() * 600000 - 60000).toISOString()
    }
  })

  existingAlerts.activations = [...existingAlerts.activations, ...alerts]
}
