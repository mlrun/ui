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
import PropTypes from 'prop-types'
import {
  DENSITY_CHUNKY,
  DENSITY_DENSE,
  DENSITY_MEDIUM,
  DENSITY_NORMAL,
  PANEL_CREATE_MODE,
  PANEL_EDIT_MODE,
  PANEL_RERUN_MODE
} from './constants'

import { BUTTON_VARIANTS } from 'igz-controls/types'

export const COMBOBOX_MATCHES = PropTypes.arrayOf(
  PropTypes.shape({
    customDelimiter: PropTypes.string,
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  })
)

export const DENSITY_OPTIONS = PropTypes.oneOf([
  DENSITY_DENSE,
  DENSITY_NORMAL,
  DENSITY_MEDIUM,
  DENSITY_CHUNKY
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

export const CHIP_OPTIONS = PropTypes.shape({
  background: PropTypes.oneOf([
    'none',
    'orange',
    'green',
    'purple',
    'grey',
    'sorbus',
    'java',
    'amethyst'
  ]),
  boldValue: PropTypes.bool,
  borderColor: PropTypes.oneOf(['transparent', 'orange', 'green', 'purple', 'grey']),
  density: DENSITY_OPTIONS,
  font: PropTypes.oneOf(['primary', 'white', 'green', 'purple', 'orange']),
  borderRadius: PropTypes.oneOf(['primary', 'secondary'])
})

export const CHIPS = PropTypes.arrayOf(CHIP)

export const FUNCTION_PANEL_MODE = PropTypes.oneOf([PANEL_EDIT_MODE, PANEL_CREATE_MODE])

export const SELECT_OPTION = PropTypes.shape({
  disabled: PropTypes.bool,
  hidden: PropTypes.bool,
  icon: PropTypes.element,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  status: PropTypes.string,
  subLabel: PropTypes.string
})

export const SELECT_OPTIONS = PropTypes.arrayOf(SELECT_OPTION)

export const RADIO_BUTTONS_ELEMENT = PropTypes.shape({
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  info: PropTypes.string,
  tip: PropTypes.string,
  hidden: PropTypes.bool
})

export const RADIO_BUTTONS_ELEMENTS = PropTypes.arrayOf(RADIO_BUTTONS_ELEMENT)

export const CONFIRM_DIALOG_BUTTON = PropTypes.shape({
  handler: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  variant: PropTypes.string.isRequired
})

export const ACTIONS_MENU = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.shape({})),
  PropTypes.func
])

export const MAIN_SPLIT_BUTTON = PropTypes.shape({
  className: PropTypes.string,
  icon: PropTypes.element,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  variant: BUTTON_VARIANTS
})

export const ADDITIONAL_SPLIT_BUTTON = PropTypes.shape({
  className: PropTypes.string,
  icon: PropTypes.element,
  options: SELECT_OPTIONS,
  onSelectOption: PropTypes.func.isRequired,
  selectedOption: SELECT_OPTION,
  variant: BUTTON_VARIANTS
})

export const INPUT_LINK = PropTypes.shape({
  show: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  url: PropTypes.string
})

export const CONTENT_MENU_TABS = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string,
    hidden: PropTypes.bool,
    preview: PropTypes.bool,
    icon: PropTypes.element
  })
)

export const SLIDER_TABS = PropTypes.arrayOf(
  PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    tip: PropTypes.string,
    hidden: PropTypes.bool
  })
)

export const SCHEDULE_DATA = PropTypes.shape({
  cron: PropTypes.string,
  defaultCron: PropTypes.string,
  activeOption: PropTypes.string.isRequired,
  minute: PropTypes.string.isRequired,
  hour: PropTypes.string.isRequired,
  week: PropTypes.shape({
    days: PropTypes.arrayOf(PropTypes.string).isRequired,
    time: PropTypes.string
  }),
  day: PropTypes.shape({
    time: PropTypes.string
  }),
  month: PropTypes.shape({
    time: PropTypes.string
  })
})

export const DAYS_OF_WEEK = PropTypes.arrayOf(
  PropTypes.shape({
    label: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired
  })
)

export const DATA_INPUT_STATE = PropTypes.shape({
  artifacts: PropTypes.array.isRequired,
  artifactsReferences: PropTypes.array.isRequired,
  comboboxMatches: PropTypes.array.isRequired,
  featureVectors: PropTypes.array.isRequired,
  featureVectorsReferences: PropTypes.array.isRequired,
  inputProjectItemPathEntered: PropTypes.bool.isRequired,
  inputProjectItemReferencePathEntered: PropTypes.bool.isRequired,
  inputProjectPathEntered: PropTypes.bool.isRequired,
  inputStorePathTypeEntered: PropTypes.bool.isRequired,
  project: PropTypes.string.isRequired,
  projectItemReference: PropTypes.string.isRequired,
  projects: PropTypes.array.isRequired,
  storePathType: PropTypes.string.isRequired
})

export const JOB_WIZARD_MODE = PropTypes.oneOf([
  PANEL_CREATE_MODE,
  PANEL_EDIT_MODE,
  PANEL_RERUN_MODE
])

export const SLIDER_STYLE_1 = 'style1'
export const SLIDER_STYLE_2 = 'style2'
