import getState from './getState'

export const generateModelEndpoints = endpoints =>
  endpoints.map(endpoint => ({
    ...endpoint,
    name: endpoint.spec.model.split(':')[0],
    state: getState(endpoint.status.state),
    ui: {
      originalContent: endpoint
    }
  }))
