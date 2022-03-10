const axios = require('axios')
const fs = require('fs-extra')
const yaml = require('js-yaml')
const lodash = require('lodash')

const baseMlRunUrl =
  'http://mlrun-api-ingress.default-tenant.app.vmdev36.lab.iguazeng.com/api/'
// const baseMlRunUrl =
//   'http://mlrun-api-ingress.default-tenant.app.dev35.lab.iguazeng.com/api/'

const baseNuclioUrl =
  'http://nuclio-ingress.default-tenant.app.vmdev36.lab.iguazeng.com/api/'
// const baseNuclioUrl =
//   'http://nuclio-ingress.default-tenant.app.dev35.lab.iguazeng.com/api/'
const githubFunctionsUrl = 'https://github.com/mlrun/functions/tree/master'
const githubYamlUrl =
  'https://raw.githubusercontent.com/mlrun/functions/master/'
const saveFolder = 'data'
const igzApiUrl =
  'platform-api.default-tenant.app.vmdev36.lab.iguazeng.com/api/'
// const igzApiUrl =
//   'http://platform-api.default-tenant.app.dev35.lab.iguazeng.com/api/'

const fetchData = async (host, endpoint = '') => {
  try {
    const response = await axios.get(`${host}${endpoint}`)

    return response.data
  } catch (e) {
    if (e.response && e.response.config) {
      console.log(`error: ${e.response.status}, ${e.response.config.url}`)
    } else {
      console.log('error', e)
    }
  }
}

const fetchJsons = async (list, host, endpointStart, endpointEnd = '') => {
  const response = await list.map(async item =>
    fetchData(`${host}${endpointStart}${item}${endpointEnd}`)
  )

  return await Promise.all(response)
}

const fetchJsonsPerProject = async (
  projectsList,
  host,
  endpointStart,
  endpointEnd = ''
) => {
  const promises = await projectsList.map(async project => {
    const data = await fetchData(
      host,
      `${endpointStart}${project}${endpointEnd}`
    )
    return [project, data]
  })
  const response = await Promise.all(promises)

  return response.reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})
}

const convertFromArrayToJson = arr => {
  const key = Object.keys(arr[0] || [])[0]
  let result

  if (key) {
    result = { [key]: [] }

    arr.forEach(item => {
      if (Object.keys(item) && Object.keys(item)[0] === key) {
        if (Array.isArray(item[key])) {
          result[key] = [...result[key], ...item[key]]
        } else if (typeof item[key] === 'object') {
          result[key].push(item[key])
        }
      }
    })
  }

  return result || {}
}

const fetchRuns = async (list, host, endpointStart, endpointEnd = '') => {
  const chunks = lodash.chunk(list, 20)
  let responseData = []

  const fetchChunk = async arr => {
    const response = await arr.map(async item => {
      return await fetchData(
        `${host}${endpointStart}${item.project}${endpointEnd}${item.uid}`
      )
    })
    const data = await Promise.all(response)
    responseData = [...responseData, ...data]
  }

  for (let i = 0; i < chunks.length; i++) {
    await fetchChunk(chunks[i])
  }

  return responseData
}

const convertRuns = data =>
  data.runs.map(run => ({
    project: run.metadata.project,
    uid: run.metadata.uid
  }))

const fetchArtifactsLogs = arr =>
  arr.map(item => ({
    project: item.metadata.project,
    uid: item.metadata.uid
  }))

// const filterData = data => {
//   const result = []
//
//   data.forEach(item => {
//     if (item.spec.analysis) result.push(Object.values(item.spec.analysis))
//   })
//
//   return result
// }

const clearDataFolder = async location => await fs.emptyDir(location)

const saveDataToJson = (location, data) =>
  fs.writeJson(location, data, { spaces: 2 })

const fetchYamlFunctions = async (functions, startUrl, endUrl) => {
  await fs.ensureDir('data/mlrun/functions')

  for (let func of functions) {
    if (func !== 'LICENSE') {
      await fs.ensureDir(`data/mlrun/functions/${func}`)
      try {
        const data = await fetchData(startUrl, `${func}${endUrl}`)

        if (data) {
          const yamlStr = await yaml.safeDump(data)
          await fs.writeFile(
            `./data/mlrun/functions/${func}/${func}.yaml`,
            yamlStr,
            'utf8'
          )
        }
      } catch (e) {
        console.log('Failed: ', e)
      }
    }
  }
}

const getPipelineIds = data => {
  const keys = Object.keys(data)

  return lodash.flatten(keys.map(key => data[key].runs)).map(item => item.id)
}

