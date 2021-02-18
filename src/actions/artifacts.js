import artifactsApi from '../api/artifacts-api'
import {
  CLOSE_ARTIFACT_PREVIEW,
  FETCH_ARTIFACTS_BEGIN,
  FETCH_ARTIFACTS_FAILURE,
  FETCH_ARTIFACTS_SUCCESS,
  FETCH_DATASETS_BEGIN,
  FETCH_DATASETS_FAILURE,
  FETCH_DATASETS_SUCCESS,
  FETCH_FILES_BEGIN,
  FETCH_FILES_FAILURE,
  FETCH_FILES_SUCCESS,
  FETCH_MODELS_BEGIN,
  FETCH_MODELS_FAILURE,
  FETCH_MODELS_SUCCESS,
  REMOVE_ARTIFACTS,
  REMOVE_DATASETS,
  SHOW_ARTIFACT_PREVIEW,
  SET_ARTIFACT_FILTER,
  REMOVE_FILES,
  REMOVE_MODELS,
  FETCH_MODEL_ENDPOINTS_BEGIN,
  FETCH_MODEL_ENDPOINTS_FAILURE,
  FETCH_MODEL_ENDPOINTS_SUCCESS
} from '../constants'
import { filterArtifacts } from '../utils/filterArtifacts'

