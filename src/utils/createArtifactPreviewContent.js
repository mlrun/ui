export const createArtifactPreviewContent = (res, fileFormat) => {
  const artifact = {}

  if (res.headers['content-type'].includes('text/csv')) {
    const data = res.data.split('\n')
    if (data[0].includes('state')) {
      const headers = data[0].split(',')
      let content = data.slice(1)
      content.pop()
      content = content.map(item => item.split(','))
      artifact.type = 'table-results'
      artifact.iterationStats = [headers].concat(content)
    } else {
      let content = data.slice(1)
      content = content.map(item => item.split(','))
      content.pop()
      artifact.type = 'table'
      artifact.data = {
        headers: data[0].split(','),
        content: content
      }
    }
  } else if (res.headers['content-type'].includes('text/plain')) {
    artifact.type = 'text'
    artifact.data = {
      content: res.data
    }
  } else if (res.headers['content-type'].includes('text/html')) {
    artifact.type = 'html'
    artifact.data = {
      content: res.data
    }
  } else if (res.headers['content-type'].includes('application/json')) {
    artifact.type = 'json'
    artifact.data = {
      content: JSON.stringify(res.data, null, 2)
    }
  } else if (res.headers['content-type'].includes('image')) {
    artifact.type = 'image'
    artifact.data = {
      content: URL.createObjectURL(res.data)
    }
  } else if (fileFormat === 'yaml' || fileFormat === 'yml') {
    artifact.type = 'yaml'
    artifact.data = {
      content: res.data
    }
  } else {
    artifact.type = 'unknown'
  }
  return artifact
}
