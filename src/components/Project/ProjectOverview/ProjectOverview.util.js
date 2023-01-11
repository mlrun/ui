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
import React from 'react'

import JobWizard from '../../JobWizard/JobWizard'
import RegisterArtifactModal from '../../RegisterArtifactModal/RegisterArtifactModal'
import RegisterModelModal from '../../../elements/RegisterModelModal/RegisterModelModal'

import { ARTIFACT_TYPE, DATASET_TYPE } from '../../../constants'
import { SECONDARY_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'
import { generateNuclioLink } from '../../../utils'

import { ReactComponent as BatchInferenceIcon } from 'igz-controls/images/ic-batch-inference.svg'
import { ReactComponent as CreatFunctionIcon } from 'igz-controls/images/ic-create-new-function.svg'
import { ReactComponent as CreateWorkflowIcon } from 'igz-controls/images/ic-create-workflow.svg'
import { ReactComponent as DataSetIcon } from 'igz-controls/images/ic-register-dataset.svg'
import { ReactComponent as DefineAlertsIcon } from 'igz-controls/images/ic-define-alerts.svg'
import { ReactComponent as FeatureSetIcon } from 'igz-controls/images/ic-create-featureset.svg'
import { ReactComponent as RegisterArtifactIcon } from 'igz-controls/images/ic-register-artifact.svg'
import { ReactComponent as CreateJobIcon } from 'igz-controls/images/ic-run-batch.svg'
// import { ReactComponent as DeployModelIcon } from 'igz-controls/images/rocket-icon.svg'
import { ReactComponent as FeatureVectorIcon } from 'igz-controls/images/ic-feature-vector.svg'
import { ReactComponent as RegisterModelIcon } from 'igz-controls/images/ic-register-model.svg'
import { ReactComponent as RTFunctionIcon } from 'igz-controls/images/ic-create-realtime-function.svg'
import { ReactComponent as RunWorkflowIcon } from 'igz-controls/images/ic-run-workflow.svg'
import { ReactComponent as ServingFunctionIcon } from 'igz-controls/images/ic-deploy-model-serving.svg'
import { ReactComponent as TrainModelIcon } from 'igz-controls/images/ic-train-model.svg'

// import { ReactComponent as UploadIcon } from 'igz-controls/images/upload-icon.svg'

export const handleClick = (navigate, openPopUp) => handler => {
  const target = handler()
  return target.type && target.type === 'modal'
    ? openPopUp(target.component, target.props)
    : target.externalLink
    ? (window.top.location.href = target.path)
    : navigate(target.path)
}

export const getInitialCards = (params, navigate, isDemoMode) => {
  const base_url = `/projects/${params.projectName}`

  return {
    collection: {
      title: 'Ingest and Process Data',
      subTitle:
        'This section enable users to upload data , crate features and register external data.',
      actions: [
        //TODO: un-comment after wizard ready
        // {
        //   icon: <UploadIcon />,
        //   id: 'uploadData',
        //   label: 'Upload data',
        //   path: {
        //     target: 'uploaddata'
        //   },
        //   tooltip: 'Test'
        // },
        {
          icon: <FeatureSetIcon />,
          id: 'createFeatureSet',
          handleClick: () => ({
            path: `${base_url}/feature-store/feature-sets?openPanel=true`
          }),
          label: 'Create Features Set',
          tooltip: ''
        },
        {
          icon: <DataSetIcon />,
          id: 'registerDataset',
          handleClick: () => ({
            component: RegisterArtifactModal,
            props: {
              actions: (formState, handleCloseModal) => [
                {
                  label: 'Cancel',
                  onClick: () => handleCloseModal(),
                  variant: TERTIARY_BUTTON
                },
                {
                  disabled: formState.submitting || (formState.invalid && formState.submitFailed),
                  label: 'Register',
                  onClick: async () => {
                    await formState.handleSubmit()

                    if (!formState.invalid) {
                      navigate(`${base_url}/datasets`)
                    }
                  },
                  variant: SECONDARY_BUTTON
                }
              ],
              // TODO: un-comment for 1.3
              // [{
              //   disabled: formState.submitting || (formState.invalid && formState.submitFailed),
              //   label: 'Register and view',
              //   onClick: async () => {
              //   await formState.handleSubmit()
              //   if (!formState.invalid) {
              //     navigate(`${base_url}/datasets`)
              //   }
              // },
              // {
              //   disabled: formState.submitting || (formState.invalid && formState.submitFailed),
              //   label: 'Register',
              //   onClick: formState.handleSubmit,
              //   variant: SECONDARY_BUTTON
              // }],

              artifactKind: DATASET_TYPE,
              projectName: params.projectName,
              refresh: () => {},
              title: 'Register dataset'
            },
            type: 'modal'
          }),
          label: 'Register dataset',
          tooltip: ''
        },
        {
          icon: <RegisterArtifactIcon />,
          id: 'registerArtifact',
          handleClick: () => ({
            component: RegisterArtifactModal,
            props: {
              //TODO: un-comment for 1.3
              actions: (formState, handleCloseModal) => [
                {
                  label: 'Cancel',
                  onClick: () => handleCloseModal(),
                  variant: TERTIARY_BUTTON
                },
                {
                  disabled: formState.submitting || (formState.invalid && formState.submitFailed),
                  label: 'Register',
                  onClick: async () => {
                    await formState.handleSubmit()

                    if (!formState.invalid) {
                      navigate(`${base_url}/files`)
                    }
                  },
                  variant: SECONDARY_BUTTON
                }
              ],
              // [{
              //   disabled: formState.submitting || (formState.invalid && formState.submitFailed),
              //   label: 'Register and view',
              // onClick: async () => {
              //   await formState.handleSubmit()
              //   if (!formState.invalid) {
              //     navigate(`${base_url}/files`)
              //   }
              // },
              // {
              //   disabled: formState.submitting || (formState.invalid && formState.submitFailed),
              //   label: 'Register',
              //   onClick: formState.handleSubmit,
              //   variant: SECONDARY_BUTTON
              // }],
              artifactKind: ARTIFACT_TYPE,
              projectName: params.projectName,
              refresh: () => {},
              title: 'Register artifact'
            },
            type: 'modal'
          }),
          label: 'Register artifact',
          tooltip: ''
        },
        {
          icon: <FeatureVectorIcon />,
          id: 'createFeatureVector',
          handleClick: () => ({
            path: `${base_url}/feature-store/feature-vectors?openPanel=true`
          }),
          label: 'Create Feature Vector',
          tooltip: ''
        }
      ],
      additionalLinks: [
        {
          id: 'featureset',
          handleClick: () => ({
            path: `${base_url}/feature-store/feature-sets`
          }),
          label: 'Feature Sets'
        },
        {
          id: 'artifacts',
          handleClick: () => ({
            path: `${base_url}/files`
          }),
          label: 'Artifacts'
        },
        {
          id: 'dataset',
          handleClick: () => ({
            path: `${base_url}/datasets`
          }),
          label: 'Datasets'
        },
        {
          id: 'featurevectors',
          handleClick: () => ({
            path: `${base_url}/feature-store/feature-vectors`
          }),
          label: 'Feature Vectors'
        }
      ]
    },
    development: {
      title: 'Develop and Train Models',
      subTitle:
        'This section enables users to develop and run functions as jobs or workflows. Those jobs can run various processing types including model training, data processing and more.',
      actions: [
        {
          id: 'createnewfunction',
          icon: <CreatFunctionIcon />,
          handleClick: () => ({
            path: `${base_url}/functions?openPanel=true`
          }),
          label: 'Create a Function',
          tooltip: ''
        },
        {
          id: 'createnewjob',
          icon: <CreateJobIcon />,
          handleClick: () =>
            isDemoMode
              ? {
                  component: JobWizard,
                  props: {
                    params
                  },
                  type: 'modal'
                }
              : {
                  // todo: delete this object when the job wizard is out of the demo mode
                  path: `${base_url}/jobs/monitor-jobs/create-new-job`
                },
          label: 'Batch run',
          tooltip: ''
        },
        {
          id: 'registeramodel',
          icon: <RegisterModelIcon />,
          handleClick: () => ({
            component: RegisterModelModal,
            props: {
              actions: (formState, handleCloseModal) => [
                {
                  label: 'Cancel',
                  onClick: () => handleCloseModal(),
                  variant: TERTIARY_BUTTON
                },
                {
                  disabled: formState.submitting || (formState.invalid && formState.submitFailed),
                  label: 'Register',
                  onClick: async () => {
                    await formState.handleSubmit()
                    if (!formState.invalid) {
                      navigate(`${base_url}/models/models`)
                    }
                  },
                  variant: SECONDARY_BUTTON
                }
              ],
              // TODO: un-comment for 1.3
              // [{
              //   disabled: formState.submitting || (formState.invalid && formState.submitFailed),
              //   label: 'Register and view',
              //   onClick: async () => {
              //   await formState.handleSubmit()
              //   if (!formState.invalid) {
              //     navigate(`${base_url}/datasets`)
              //   }
              // },
              // {
              //   disabled: formState.submitting || (formState.invalid && formState.submitFailed),
              //   label: 'Register',
              //   onClick: formState.handleSubmit,
              //   variant: SECONDARY_BUTTON
              // }],
              projectName: params.projectName,
              refresh: () => {}
            },
            type: 'modal'
          }),
          label: 'Register model',
          tooltip: ''
        },
        {
          id: 'trainmodel',
          icon: <TrainModelIcon />,
          handleClick: () => {},
          label: 'Train model',
          tooltip: '',
          hidden: !isDemoMode
        },
        {
          id: 'createworkflow',
          icon: <CreateWorkflowIcon />,
          handleClick: () => {},
          label: 'Create workflow',
          tooltip: '',
          hidden: !isDemoMode
        },
        {
          id: 'runworkflow',
          icon: <RunWorkflowIcon />,
          handleClick: () => {},
          label: 'Run workflow',
          tooltip: '',
          hidden: !isDemoMode
        }
      ],
      additionalLinks: [
        {
          id: 'functions',
          handleClick: () => ({
            path: `${base_url}/functions`
          }),
          label: 'ML Functions'
        },
        {
          id: 'jobs',
          handleClick: () => ({
            path: `${base_url}/jobs`
          }),
          label: 'Jobs'
        },
        {
          id: 'models',
          handleClick: () => ({
            path: `${base_url}/models/models`
          }),
          label: 'Models'
        },
        {
          id: 'workflow',
          handleClick: () => ({
            path: `${base_url}/jobs/monitor-workflows`
          }),
          label: 'Workflow'
        }
      ]
    },
    deployment: {
      title: 'Deploy and Monitor',
      subTitle:
        'This section enables users to deploy models, deploy real time graph and run real time pipelines at scale.',
      actions: [
        {
          id: 'createRealTimeFunction',
          icon: <RTFunctionIcon />,
          label: 'Create realtime function',
          handleClick: () => ({
            path: generateNuclioLink(`${base_url}/create-function`),
            externalLink: true
          }),
          tooltip: ''
        },
        {
          id: 'deployServingFunction',
          icon: <ServingFunctionIcon />,
          handleClick: () => ({
            path: `${base_url}/functions?openPanel=true&runtime=serving`
          }),
          label: 'Deploy serving function',
          tooltip: ''
        },
        {
          id: 'batchInference',
          icon: <BatchInferenceIcon />,
          handleClick: () => {},
          label: 'Batch inference',
          tooltip: '',
          hidden: !isDemoMode
        },
        {
          id: 'defineAlerts',
          icon: <DefineAlertsIcon />,
          handleClick: () => {},
          label: 'Define alerts',
          tooltip: '',
          hidden: !isDemoMode
        }
        // {
        //   id: 'deployModel',
        //   icon: <DeployModelIcon />,
        //   handleClick: () => ({
        //     path: `${base_url}/models/models`
        //   }),
        //   label: 'Deploy Model',
        //   tooltip: ''
        // }
      ],
      additionalLinks: [
        {
          id: 'modelEndpoints',
          handleClick: () => ({
            path: `${base_url}/models/model-endpoints`
          }),
          label: 'Model Endpoints'
        },
        {
          id: 'realTimePipelines',
          handleClick: () => ({
            path: `${base_url}/models/real-time-pipelines`
          }),
          label: 'RT Pipelines'
        },
        {
          id: 'nuclioFunctions',
          handleClick: () => ({
            path: generateNuclioLink(`${base_url}/functions`),
            externalLink: true
          }),
          label: 'Nuclio Functions'
        },
        {
          id: 'monitor',
          handleClick: () => ({
            path: `${base_url}/monitor`
          }),
          label: 'Monitoring'
        }
      ]
    }
  }
}
