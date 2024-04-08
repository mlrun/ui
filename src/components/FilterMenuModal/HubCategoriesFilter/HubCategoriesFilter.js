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
import React, { useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import { isEqual, pickBy } from 'lodash'
import { useSelector } from 'react-redux'
import { useForm } from 'react-final-form'

import { FilterMenuWizardContext } from '../FilterMenuModal'
import { FormCheckBox } from 'igz-controls/components'
import FormOnChange from '../../../common/FormOnChange/FormOnChange'

import { FILTER_MENU_MODAL, HUB_CATEGORIES_FILTER } from '../../../constants'

import './hubCategoriesFilter.scss'

const HubCategoriesFilter = ({ templates }) => {
  const form = useForm()
  const filtersContext = useContext(FilterMenuWizardContext)
  const filtersStoreHubCategories = useSelector(
    store =>
      store.filtersStore[FILTER_MENU_MODAL][filtersContext.filterMenuName]?.values?.[
        HUB_CATEGORIES_FILTER
      ]
  )

  useEffect(() => {
    form.change(HUB_CATEGORIES_FILTER, filtersStoreHubCategories)
  }, [filtersStoreHubCategories, form])

  const handleHubCategoriesChange = (next, prev) => {
    if (!isEqual(prev, next)) {
      const hubCategories = pickBy(next, value => value)

      if (!isEqual(hubCategories, filtersStoreHubCategories)) {
        form.change(HUB_CATEGORIES_FILTER, hubCategories)
      }
    }
  }

  return (
    <div className="categories-list">
      {templates.map(template => (
        <div key={template.id} className="category">
          <FormCheckBox
            label={template.label}
            highlightLabel={true}
            name={`${HUB_CATEGORIES_FILTER}.${template.id}`}
          />
        </div>
      ))}
      <FormOnChange handler={handleHubCategoriesChange} name={HUB_CATEGORIES_FILTER} />
    </div>
  )
}

HubCategoriesFilter.propTypes = {
  templates: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired
}

export default HubCategoriesFilter