const getIgzRelations = (users, relations = {}) => {
  const result = lodash.cloneDeep(relations)

  users.forEach(user => {
    const tmpItem = Array.isArray(user.data) ? user.data[0] : user.data

    const data = user.included.map(item => ({
      type: item.type,
      id: item.id,
      relationships: item.relationships || null
    }))

    if (result[tmpItem.id]) {
      result[tmpItem.id] = [...result[tmpItem.id], ...data]
    } else {
      result[tmpItem.id] = data
    }
  })

  return result
}

const fetchAllLogs = async artifactLogs => {
  const chunks = lodash.chunk(artifactLogs, 20)
  let responseData = []

  const fetchLogs = async arr => {
    const response = await arr.map(async ({ project, uid }) => ({
      uid,
      log: await fetchLog(baseMlRunUrl, project, uid)
    }))
    const data = await Promise.all(response)
    responseData = [...responseData, ...data]
  }

  for (let i = 0; i < chunks.length; i++) {
    await fetchLogs(chunks[i])
  }

  return responseData
}

const fetchLog = async (host, projectName, uid) => {
  try {
    const response = await axios.get(`${host}log/${projectName}/${uid}`)

    return response.data
  } catch (e) {
    if (e.config && e.config.url) {
      console.log(e.config.url)
    } else {
      console.log(e)
    }
  }
}

