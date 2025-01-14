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
import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'

import Loader from '../../common/Loader/Loader'
import Details from '../../components/Details/Details'
import { Modal } from 'igz-controls/components'

import { MODAL_MAX } from 'igz-controls/constants'
import { DETAILS_OVERVIEW_TAB } from '../../constants'

const DetailsPopUp = ({
  actionsMenu,
  formInitialValues = {},
  handleRefresh,
  isLoading,
  isOpen,
  onResolve,
  pageData,
  selectedItem
}) => {
  const location = useLocation()
  const initialLocationPathnameRef = useRef(null)
  const [detailsPopUpSelectedTab, setDetailsPopUpSelectedTab] = useState(DETAILS_OVERVIEW_TAB)

  useEffect(() => {
    if (!initialLocationPathnameRef.current) {
      initialLocationPathnameRef.current = location.pathname
    } else if (initialLocationPathnameRef.current !== location.pathname) {
      onResolve()
    }
  }, [location.pathname, onResolve])

  return (
    <Modal onClose={onResolve} show={isOpen} size={MODAL_MAX} location={location} noHeader>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="function-popup">
          <Details
            actionsMenu={actionsMenu}
            detailsMenu={pageData.details?.menu}
            detailsPopUpSelectedTab={detailsPopUpSelectedTab}
            formInitialValues={formInitialValues}
            handleCancel={onResolve}
            handleRefresh={handleRefresh}
            isDetailsPopUp
            isDetailsScreen
            pageData={pageData}
            selectedItem={selectedItem}
            setDetailsPopUpSelectedTab={setDetailsPopUpSelectedTab}
          />
        </div>
      )}
    </Modal>
  )
}

DetailsPopUp.propTypes = {
  actionsMenu: PropTypes.oneOfType([PropTypes.func, PropTypes.array]).isRequired,
  handleRefresh: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onResolve: PropTypes.func.isRequired,
  pageData: PropTypes.object.isRequired,
  selectedItem: PropTypes.object.isRequired
}

export default DetailsPopUp
