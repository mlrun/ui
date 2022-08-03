import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Form } from 'react-final-form'
import { createForm } from 'final-form'

// import FunctionsPanelTitle from '../../elements/FunctionsPanelTitle/FunctionsPanelTitle'
import NewFunctionModalStep1 from './NewFunctionModalStep1/NewFunctionModalStep1'
import NewFunctionModalStep2 from './NewFunctionModalStep2/NewFunctionModalStep2'
import NewFunctionModalStep3 from './NewFunctionModalStep3/NewFunctionModalStep3'

import { Wizard } from 'igz-controls/components'

import { LABEL_BUTTON, MODAL_LG, SECONDARY_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'
import { PANEL_DEFAULT_ACCESS_KEY, FUNCTION_TYPE_JOB } from '../../constants'
import {
  getDefaultVolumeMounts,
  getModalTitle,
  DEFAULT_ENTRY,
  DEFAULT_RUNTIME,
  NEW_IMAGE,
  sourceCodeInBase64,
  VOLUME_MOUNT_AUTO_TYPE
} from './newFunctionModal.util'
import {
  // generateFullCpuValue,
  // generateFullMemoryValue,
  getDefaultCpuUnit,
  getDefaultMemoryUnit,
  getLimitsGpuType
  // getSelectedCpuOption,
  // setCpuValidation,
  // setMemoryDropdownValidation,
  // setMemoryInputValidation
} from '../../utils/panelResources.util'
import { useModalBlockHistory } from '../../hooks/useModalBlockHistory.hook'
import { useMode } from '../../hooks/mode.hook'
import { parseKeyValues } from '../../utils'
import { FUNCTION_PANEL_MODE } from '../../types'

const NewFunctionModal = ({
  defaultData,
  isOpen,
  isStandAlone,
  mode,
  onResolve,
  projectName,
  runtime
}) => {
  const location = useLocation()
  const { appStore, functionsStore } = useSelector(state => state)
  const { isStagingMode } = useMode()

  const defaultPodsResources = useMemo(() => {
    return appStore.frontendSpec?.default_function_pod_resources
  }, [appStore.frontendSpec.default_function_pod_resources])

  const gpuType = useMemo(
    () => getLimitsGpuType(defaultData.resources?.limits),
    [defaultData.resources?.limits]
  )

  const preemptionMode = useMemo(() => {
    return appStore.frontendSpec.feature_flags.preemption_nodes === 'enabled'
      ? defaultData.preemption_mode ||
          appStore.frontendSpec.default_function_preemption_mode ||
          'prevent'
      : ''
  }, [
    defaultData.preemption_mode,
    appStore.frontendSpec.default_function_preemption_mode,
    appStore.frontendSpec.feature_flags.preemption_nodes
  ])

  const formRef = React.useRef(
    createForm({
      initialValues: {
        kind: defaultData.type ?? runtime ?? DEFAULT_RUNTIME,
        metadata: {
          credentials: {
            access_key: PANEL_DEFAULT_ACCESS_KEY
          },
          labels: parseKeyValues(defaultData.labels) ?? [], //change to return object
          name: defaultData.name ?? '',
          tag: defaultData.tag ?? ''
        },
        spec: {
          args: [],
          build: {
            base_image: defaultData.build?.base_image ?? '',
            commands: (defaultData.build?.commands || []).join('\n') ?? '',
            functionSourceCode:
              defaultData.build?.functionSourceCode ??
              sourceCodeInBase64[defaultData.type ?? runtime ?? DEFAULT_RUNTIME] ??
              '',
            image: defaultData.build?.image ?? ''
          },
          command: defaultData.command ?? '',
          default_class: defaultData.default_class ?? '',
          default_handler: defaultData.default_handler ?? '',
          description: defaultData.description ?? '',
          env: [],
          image: defaultData.image ?? '',
          priority_class_name:
            defaultData.priority_class_name ||
            appStore.frontendSpec.default_function_priority_class_name ||
            '',
          secret_sources: [],
          preemption_mode: preemptionMode,
          volume_mounts:
            getDefaultVolumeMounts(
              defaultData.volume_mounts ?? [],
              defaultData.volumes ?? [],
              mode
            ) || [],
          volumes: defaultData.volumes ?? [],
          resources: {
            limits: {
              cpu: defaultData.resources?.limits?.cpu ?? defaultPodsResources?.limits.cpu ?? '',
              cpuUnit: getDefaultCpuUnit(
                defaultData.resources?.limits ?? {},
                defaultPodsResources?.limits.cpu
              ),
              memory:
                defaultData.resources?.limits?.memory ?? defaultPodsResources?.limits.memory ?? '',
              [gpuType]:
                defaultData.resources?.limits?.[gpuType] ?? defaultPodsResources?.limits.gpu ?? '',
              memoryUnit: getDefaultMemoryUnit(
                defaultData.resources?.limits ?? {},
                defaultPodsResources?.limits.memory
              )
            },
            requests: {
              cpu: defaultData.resources?.requests?.cpu ?? defaultPodsResources?.requests.cpu ?? '',
              cpuUnit: getDefaultCpuUnit(
                defaultData.resources?.requests ?? {},
                defaultPodsResources?.requests.cpu
              ),
              memory:
                defaultData.resources?.requests?.memory ??
                defaultPodsResources?.requests.memory ??
                '',
              memoryUnit: getDefaultMemoryUnit(
                defaultData.resources?.requests ?? {},
                defaultPodsResources?.requests.memory
              )
            }
          }
        },
        extra: {
          entry: DEFAULT_ENTRY,
          imageType:
            (defaultData?.build?.image ||
              defaultData?.build?.base_image ||
              defaultData?.build?.commands?.length > 0) &&
            defaultData.image?.length === 0
              ? NEW_IMAGE
              : '',
          skip_deployed: null,
          volumeMount: VOLUME_MOUNT_AUTO_TYPE
        }
      },
      onSubmit: () => {}
    })
  )
  const { handleCloseModal } = useModalBlockHistory(onResolve, formRef.current)

  const stepsConfig = formState => [
    {
      id: 'general',
      label: 'General'
    },
    {
      id: 'code',
      label: 'Code'
    },
    {
      id: 'resources',
      label: 'Resources'
    },
    {
      id: 'volumes',
      label: 'Volumes'
    },
    {
      id: 'environmentVariables',
      label: 'Environment variables'
    },
    {
      id: 'servingRuntimeConfig',
      label: 'Serving runtime configuration',
      hidden: formState.values.kind === FUNCTION_TYPE_JOB
    },
    {
      id: 'advanced',
      label: 'Advanced',
      getActions: () => [
        {
          label: 'Cancel',
          onClick: handleCloseModal,
          variant: LABEL_BUTTON
        },
        {
          label: 'Save',
          onClick: () => handleSave(),
          variant: TERTIARY_BUTTON
        },
        {
          label: 'Deploy',
          onClick: () => handleSave(true),
          variant: SECONDARY_BUTTON
        }
      ],
      hidden: formState.values.kind === FUNCTION_TYPE_JOB
    }
  ]

  const handleSave = deploy => {
    console.log('save')
    console.log(deploy)
  }

  const handleSubmit = values => {
    console.log(values)
  }

  return (
    <Form form={formRef.current} onSubmit={handleSubmit}>
      {formState => {
        return (
          <Wizard
            className="form"
            formState={formState}
            isWizardOpen={isOpen}
            onWizardResolve={handleCloseModal}
            onWizardSubmit={formState.handleSubmit}
            location={location}
            size={MODAL_LG}
            stepsConfig={stepsConfig(formState)}
            title={getModalTitle(formState.values.runtime)}
          >
            <Wizard.Step>
              <NewFunctionModalStep1
                formRef={formRef}
                formState={formState}
                functionsStore={functionsStore}
                isStandAlone={isStandAlone}
                isStagingMode={isStagingMode}
                mode={mode}
              />
            </Wizard.Step>
            <Wizard.Step>
              <NewFunctionModalStep2
                appStore={appStore}
                formRef={formRef}
                formState={formState}
                functionsStore={functionsStore}
                mode={mode}
                projectName={projectName}
              />
            </Wizard.Step>
            <Wizard.Step>
              <NewFunctionModalStep3 appStore={appStore} formState={formState} />
            </Wizard.Step>
            <Wizard.Step>Volumes</Wizard.Step>
            {formState.values.kind !== FUNCTION_TYPE_JOB && (
              <Wizard.Step>Environment variables</Wizard.Step>
            )}
            {formState.values.kind !== FUNCTION_TYPE_JOB && (
              <Wizard.Step>Serving runtime configuration</Wizard.Step>
            )}
            {formState.values.kind !== FUNCTION_TYPE_JOB && <Wizard.Step>Advanced</Wizard.Step>}
          </Wizard>
        )
      }}
    </Form>
  )
}

NewFunctionModal.defaultProps = {
  defaultData: {},
  isStandAlone: false,
  runtime: FUNCTION_TYPE_JOB
}

NewFunctionModal.propTypes = {
  defaultData: PropTypes.shape({}),
  mode: FUNCTION_PANEL_MODE.isRequired,
  isStandAlone: PropTypes.bool,
  projectName: PropTypes.string.isRequired,
  runtime: PropTypes.string
}

export default NewFunctionModal