const synchronizeBackend = async () => {
  const { projects } = await fetchData(baseMlRunUrl, 'projects')
  const projectNames = projects.map(project => project.metadata.name)

  const { project_summaries } = await fetchData(
    baseMlRunUrl,
    'project-summaries'
  )
  const summaries = { project_summaries }

  const frontendSpec = await fetchData(baseMlRunUrl, 'frontend-spec')
  const artifactsArr = await fetchJsons(
    projectNames,
    baseMlRunUrl,
    'artifacts?project=',
    '&tag=*'
  )
  const artifacts = convertFromArrayToJson(artifactsArr)

  const featureSetsArr = await fetchJsons(
    projectNames,
    baseMlRunUrl,
    'projects/',
    '/feature-sets'
  )
  const featureSets = convertFromArrayToJson(featureSetsArr)

  const schedulesArr = await fetchJsons(
    projectNames,
    baseMlRunUrl,
    'projects/',
    '/schedules'
  )
  const schedules = convertFromArrayToJson(schedulesArr)

  const featuresArr = await fetchJsons(
    projectNames,
    baseMlRunUrl,
    'projects/',
    '/features'
  )
  const features = convertFromArrayToJson(featuresArr)

  const entitiesArr = await fetchJsons(
    projectNames,
    baseMlRunUrl,
    'projects/',
    '/entities'
  )
  const entities = convertFromArrayToJson(entitiesArr)

  const featureVectorsArr = await fetchJsons(
    projectNames,
    baseMlRunUrl,
    'projects/',
    '/feature-vectors'
  )
  const featureVectors = convertFromArrayToJson(featureVectorsArr)

  const artifactTags = await fetchJsons(
    projectNames,
    baseMlRunUrl,
    'projects/',
    '/artifact-tags'
  )
  const functionsArr = await fetchJsons(
    projectNames,
    baseMlRunUrl,
    'funcs?project='
  )
  const functions = convertFromArrayToJson(functionsArr)

  const runsData = await fetchJsons(projectNames, baseMlRunUrl, 'runs?project=')
  const runs = convertFromArrayToJson(runsData)
  const runsUid = convertRuns(runs)
  const runProjectUidData = await fetchRuns(runsUid, baseMlRunUrl, 'run/', '/')
  const runProjectUid = convertFromArrayToJson(runProjectUidData)

  const pipelines = await fetchJsonsPerProject(
    projectNames,
    baseMlRunUrl,
    'projects/',
    '/pipelines'
  )
  const pipelineIds = getPipelineIds(pipelines)
  const pipelineIdsData = await fetchJsons(
    pipelineIds,
    baseMlRunUrl,
    'pipelines/'
  )

  const secretKeys = await fetchJsonsPerProject(
    projectNames,
    baseMlRunUrl,
    'projects/',
    '/secret-keys?provider=kubernetes'
  )

  const artifactsLogs = await fetchArtifactsLogs(runs.runs)
  const logs = await fetchAllLogs(artifactsLogs)

  await clearDataFolder(saveFolder)

  saveDataToJson('./data/projects.json', { projects })
  saveDataToJson('./data/summary.json', summaries)
  saveDataToJson('./data/frontendSpec.json', frontendSpec)
  saveDataToJson('./data/artifacts.json', artifacts)
  saveDataToJson('./data/features.json', features)
  saveDataToJson('./data/entities.json', entities)
  saveDataToJson('./data/featureSets.json', featureSets)
  saveDataToJson('./data/featureVectors.json', featureVectors)
  saveDataToJson('./data/pipelines.json', pipelines)
  saveDataToJson('./data/secretKeys.json', secretKeys)
  saveDataToJson('./data/schedules.json', schedules)
  saveDataToJson('./data/funcs.json', functions)
  saveDataToJson('./data/runs.json', runs)
  saveDataToJson('./data/logs.json', logs)
  saveDataToJson('./data/artifactsTags.json', artifactTags)
  saveDataToJson('./data/run.json', runProjectUid)
  saveDataToJson('./data/piplineIDs.json', pipelineIdsData)

  // backend temporary 403 error
  // const filteredData = await filterData(featureSets.feature_sets)
  // const filteredFeatureSetsData = await lodash.flatten(filteredData)

  // nuclio endpoints
  const nuclioFunctions = await fetchData(baseNuclioUrl, 'functions')
  const nuclioApiGateways = await fetchData(baseNuclioUrl, 'api_gateways')

  saveDataToJson('./data/nuclioFunctions.json', nuclioFunctions)
  saveDataToJson('./data/nuclioAPIGateways.json', nuclioApiGateways)

  // Iguazio API sync
  if (frontendSpec?.feature_flags?.project_membership === 'enabled') {
    const igzProjects = await fetchData(igzApiUrl, 'projects')
    const igzProjectAuthRoles = await fetchData(
      igzApiUrl,
      'project_authorization_roles'
    )
    const igzUserGroups = await fetchData(igzApiUrl, 'user_groups')
    const igzUsers = await fetchData(igzApiUrl, 'users')
    const igzUserNames = igzUsers.data.map(item => item.attributes.username)

    const igzUserGroupsEndpoints = igzUserNames.map(
      name => `?filter${name}=username&include=user_groups`
    )
    const igzUsersWithGroups = await fetchJsons(
      igzUserGroupsEndpoints,
      igzApiUrl,
      'users'
    )

    const igzProjectsEndpoints = igzUserNames.map(
      name => `?filter${name}=username&include=projects`
    )
    const igzUsersWithProjects = await fetchJsons(
      igzProjectsEndpoints,
      igzApiUrl,
      'users'
    )

    const relations = getIgzRelations(igzUsersWithProjects)
    const igzRelations = getIgzRelations(igzUsersWithGroups, relations)

    const igzProjectIds = igzProjects.data.map(project => project.id)
    const projectsWithOtherRelations = await fetchJsons(
      igzProjectIds,
      igzApiUrl,
      'projects/',
      '?include='
    )
    const projectsRelations = getIgzRelations(projectsWithOtherRelations)

    saveDataToJson('./data/iguazioProjects.json', igzProjects)
    saveDataToJson(
      './data/iguazioProjectAuthorizationRoles.json',
      igzProjectAuthRoles
    )
    saveDataToJson('./data/iguazioUserGroups.json', igzUserGroups)
    saveDataToJson('./data/iguazioUsers.json', igzUsers)
    saveDataToJson('./data/iguazioUserRelations.json', igzRelations)
    saveDataToJson('./data/iguazioProjectsRelations.json', projectsRelations)
  } else {
    saveDataToJson('./data/iguazioProjects.json', {})
    saveDataToJson('./data/iguazioProjectAuthorizationRoles.json', {})
    saveDataToJson('./data/iguazioUserGroups.json', {})
    saveDataToJson('./data/iguazioUsers.json', {})
    saveDataToJson('./data/iguazioUserRelations.json', {})
    saveDataToJson('./data/iguazioProjectsRelations.json', {})
  }

  // github functions
  const functionsHtml = await fetchData(githubFunctionsUrl)

  const functionsTreeMatches = functionsHtml.match(
    /class="js-navigation-open Link--primary" title="([a-z-A-Z_]*)" data/g
  )
  const functionsTree = functionsTreeMatches.map(item => {
    return item
      .replace(/class="js-navigation-open Link--primary" title="/, '')
      .replace(/" data/, '')
  })

  await fetchYamlFunctions(functionsTree, githubYamlUrl, '/function.yaml')
}

synchronizeBackend()
