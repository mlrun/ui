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
import { Form } from 'react-final-form'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'
import { createForm } from 'final-form'
import { Field } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import PropTypes from 'prop-types'
import { useNavigate, useParams } from 'react-router-dom'

import FilterMenuModal from '../FilterMenuModal/FilterMenuModal'
import NameFilter from '../../common/NameFilter/NameFilter'
import { RoundedIcon, Button } from 'igz-controls/components'
import DatePicker from '../../common/DatePicker/DatePicker'

import { setFieldState } from 'igz-controls/utils/form.util'
import { removeFilters, setFilters } from '../../reducers/filtersReducer'
import detailsActions from '../../actions/details'
import {
  GROUP_BY_NAME,
  GROUP_BY_NONE,
  NAME_FILTER,
  REQUEST_CANCELED,
  TAG_FILTER_ALL_ITEMS
} from '../../constants'
import { NEXT_24_HOUR_DATE_OPTION, PAST_24_HOUR_DATE_OPTION } from '../../utils/datePicker.util'

import { ReactComponent as RefreshIcon } from 'igz-controls/images/refresh.svg'

const ActionBar = ({
  actionButtons,
  cancelRequest,
  children,
  filterMenuName,
  filters,
  handleRefresh,
  navigateLink,
  page,
  removeSelectedItem,
  setSelectedRowData,
  tab,
  withRefreshButton
}) => {
  const filtersStore = useSelector(store => store.filtersStore)
  const filterMenuModal = useSelector(store => store.filtersStore.filterMenuModal?.[filterMenuName])
  const changes = useSelector(store => store.detailsStore.changes)
  const dispatch = useDispatch()
  const params = useParams()
  const navigate = useNavigate()

  const formInitialValues = useMemo(() => {
    const values = {}

    filters.map(filter => (values[filter.type] = filter.initialValue))

    return values
  }, [filters])

  const formRef = React.useRef(
    createForm({
      initialValues: formInitialValues,
      mutators: { ...arrayMutators, setFieldState },
      onSubmit: () => {}
    })
  )

  const filterMenuModalInitialState = useMemo(() => {
    return (
      filterMenuModal?.initialValues && {
        ...filterMenuModal.initialValues
      }
    )
  }, [filterMenuModal?.initialValues])

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

  const applyChanges = async (formValues, filterMenuModal) => {
    const filtersHelperResult = await filtersHelper(changes, dispatch)

    if (filtersHelperResult) {
      if (params.name) {
        navigate(navigateLink)
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

      removeSelectedItem && dispatch(removeSelectedItem({}))
      setSelectedRowData && setSelectedRowData({})
      handleRefresh({ ...formValues, ...filterMenuModal })
    }
  }

  const refresh = formState => {
    if (changes.counter > 0 && cancelRequest) {
      cancelRequest(REQUEST_CANCELED)
    } else {
      handleRefresh({
        ...formState.values,
        ...filtersStore.filterMenuModal[filterMenuName].values
      })
    }
  }

  const handleDateChange = (dates, isPredefined, input, formState) => {
    const generatedDates = [...dates]

    if (generatedDates.length === 1) {
      generatedDates.push(new Date())
    }

    dispatch(
      setFilters({
        dates: {
          value: generatedDates,
          isPredefined
        }
      })
    )
    applyChanges(
      {
        ...formState.values,
        dates: {
          value: generatedDates,
          isPredefined
        }
      },
      filterMenuModal.values
    )
    input.onChange({
      value: generatedDates,
      isPredefined
    })
  }

  useEffect(() => {
    return () => {
      dispatch(removeFilters())
    }
  }, [params.projectName, params.name, page, tab, dispatch])

  return (
    <Form form={formRef.current} onSubmit={() => {}}>
      {formState => (
        <div className="action-bar">
          <div className="action-bar__filters">
            {filters.map(filter => {
              switch (filter.type) {
                case NAME_FILTER:
                  return (
                    !filter.hidden && (
                      <div className="action-bar__filters-item" key={filter.type}>
                        <NameFilter
                          applyChanges={value =>
                            applyChanges(
                              { ...formState.values, name: value },
                              filterMenuModal.values
                            )
                          }
                        />
                      </div>
                    )
                  )
                case 'dates':
                  return (
                    <div className="action-bar__filters-item" key={filter.type}>
                      <Field name={'dates'}>
                        {({ input }) => {
                          return (
                            <DatePicker
                              className="details-date-picker"
                              date={input.value.value[0]}
                              dateTo={input.value.value[1]}
                              hasFutureOptions={filter.isFuture}
                              selectedOptionId={filter.isFuture ? NEXT_24_HOUR_DATE_OPTION : PAST_24_HOUR_DATE_OPTION}
                              label=""
                              onChange={(dates, isPredefined) =>
                                handleDateChange(dates, isPredefined, input, formState)
                              }
                              type="date-range-time"
                              withLabels
                            />
                          )
                        }}
                      </Field>
                    </div>
                  )
                default:
                  return null
              }
            })}
            {filterMenuModal && (
              <FilterMenuModal
                applyChanges={filterMenuModal => applyChanges(formState.values, filterMenuModal)}
                filterMenuName={filterMenuName}
                initialValues={filterMenuModalInitialState}
                restartFormTrigger={tab}
                values={filterMenuModal.values}
              >
                {children}
              </FilterMenuModal>
            )}
          </div>
          {(withRefreshButton || !isEmpty(actionButtons)) && (
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

              {withRefreshButton && (
                <RoundedIcon tooltipText="Refresh" onClick={() => refresh(formState)} id="refresh">
                  <RefreshIcon />
                </RoundedIcon>
              )}
            </div>
          )}
        </div>
      )}
    </Form>
  )
}

ActionBar.defaultProps = {
  actionButtons: [],
  cancelRequest: null,
  removeSelectedItem: null,
  setSelectedRowData: null,
  tab: '',
  withRefreshButton: true
}

ActionBar.propTypes = {
  actionButtons: PropTypes.arrayOf(
    PropTypes.shape({
      className: PropTypes.string,
      hidden: PropTypes.bool,
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      variant: PropTypes.string.isRequired
    })
  ),
  cancelRequest: PropTypes.func,
  filterMenuName: PropTypes.string.isRequired,
  handleRefresh: PropTypes.func.isRequired,
  navigateLink: PropTypes.string,
  page: PropTypes.string.isRequired,
  removeSelectedItem: PropTypes.func,
  setContent: PropTypes.func.isRequired,
  setSelectedRowData: PropTypes.func,
  tab: PropTypes.string,
  withRefreshButton: PropTypes.bool
}

export default ActionBar
