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

  if (!target) return

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
      title: 'Ingest and process data',
      subTitle: 'Register, upload data directly, or define features using the feature store.',
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
          label: 'Create feature set',
          tooltip: 'Create a new feature set as part of the MLRun feature store.'
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
                    const submitSuccess = await formState.handleSubmit()

                    if (!formState.invalid && submitSuccess) {
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
              params,
              refresh: () => {},
              title: 'Register dataset'
            },
            type: 'modal'
          }),
          label: 'Register dataset',
          tooltip:
            'Register an existing dataset in the MLRun database so it can be referenced by other processes.'
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
                    const submitSuccess = await formState.handleSubmit()

                    if (!formState.invalid && submitSuccess) {
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
              params,
              refresh: () => {},
              title: 'Register artifact'
            },
            type: 'modal'
          }),
          label: 'Register artifact',
          tooltip:
            'Register an existing artifact in the MLRun database so it can be referenced by other processes.'
        },
        {
          icon: <FeatureVectorIcon />,
          id: 'createFeatureVector',
          handleClick: () => ({
            path: `${base_url}/feature-store/feature-vectors?openPanel=true`
          }),
          label: 'Create feature vector',
          tooltip:
            'Create a feature vector that combines different features across one or more feature sets as part of the MLRun feature store.'
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
      title: 'Develop and train model',
      subTitle:
        'Define your code in a function and train your models. You can also run any additional code in batch, as well as define and run workflows.',
      actions: [
        {
          id: 'createBatchFunction',
          icon: <CreatFunctionIcon />,
          handleClick: () => ({
            path: `${base_url}/functions?openPanel=true`
          }),
          label: 'Create batch function',
          tooltip:
            'Define the code and other properties to run later in batch. Batch runs are typically used for processes such as data preparation and model training.',
          hidden: !isDemoMode
        },
        {
          id: 'createnBatchRun',
          icon: <CreateJobIcon />,
          handleClick: () => {
            return {
              component: JobWizard,
              props: {
                params
              },
              type: 'modal'
            }
          },
          label: 'Batch run',
          tooltip:
            'Run a function in a batch process either immediately or define a schedule. You can also define hyperparameters to execute and compare multiple runs. Batch runs are typically used for processes such as data preparation and model training.'
        },
        {
          id: 'registerModel',
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
              params,
              refresh: () => {}
            },
            type: 'modal'
          }),
          label: 'Register model',
          tooltip:
            'Store a model (with its metadata) in the MLRun database for subsequent use in functions.',
          hidden: !isDemoMode
        },
        {
          id: 'trainModel',
          icon: <TrainModelIcon />,
          handleClick: () => {
            return {
              component: JobWizard,
              props: {
                params,
                isTrain: true,
                wizardTitle: 'Train model',
                isOverview: true
              },
              type: 'modal'
            }
          },
          label: 'Train model',
          tooltip:
            'Train a new model based on an input dataset. You can also define hyperparameters to execute and compare multiple models.'
        },
        {
          id: 'createWorkflow',
          icon: <CreateWorkflowIcon />,
          handleClick: () => {},
          label: 'Create workflow',
          tooltip:
            'Create a flow of multiple steps to execute, such as batch run, model deployment, and model testing.',
          hidden: !isDemoMode
        },
        {
          id: 'runWorkflow',
          icon: <RunWorkflowIcon />,
          handleClick: () => {},
          label: 'Run workflow',
          tooltip: 'Specify the workflow and its input arguments.',
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
          label: 'Workflows'
        }
      ]
    },
    deployment: {
      title: 'Deploy and monitor',
      subTitle:
        'Deploy online serving models or perform batch inference, as well as define data and model monitoring and notification.',
      actions: [
        {
          id: 'createRealTimeFunction',
          icon: <RTFunctionIcon />,
          label: 'Create real-time function',
          handleClick: () => ({
            path: generateNuclioLink(`${base_url}/create-function`),
            externalLink: true
          }),
          tooltip:
            'These are typically used for serving, APIs, and stream processing. Specify the code, resources, and triggers.'
        },
        {
          id: 'deployServingFunction',
          icon: <ServingFunctionIcon />,
          handleClick: () => ({
            path: `${base_url}/functions?openPanel=true&runtime=serving`
          }),
          label: 'Deploy serving model',
          tooltip:
            'Deploy model for real-time inference. The model can receive data as HTTP, stream, as well as execute a real-time serving pipeline.',
          hidden: !isDemoMode
        },
        {
          id: 'batchInference',
          icon: <BatchInferenceIcon />,
          handleClick: () => {
            return {
              component: JobWizard,
              props: {
                params,
                isBatchInference: true,
                wizardTitle: 'Batch inference'
              },
              type: 'modal'
            }
          },
          label: 'Batch inference',
          tooltip:
            'Run your model on a large dataset, usually read from an offline source, such as files or databases. The results are written to offline targets.'
        },
        {
          id: 'defineAlerts',
          icon: <DefineAlertsIcon />,
          handleClick: () => {},
          label: 'Define alerts',
          tooltip:
            'Use alerts to notify about operational performance metrics, or to automate a call to a CI/CD pipeline when drift is detected.',
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
