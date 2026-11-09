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

/*=========== GENERAL =============*/

export const VIEW_SEARCH_PARAMETER = 'view'
export const FULL_VIEW_MODE = 'full'

export const DENSITY_DENSE = 'dense'
export const DENSITY_NORMAL = 'normal'
export const DENSITY_MEDIUM = 'medium'
export const DENSITY_CHUNKY = 'chunky'

/*=========== EVENT KEYS =============*/
export const BACKSPACE = 'Backspace'
export const CLICK = 'Click'
export const DELETE = 'Delete'
export const TAB = 'Tab'
export const TAB_SHIFT = 'Tab+Shift'

/*=========== BUTTONS =============*/

export const PRIMARY_BUTTON = 'primary'
export const SECONDARY_BUTTON = 'secondary'
export const TERTIARY_BUTTON = 'tertiary'
export const DANGER_BUTTON = 'danger'
export const LABEL_BUTTON = 'label'

/*=========== VALITATION =============*/

export const validation = {
  BEGIN_END_NOT_WITH: { LABEL: 'Must not begin and end with', NAME: 'beginEndNot' },
  BEGIN_END_WITH: { LABEL: 'Must begin and end with', NAME: 'beginEnd' },
  BEGIN_NOT_WITH: { LABEL: 'Must not begin with', NAME: 'beginNot' },
  BEGIN_WITH: { LABEL: 'Must begin with', NAME: 'begin' },
  END_NOT_WITH: { LABEL: 'Must not end with', NAME: 'endNot' },
  END_WITH: { LABEL: 'Must end with', NAME: 'end' },
  MUST_CONTAIN_EXACTLY_ONE: { LABEL: 'Must contain exactly one', NAME: 'exactlyOne' },
  MUST_HAVE_DOT_AFTER_AT: { LABEL: 'Must have at least one . after @', NAME: 'dotAfterAt' },
  MUST_NOT_BE: { LABEL: 'Must not be', NAME: 'mustNotBe' },
  NO_CONSECUTIVE_CHARACTER: { LABEL: 'No consecutive characters', NAME: 'noConsecutiveCharacters' },
  NOT_CONTAIN: { LABEL: 'Must not contain', NAME: 'notContainCharacters' },
  ONLY_AT_THE_BEGINNING: { LABEL: 'Only at the beginning', NAME: 'onlyAtTheBeginning' },
  REQUIRED: { LABEL: 'This field is required', NAME: 'required' },
  VALID_CHARACTERS_WITH_REFIX: { LABEL: 'Valid characters', NAME: 'validCharactersWithPrefix' },
  VALID_CHARACTERS: { LABEL: 'Valid characters', NAME: 'validCharacters' }
}

/*=========== STATUS CODES =============*/

export const BADREQUEST_ERROR_STATUS_CODE = 400
export const FORBIDDEN_ERROR_STATUS_CODE = 403
export const NOTFOUND_ERROR_STATUS_CODE = 404
export const CONFLICT_ERROR_STATUS_CODE = 409
export const INTERNAL_SERVER_ERROR_STATUS_CODE = 500
export const BAD_GATEWAY_ERROR_STATUS_CODE = 502
export const SERVICE_UNAVAILABLE_ERROR_STATUS_CODE = 503
export const GATEWAY_TIMEOUT_STATUS_CODE = 504

/*=========== MODAL =============*/

export const MODAL_SM = 'sm'
export const MODAL_MD = 'md'
export const MODAL_LG = 'lg'
export const MODAL_MIN = 'min'
export const MODAL_MAX = 'max'

/*=========== TABLE =============*/

export const MAIN_TABLE_ID = 'main-table'
export const MAIN_TABLE_BODY_ID = 'main-table-body'
