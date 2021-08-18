import getState from './getState'

export const generateModelEndpoints = endpoints =>
  endpoints.map(endpoint => ({
    ...endpoint,
    state: getState(endpoint.status.state),
    ui: {
      originalContent: endpoint
    }
  }))
