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
import classnames from 'classnames'
import { Form } from 'react-final-form'
import { createForm } from 'final-form'
import { isEqual, reduce, throttle } from 'lodash-es'
import { useDispatch } from 'react-redux'

import { PopUpDialog, RoundedIcon, Button } from 'igz-controls/components'

import { PRIMARY_BUTTON, TERTIARY_BUTTON } from 'igz-controls/constants'
import { isTargetElementInContainerElement } from '../../utils/checkElementsPosition.utils'
import { setModalFiltersValues } from '../../reducers/filtersReducer'
import { performDetailsActionHelper } from '../Details/details.util'

import FilterIcon from 'igz-controls/images/filter.svg?react'

import './filterMenuModal.scss'

const FilterMenuWizardContext = React.createContext({})

const FilterMenuModal = ({
  applyChanges = null,
  applyButton = { label: 'Apply', variant: PRIMARY_BUTTON },
  cancelButton = { label: 'Clear', variant: TERTIARY_BUTTON },
  children,
  detailsChanges = null,
  filterMenuName = '',
  header = 'Filter by',
  initialValues,
  values,
  withoutApplyButton = false,
  wizardClassName = ''
}) => {
  const [filtersWizardIsShown, setFiltersWizardIsShown] = useState(false)
  const filtersIconButtonRef = useRef()
  const dispatch = useDispatch()
  const appliedValues = useMemo(
    () => ({
      ...initialValues,
      ...values
    }),
    [initialValues, values]
  )
  const [form] = useState(() =>
    createForm({
      onSubmit: () => {},
      initialValues: appliedValues
    })
  )
  const previousAppliedValuesRef = useRef(appliedValues)

  const filtersIconClassnames = classnames(
    'filters-button',
    !isEqual(appliedValues, initialValues) && 'filters-button_applied'
  )

  const filtersWizardClassnames = classnames('filters-wizard', wizardClassName)

  useLayoutEffect(() => {
    if (!isEqual(previousAppliedValuesRef.current, appliedValues)) {
      previousAppliedValuesRef.current = appliedValues
      form.initialize(appliedValues)
    }
  }, [appliedValues, form])

  const preserveDraftForRemount = useCallback(() => {
    const formState = form.getState()

    if (!isEqual(formState.initialValues, formState.values)) {
      form.initialize(formState.values)
    }
  }, [form])

  const hideFiltersWizard = useCallback(
    event => {
      if (
        !event.target.closest('.filters-button') &&
        !event.target.closest('.filters-wizard') &&
        !isTargetElementInContainerElement(event.target, document.querySelector('.filters-wizard'))
      ) {
        preserveDraftForRemount()
        setFiltersWizardIsShown(false)
      }
    },
    [preserveDraftForRemount]
  )

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

  const getFilterCounter = () => {
    return reduce(
      appliedValues,
      (acc, filterValue, filterName) => {
        return !isEqual(filterValue, initialValues[filterName]) ? ++acc : acc
      },
      0
    )
  }

  const handleApplyFilters = formState => {
    if (filterMenuName) {
      dispatch(
        setModalFiltersValues({
          name: filterMenuName,
          value: { ...formState.values }
        })
      )
    }

    applyChanges && applyChanges(formState.values)
    preserveDraftForRemount()
    setFiltersWizardIsShown(false)
  }

  const handleClearFilters = async (formState, counter) => {
    if (!isEqual(initialValues, formState.values)) {
      let actionCanBePerformed = true

      if (detailsChanges) {
        actionCanBePerformed = await performDetailsActionHelper(detailsChanges, dispatch, true)
      }

      if (actionCanBePerformed) {
        form.restart(initialValues)
        setFiltersWizardIsShown(false)

        if (counter > 0) {
          if (filterMenuName) {
            dispatch(
              setModalFiltersValues({
                name: filterMenuName,
                value: initialValues
              })
            )
          }

          applyChanges && applyChanges(initialValues, true)
        }
      }
    }
  }

  return (
    <Form form={form} onSubmit={() => {}}>
      {formState => {
        const counter = getFilterCounter()
        return (
          <FilterMenuWizardContext.Provider value={{ filterMenuName }}>
            <RoundedIcon
              id="filter-menu-btn"
              ref={filtersIconButtonRef}
              className={filtersIconClassnames}
              isActive={filtersWizardIsShown}
              onClick={() => {
                if (filtersWizardIsShown) {
                  preserveDraftForRemount()
                }

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
                          disabled={isEqual(initialValues, formState.values)}
                          id="filter-clear-btn"
                          label={cancelButton.label}
                          onClick={() => handleClearFilters(formState, counter)}
                          variant={cancelButton.variant}
                        />
                      )}
                      {applyButton && !withoutApplyButton && (
                        <Button
                          disabled={isEqual(appliedValues, formState.values) || formState?.invalid}
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
  children: PropTypes.node.isRequired,
  detailsChanges: PropTypes.object,
  filterMenuName: PropTypes.string,
  header: PropTypes.string,
  initialValues: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  withoutApplyButton: PropTypes.bool,
  wizardClassName: PropTypes.string
}

export default FilterMenuModal
