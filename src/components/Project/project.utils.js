import React from 'react'

import { ReactComponent as Jupyter } from '../../images/jupyter.svg'
import { ReactComponent as VSCode } from '../../images/vs-code.svg'

export const launchIDEOptions = [
  {
    label: 'Jupyter',
    id: 'jupyter',
    icon: <Jupyter />
  },
  {
    label: 'VS Code',
    id: 'vsCode',
    icon: <VSCode />
  }
]

export const getLinks = match => [
  {
    label: 'Models',
    link: `/projects/${match.params.projectName}/models`
  },
  {
    label: 'Datasets',
    link: `/projects/${match.params.projectName}/datasets`
  },
  {
    label: 'Files',
    link: `/projects/${match.params.projectName}/files`
  },
  {
    label: 'Monitor jobs and workflows',
    link: `/projects/${match.params.projectName}/jobs/monitor`
  },
  {
    label: 'Schedule jobs and workflows',
    link: `/projects/${match.params.projectName}/jobs/schedule`
  },
  {
    label: 'ML functions',
    link: `/projects/${match.params.projectName}/functions`
  }
]
