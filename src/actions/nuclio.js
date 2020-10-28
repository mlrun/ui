import nuclioApi from '../api/nuclio'

const nuclioActions = {
  fetchNuclioFunctions: (project, name) => dispatch => {
    return nuclioApi.getFunctions(project, name).then(({ data }) => {
      console.log(data)
    })
  }
}

export default nuclioActions
