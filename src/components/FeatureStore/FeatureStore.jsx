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
import React, { useCallback, useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import Breadcrumbs from '../../common/Breadcrumbs/Breadcrumbs'
import { ConfirmDialog, Loader } from 'igz-controls/components'

import { TABLE_CONTAINER } from '../../constants'
import { toggleYaml } from '../../reducers/appReducer'

import './featureStore.scss'

export const FeatureStoreContext = React.createContext({})

const FeatureStore = () => {
  const [featureSetsPanelIsOpen, setFeatureSetsPanelIsOpen] = useState(false)
  const [createVectorPopUpIsOpen, setCreateVectorPopUpIsOpen] = useState(false)
  const [confirmData, setConfirmData] = useState(null)
  const featureStore = useSelector(store => store.featureStore)

  const dispatch = useDispatch()
  const params = useParams()

  const toggleConvertedYaml = useCallback(
    data => {
      return dispatch(toggleYaml(data))
    },
    [dispatch]
  )

  return (
    <>
      <div className="content-wrapper">
        <div className="content__header">
          <Breadcrumbs itemName={params.name} />
        </div>
        <div className="content">
          <div className={TABLE_CONTAINER}>
            <FeatureStoreContext.Provider
              value={{
                setConfirmData,
                createVectorPopUpIsOpen,
                featureSetsPanelIsOpen,
                setFeatureSetsPanelIsOpen,
                setCreateVectorPopUpIsOpen,
                toggleConvertedYaml
              }}
            >
              <Outlet />
            </FeatureStoreContext.Provider>
            {(featureStore.loading ||
              featureStore.entities.loading ||
              featureStore.features.loading) && <Loader />}
          </div>
        </div>
      </div>
      {confirmData && (
        <ConfirmDialog
          cancelButton={{
            handler: confirmData.rejectHandler,
            label: confirmData.btnCancelLabel,
            variant: confirmData.btnCancelVariant
          }}
          closePopUp={confirmData.rejectHandler}
          confirmButton={{
            handler: () => confirmData.confirmHandler(confirmData.item),
            label: confirmData.btnConfirmLabel,
            variant: confirmData.btnConfirmVariant
          }}
          header={confirmData.header}
          isOpen={Boolean(confirmData)}
          message={confirmData.message}
        />
      )}
    </>
  )
}

export default FeatureStore
