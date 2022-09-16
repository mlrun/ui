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
        label: '.chip',
        remove_btn: '.item-icon-close'
      }
    }
  }
}

const parametersTable = {
  root: '.key-value-table.settings__params',
  header: {
    root: '.table-row__header ',
    sorters: {
      key: '.table-cell__key',
      value: '.table-cell__value'
    }
  },
  body: {
    root: '.key-value-table__body',
    add_row_btn: '.table-row .add-new-item-btn',
    row: {
      root: '.table-row',
      fields: {
        key: '.table-cell__key',
        value: '.table-cell__value',
        edit_btn: '.table-cell__actions .key-value-table__btn:nth-of-type(1)',
        apply_edit_btn: '.table-cell__actions .key-value-table__btn:nth-of-type(1)',
        remove_btn: '.table-cell__actions .key-value-table__btn:nth-of-type(2)'
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
        '.settings__card-content .settings__source .input-wrapper',
        true,
        true,
        true
      )
    ),
    Artifact_Path_Input: inputGroup(
      generateInputGroup(
        '.settings__card-content .settings__artifact-path .input-wrapper',
        true,
        false,
        true
      )
    ),
    Project_Description: textAreaGroup(generateTextAreaGroup('.settings__description .text-area-wrapper')),
    Labels_Table: commonTable(labelsTable),
    Parameters_Table: commonTable(parametersTable),
    Parameters_Table_Key_Input: inputGroup(
      generateInputGroup(
        '.key-value-table.settings__params .table-cell__key .input-wrapper',
        true,
        false,
        true
      )
    ),
    Parameters_Table_Value_Input: inputGroup(
      generateInputGroup(
        '.key-value-table.settings__params .table-cell__value .input-wrapper',
        true,
        false,
        true
      )
    ),
    Parameters_Table_Add_Row_Button: By.css(
      '.key-value-table.settings__params .table-cell__actions .btn-add:nth-of-type(1)'
    ),
    Parameters_Table_Discard_Row_Button: By.css(
      '.key-value-table.settings__params .table-cell__actions .btn-add:nth-of-type(2)'
    )
  },
  secretsTab: {
    Secrets_Table: commonTable(secretsTable),
    Add_Secret_Button: By.css('.table-row__last .add-new-item-btn')
  }
}