const artifactsAction = {
  closeArtifactsPreview: item => ({
    type: CLOSE_ARTIFACT_PREVIEW,
    payload: item
  }),
  fetchArtifacts: item => dispatch => {
    dispatch(artifactsAction.fetchArtifactsBegin())

    return artifactsApi
      .getArtifacts(item)
      .then(({ data }) => {
        let artifacts = filterArtifacts(data.artifacts)

        dispatch(artifactsAction.fetchArtifactsSuccess(artifacts))

        return artifacts
      })
      .catch(err => {
        dispatch(artifactsAction.fetchArtifactsFailure(err))
      })
  },
  fetchArtifactsBegin: () => ({
    type: FETCH_ARTIFACTS_BEGIN
  }),
  fetchArtifactsFailure: error => ({
    type: FETCH_ARTIFACTS_FAILURE,
    payload: error
  }),
  fetchArtifactsSuccess: artifactsList => ({
    type: FETCH_ARTIFACTS_SUCCESS,
    payload: artifactsList
  }),
  fetchDataSets: project => dispatch => {
    dispatch(artifactsAction.fetchDataSetsBegin())

    return artifactsApi
      .getArtifactsDataSets(project)
      .then(({ data }) => {
        let dataSets = filterArtifacts(data.artifacts)

        dispatch(artifactsAction.fetchDataSetsSuccess(dataSets))

        return dataSets
      })
      .catch(err => {
        dispatch(artifactsAction.fetchDataSetsFailure(err))
      })
  },
  fetchDataSetsBegin: () => ({
    type: FETCH_DATASETS_BEGIN
  }),
  fetchDataSetsFailure: () => ({
    type: FETCH_DATASETS_FAILURE
  }),
  fetchDataSetsSuccess: dataSets => ({
    type: FETCH_DATASETS_SUCCESS,
    payload: dataSets
  }),
  fetchFiles: project => dispatch => {
    dispatch(artifactsAction.fetchFilesBegin())

    return artifactsApi
      .getArtifactsFiles(project)
      .then(({ data }) => {
        let files = filterArtifacts(data.artifacts)

        dispatch(artifactsAction.fetchFilesSuccess(files))

        return files
      })
      .catch(err => {
        dispatch(artifactsAction.fetchFilesFailure(err))
      })
  },
  fetchFilesBegin: () => ({
    type: FETCH_FILES_BEGIN
  }),
  fetchFilesFailure: () => ({
    type: FETCH_FILES_FAILURE
  }),
  fetchFilesSuccess: files => ({
    type: FETCH_FILES_SUCCESS,
    payload: files
  }),
  fetchModelEndpoints: item => dispatch => {
    dispatch(artifactsAction.fetchModelEndpointsBegin())

    return artifactsApi
      .getModelEndpoints(item)
      .then(({ data }) => {
        data = {
          endpoints: [
            {
              endpoint: {
                kind: 'model-endpoint',
                metadata: {
                  project: 'test',
                  tag: 'v44',
                  labels: {
                    L: 20,
                    Q: 66,
                    r: 16,
                    j: 71
                  }
                },
                spec: {
                  model: 'model_71',
                  function: 'function_91',
                  model_class: 'classifier'
                },
                status: {
                  state: 'active'
                },
                id: 'test.8d6a27af1ec985efea9d3e4b1d8d08a7'
              },
              first_request: null,
              last_request: null,
              accuracy: null,
              error_count: null,
              alert_count: null,
              drift_status: null,
              metrics: null,
              features: null
            },
            {
              endpoint: {
                kind: 'model-endpoint',
                metadata: {
                  project: 'test',
                  tag: 'v53',
                  labels: {
                    q: 20,
                    p: 64,
                    D: 41,
                    s: 59
                  }
                },
                spec: {
                  model: 'model_70',
                  function: 'function_66',
                  model_class: 'classifier'
                },
                status: {
                  state: 'active'
                },
                id: 'test.878b8f085a1e6ee5a0545a8655016846'
              },
              first_request: null,
              last_request: null,
              accuracy: null,
              error_count: null,
              alert_count: null,
              drift_status: null,
              metrics: null,
              features: null
            },
            {
              endpoint: {
                kind: 'model-endpoint',
                metadata: {
                  project: 'test',
                  tag: 'v70',
                  labels: {
                    f: 65,
                    v: 10,
                    s: 36,
                    o: 47
                  }
                },
                spec: {
                  model: 'model_95',
                  function: 'function_90',
                  model_class: 'classifier'
                },
                status: {
                  state: 'active'
                },
                id: 'test.b8e161209ce64611437d95bf56129a47'
              },
              first_request: null,
              last_request: null,
              accuracy: null,
              error_count: null,
              alert_count: null,
              drift_status: null,
              metrics: null,
              features: null
            },
            {
              endpoint: {
                kind: 'model-endpoint',
                metadata: {
                  project: 'test',
                  tag: 'v31',
                  labels: {
                    v: 72,
                    m: 56,
                    K: 50,
                    U: 33
                  }
                },
                spec: {
                  model: 'model_33',
                  function: 'function_13',
                  model_class: 'classifier'
                },
                status: {
                  state: 'active'
                },
                id: 'test.0fd0a8e6da0c0b917022617df7f9c874'
              },
              first_request: null,
              last_request: null,
              accuracy: null,
              error_count: null,
              alert_count: null,
              drift_status: '-1',
              metrics: null,
              features: null
            },
            {
              endpoint: {
                kind: 'model-endpoint',
                metadata: {
                  project: 'test',
                  tag: 'v78',
                  labels: {
                    u: 91,
                    t: 38,
                    g: 46,
                    H: 19
                  }
                },
                spec: {
                  model: 'model_18',
                  function: 'function_45',
                  model_class: 'classifier'
                },
                status: {
                  state: 'active'
                },
                id: 'test.6f354925a1398dcfa91dd863c478538a'
              },
              first_request: null,
              last_request: null,
              accuracy: null,
              error_count: null,
              alert_count: null,
              drift_status: null,
              metrics: null,
              features: null
            }
          ]
        }
        dispatch(artifactsAction.fetchModelEndpointsSuccess(data.endpoints))

        return data.endpoints
      })
      .catch(err => {
        dispatch(artifactsAction.fetchModelEndpointsFailure(err))
      })
  },
  fetchModelEndpointsBegin: () => ({
    type: FETCH_MODEL_ENDPOINTS_BEGIN
  }),
  fetchModelEndpointsFailure: () => ({
    type: FETCH_MODEL_ENDPOINTS_FAILURE
  }),
  fetchModelEndpointsSuccess: models => ({
    type: FETCH_MODEL_ENDPOINTS_SUCCESS,
    payload: models
  }),
  fetchModels: project => dispatch => {
    dispatch(artifactsAction.fetchModelsBegin())

    return artifactsApi
      .getArtifactsModels(project)
      .then(({ data }) => {
        let models = filterArtifacts(data.artifacts)

        dispatch(artifactsAction.fetchModelsSuccess(models))

        return data.artifacts
      })
      .catch(err => {
        dispatch(artifactsAction.fetchModelsFailure(err))
      })
  },
  fetchModelsBegin: () => ({
    type: FETCH_MODELS_BEGIN
  }),
  fetchModelsFailure: () => ({
    type: FETCH_MODELS_FAILURE
  }),
  fetchModelsSuccess: models => ({
    type: FETCH_MODELS_SUCCESS,
    payload: models
  }),
  removeArtifacts: () => ({
    type: REMOVE_ARTIFACTS
  }),
  removeDataSets: () => ({
    type: REMOVE_DATASETS
  }),
  removeFiles: () => ({
    type: REMOVE_FILES
  }),
  removeModels: () => ({
    type: REMOVE_MODELS
  }),
  setArtifactFilter: filter => ({
    type: SET_ARTIFACT_FILTER,
    payload: filter
  }),
  showArtifactsPreview: item => ({
    type: SHOW_ARTIFACT_PREVIEW,
    payload: item
  })
}

export default artifactsAction
