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
import { has, isEqual, reduce } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'

import { PopUpDialog, RoundedIcon } from 'igz-controls/components'

import { FILTER_MENU_MODAL } from '../../constants'
import { setModalFiltersInitialValues, setModalFiltersValues } from '../../reducers/filtersReducer'

import { ReactComponent as FilterIcon } from 'igz-controls/images/filter.svg'

import './filterMenuModal.scss'

export const FilterMenuWizardContext = React.createContext({})

const FilterMenuModal = ({ children, filterMenuName, initialValues, values, wizardClassName }) => {
  const [filtersWizardIsShown, setFiltersWizardIsShown] = useState(false)
  const filtersIconButtonRef = useRef()
  const dispatch = useDispatch()
  const filtersData = useSelector(store => store.filtersStore[FILTER_MENU_MODAL][filterMenuName])
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

  const filtersWizardClassnames = classnames(
    'filters-wizard',
    wizardClassName
  )

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

  const hideFiltersWizard = useCallback(event => {
    if (!event.target.closest('.filters-button') && !event.target.closest('.filters-wizard')) {
      setFiltersWizardIsShown(false)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('click', hideFiltersWizard)
    window.addEventListener('scroll', hideFiltersWizard, true)

    return () => {
      window.removeEventListener('click', hideFiltersWizard)
      window.removeEventListener('scroll', hideFiltersWizard, true)
    }
  }, [hideFiltersWizard])

  const getFilterCounter = formState => {
    return reduce(
      formState.values,
      (acc, filterValue, filterName) => {
        return !isEqual(filterValue, formState.initialValues[filterName]) ? ++acc : acc
      },
      0
    )
  }

  return (
    <Form form={formRef.current} onSubmit={() => {}}>
      {formState => {
        const counter = getFilterCounter(formState)

        return (
          <FilterMenuWizardContext.Provider value={{ filterMenuName }}>
            <RoundedIcon
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
                headerIsHidden
                customPosition={{
                  element: filtersIconButtonRef,
                  position: 'bottom-left'
                }}
              >
                {children}
              </PopUpDialog>
            )}
          </FilterMenuWizardContext.Provider>
        )
      }}
    </Form>
  )
}

FilterMenuModal.defaultProps = {
  wizardClassName: ''
}

FilterMenuModal.propTypes = {
  filterMenuName: PropTypes.string.isRequired,
  initialValues: PropTypes.shape({}).isRequired,
  values: PropTypes.shape({}).isRequired,
  wizardClassName: PropTypes.string
}

export default FilterMenuModal
