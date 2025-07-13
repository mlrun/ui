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
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import arrayMutators from 'final-form-arrays'
import classnames from 'classnames'
import { Field } from 'react-final-form'
import { Form } from 'react-final-form'
import { createForm } from 'final-form'
import { isEmpty, isEqual, isNil, mapValues, pickBy } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import DatePicker from '../../common/DatePicker/DatePicker'
import FilterMenuModal from '../FilterMenuModal/FilterMenuModal'
import NameFilter from '../../common/NameFilter/NameFilter'
import { RoundedIcon, Button, FormCheckBox, FormOnChange } from 'igz-controls/components'

import {
  AUTO_REFRESH,
  AUTO_REFRESH_ID,
  DATES_FILTER,
  GROUP_BY_NAME,
  GROUP_BY_NONE,
  INTERNAL_AUTO_REFRESH_ID,
  NAME_FILTER,
  REQUEST_CANCELED,
  TAG_FILTER_ALL_ITEMS
} from '../../constants'
import { CUSTOM_RANGE_DATE_OPTION } from '../../utils/datePicker.util'
import { FILTERS_CONFIG } from '../../types'
import { getCloseDetailsLink } from '../../utils/link-helper.util'
import { setFieldState } from 'igz-controls/utils/form.util'
import {
  setFilters,
  toggleAutoRefresh,
  toggleInternalAutoRefresh
} from '../../reducers/filtersReducer'
import { performDetailsActionHelper } from '../Details/details.util'

import CollapseIcon from 'igz-controls/images/collapse.svg?react'
import ExpandIcon from 'igz-controls/images/expand.svg?react'
import RefreshIcon from 'igz-controls/images/refresh.svg?react'

