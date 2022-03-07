import React from 'react'

import { PROJECT_MONITOR } from '../../constants'

import { ReactComponent as APIIcon } from '../../images/api-getaway-icon.svg'
import { ReactComponent as DashboardIcon } from '../../images/dashboard-icon.svg'
import { ReactComponent as DatasetsIcon } from '../../images/datasets-icon.svg'
import { ReactComponent as EyeIcon } from '../../images/eye.svg'
import { ReactComponent as FileIcon } from '../../images/file-icon.svg'
import { ReactComponent as FunctionIcon } from '../../images/function-icon.svg'
import { ReactComponent as JobsWorkflowIcon } from '../../images/sitemap-icon.svg'
import { ReactComponent as ModelsIcon } from '../../images/models-icon.svg'
import { ReactComponent as NuclioIcon } from '../../images/realtime-icon.svg'
import { ReactComponent as PackageIcon } from '../../images/package.svg'
// import { ReactComponent as RTPiplinesIcon } from '../../images/timer-outline-icon.svg'

export const getLinks = projectName => {
  const base_url = `/projects/${projectName}`

  return [
    {
      icon: <DashboardIcon />,
      label: 'Project overview',
      link: base_url,
      rootPath: '/',
      hidden: true
    },
    {
      icon: <EyeIcon />,
      id: 'monitor',
      label: 'Project monitoring',
      link: `${base_url}/${PROJECT_MONITOR}`
    },
    {
      icon: <PackageIcon />,
      id: 'feature-store',
      label: 'Feature store',
      link: `${base_url}/feature-store`
    },
    {
      icon: <DatasetsIcon />,
      id: 'datasets',
      label: 'Datasets',
      link: `${base_url}/datasets`
    },
    {
      icon: <FileIcon />,
      id: 'files',
      label: 'Artifacts',
      link: `${base_url}/files`
    },
    {
      icon: <ModelsIcon />,
      id: 'models',
      label: 'Models',
      link: `${base_url}/models`
    },
    {
      icon: <JobsWorkflowIcon />,
      id: 'jobs',
      label: 'Jobs and workflows',
      link: `${base_url}/jobs`
    },
    //  {
    //    icon: <RTPiplinesIcon />,
    //    label: 'Realtime pipelines',
    //    link: `${base_url}/models` //TODO: fix path
    //  },
    {
      icon: <FunctionIcon />,
      id: 'functions',
      label: 'ML functions',
      link: `${base_url}/functions`
    },
    {
      icon: <NuclioIcon />,
      id: 'Real-time functions',
      label: 'Real-time functions',
      link: `${window.mlrunConfig.nuclioUiUrl}${base_url}/functions`,
      externalLink: true
    },
    {
      icon: <APIIcon />,
      id: 'API gateways',
      label: 'API gateways',
      link: `${window.mlrunConfig.nuclioUiUrl}${base_url}/api-gateways`,
      externalLink: true
    }
  ]
}
