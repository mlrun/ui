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
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { isNil } from 'lodash'

import FunctionsPanelCodeView from './FunctionsPanelCodeView'

import functionsActions from '../../actions/functions'
import {
  DEFAULT_ENTRY,
  DEFAULT_IMAGE,
  EXISTING_IMAGE,
  NEW_IMAGE,
  sourceCodeInBase64
} from './functionsPanelCode.util'
import { FUNCTION_DEFAULT_HANDLER, PANEL_CREATE_MODE, TAG_LATEST } from '../../constants'
import { splitTrim, trimSplit } from '../../utils'
import { useParams } from 'react-router-dom'

const FunctionsPanelCode = ({
  appStore,
  defaultData = {},
  functionsStore,
  imageType,
  mode,
  resetNewFunctionCodeCustomImage,
  setImageType,
  setNewFunctionBaseImage,
  setNewFunctionBuildImage,
  setNewFunctionCommands,
  setNewFunctionRequirements,
  setNewFunctionDefaultClass,
  setNewFunctionForceBuild,
  setNewFunctionHandler,
  setNewFunctionImage,
  setNewFunctionSourceCode,
  setValidation,
  validation
}) => {
  const [data, setData] = useState({
    default_class: defaultData.default_class ?? '',
    entry: DEFAULT_ENTRY,
    handler: defaultData.default_handler ?? FUNCTION_DEFAULT_HANDLER,
    image: defaultData.image ?? '',
    base_image: defaultData.build?.base_image ?? '',
    requirements: (defaultData.build?.requirements || []).join(', ') ?? '',
    commands: (defaultData.build?.commands || []).join('\n') ?? '',
    build_image: defaultData.build?.image ?? ''
  })
  const [editCode, setEditCode] = useState(false)
  const params = useParams()

  useEffect(() => {
    if (
      !functionsStore.newFunction.spec.build.functionSourceCode &&
      isNil(defaultData.build?.functionSourceCode)
    ) {
      setNewFunctionSourceCode(sourceCodeInBase64[functionsStore.newFunction.kind])
    }
  }, [
    defaultData.build,
    functionsStore.newFunction.kind,
    functionsStore.newFunction.spec.build.functionSourceCode,
    setNewFunctionSourceCode
  ])

  useEffect(() => {
    if (mode === PANEL_CREATE_MODE && imageType.length === 0) {
      if (appStore.frontendSpec.default_function_image_by_kind?.[functionsStore.newFunction.kind]) {
        setNewFunctionImage(
          appStore.frontendSpec.default_function_image_by_kind[functionsStore.newFunction.kind]
        )
        setImageType(EXISTING_IMAGE)
        setData(state => ({
          ...state,
          image:
            appStore.frontendSpec?.default_function_image_by_kind?.[functionsStore.newFunction.kind]
        }))
      } else {
        const buildImage = (appStore.frontendSpec?.function_deployment_target_image_template || '')
          .replace('{project}', params.projectName)
          .replace('{name}', functionsStore.newFunction.metadata.name)
          .replace('{tag}', functionsStore.newFunction.metadata.tag || TAG_LATEST)

        setNewFunctionRequirements(
          trimSplit(appStore.frontendSpec?.function_deployment_mlrun_requirement ?? '', ',')
        )
        setImageType(NEW_IMAGE)
        setNewFunctionBaseImage(
          appStore.frontendSpec?.default_function_image_by_kind?.[
            functionsStore.newFunction.kind
          ] ?? ''
        )
        setNewFunctionBuildImage(buildImage)
        setData(state => ({
          ...state,
          requirements: appStore.frontendSpec?.function_deployment_mlrun_requirement ?? '',
          base_image:
            appStore.frontendSpec?.default_function_image_by_kind?.[
              functionsStore.newFunction.kind
            ] ?? '',
          build_image: buildImage
        }))
      }
    } else if (
      (defaultData.image?.length > 0 ||
        (defaultData.build?.base_image?.length === 0 &&
          defaultData.build?.commands?.length === 0 &&
          defaultData.build?.image?.length === 0 &&
          defaultData.image?.length === 0)) &&
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
    functionsStore.newFunction.metadata.name,
    functionsStore.newFunction.metadata.tag,
    imageType.length,
    params.projectName,
    mode,
    setImageType,
    setNewFunctionBaseImage,
    setNewFunctionBuildImage,
    setNewFunctionCommands,
    setNewFunctionImage,
    setNewFunctionRequirements
  ])

  const handleClassOnBlur = () => {
    if (functionsStore.newFunction.spec.default_class !== data.default_class) {
      setNewFunctionDefaultClass(data.default_class)
    }
  }

  const handleHandlerOnBlur = () => {
    if (functionsStore.newFunction.spec.default_handler !== data.handler) {
      setNewFunctionHandler(data.handler)
    }
  }

  const handleImageTypeChange = type => {
    if (type === EXISTING_IMAGE) {
      if (mode === PANEL_CREATE_MODE) {
        resetNewFunctionCodeCustomImage()
        setData(state => ({
          ...state,
          base_image: '',
          commands: '',
          requirements: '',
          build_image: '',
          image:
            appStore.frontendSpec?.default_function_image_by_kind?.[
              functionsStore.newFunction.kind
            ] ?? ''
        }))
      } else {
        setData(state => ({
          ...state,
          image:
            state.image ||
            appStore.frontendSpec?.default_function_image_by_kind?.[
              functionsStore.newFunction.kind
            ] ||
            ''
        }))
      }
      setNewFunctionImage(
        data.image ||
          appStore.frontendSpec?.default_function_image_by_kind?.[
            functionsStore.newFunction.kind
          ] ||
          ''
      )
    } else if (type === NEW_IMAGE) {
      const buildImage = (appStore.frontendSpec?.function_deployment_target_image_template || '')
        .replace('{project}', params.projectName)
        .replace('{name}', functionsStore.newFunction.metadata.name)
        .replace('{tag}', functionsStore.newFunction.metadata.tag || TAG_LATEST)

      if (mode === PANEL_CREATE_MODE) {
        setNewFunctionImage('')
        setData(state => ({
          ...state,
          image: '',
          requirements: appStore.frontendSpec?.function_deployment_mlrun_requirement ?? '',
          base_image:
            appStore.frontendSpec?.default_function_image_by_kind?.[
              functionsStore.newFunction.kind
            ] || '',
          build_image: buildImage
        }))
      } else {
        setData(state => ({
          ...state,
          commands: state.commands || '',
          requirements:
            state.requirements ||
            (appStore.frontendSpec?.function_deployment_mlrun_requirement ?? ''),
          base_image:
            state.base_image ||
            appStore.frontendSpec?.default_function_image_by_kind?.[
              functionsStore.newFunction.kind
            ] ||
            '',
          build_image: state.build_image || buildImage
        }))
      }

      setNewFunctionRequirements(
        data.requirements.length > 0
          ? splitTrim(data.requirements, ',')
          : splitTrim(appStore.frontendSpec?.function_deployment_mlrun_requirement ?? '', ',')
      )
      setNewFunctionCommands(trimSplit(data.commands, '\n') || '')
      setNewFunctionBaseImage(
        data.base_image ||
          appStore.frontendSpec?.default_function_image_by_kind?.[
            functionsStore.newFunction.kind
          ] ||
          ''
      )
      setNewFunctionBuildImage(data.build_image || buildImage)
    }

    setImageType(type)
    setValidation(state => ({
      ...state,
      isCodeImageValid: true,
      isBaseImageValid: true,
      isBuildCommandsValid: true,
      isBuildImageValid: true
    }))
  }

  return (
    <FunctionsPanelCodeView
      data={data}
      editCode={editCode}
      functionsStore={functionsStore}
      handleClassOnBlur={handleClassOnBlur}
      handleHandlerOnBlur={handleHandlerOnBlur}
      handleImageTypeChange={handleImageTypeChange}
      imageType={imageType}
      mode={mode}
      setData={setData}
      setEditCode={setEditCode}
      setValidation={setValidation}
      setNewFunctionBaseImage={setNewFunctionBaseImage}
      setNewFunctionBuildImage={setNewFunctionBuildImage}
      setNewFunctionRequirements={setNewFunctionRequirements}
      setNewFunctionCommands={setNewFunctionCommands}
      setNewFunctionForceBuild={setNewFunctionForceBuild}
      setNewFunctionImage={setNewFunctionImage}
      setNewFunctionSourceCode={setNewFunctionSourceCode}
      validation={validation}
    />
  )
}

FunctionsPanelCode.propTypes = {
  defaultData: PropTypes.shape({}),
  imageType: PropTypes.string.isRequired,
  mode: PropTypes.string.isRequired,
  setImageType: PropTypes.func.isRequired,
  setValidation: PropTypes.func.isRequired,
  validation: PropTypes.shape({}).isRequired
}

export default connect((functionsStore, appStore) => ({ ...functionsStore, ...appStore }), {
  ...functionsActions
})(FunctionsPanelCode)
