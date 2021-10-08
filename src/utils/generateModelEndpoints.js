export const generateModelEndpoints = endpoints =>
  endpoints.map(endpoint => ({
    ...endpoint,
    ui: {
      originalContent: endpoint
    }
  }))
