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
import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { FieldArray } from 'react-final-form-arrays'
import classNames from 'classnames'
import { debounce, isEmpty } from 'lodash'
import { Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { createForm } from 'final-form'

import { PopUpDialog, FormInput } from 'igz-controls/components'
import { SelectOption } from 'igz-controls/elements'
import { TextTooltipTemplate, Tooltip } from 'iguazio.dashboard-react-controls/dist/components'
import { ReactComponent as Caret } from 'igz-controls/images/dropdown.svg'
import Accordion from '../../common/Accordion/Accordion'
import FormOnChange from '../../common/FormOnChange/FormOnChange'

import { filterMetrics, getMetricsLabel, groupMetricByApplication } from './metricsSelector.utils'
import { METRICS_SELECTOR_OPTIONS } from '../../types'

import { ReactComponent as Arrow } from 'igz-controls/images/arrow.svg'
import { ReactComponent as SearchIcon } from 'igz-controls/images/search.svg'

import './metricsSelector.scss'

const MetricsSelector = ({ maxSelectionNumber, metrics, name, onSelect, preselectedMetrics }) => {
  const [nameFilter, setNameFilter] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const selectorFieldRef = useRef()
  const formRef = React.useRef(
    createForm({
      initialValues: {
        metrics: []
      },
      mutators: { ...arrayMutators },
      onSubmit: () => {}
    })
  )

  const generatedMetrics = useMemo(() => {
    return groupMetricByApplication(metrics)
  }, [metrics])

  const filteredMetrics = useMemo(() => {
    return filterMetrics(generatedMetrics, nameFilter)
  }, [generatedMetrics, nameFilter])

  const setNameFilerDebounced = useMemo(
    () =>
      debounce(name => {
        setNameFilter(name)
      }, 500),
    [setNameFilter]
  )

  const metricsHeaderClassNames = classNames(
    'metrics-selector-header',
    isOpen && 'metrics-selector-header__open'
  )

  useEffect(() => {
    if (preselectedMetrics) {
      formRef.current.reset({
        metrics: preselectedMetrics.map(metricItem => metricItem.full_name)
      })
    }
  }, [preselectedMetrics])

  const clickHandler = useCallback(
    event => {
      if (
        !event.target.closest('.metrics-selector-popup') &&
        !event.target.closest('.metrics-selector')
      ) {
        setIsOpen(false)
      }
    },
    [setIsOpen]
  )

  const scrollHandler = useCallback(
    event => {
      if (!event.target.closest('.metrics-selector-popup')) {
        setIsOpen(false)
      }
    },
    [setIsOpen]
  )

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('scroll', scrollHandler, true)
      window.addEventListener('click', clickHandler)
    }

    return () => {
      window.removeEventListener('click', clickHandler)
      window.removeEventListener('scroll', scrollHandler, true)
    }
  }, [clickHandler, scrollHandler, isOpen])

  const handleOnChange = selectedMetrics => {
    onSelect(
      selectedMetrics.map(metricFullName => {
        return metrics.find(metric => metric.full_name === metricFullName)
  
      })
    )
  }

  const getSelectValue = (selectedMetrics = []) => {
    if (isEmpty(selectedMetrics)) {
      return 'Chose Metrics...'
    }

    if (selectedMetrics.length === 1) {
      return '1 metric selected'
    }

    return `${selectedMetrics.length} metrics selected`
  }

  return (
    <Form form={formRef.current} onSubmit={() => {}}>
      {formState => (
        <div className="metrics-selector" data-testid="metrics-selector">
          <div
            data-testid="metric-selector-field"
            ref={selectorFieldRef}
            className="metric-selector-field"
          >
            <div
              data-testid="metrics-selector-header"
              className={metricsHeaderClassNames}
              onClick={() => setIsOpen(isOpen => !isOpen)}
            >
              <div
                data-testid="selected-metrics"
                className="metrics-selector-header__selected-metrics data-ellipsis"
              >
                <span>{getSelectValue(formState.values.metrics)}</span>
              </div>
              <div className="metrics-selector-header__icon">
                <Caret />
              </div>
            </div>
            {isOpen && (
              <PopUpDialog
                className="form-field form-field-select__options-list metrics-selector-popup"
                headerIsHidden
                customPosition={{
                  element: selectorFieldRef,
                  position: 'bottom-right',
                  autoHorizontalPosition: true
                }}
                style={{
                  width: '280px'
                }}
              >
                <div className="metrics-selector-search">
                  <div className="metrics-selector-search__name-filter">
                    <FormInput
                      inputIcon={<SearchIcon />}
                      name="metric-name"
                      placeholder="Search metrics..."
                    />
                    <FormOnChange name="metric-name" handler={setNameFilerDebounced} />
                  </div>
                </div>

                <ul className="metrics-selector-options options-list">
                  <FieldArray name={name}>
                    {({ fields }) => {
                      return (
                        <>
                          {filteredMetrics.map(metricsGroup => {
                            return !isEmpty(metricsGroup.metrics) ? (
                              <Accordion
                                key={metricsGroup.app}
                                accordionClassName="metrics-selector-accordion"
                                icon={<Arrow />}
                                iconClassName="metrics-selector-accordion-icon"
                                openByDefault
                              >
                                <div className="metrics-selector-accordion-content">
                                  <div className="metrics-selector-accordion-title">
                                    {metricsGroup.app}
                                  </div>
                                  <ul className="metrics-selector-options">
                                    {metricsGroup.metrics.map(metricItem => {
                                      return (
                                        <Tooltip
                                          key={metricItem.id}
                                          template={<TextTooltipTemplate text={metricItem.name} />}
                                        >
                                          <SelectOption
                                            item={{
                                              ...metricItem,
                                              label: getMetricsLabel(metricItem),
                                              disabled:
                                                fields.value?.length >= maxSelectionNumber &&
                                                !fields.value.includes(metricItem.id)
                                            }}
                                            name={name}
                                            multiple
                                          />
                                        </Tooltip>
                                      )
                                    })}
                                  </ul>
                                </div>
                              </Accordion>
                            ) : null
                          })}
                        </>
                      )
                    }}
                  </FieldArray>
                </ul>
                <FormOnChange name={name} handler={handleOnChange} />
                <div data-testid="metrics-selector-counter" className="metrics-selector-counter">
                  {`${formState.values.metrics.length}/${maxSelectionNumber}`}
                </div>
              </PopUpDialog>
            )}
          </div>
        </div>
      )}
    </Form>
  )
}

MetricsSelector.defaultProps = {
  maxSelectionNumber: 20,
  onSelect: () => {},
  preselectedMetrics: []
}

MetricsSelector.propTypes = {
  maxSelectionNumber: PropTypes.number,
  metrics: METRICS_SELECTOR_OPTIONS.isRequired,
  name: PropTypes.string.isRequired,
  onSelect: PropTypes.func,
  preselectedMetrics: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.string.isRequired }))
}

export default MetricsSelector
