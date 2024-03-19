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
import { By } from 'selenium-webdriver'
import commonTable from '../components/table.component'
import inputGroup from '../components/input-group.component'
import textAreaGroup from '../components/text-area.component'
import { generateInputGroup, generateTextAreaGroup } from '../../common-tools/common-tools'


const tabSelector = {
  root: '.content-menu',
  header: {},
  body: {
    root: '.content-menu__list',
    row: {
      root: '.content-menu__item',
      fields: {
        key: 'a'
      }
    }
  }
}

const labelsTable = {
  root: '.settings__labels',
  header: {},
  body: {
    root: '.chips-wrapper',
    add_row_btn: 'button.button-add',
    row: {
      root: '.chip-block',
      fields: {
        key_input: 'input.input-label-key',
        value_input: 'input.input-label-value',
        key_verify: '.edit-chip-container input.input-label-key',
        value_verify: '.edit-chip-container input.input-label-value',
        remove_btn: '.edit-chip__icon-close'
      }
    }
  }
}

const parametersTable = {
  root: '[data-testid="params"]',
  header: {
    root: '.form-table__header-row',
    sorters: {
      key: '.table-cell__key',
      value: '.table-cell__value'
    }
  },
  body: {
    add_row_btn: '[data-testid="params-add-btn"]',
    row: {
      root: '.form-table__row:nth-of-type(2)',
      fields: {
        key: '.form-table__cell_1:nth-of-type(1)',
        value: '.form-table__cell_1:nth-of-type(2)',
        edit_btn: '.form-table__actions-cell [data-testid="edit-btn"]',
        apply_edit_btn: '.form-table__actions-cell [data-testid="apply-btn"]',
        remove_btn: '.form-table__actions-cell [data-testid="delete-btn"]'
      }
    }
  }
}

const parametersTableVerify = {
  root: '[data-testid="params"]',
  header: {},
  body: {
    row: {
      root: '.form-table__row',
      fields: {
        key: '.form-table__cell_1:nth-of-type(1)',
        value: '.form-table__cell_1:nth-of-type(2)',
        remove_btn: '.form-table__actions-cell [data-testid="delete-btn"]'
      }
    }
  }
}

const secretsTable = {
  root: '.settings__secrets',
  header: {
    root: '.table-row__header',
    sorters: {
      key: '.table-cell__key',
      value: '.table-cell__value'
    }
  },
  body: {
    add_row_btn: '.add-new-item-btn',
    save_row_btn: '.btn-add',
    row: {
      root: '.table-row:not(.table-row__header)',
      fields: {
        key: '.table-cell__key',
        value: '.table-cell__value',
        key_input: '.table-cell__key input',
        value_input: '.table-cell__value input',
        edit_btn: '.table-cell__actions .key-value-table__btn:nth-of-type(1)',
        remove_btn: '.table-cell__actions .key-value-table__btn:nth-of-type(2)'
      }
    }
  }
}

module.exports = {
  generalTab: {
    Project_Settings_Tab_Selector: commonTable(tabSelector),
    Source_URL_Input: inputGroup(
      generateInputGroup(
        '.settings__card-content .settings__source [data-testid="source-form-field-input"]',
        true,
        true,
        '.form-field__warning svg'
      )
    ),
    Artifact_Path_Input: inputGroup(
      generateInputGroup(
        '.settings__card-content .settings__artifact-path [data-testid="artifact_path-form-field-input"]',
        true,
        false,
        '.form-field__warning svg'
      )
    ),
    Project_Description: textAreaGroup(generateTextAreaGroup('.settings__description .text-area-wrapper')),
    Labels_Table: commonTable(labelsTable),
    Parameters_Table: commonTable(parametersTable),
    Parameters_Table_Verify: commonTable(parametersTableVerify),
    Parameters_Table_Key_Input: inputGroup(
      generateInputGroup(
        '.form-key-value-table .form-table__row_active .form-table__cell_1:nth-of-type(1)',
        true,
        false,
        '.form-field__warning'
      )
    ),
    Parameters_Table_Value_Input: inputGroup(
      generateInputGroup(
        '.form-key-value-table .form-table__row_active .form-table__cell_1:nth-of-type(2)',
        true,
        false,
        '.form-field__warning'
      )
    ),
    Parameters_Table_Add_Row_Button: By.css(
      '.form-key-value-table .form-table__row_active .form-table__actions-cell [data-testid="apply-btn"]'
    ),
    Parameters_Table_Discard_Row_Button: By.css(
      '.form-key-value-table .form-table__row_active .form-table__actions-cell [data-testid="delete-discard-btn"]'
    ),
    Add_Label_Button: By.css('.settings__labels .chips__wrapper .chips-wrapper button'),
    Labels_Key: inputGroup(
      generateInputGroup(
        '.settings__labels .chips-wrapper .chip-block .edit-chip-container',
        false,
        true,
        false
      )
    ),
    Labels_Value: inputGroup(
      generateInputGroup(
        '.settings__labels .chips-wrapper .chip-block .edit-chip-container',
        false,
        true,
        false,
        '.input-label-value'
      )
    ),
  },
  secretsTab: {
    Secrets_Table: commonTable(secretsTable),
    Add_Secret_Button: By.css('.table-row__last .add-new-item-btn'),
    Secrets_Hint: By.css('.settings__card-subtitle')
  }
}
