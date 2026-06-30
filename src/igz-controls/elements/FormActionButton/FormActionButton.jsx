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
import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'

import Plus from '../../images/plus.svg?react'

let FormActionButton = (
  {
    disabled = false,
    fields,
    fieldsPath,
    hidden = false,
    id = '',
    label = 'Add new item',
    onClick
  },
  ref
) => {
  return (
    <>
      {!hidden && (
        <div className="form-table__row form-table__action-row no-hover">
          <button
            data-testid={id ? id : `${fieldsPath}-add-btn`}
            onClick={event => onClick(event, fields, fieldsPath)}
            disabled={disabled}
          >
            <Plus />
            {label}
          </button>
        </div>
      )}
      {/*The tag `span` below is used as bottom point to scroll to if the new item is added to the list*/}
      <span ref={ref}></span>
    </>
  )
}

FormActionButton = forwardRef(FormActionButton)

FormActionButton.displayName = 'FormActionButton'

FormActionButton.propTypes = {
  disabled: PropTypes.bool,
  fields: PropTypes.shape({}).isRequired,
  fieldsPath: PropTypes.string.isRequired,
  hidden: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func.isRequired
}

export default FormActionButton