const ActionBar = ({
  actionButtons = [],
  allRowsAreExpanded,
  autoRefreshIsEnabled = false,
  autoRefreshIsStopped = false,
  autoRefreshStopTrigger = false,
  cancelRequest = null,
  children,
  closeParamName = '',
  filters,
  filtersConfig,
  handleAutoRefreshPrevValueChange = null,
  handleRefresh,
  hidden = false,
  internalAutoRefreshIsEnabled = false,
  removeSelectedItem = null,
  selectedItemName = '',
  setSearchParams,
  setSelectedRowData = null,
  tab = '',
  toggleAllRows,
  withAutoRefresh = false,
  withInternalAutoRefresh = false,
  withRefreshButton = true,
  withoutExpandButton
}) => {
  const [internalAutoRefreshPrevValue, setInternalAutoRefreshPrevValue] = useState(
    internalAutoRefreshIsEnabled
  )
  const filtersStore = useSelector(store => store.filtersStore)
  const changes = useSelector(store => store.commonDetailsStore.changes)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const params = useParams()

  const actionBarClassNames = classnames('action-bar', hidden && 'action-bar_hidden')

  const getFilterMenu = useCallback(
    isModal => {
      return filters && filtersConfig
        ? pickBy(
            filters,
            (_, filerName) =>
              filerName in filtersConfig &&
              !filtersConfig[filerName].hidden &&
              Boolean(filtersConfig[filerName].isModal) === isModal
          )
        : {}
    },
    [filters, filtersConfig]
  )

  const filterMenu = useMemo(() => getFilterMenu(false), [getFilterMenu])
  const filterMenuModal = useMemo(() => getFilterMenu(true), [getFilterMenu])

  const formFiltersInitialValues = useMemo(() => {
    const initialValues = {}

    for (const [filterName, filterConfig] of Object.entries(filtersConfig)) {
      if (!filterConfig.isModal && !filterConfig.hidden) {
        initialValues[filterName] = filterConfig.initialValue
      }
    }

    return initialValues
  }, [filtersConfig])

  const formInitialValues = useMemo(() => {
    const initialValues = {
      [AUTO_REFRESH_ID]: autoRefreshIsEnabled,
      [INTERNAL_AUTO_REFRESH_ID]: internalAutoRefreshIsEnabled,
      ...formFiltersInitialValues
    }

    return initialValues
  }, [autoRefreshIsEnabled, formFiltersInitialValues, internalAutoRefreshIsEnabled])

  const formRef = React.useRef(
    createForm({
      initialValues: formInitialValues,
      mutators: { ...arrayMutators, setFieldState },
      onSubmit: () => {}
    })
  )

  const filterMenuModalInitialState = useMemo(() => {
    return mapValues(
      pickBy(filtersConfig, filterConfig => filterConfig.isModal && !filterConfig.hidden),
      filterConfig => filterConfig.initialValue
    )
  }, [filtersConfig])

  const saveFilters = useCallback(
    filtersForSaving => {
      if (!isEmpty(filtersForSaving)) {
        setSearchParams(
          prevSearchParams => {
            for (const [filterName, filterValue] of Object.entries(filtersForSaving)) {
              if (
                !isNil(filtersConfig[filterName]?.initialValue) &&
                !isEqual(filtersConfig[filterName].initialValue, filterValue)
              ) {
                let newFilterValue = filterValue

                if (filterName === DATES_FILTER) {
                  newFilterValue =
                    filterValue.initialSelectedOptionId === CUSTOM_RANGE_DATE_OPTION
                      ? filterValue.value.map(date => new Date(date).getTime()).join('-')
                      : filterValue.initialSelectedOptionId
                }

                prevSearchParams.set(filterName, newFilterValue)
              } else {
                prevSearchParams.delete(filterName)
              }
            }

            return prevSearchParams
          },
          { replace: true }
        )
      }
    },
    [filtersConfig, setSearchParams]
  )

  const applyFilters = useCallback(
    async (formValues, filters, actionCanBePerformedChecked) => {
      const actionCanBePerformed = actionCanBePerformedChecked || await performDetailsActionHelper(changes, dispatch, true)
      const newFilters = { ...filters, ...formValues }

      if (actionCanBePerformed) {
        if (closeParamName) {
          navigate(getCloseDetailsLink(closeParamName, true, selectedItemName), { replace: true })
        }

        if (
          (filters.tag === TAG_FILTER_ALL_ITEMS || isEmpty(filters.iter)) &&
          filtersStore.groupBy === GROUP_BY_NONE
        ) {
          dispatch(setFilters({ groupBy: GROUP_BY_NAME }))
        } else if (
          filtersStore.groupBy === GROUP_BY_NAME &&
          filters.tag !== TAG_FILTER_ALL_ITEMS &&
          !isEmpty(filters.iter)
        ) {
          dispatch(setFilters({ groupBy: GROUP_BY_NONE }))
        }

        saveFilters(newFilters)
        removeSelectedItem && dispatch(removeSelectedItem({}))
        setSelectedRowData && setSelectedRowData({})
        toggleAllRows && toggleAllRows(true)
        handleRefresh(newFilters, true)
      }
    },
    [
      changes,
      dispatch,
      closeParamName,
      filtersStore.groupBy,
      saveFilters,
      removeSelectedItem,
      setSelectedRowData,
      toggleAllRows,
      handleRefresh,
      navigate,
      selectedItemName
    ]
  )

  const refresh = useCallback(
    async formState => {
      const actionCanBePerformed = await performDetailsActionHelper(changes, dispatch)

      if (actionCanBePerformed) {
        if (changes.counter > 0 && cancelRequest) {
          cancelRequest(REQUEST_CANCELED)
        } else {
          saveFilters(formState.values)
          handleRefresh({
            ...filters,
            ...formState.values
          })
        }
      }
    },
    [changes, dispatch, cancelRequest, saveFilters, handleRefresh, filters]
  )

  const handleDateChange = (dates, isPredefined, optionId, input, formState) => {
    const generatedDates = [...dates]

    if (generatedDates.length === 1) {
      generatedDates.push(new Date())
    }

    const selectedDate = {
      value: generatedDates,
      isPredefined,
      initialSelectedOptionId: optionId
    }

    const newFilterValues = { ...formState.values, [DATES_FILTER]: selectedDate }

    applyFilters(newFilterValues, filterMenuModal)
    input.onChange(selectedDate)
  }

  const handleActionClick = async handler => {
    const actionCanBePerformed = await performDetailsActionHelper(changes, dispatch)

    if (actionCanBePerformed) {
      handler(params, handleRefresh, filters)
    }
  }

  useEffect(() => {
    if (!isEqual(formRef.current?.getState().values, filterMenu)) {
      formRef.current?.batch(() => {
        for (const filterName in filterMenu) {
          formRef.current?.change(filterName, filterMenu[filterName])
        }
      })
    }
  }, [filterMenu, filtersConfig])

  useEffect(() => {
    if (
      ((filtersStore.autoRefresh && !withInternalAutoRefresh) ||
        filtersStore.internalAutoRefresh) &&
      !hidden
    ) {
      const intervalId = setInterval(() => {
        if (!autoRefreshIsStopped) {
          refresh(formRef.current.getState())
        }
      }, 30000)

      return () => clearInterval(intervalId)
    }
  }, [
    autoRefreshIsStopped,
    hidden,
    refresh,
    withInternalAutoRefresh,
    filtersStore.internalAutoRefresh,
    filtersStore.autoRefresh
  ])

  useEffect(() => {
    if (autoRefreshStopTrigger && filtersStore.internalAutoRefresh) {
      formRef.current?.change(INTERNAL_AUTO_REFRESH_ID, false)
      setInternalAutoRefreshPrevValue(true)
      dispatch(toggleInternalAutoRefresh(false))
      handleAutoRefreshPrevValueChange && handleAutoRefreshPrevValueChange(true)
    } else if (!autoRefreshStopTrigger && internalAutoRefreshPrevValue) {
      setInternalAutoRefreshPrevValue(false)
      dispatch(toggleInternalAutoRefresh(true))
      formRef.current?.change(INTERNAL_AUTO_REFRESH_ID, true)
      handleAutoRefreshPrevValueChange && handleAutoRefreshPrevValueChange(false)
    }
  }, [
    internalAutoRefreshPrevValue,
    autoRefreshStopTrigger,
    handleAutoRefreshPrevValueChange,
    dispatch,
    filtersStore.internalAutoRefresh
  ])

  useEffect(() => {
    return () => {
      setInternalAutoRefreshPrevValue(false)
    }
  }, [])

  useLayoutEffect(() => {
    const prevValues = formRef.current.getState().values
    const valuesToReset = {
      [INTERNAL_AUTO_REFRESH_ID]: prevValues[INTERNAL_AUTO_REFRESH_ID],
      [AUTO_REFRESH_ID]: prevValues[AUTO_REFRESH_ID],
      ...formFiltersInitialValues
    }
    formRef.current.reset(valuesToReset)
  }, [formFiltersInitialValues])

  useLayoutEffect(() => {
    formRef.current?.batch(() => {
      formRef.current?.change(AUTO_REFRESH_ID, autoRefreshIsEnabled)
      formRef.current?.change(INTERNAL_AUTO_REFRESH_ID, internalAutoRefreshIsEnabled)
    })
  }, [autoRefreshIsEnabled, internalAutoRefreshIsEnabled])

  useEffect(() => {
    dispatch(toggleAutoRefresh(false))
    dispatch(toggleInternalAutoRefresh(false))
  }, [dispatch, params.projectName])

  return (
    <Form form={formRef.current} onSubmit={() => {}}>
      {formState => (
        <div className={actionBarClassNames}>
          <div className="action-bar__filters">
            {NAME_FILTER in filterMenu && !filtersConfig[NAME_FILTER].hidden && (
              <div key={NAME_FILTER} className="action-bar__filters-item">
                <NameFilter
                  applyChanges={value =>
                    applyFilters({ ...formState.values, name: value }, filterMenuModal)
                  }
                />
              </div>
            )}
            {DATES_FILTER in filterMenu && !filtersConfig[DATES_FILTER].hidden && (
              <div key={DATES_FILTER} className="action-bar__filters-item filter-column">
                <Field name={DATES_FILTER}>
                  {({ input }) => {
                    return (
                      <DatePicker
                        customOptions={filtersConfig[DATES_FILTER].customOptions}
                        excludeCustomRange={filtersConfig[DATES_FILTER].excludeCustomRange}
                        key={tab}
                        className="details-date-picker"
                        date={input.value.value[0]}
                        dateTo={input.value.value[1]}
                        hasFutureOptions={filtersConfig[DATES_FILTER].isFuture}
                        selectedOptionId={
                          filterMenu[DATES_FILTER]?.initialSelectedOptionId ||
                          input.value.initialSelectedOptionId
                        }
                        label=""
                        onChange={(dates, isPredefined, optionId) =>
                          handleDateChange(dates, isPredefined, optionId, input, formState)
                        }
                        timeFrameLimit={filtersConfig[DATES_FILTER].timeFrameLimit}
                        type="date-range-time"
                        withLabels
                      />
                    )
                  }}
                </Field>
              </div>
            )}
          </div>
          {!isEmpty(filterMenuModalInitialState) && (
            <FilterMenuModal
              applyChanges={(filterMenuModal, actionCanBePerformedChecked) => applyFilters(formState.values, filterMenuModal, actionCanBePerformedChecked)}
              initialValues={filterMenuModalInitialState}
              values={filterMenuModal}
              detailsChanges={changes}
            >
              {children}
            </FilterMenuModal>
          )}
          {(withRefreshButton || !isEmpty(actionButtons)) && (
            <div className="action-bar__actions">
              {actionButtons.map(
                (actionButton, index) =>
                  actionButton &&
                  !actionButton.hidden &&
                  (actionButton.template || (
                    <Button
                      disabled={actionButton.disabled}
                      key={index}
                      variant={actionButton.variant}
                      label={actionButton.label}
                      className={actionButton.className}
                      icon={actionButton.icon}
                      onClick={() => {
                        handleActionClick(actionButton.onClick)
                      }}
                    />
                  ))
              )}
              {withAutoRefresh && !withInternalAutoRefresh && (
                <>
                  <FormCheckBox
                    className="auto-refresh"
                    label={AUTO_REFRESH}
                    name={AUTO_REFRESH_ID}
                  />
                  <FormOnChange
                    handler={value => {
                      dispatch(toggleAutoRefresh(value))
                    }}
                    name={AUTO_REFRESH_ID}
                  />
                </>
              )}
              {withInternalAutoRefresh && (
                <>
                  <FormCheckBox
                    className="auto-refresh"
                    disabled={autoRefreshStopTrigger}
                    label={AUTO_REFRESH}
                    name={INTERNAL_AUTO_REFRESH_ID}
                  />
                  <FormOnChange
                    handler={value => {
                      dispatch(toggleInternalAutoRefresh(value))
                    }}
                    name={INTERNAL_AUTO_REFRESH_ID}
                  />
                </>
              )}
              {withRefreshButton && (
                <RoundedIcon tooltipText="Refresh" onClick={() => refresh(formState)} id="refresh">
                  <RefreshIcon />
                </RoundedIcon>
              )}
              {!withoutExpandButton && filtersStore.groupBy !== GROUP_BY_NONE && (
                <RoundedIcon
                  id="toggle-collapse"
                  tooltipText={allRowsAreExpanded ? 'Collapse' : 'Expand all'}
                  onClick={() => toggleAllRows(allRowsAreExpanded)}
                >
                  {allRowsAreExpanded ? <CollapseIcon /> : <ExpandIcon />}
                </RoundedIcon>
              )}
            </div>
          )}
        </div>
      )}
    </Form>
  )
}

