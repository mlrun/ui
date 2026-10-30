/*
Copyright 2022 Iguazio Systems Ltd.
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
import PropTypes from 'prop-types'

import {
  DANGER_BUTTON,
  DENSITY_CHUNKY,
  DENSITY_DENSE,
  DENSITY_MEDIUM,
  DENSITY_NORMAL,
  LABEL_BUTTON,
  MODAL_LG,
  MODAL_MAX,
  MODAL_MD,
  MODAL_MIN,
  MODAL_SM,
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
  TERTIARY_BUTTON
} from './constants'

export const BUTTON_VARIANTS = PropTypes.oneOf([
  DANGER_BUTTON,
  LABEL_BUTTON,
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
  TERTIARY_BUTTON
])

export const CHIP = PropTypes.shape({
  delimiter: PropTypes.element,
  id: PropTypes.string,
  value: PropTypes.string.isRequired
})

export const CHIP_INPUT_LIST = PropTypes.arrayOf(
  PropTypes.shape({
    disabled: PropTypes.bool,
    icon: PropTypes.element,
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    subLabel: PropTypes.string,
    ui: PropTypes.shape({})
  })
)

export const DENSITY_OPTIONS = PropTypes.oneOf([
  DENSITY_DENSE,
  DENSITY_NORMAL,
  DENSITY_MEDIUM,
  DENSITY_CHUNKY
])

export const CHIP_OPTIONS = PropTypes.shape({
  background: PropTypes.oneOf([
    'amethyst',
    'green',
    'grey',
    'java',
    'none',
    'orange',
    'purple',
    'sorbus'
  ]),
  boldValue: PropTypes.bool,
  borderColor: PropTypes.oneOf(['transparent', 'orange', 'green', 'purple', 'grey']),
  density: DENSITY_OPTIONS,
  font: PropTypes.oneOf(['primary', 'white', 'green', 'purple', 'orange']),
  borderRadius: PropTypes.oneOf(['primary', 'secondary'])
})

export const CHIPS = PropTypes.arrayOf(CHIP)

export const VISIBLE_CHIPS_MAX_LENGTH = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.oneOf(['all'])
])

export const POP_UP_CUSTOM_POSITION = PropTypes.shape({
  element: PropTypes.shape({}),
  position: PropTypes.oneOf(['top-left', 'top-right', 'bottom-left', 'bottom-right']),
  autoHorizontalPosition: PropTypes.bool,
  autoVerticalPosition: PropTypes.bool
})

export const MODAL_SIZES = PropTypes.oneOf([MODAL_SM, MODAL_MD, MODAL_LG, MODAL_MIN, MODAL_MAX])

export const CONFIRM_DIALOG_CANCEL_BUTTON = PropTypes.shape({
  handler: PropTypes.func,
  label: PropTypes.string.isRequired,
  variant: PropTypes.string.isRequired
})
export const CONFIRM_DIALOG_MESSAGE = PropTypes.oneOfType([PropTypes.element, PropTypes.string])
export const CONFIRM_DIALOG_SUBMIT_BUTTON = PropTypes.shape({
  handler: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  variant: PropTypes.string.isRequired
})

export const WIZARD_STEPS_CONFIG = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    hidden: PropTypes.bool,
    disabled: PropTypes.bool,
    nextIsDisabled: PropTypes.bool
  })
)

export const INPUT_LINK = PropTypes.shape({
  show: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  url: PropTypes.string
})

export const SELECT_OPTION = PropTypes.shape({
  disabled: PropTypes.bool,
  hidden: PropTypes.bool,
  icon: PropTypes.element,
  id: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  labelHtml: PropTypes.string,
  status: PropTypes.string,
  subLabel: PropTypes.string
})

export const SELECT_OPTIONS = PropTypes.arrayOf(SELECT_OPTION)

export const INPUT_VALIDATION_RULES = PropTypes.arrayOf(
  PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    pattern: PropTypes.oneOfType([PropTypes.instanceOf(RegExp), PropTypes.func]).isRequired,
    isValid: PropTypes.bool
  })
)

export const COMBOBOX_SUGGESTION_LIST = PropTypes.arrayOf(
  PropTypes.shape({
    customDelimiter: PropTypes.string,
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  })
)

export const COMBOBOX_VALIDATION_RULES = PropTypes.arrayOf(
  PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    isValid: PropTypes.bool
  })
)

export const COMBOBOX_SELECT_OPTIONS = PropTypes.arrayOf(
  PropTypes.shape({
    className: PropTypes.string,
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  })
)

export const FORM_TABLE_EDITING_ITEM = PropTypes.shape({
  data: PropTypes.shape({}).isRequired,
  ui: PropTypes.shape({
    isNew: PropTypes.bool,
    index: PropTypes.number.isRequired,
    fieldsPath: PropTypes.string.isRequired
  }).isRequired,
  [PropTypes.string]: PropTypes.any
})

export const SORT_PROPS = PropTypes.shape({
  selectedColumnName: PropTypes.string.isRequired,
  getSortingIcon: PropTypes.func.isRequired,
  sortTable: PropTypes.func.isRequired
})

export const ALLOW_SORT_BY = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
  PropTypes.arrayOf(PropTypes.string, PropTypes.number)
])

export const DEFAULT_SORT_BY = PropTypes.oneOfType([PropTypes.string, PropTypes.number])

export const EXCLUDE_SORT_BY = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
  PropTypes.arrayOf(PropTypes.string, PropTypes.number)
])

export const DENSITY = PropTypes.oneOf(['dense', 'normal', 'medium', 'chunky'])

export const VIRTUALIZATION_CONFIG = PropTypes.shape({
  startIndex: PropTypes.number.isRequired,
  endIndex: PropTypes.number.isRequired,
  tableBodyPaddingTop: PropTypes.number.isRequired
})

export const SLIDER_TABS = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    tip: PropTypes.string,
    hidden: PropTypes.bool
  })
)

export const DETAILS_MENU = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    hidden: PropTypes.bool
  })
)

export const ACTION_BUTTON = PropTypes.shape({
  disabled: PropTypes.bool,
  hidden: PropTypes.bool,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  tooltip: PropTypes.string,
  variant: PropTypes.string
})

const ACTIONS_MENU_ITEM = PropTypes.shape({
  label: PropTypes.string.isRequired,
  icon: PropTypes.object,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string
})

export const ACTIONS_MENU = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.arrayOf(ACTIONS_MENU_ITEM.isRequired)),
  PropTypes.func
])
