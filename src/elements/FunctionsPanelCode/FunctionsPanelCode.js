import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { isNil } from 'lodash'

import FunctionsPanelCodeView from './FunctionsPanelCodeView'

import functionsActions from '../../actions/functions'
import {
  DEFAULT_ENTRY,
  DEFAULT_IMAGE,
  DEFAULT_SOURCE_CODE,
  EXISTING_IMAGE,
  NEW_IMAGE
} from './functionsPanelCode.util'
import { PANEL_CREATE_MODE } from '../../constants'

const FunctionsPanelCode = ({
  appStore,
  defaultData,
  functionsStore,
  imageType,
  match,
  mode,
  resetNewFunctionCodeCustomImage,
  setImageType,
  setNewFunctionBaseImage,
  setNewFunctionBuildImage,
  setNewFunctionCommands,
  setNewFunctionHandler,
  setNewFunctionImage,
  setNewFunctionSourceCode,
  setNewFunctionWithMlrun,
  setValidation,
  validation
}) => {
  const [data, setData] = useState({
    entry: DEFAULT_ENTRY,
    handler: defaultData.default_handler ?? '',
    image: defaultData.image ?? '',
    base_image: defaultData.build?.base_image ?? '',
    commands: (defaultData.build?.commands || []).join('\n') ?? '',
    build_image: defaultData.build?.image ?? ''
  })
  const [editCode, setEditCode] = useState(false)

  const handleHandlerOnBlur = event => {
    if (functionsStore.newFunction.spec.default_handler !== data.handler) {
      setNewFunctionHandler(data.handler)
    }
  }

  useEffect(() => {
    if (
      !functionsStore.newFunction.spec.build.functionSourceCode &&
      isNil(defaultData.build?.functionSourceCode)
    ) {
      setNewFunctionSourceCode(DEFAULT_SOURCE_CODE)
    }
  }, [
    defaultData.build,
    functionsStore.newFunction.spec.build.functionSourceCode,
    setNewFunctionSourceCode
  ])

  useEffect(() => {
    if (mode === PANEL_CREATE_MODE && imageType.length === 0) {
      if (
        appStore.frontendSpec.default_function_image_by_kind?.[
          functionsStore.newFunction.kind
        ]
      ) {
        setNewFunctionImage(
          appStore.frontendSpec.default_function_image_by_kind[
            functionsStore.newFunction.kind
          ]
        )
        setImageType(EXISTING_IMAGE)
        setData(state => ({
          ...state,
          image:
            appStore.frontendSpec?.default_function_image_by_kind?.[
              functionsStore.newFunction.kind
            ]
        }))
      } else {
        setNewFunctionCommands(
          appStore.frontendSpec?.function_deployment_mlrun_command
        )
        setImageType(NEW_IMAGE)
        setNewFunctionBaseImage(
          appStore.frontendSpec?.default_function_image_by_kind?.[
            functionsStore.newFunction.kind
          ]
        )
        setData(state => ({
          ...state,
          commands: appStore.frontendSpec?.function_deployment_mlrun_command,
          base_image:
            appStore.frontendSpec?.default_function_image_by_kind?.[
              functionsStore.newFunction.kind
            ]
        }))
      }
    } else if (
      defaultData.build?.base_image?.length === 0 &&
      defaultData.build?.commands?.length === 0 &&
      defaultData.build?.image?.length === 0 &&
      imageType.length === 0
    ) {
      setNewFunctionImage(defaultData.image || DEFAULT_IMAGE)
      setImageType(EXISTING_IMAGE)
      setData(state => ({
        ...state,
        image: defaultData.image || DEFAULT_IMAGE
      }))
    } else if (imageType.length === 0) {
      setImageType(NEW_IMAGE)
    }
  }, [
    appStore.frontendSpec,
    defaultData.build,
    defaultData.image,
    functionsStore.newFunction.kind,
    functionsStore.newFunction.metadata.tag,
    imageType.length,
    match.params.projectName,
    mode,
    setImageType,
    setNewFunctionBaseImage,
    setNewFunctionBuildImage,
    setNewFunctionCommands,
    setNewFunctionImage
  ])

  const handleImageTypeChange = imageType => {
    if (imageType === EXISTING_IMAGE) {
      setNewFunctionImage(
        appStore.frontendSpec?.default_function_image_by_kind?.[
          functionsStore.newFunction.kind
        ]
      )
      resetNewFunctionCodeCustomImage()
      setData(state => ({
        ...state,
        base_image: '',
        commands: '',
        build_image: '',
        image:
          appStore.frontendSpec?.default_function_image_by_kind?.[
            functionsStore.newFunction.kind
          ]
      }))
      setNewFunctionWithMlrun(false)
    } else {
      setNewFunctionImage('')
      setNewFunctionCommands(
        appStore.frontendSpec?.function_deployment_mlrun_command
      )
      setNewFunctionBaseImage(
        appStore.frontendSpec?.default_function_image_by_kind?.[
          functionsStore.newFunction.kind
        ]
      )
      setData(state => ({
        ...state,
        image: '',
        commands: appStore.frontendSpec?.function_deployment_mlrun_command,
        base_image:
          appStore.frontendSpec?.default_function_image_by_kind?.[
            functionsStore.newFunction.kind
          ]
      }))
      setNewFunctionWithMlrun(true)
    }

    setImageType(imageType)
    setValidation(state => ({
      ...state,
      isCodeImageValid: true,
      isBaseImageValid: true,
      isBuildCommandsValid: true
    }))
  }

  return (
    <FunctionsPanelCodeView
      appStore={appStore}
      data={data}
      editCode={editCode}
      functionsStore={functionsStore}
      handleHandlerOnBlur={handleHandlerOnBlur}
      handleImageTypeChange={handleImageTypeChange}
      imageType={imageType}
      setData={setData}
      setEditCode={setEditCode}
      setValidation={setValidation}
      setNewFunctionBaseImage={setNewFunctionBaseImage}
      setNewFunctionBuildImage={setNewFunctionBuildImage}
      setNewFunctionCommands={setNewFunctionCommands}
      setNewFunctionImage={setNewFunctionImage}
      setNewFunctionSourceCode={setNewFunctionSourceCode}
      setNewFunctionWithMlrun={setNewFunctionWithMlrun}
      validation={validation}
    />
  )
}

FunctionsPanelCode.defaultProps = {
  defaultData: {}
}

FunctionsPanelCode.propTypes = {
  defaultData: PropTypes.shape({}),
  imageType: PropTypes.string.isRequired,
  match: PropTypes.shape({}).isRequired,
  mode: PropTypes.string.isRequired,
  setImageType: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default connect(
  (functionsStore, appStore) => ({ ...functionsStore, ...appStore }),
  {
    ...functionsActions
  }
)(FunctionsPanelCode)
