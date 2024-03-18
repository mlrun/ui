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
import React, { useEffect, useMemo } from 'react'
import { createForm } from 'final-form'
import arrayMutators from 'final-form-arrays'
import { Form } from 'react-final-form'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'
import { useNavigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'

import { RoundedIcon, Button } from 'igz-controls/components'
import FilterMenuModal from '../FilterMenuModal/FilterMenuModal'
import ArtifactsFilters from './ArtifactsFilters'
import NameFilter from '../../common/NameFilter/NameFilter'

import {
  GROUP_BY_NAME,
  GROUP_BY_NONE,
  REQUEST_CANCELED,
  TAG_FILTER_ALL_ITEMS
} from '../../constants'
import detailsActions from '../../actions/details'
import { removeFilters, setFilters } from '../../reducers/filtersReducer'
import { setFieldState } from 'igz-controls/utils/form.util'

import { ReactComponent as RefreshIcon } from 'igz-controls/images/refresh.svg'

function ArtifactsActionBar({
  actionButtons,
  artifacts,
  cancelRequest,
  filterMenuName,
  handleRefresh,
  page,
  removeSelectedItem,
  setContent,
  setSelectedRowData,
  tab,
  urlTagOption
}) {
  const filtersStore = useSelector(store => store.filtersStore)
  const filterMenuModal = useSelector(store => store.filtersStore.filterMenuModal[filterMenuName])
  const changes = useSelector(store => store.detailsStore.changes)
  const dispatch = useDispatch()
  const params = useParams()
  const navigate = useNavigate()
  const formRef = React.useRef(
    createForm({
      initialValues: { name: '' },
      mutators: { ...arrayMutators, setFieldState },
      onSubmit: () => {}
    })
  )

  const filtersInitialState = useMemo(() => {
    return {
      ...filterMenuModal.initialValues
    }
  }, [filterMenuModal.initialValues])

  useEffect(() => {
    return () => {
      dispatch(removeFilters())
    }
  }, [params.pageTab, params.projectName, page, tab, dispatch])

  const applyChanges = async (name, filterMenuModal) => {
    const filtersHelperResult = await filtersHelper(changes, dispatch)

    if (filtersHelperResult) {
      if (params.name) {
        navigate(`/projects/${params.projectName}/${page.toLowerCase()}${tab ? `/${tab}` : ''}`)
      }

      if (
        (filterMenuModal.tag === TAG_FILTER_ALL_ITEMS || isEmpty(filterMenuModal.iter)) &&
        filtersStore.groupBy === GROUP_BY_NONE
      ) {
        dispatch(setFilters({ groupBy: GROUP_BY_NAME }))
      } else if (
        filtersStore.groupBy === GROUP_BY_NAME &&
        filterMenuModal.tag !== TAG_FILTER_ALL_ITEMS &&
        !isEmpty(filterMenuModal.iter)
      ) {
        dispatch(setFilters({ groupBy: GROUP_BY_NONE }))
      }

      setContent([])
      dispatch(removeSelectedItem({}))
      setSelectedRowData({})
      handleRefresh({ name, ...filterMenuModal })
    }
  }

  const filtersHelper = async () => {
    let handleChangeFilters = Promise.resolve(true)

    if (changes.counter > 0) {
      handleChangeFilters = await new Promise(resolve => {
        const handleDiscardChanges = () => {
          window.removeEventListener('discardChanges', handleDiscardChanges)
          resolve(true)
        }
        window.addEventListener('discardChanges', handleDiscardChanges)

        dispatch(detailsActions.setFiltersWasHandled(true))
        dispatch(detailsActions.showWarning(true))
      })
    }

    return handleChangeFilters
  }

  const refresh = formState => {
    if (changes.counter > 0 && cancelRequest) {
      cancelRequest(REQUEST_CANCELED)
    } else {
      handleRefresh({
        name: formState.values.name,
        ...filtersStore.filterMenuModal[filterMenuName].values
      })
    }
  }

  return (
    <Form form={formRef.current} onSubmit={() => {}}>
      {formState => (
        <div className="action-bar">
          <div className="action-bar__filters">
            <NameFilter applyChanges={value => applyChanges(value, filterMenuModal.values)} />
            <FilterMenuModal
              applyChanges={filterMenuModal => applyChanges(formState.values.name, filterMenuModal)}
              filterMenuName={filterMenuName}
              initialValues={filtersInitialState}
              restartFormTrigger={tab ?? page}
              values={filterMenuModal.values}
              wizardClassName="artifacts-filters__wrapper"
            >
              <ArtifactsFilters artifacts={artifacts} />
            </FilterMenuModal>
          </div>
          <div className="action-bar__actions">
            {actionButtons.map(
              (actionButton, index) =>
                actionButton &&
                !actionButton.hidden && (
                  <Button
                    key={index}
                    variant={actionButton.variant}
                    label={actionButton.label}
                    className={actionButton.className}
                    onClick={actionButton.onClick}
                  />
                )
            )}

            <RoundedIcon tooltipText="Refresh" onClick={() => refresh(formState)} id="refresh">
              <RefreshIcon />
            </RoundedIcon>
          </div>
        </div>
      )}
    </Form>
  )
}

ArtifactsActionBar.defaultProps = {
  actionButtons: [],
  cancelRequest: null,
  tab: ''
}

ArtifactsActionBar.propTypes = {
  actionButtons: PropTypes.arrayOf(
    PropTypes.shape({
      className: PropTypes.string,
      hidden: PropTypes.bool,
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      variant: PropTypes.string.isRequired
    })
  ),
  artifacts: PropTypes.arrayOf(PropTypes.object).isRequired,
  cancelRequest: PropTypes.func,
  filterMenuName: PropTypes.string.isRequired,
  handleRefresh: PropTypes.func.isRequired,
  page: PropTypes.string.isRequired,
  removeSelectedItem: PropTypes.func.isRequired,
  setContent: PropTypes.func.isRequired,
  setSelectedRowData: PropTypes.func.isRequired,
  tab: PropTypes.string
}

export default ArtifactsActionBar
