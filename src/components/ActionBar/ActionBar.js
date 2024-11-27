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
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import arrayMutators from 'final-form-arrays'
import classnames from 'classnames'
import { Field } from 'react-final-form'
import { Form } from 'react-final-form'
import { createForm } from 'final-form'
import { isEmpty, isEqual, isNil, mapValues, pickBy } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

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
  NAME_FILTER,
  REQUEST_CANCELED,
  TAG_FILTER_ALL_ITEMS
} from '../../constants'
import detailsActions from '../../actions/details'
import { FILTERS_CONFIG } from '../../types'
import { setFilters } from '../../reducers/filtersReducer'
import { setFieldState } from 'igz-controls/utils/form.util'
import { CUSTOM_RANGE_DATE_OPTION } from '../../utils/datePicker.util'

import { ReactComponent as CollapseIcon } from 'igz-controls/images/collapse.svg'
import { ReactComponent as ExpandIcon } from 'igz-controls/images/expand.svg'
import { ReactComponent as RefreshIcon } from 'igz-controls/images/refresh.svg'

const ActionBar = ({
  autoRefreshIsEnabled = false,
  autoRefreshIsStopped = false,
  actionButtons = [],
  cancelRequest = null,
  children,
  expand,
  filters,
  filtersConfig,
  handleExpandAll,
  handleRefresh,
  hidden = false,
  navigateLink,
  page,
  removeSelectedItem = null,
  setSelectedRowData = null,
  tab = '',
  withRefreshButton = true,
  withoutExpandButton
}) => {
  const [autoRefresh, setAutoRefresh] = useState(autoRefreshIsEnabled)
  const filtersStore = useSelector(store => store.filtersStore)
  const formInitialValuesAreSetRef = useRef(false)
  const changes = useSelector(store => store.detailsStore.changes)
  const dispatch = useDispatch()
  const params = useParams()
  const navigate = useNavigate()
  const [, setSearchParams] = useSearchParams()

  const actionBarClassNames = classnames('action-bar', hidden && 'action-bar_hidden')

  const getFilterMenu = useCallback(
    isModal => {
      return filters && filtersConfig
        ? pickBy(
            filters,
            (_, filerName) =>
              filerName in filtersConfig && Boolean(filtersConfig[filerName].isModal) === isModal
          )
        : {}
    },
    [filters, filtersConfig]
  )

  const filterMenu = useMemo(() => getFilterMenu(false), [getFilterMenu])
  const filterMenuModal = useMemo(() => getFilterMenu(true), [getFilterMenu])

  const formInitialValues = useMemo(() => {
    const initialValues = {
      [AUTO_REFRESH_ID]: autoRefreshIsEnabled
    }

    if (!formInitialValuesAreSetRef.current) {
      for (const [filterName, filterConfig] of Object.entries(filtersConfig)) {
        if (!filterConfig.isModal) {
          initialValues[filterName] = filterConfig.initialValue
        }
      }
      formInitialValuesAreSetRef.current = true
    }

    return initialValues
  }, [autoRefreshIsEnabled, filtersConfig])

  const formRef = React.useRef(
    createForm({
      initialValues: formInitialValues,
      mutators: { ...arrayMutators, setFieldState },
      onSubmit: () => {}
    })
  )

  const filterMenuModalInitialState = useMemo(() => {
    return mapValues(
      pickBy(filtersConfig, filterConfig => filterConfig.isModal),
      filterConfig => filterConfig.initialValue
    )
  }, [filtersConfig])

  const filtersHelper = useCallback(async () => {
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
  }, [changes.counter, dispatch])

  const saveFilters = useCallback(
    filtersForSaving => {
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

          setSearchParams(
            prevSearchParams => {
              prevSearchParams.set(filterName, newFilterValue)
              return prevSearchParams
            },
            { replace: true }
          )
        } else {
          setSearchParams(
            prevSearchParams => {
              prevSearchParams.delete(filterName)
              return prevSearchParams
            },
            { replace: true }
          )
        }
      }
    },
    [filtersConfig, setSearchParams]
  )

  const applyChanges = useCallback(
    async (formValues, filters) => {
      const filtersHelperResult = await filtersHelper(changes, dispatch)
      const newFilters = { ...filters, ...formValues }

      if (filtersHelperResult) {
        if (params.name || params.funcName || params.hash) {
          navigate(navigateLink)
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
        handleExpandAll && handleExpandAll(true)
        handleRefresh(newFilters)
      }
    },
    [
      filtersHelper,
      changes,
      dispatch,
      saveFilters,
      params.name,
      params.funcName,
      params.hash,
      filtersStore.groupBy,
      removeSelectedItem,
      setSelectedRowData,
      handleExpandAll,
      handleRefresh,
      navigate,
      navigateLink
    ]
  )

  const refresh = useCallback(
    formState => {
      if (changes.counter > 0 && cancelRequest) {
        cancelRequest(REQUEST_CANCELED)
      } else {
        saveFilters(formState.values)
        handleRefresh({
          ...filters,
          ...formState.values
        })
      }
    },
    [cancelRequest, changes.counter, filters, handleRefresh, saveFilters]
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

    applyChanges(newFilterValues, filterMenuModal)
    input.onChange(selectedDate)
  }

  useLayoutEffect(() => {
    return () => {
      formInitialValuesAreSetRef.current = false
    }
  }, [params.projectName, params.name, page, tab])

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
    if (autoRefreshIsEnabled && autoRefresh && !hidden) {
      const intervalId = setInterval(() => {
        if (!autoRefreshIsStopped) {
          refresh(formRef.current.getState())
        }
      }, 30000)

      return () => clearInterval(intervalId)
    }
  }, [autoRefresh, autoRefreshIsStopped, hidden, autoRefreshIsEnabled, refresh])

  return (
    <Form form={formRef.current} onSubmit={() => {}}>
      {formState => (
        <div className={actionBarClassNames}>
          <div className="action-bar__filters">
            {NAME_FILTER in filterMenu && !filtersConfig[NAME_FILTER].hidden && (
              <div key={NAME_FILTER} className="action-bar__filters-item">
                <NameFilter
                  applyChanges={value =>
                    applyChanges({ ...formState.values, name: value }, filterMenuModal)
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
                        key={tab}
                        className="details-date-picker"
                        date={input.value.value[0]}
                        dateTo={input.value.value[1]}
                        hasFutureOptions={filtersConfig[DATES_FILTER].isFuture}
                        selectedOptionId={input.value.initialSelectedOptionId}
                        label=""
                        onChange={(dates, isPredefined, optionId) =>
                          handleDateChange(dates, isPredefined, optionId, input, formState)
                        }
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
              applyChanges={filterMenuModal => applyChanges(formState.values, filterMenuModal)}
              initialValues={filterMenuModalInitialState}
              restartFormTrigger={`${tab}`}
              values={filterMenuModal}
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
                      onClick={actionButton.onClick}
                    />
                  ))
              )}
              {autoRefreshIsEnabled && (
                <FormCheckBox
                  className="auto-refresh"
                  label={AUTO_REFRESH}
                  name={AUTO_REFRESH_ID}
                />
              )}
              <FormOnChange handler={setAutoRefresh} name={AUTO_REFRESH_ID} />
              {withRefreshButton && (
                <RoundedIcon tooltipText="Refresh" onClick={() => refresh(formState)} id="refresh">
                  <RefreshIcon />
                </RoundedIcon>
              )}
              {!withoutExpandButton && filtersStore.groupBy !== GROUP_BY_NONE && (
                <RoundedIcon
                  id="toggle-collapse"
                  tooltipText={expand ? 'Collapse' : 'Expand all'}
                  onClick={() => handleExpandAll()}
                >
                  {expand ? <CollapseIcon /> : <ExpandIcon />}
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
  autoRefreshIsEnabled: PropTypes.bool,
  autoRefreshIsStopped: PropTypes.bool,
  cancelRequest: PropTypes.func,
  expand: PropTypes.bool,
  filters: PropTypes.object.isRequired,
  filtersConfig: FILTERS_CONFIG.isRequired,
  handleExpandAll: PropTypes.func,
  handleRefresh: PropTypes.func.isRequired,
  hidden: PropTypes.bool,
  navigateLink: PropTypes.string,
  page: PropTypes.string.isRequired,
  removeSelectedItem: PropTypes.func,
  setSelectedRowData: PropTypes.func,
  tab: PropTypes.string,
  withRefreshButton: PropTypes.bool,
  withoutExpandButton: PropTypes.bool
}

export default ActionBar