ActionBar.propTypes = {
  actionButtons: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        className: PropTypes.string,
        hidden: PropTypes.bool,
        label: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
        variant: PropTypes.string
      }),
      PropTypes.shape({
        hidden: PropTypes.bool.isRequired,
        template: PropTypes.object.isRequired
      })
    ])
  ),
  allRowsAreExpanded: PropTypes.bool,
  autoRefreshIsEnabled: PropTypes.bool,
  autoRefreshIsStopped: PropTypes.bool,
  autoRefreshStopTrigger: PropTypes.bool,
  cancelRequest: PropTypes.func,
  children: PropTypes.node,
  closeParamName: PropTypes.string,
  filters: PropTypes.object.isRequired,
  filtersConfig: FILTERS_CONFIG.isRequired,
  handleAutoRefreshPrevValueChange: PropTypes.func,
  handleRefresh: PropTypes.func.isRequired,
  hidden: PropTypes.bool,
  internalAutoRefreshIsEnabled: PropTypes.bool,
  removeSelectedItem: PropTypes.func,
  selectedItemName: PropTypes.string,
  setSearchParams: PropTypes.func.isRequired,
  setSelectedRowData: PropTypes.func,
  tab: PropTypes.string,
  toggleAllRows: PropTypes.func,
  withAutoRefresh: PropTypes.bool,
  withInternalAutoRefresh: PropTypes.bool,
  withRefreshButton: PropTypes.bool,
  withoutExpandButton: PropTypes.bool
}

export default React.memo(ActionBar)
