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
import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Form } from 'react-final-form'
import { createForm } from 'final-form'
import { has, isEmpty, isEqual, reduce, throttle } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import { PopUpDialog, RoundedIcon, Button } from 'igz-controls/components'

import { FILTER_MENU_MODAL } from '../../constants'
import { isTargetElementInContainerElement } from '../../utils/checkElementsPosition.utils'
import {
  resetModalFilter,
  setModalFiltersInitialValues,
  setModalFiltersValues
} from '../../reducers/filtersReducer'

import { ReactComponent as FilterIcon } from 'igz-controls/images/filter.svg'

import './filterMenuModal.scss'

export const FilterMenuWizardContext = React.createContext({})

const FilterMenuModal = ({
  applyChanges = null,
  applyButton = { label: 'Apply', variant: 'secondary' },
  cancelButton = { label: 'Clear', variant: 'tertiary' },
  children,
  filterMenuName,
  header = 'Filter by',
  initialValues,
  restartFormTrigger = null,
  values,
  withoutApplyButton = false,
  wizardClassName = ''
}) => {
  const [filtersWizardIsShown, setFiltersWizardIsShown] = useState(false)
  const filtersIconButtonRef = useRef()
  const dispatch = useDispatch()
  const filtersData = useSelector(store => store.filtersStore[FILTER_MENU_MODAL][filterMenuName])
  const params = useParams()
  const formRef = React.useRef(
    createForm({
      onSubmit: () => {},
      initialValues
    })
  )
  const filtersIconClassnames = classnames(
    'filters-button',
    !isEqual(filtersData?.values, filtersData?.initialValues) && 'filters-button_applied'
  )

  const filtersWizardClassnames = classnames('filters-wizard', wizardClassName)

  useEffect(() => {
    if (!has(filtersData, 'initialValues')) {
      dispatch(setModalFiltersInitialValues({ name: filterMenuName, value: initialValues }))
    }
  }, [dispatch, filtersData, filterMenuName, initialValues])

  useEffect(() => {
    if (!has(filtersData, 'values')) {
      dispatch(setModalFiltersValues({ name: filterMenuName, value: values }))
    }
  }, [dispatch, filtersData, filterMenuName, values])

  useEffect(() => {
    if (!isEqual(initialValues, values)) {
      formRef.current?.batch(() => {
        for (const filterName in values) {
          formRef.current?.change(filterName, values[filterName])
        }
      })
    }
  }, [initialValues, values])

  const hideFiltersWizard = useCallback(event => {
    if (
      !event.target.closest('.filters-button') &&
      !event.target.closest('.filters-wizard') &&
      !isTargetElementInContainerElement(event.target, document.querySelector('.filters-wizard'))
    ) {
      setFiltersWizardIsShown(false)
    }
  }, [])

  useEffect(() => {
    const throttledHideFiltersWizard = throttle(hideFiltersWizard, 500, {
      leading: true,
      trailing: true
    })
    window.addEventListener('click', hideFiltersWizard)
    window.addEventListener('scroll', throttledHideFiltersWizard, true)

    return () => {
      window.removeEventListener('click', hideFiltersWizard)
      window.removeEventListener('scroll', throttledHideFiltersWizard, true)
    }
  }, [hideFiltersWizard])

  useEffect(() => {
    const ref = formRef.current

    return () => {
      ref.restart(initialValues)
      dispatch(resetModalFilter(filterMenuName))
    }
  }, [
    params.pageTab,
    params.projectName,
    restartFormTrigger,
    dispatch,
    initialValues,
    filterMenuName
  ])

  const getFilterCounter = formState => {
    const initialValues = applyChanges ? filtersData?.initialValues : formState.initialValues
    const currentValues = applyChanges ? filtersData?.values : formState.values

    return reduce(
      currentValues,
      (acc, filterValue, filterName) => {
        return !isEqual(filterValue, initialValues[filterName]) &&
          isEmpty(formState.errors[filterName])
          ? ++acc
          : acc
      },
      0
    )
  }

  const handleApplyFilters = formState => {
    dispatch(
      setModalFiltersValues({
        name: filterMenuName,
        value: { ...formState.values }
      })
    )
    applyChanges && applyChanges(formState.values)
    setFiltersWizardIsShown(false)
  }

  const handleClearFilters = (formState, counter) => {
    if (!isEqual(initialValues, formState.values)) {
      formRef.current.restart(initialValues)
      setFiltersWizardIsShown(false)

      if (counter > 0) {
        applyChanges && applyChanges(initialValues)
        dispatch(
          setModalFiltersValues({
            name: filterMenuName,
            value: initialValues
          })
        )
      }
    }
  }

  return (
    <Form form={formRef.current} onSubmit={() => {}}>
      {formState => {
        const counter = getFilterCounter(formState)
        return (
          <FilterMenuWizardContext.Provider value={{ filterMenuName }}>
            <RoundedIcon
              id="filter-menu-btn"
              ref={filtersIconButtonRef}
              className={filtersIconClassnames}
              isActive={filtersWizardIsShown}
              onClick={() => {
                setFiltersWizardIsShown(prevValue => !prevValue)
              }}
              tooltipText={counter > 0 ? `Filter (${counter})` : 'Filter'}
            >
              <FilterIcon />
            </RoundedIcon>
            {filtersWizardIsShown && (
              <PopUpDialog
                className={filtersWizardClassnames}
                customPosition={{
                  element: filtersIconButtonRef,
                  position: 'bottom-left'
                }}
                headerIsHidden
              >
                <>
                  <h3 className="filters-wizard__header">{header}</h3>
                  <div className="filters-wizard__list">{children}</div>
                  {(applyButton || cancelButton) && (
                    <div className="filters-wizard__modal-buttons">
                      {cancelButton && (
                        <Button
                          disabled={isEqual(formState.initialValues, formState.values)}
                          id="filter-clear-btn"
                          label={cancelButton.label}
                          onClick={() => handleClearFilters(formState, counter)}
                          variant={cancelButton.variant}
                        />
                      )}
                      {applyButton && !withoutApplyButton && (
                        <Button
                          disabled={isEqual(filtersData?.values, formState.values)}
                          id="filter-apply-btn"
                          variant={applyButton.variant}
                          label={applyButton.label}
                          onClick={() => handleApplyFilters(formState)}
                        />
                      )}
                    </div>
                  )}
                </>
              </PopUpDialog>
            )}
          </FilterMenuWizardContext.Provider>
        )
      }}
    </Form>
  )
}

FilterMenuModal.propTypes = {
  applyChanges: PropTypes.func,
  applyButton: PropTypes.shape({
    label: PropTypes.string.isRequired,
    variant: PropTypes.string.isRequired
  }),
  cancelButton: PropTypes.shape({
    label: PropTypes.string.isRequired,
    variant: PropTypes.string.isRequired
  }),
  filterMenuName: PropTypes.string.isRequired,
  header: PropTypes.string,
  initialValues: PropTypes.shape({}).isRequired,
  restartFormTrigger: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  values: PropTypes.shape({}).isRequired,
  withoutApplyButton: PropTypes.bool,
  wizardClassName: PropTypes.string
}

export default FilterMenuModal
