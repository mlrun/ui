import inputGroup from '../components/input-group.component'
import numberInputGroup from '../components/number-input-group.component'
import commonTable from '../components/table.component'
import dropdownComponent from '../components/dropdown.component'
import checkboxComponent from '../components/checkbox.component'
import radiobuttonComponent from '../components/radio-button.component'
import labelComponent from '../components/label.component'
import actionMenu from '../components/action-menu.component'
import {
  generateInputGroup,
  generateNumberInputGroup,
  generateLabelGroup,
  generateDropdownGroup
} from '../../common-tools/common-tools'
const { By } = require('selenium-webdriver')

const actionMenuStructure = {
  root: 'div.actions-menu__container',
  menuElements: {
    open_button: 'div.data-ellipsis button',
    options: 'div.actions-menu__body div.actions-menu__option'
  }
}

const labelsTable = {
  root: 'div.panel-title__labels-container div.panel-title__labels-wrapper',
  header: {},
  body: {
    root: 'div.chips-wrapper',
    add_row_btn: 'button.button-add',
    row: {
      root: 'div.chip-block',
      fields: {
        key_input: 'input.input-label-key',
        value_input: 'input.input-label-value',
        // key_input: {
        //   componentType: inputGroup,
        //   structure: {
        //     root: '',
        //     elements: {
        //       input: 'input.input-label-key'
        //     }
        //   }
        // },
        // value_input: {
        //   componentType: inputGroup,
        //   structure: {
        //     root: '',
        //     elements: {
        //       input: 'input.input-label-value'
        //     }
        //   }
        // },
        label: 'div.chip_short',
        remove_btn: '.item-icon-close'
      }
    }
  }
}

const dataSorceAttributesTable = {
  root: 'div.data-source__table',
  header: {
    root: 'div.table-row__header',
    sorters: {
      attribute_name: 'div.table-cell__key',
      value: 'div.table-cell__value'
    }
  },
  body: {
    add_row_btn: 'div.table-row button.add-new-item-btn',
    offset: 1,
    row: {
      root: 'div[class*=table-row]:not([class*=table-row__header])',
      fields: {
        attribute_name: 'div.table-cell__key',
        value: 'div.table-cell__value',
        action: 'div.table-cell__actions',
        attribute_name_input: 'div.table-cell__key input',
        value_input: 'div.table-cell__value input',
        add_row_btn: 'button'
      }
    }
  }
}

const partitionGranularityDropdown = {
  root:
    'div.feature-set-panel div.accordion__container:nth-of-type(3) div.panel-section__body div.target-store__item:nth-of-type(2) div.select',
  dropdownElements: {
    open_button: 'div.select__header div.select__value',
    options: 'div.select__body div.select__item',
    option_name: 'div.data-ellipsis > div.data-ellipsis'
  }
}

const fileTypeDropdown = {
  root:
    'div.feature-set-panel div.accordion__container:nth-of-type(3) div.panel-section__body div.target-store__item:nth-of-type(3) div.select',
  dropdownElements: {
    open_button: 'div.select__header div.select__value',
    options: 'div.select__body div.select__item',
    option_name: 'div.data-ellipsis > div.data-ellipsis'
  }
}

// New job components
const dataSourceInputSourcesTable = {
  root:
    '.new-item-side-panel__body .accordion__container:nth-of-type(1) .panel-section__body',
  header: {
    root: 'table__header',
    sorters: {
      input_name: '.table__cell:nth-of-type(1)',
      path: '.table__cell:nth-of-type(2)'
    }
  },
  body: {
    offset: 1,
    add_row_btn: '.table__row .add-input',
    row: {
      root: 'div[class=table__row]',
      fields: {
        input_name_input: '.input-row-wrapper',
        path_combobox: '.combobox',
        add_btn: '.btn-add',
        input_name_label: '.table__cell:nth-of-type(1)',
        path_label: '.table__cell:nth-of-type(2)',
        delete_btn: '.table__cell-actions .btn_delete'
      }
    }
  }
}

const jobPredefinedParametersTable = {
  root:
    '.new-item-side-panel__body .accordion__container:nth-of-type(2) .panel-section__body .job-panel__parameters-table',
  header: {
    root: '.table__header',
    sorters: {
      name: '.table__cell:nth-of-type(2)',
      type: '.table__cell:nth-of-type(3)',
      simple_hyper: '.table__cell:nth-of-type(4)',
      values: '.table__cell:nth-of-type(5)'
    }
  },
  body: {
    root: 'div:not([class]):nth-of-type(2)',
    offset: 1,
    row: {
      root: 'div[class^=table__row]',
      fields: {
        checkbox: '.checkbox',
        name: {
          componentType: labelComponent,
          structure: generateLabelGroup(
            '.table__cell_disabled:nth-of-type(1)',
            false,
            true
          )
        },
        type: {
          componentType: labelComponent,
          structure: generateLabelGroup(
            '.table__cell_disabled:nth-of-type(2)',
            false,
            false
          )
        },
        simple_hyper: {
          componentType: labelComponent,
          structure: generateLabelGroup(
            '.table__cell:nth-of-type(3)',
            false,
            false
          )
        },
        values: {
          componentType: labelComponent,
          structure: generateLabelGroup(
            '.table__cell:nth-of-type(4)',
            false,
            false
          )
        },
        simple_hyper_dropdown: {
          componentType: dropdownComponent,
          structure: generateDropdownGroup(
            '.select',
            'div.select__header div.select__value',
            'div.select__body div.select__item',
            'div.data-ellipsis > div.data-ellipsis'
          )
        },
        values_input: {
          componentType: inputGroup,
          structure: generateInputGroup('.table__cell:nth-of-type(4)', false)
        },
        apply_edit_btn: '.table__cell:nth-of-type(5) .apply-edit-btn'
      }
    }
  }
}

const jobCustomParametersTable = {
  root:
    '.new-item-side-panel__body .accordion__container:nth-of-type(2) .panel-section__body .job-panel__parameters-table',
  header: {
    root: '.table__header',
    sorters: {
      name: '.table__cell:nth-of-type(2)',
      type: '.table__cell:nth-of-type(3)',
      simple_hyper: '.table__cell:nth-of-type(4)',
      values: '.table__cell:nth-of-type(5)'
    }
  },
  body: {
    root: 'div:not([class]):nth-of-type(3)',
    offset: 1,
    row: {
      root: 'div[class^=table__row]',
      fields: {
        checkbox: '.checkbox',
        name: {
          componentType: labelComponent,
          structure: generateLabelGroup(
            false,
            '.table__cell_disabled:nth-of-type(1)',
            false
          )
        },
        type: {
          componentType: labelComponent,
          structure: generateLabelGroup(
            '.table__cell_disabled:nth-of-type(2)',
            false,
            false
          )
        },
        simple_hyper: {
          componentType: labelComponent,
          structure: generateLabelGroup(
            '.table__cell:nth-of-type(3)',
            false,
            false
          )
        },
        values: {
          componentType: labelComponent,
          structure: generateLabelGroup(
            '.table__cell:nth-of-type(4)',
            false,
            false
          )
        },
        simple_hyper_dropdown: {
          componentType: dropdownComponent,
          structure: generateDropdownGroup(
            '.select',
            'div.select__header div.select__value',
            'div.select__body div.select__item',
            'div.data-ellipsis > div.data-ellipsis'
          )
        },
        values_input: {
          componentType: inputGroup,
          structure: generateInputGroup('.table__cell:nth-of-type(4)', false)
        },
        apply_edit_btn: '.table__cell:nth-of-type(5) .apply-edit-btn'
      }
    }
  }
}

// TODO: Wait for some details
const volumePathsTable = {
  root:
    '.new-item-side-panel__body .accordion__container:nth-of-type(3) .job-panel__item > .panel-section:nth-of-type(2) .volumes-table',
  header: {
    root: '.table__header',
    sorters: {
      type: '.table__cell:nth-of-type(1)',
      volume_name: '.table__cell:nth-of-type(2)',
      path: '.table__cell:nth-of-type(3)'
    }
  },
  body: {
    offset: 0,
    add_row_btn: '.no-hover .add-input',
    row: {
      root: 'div[class=table__row]',
      fields: {
        type: '.table__cell:nth-of-type(1) .data-ellipsis',
        volume_name: '.table__cell:nth-of-type(2) .data-ellipsis',
        path: '.table__cell:nth-of-type(3) .data-ellipsis',
        action_menu: {
          componentType: actionMenu,
          structure: actionMenuStructure
        }
      }
    }
  }
}

const resourcesNodeSelectorTable = {
  root:
    '.new-item-side-panel__body .accordion__container:nth-of-type(3) .panel-section:nth-of-type(4) .key-value-table',
  header: {
    root: '.table-row__header',
    sorters: {
      key: '.table-cell__key',
      value: '.table-cell__value'
    }
  },
  body: {
    offset: 1,
    add_row_btn: '.table-row .add-new-item-btn',
    row: {
      root: 'div[class^=table-row]',
      fields: {
        key: '.table-cell__key .data-ellipsis',
        value: '.table-cell__value .data-ellipsis',
        delete_btn: '.table-cell__actions button',
        key_input: {
          componentType: inputGroup,
          structure: generateInputGroup('.table-cell__key', true, false, false)
        },
        value_input: {
          componentType: inputGroup,
          structure: generateInputGroup(
            '.table-cell__value',
            true,
            false,
            false
          )
        },
        add_row_btn: 'button svg'
      }
    }
  }
}

const advancedEnvironmentVariablesTable = {
  root:
    '.new-item-side-panel__body .accordion__container:nth-of-type(4) .panel-section:nth-of-type(2) .job-panel__table',
  header: {
    root: '.table__header',
    sorters: {
      name: '.table__cell:nth-of-type(1)',
      value: '.table__cell:nth-of-type(2)'
    }
  },
  body: {
    offset: 1,
    add_row_btn: '.table__row .add-input',
    row: {
      root: 'div[class^=table__row]',
      fields: {
        name: '.table__cell:nth-of-type(1) .data-ellipsis',
        value: '.table__cell:nth-of-type(2) .data-ellipsis',
        delete_btn: '.table__cell:nth-of-type(3) .btn_delete',
        name_input: {
          componentType: inputGroup,
          structure: generateInputGroup(
            '.input-row-wrapper .input-wrapper:nth-of-type(1)',
            true,
            false,
            false
          )
        },
        value_input: {
          componentType: inputGroup,
          structure: generateInputGroup(
            '.input-row-wrapper .input-wrapper:nth-of-type(1)',
            true,
            false,
            false
          )
        },
        add_row_btn: 'button svg'
      }
    }
  }
}

const advancedSecretsTable = {
  root:
    '.new-item-side-panel__body .accordion__container:nth-of-type(4) .panel-section:nth-of-type(3) .job-panel__table',
  header: {
    root: '.table__header',
    sorters: {
      kind: '.table__cell:nth-of-type(1)',
      value: '.table__cell:nth-of-type(2)'
    }
  },
  body: {
    offset: 1,
    add_row_btn: '.table__row .add-input',
    row: {
      root: 'div[class^=table__row]',
      fields: {
        kind: '.table__cell:nth-of-type(1) .data-ellipsis',
        value: '.table__cell:nth-of-type(2) .data-ellipsis',
        delete_btn: '.table__cell:nth-of-type(3) .btn_delete',
        kind_dropdown: {
          componentType: dropdownComponent,
          structure: generateDropdownGroup(
            '.select',
            'div.select__header div.select__value',
            'div.select__body div.select__item',
            'div.data-ellipsis > div.data-ellipsis'
          )
        },
        value_input: {
          componentType: inputGroup,
          structure: generateInputGroup('.input-wrapper', true, false, false)
        },
        add_row_btn: 'button svg'
      }
    }
  }
}

// common components
const commonCrossCloseButton = By.css(
  'div.new-item-side-panel button.panel-title__btn_close'
)

module.exports = {
  newFeatureSet: {
    Cross_Close_Button: commonCrossCloseButton,
    Feature_Set_Name_Input: inputGroup(
      generateInputGroup(
        'div.feature-set-panel div.panel-title div.name',
        true,
        true,
        true
      )
    ),
    Version_Input: inputGroup(
      generateInputGroup(
        'div.feature-set-panel div.panel-title div.version',
        true,
        false,
        true
      )
    ),
    Description_Input: inputGroup({
      root: 'div.feature-set-panel div.panel-title div.text-area-wrapper',
      elements: {
        input: 'textarea',
        label: 'label'
      }
    }),
    Labels_Table: commonTable(labelsTable),
    Data_Source_Accordion: {
      Accordion_Header: By.css(
        'div.feature-set-panel div.accordion__container:nth-of-type(1) h5'
      ),
      Collapse_Button: By.css(
        'div.feature-set-panel div.accordion__container:nth-of-type(1) button.new-item-side-panel__expand-icon'
      ),
      URL_Input: inputGroup(
        generateInputGroup(
          'div.feature-set-panel div.accordion__container:nth-of-type(1) div.panel-section__body div.input-wrapper:nth-of-type(2)',
          true,
          false,
          true
        )
      ),
      Key_Input: inputGroup(
        generateInputGroup(
          'div.feature-set-panel div.accordion__container:nth-of-type(1) div.panel-section__body div.input-wrapper:nth-of-type(3)',
          true,
          false,
          false
        )
      ),
      Time_Input: inputGroup(
        generateInputGroup(
          'div.feature-set-panel div.accordion__container:nth-of-type(1) div.panel-section__body div.input-wrapper:nth-of-type(4)',
          true,
          false,
          false
        )
      ),
      Kind_Dropdown: dropdownComponent(
        generateDropdownGroup(
          '.feature-set-panel .accordion__container:nth-of-type(1) .panel-section__body .select',
          '.select__header .select__value',
          '.select__body .select__item',
          '.data-ellipsis > .data-ellipsis'
        )
      ),
      Attributes_Table: commonTable(dataSorceAttributesTable)
    },
    Schema_Accordion: {
      Accordion_Header: By.css(
        'div.feature-set-panel div.accordion__container:nth-of-type(2) h5'
      ),
      Collapse_Button: By.css(
        'div.feature-set-panel div.accordion__container:nth-of-type(2) button.new-item-side-panel__expand-icon'
      ),
      Entities_Input: inputGroup(
        generateInputGroup(
          '.feature-set-panel .accordion__container:nth-of-type(2) .input-wrapper:nth-of-type(1)',
          true,
          false,
          true
        )
      ),
      Timestamp_Input: inputGroup(
        generateInputGroup(
          '.feature-set-panel .accordion__container:nth-of-type(2) .input-wrapper:nth-of-type(2)',
          true,
          false,
          false
        )
      )
    },
    Target_Store_Accordion: {
      Accordion_Header: By.css(
        'div.feature-set-panel div.accordion__container:nth-of-type(3) h5'
      ),
      Collapse_Button: By.css(
        'div.feature-set-panel div.accordion__container:nth-of-type(3) button.new-item-side-panel__expand-icon'
      ),
      // online group
      Online_Checkbox: checkboxComponent({
        root:
          'div.feature-set-panel div.accordion__container:nth-of-type(3) div.accordion__body div.target-store__item:nth-of-type(1) span.checkbox',
        elements: {
          checkbox: 'svg[class]',
          name: '',
          icon: 'svg:not([class])'
        }
      }),
      Online_Path_Input: inputGroup(
        generateInputGroup(
          'div.feature-set-panel div.accordion__container:nth-of-type(3) div.panel-section__body div.target-store__item:nth-of-type(1) div.input-wrapper',
          true,
          false,
          true
        )
      ),
      // Offline group
      Offline_Checkbox: checkboxComponent({
        root:
          'div.feature-set-panel div.accordion__container:nth-of-type(3) div.accordion__body div.target-store__item:nth-of-type(2) span.checkbox',
        elements: {
          checkbox: 'svg[class]',
          name: '',
          icon: 'svg:not([class])'
        }
      }),
      Offline_Path_Input: inputGroup(
        generateInputGroup(
          'div.feature-set-panel div.accordion__container:nth-of-type(3) div.panel-section__body div.target-store__item:nth-of-type(2) div.input-wrapper',
          true,
          false,
          true
        )
      ),
      Offline_Partition_Checkbox: checkboxComponent({
        root:
          'div.feature-set-panel div.accordion__container:nth-of-type(3) div.panel-section__body div.target-store__item:nth-of-type(2) div.target-store__inputs-container span.checkbox',
        elements: {
          checkbox: 'svg[class]',
          name: '',
          icon: 'svg:not([class])'
        }
      }),
      Offline_Partition_Key_Buckering_Number_Input: inputGroup(
        generateInputGroup(
          'div.feature-set-panel div.accordion__container:nth-of-type(3) div.panel-section__body div.target-store__item:nth-of-type(2) div.input-wrapper',
          true,
          'div.input__tip svg',
          false
        )
      ),
      Offline_Partition_Columns_Input: inputGroup(
        generateInputGroup(
          'div.feature-set-panel div.accordion__container:nth-of-type(3) div.panel-section__body div.target-store__item:nth-of-type(2) div.target-store__inputs-container > div.partition-cols.input-wrapper',
          true,
          false,
          false
        )
      ),
      Offline_Partition_Granularity_Dropdown: dropdownComponent(
        partitionGranularityDropdown
      ),
      // Other group
      Other_Checkbox: checkboxComponent({
        root:
          'div.feature-set-panel div.accordion__container:nth-of-type(3) div.accordion__body div.target-store__item:nth-of-type(3) span.checkbox',
        elements: {
          checkbox: 'svg[class]',
          name: '',
          icon: 'svg:not([class])'
        }
      }),
      File_Type_Dropdown: dropdownComponent(fileTypeDropdown),
      URL_Input: inputGroup(
        generateInputGroup(
          'div.feature-set-panel div.accordion__container:nth-of-type(3) div.input-wrapper',
          true,
          false,
          false
        )
      )
    },
    No_Transformation_Radiobutton: radiobuttonComponent({
      root:
        'div.feature-set-panel div.radio-buttons div.radio-buttons__content:nth-of-type(1)',
      elements: {
        radiobutton: 'label.radio-button input',
        mark: 'label.radio-button .checkmark',
        name: 'span.radio-button__label',
        description: 'span.radio-button__info'
      }
    }),
    Add_Transformation_Via_API_Radiobutton: radiobuttonComponent({
      root:
        'div.feature-set-panel div.radio-buttons div.radio-buttons__content:nth-of-type(2)',
      elements: {
        radiobutton: 'label.radio-button input',
        mark: 'label.radio-button .checkmark',
        name: 'span.radio-button__label',
        description: 'span.radio-button__info'
      }
    }),
    Cancel_Batton: By.css(
      'div.feature-set-panel div.new-item-side-panel__buttons-container button.pop-up-dialog__btn_cancel'
    ),
    Save_Batton: By.css(
      'div.feature-set-panel div.new-item-side-panel__buttons-container button[class="btn btn-secondary"]'
    ),
    Save_And_Ingest_Button: By.css(
      'div.feature-set-panel div.new-item-side-panel__buttons-container button.btn_start-ingestion'
    )
  },
  newJobTemplateEdit: {
    Cross_Close_Button: commonCrossCloseButton,
    Name_Edit_Button: By.css(
      'div.new-item-side-panel div.panel-title__container div.accordion__container button'
    ),
    Job_Name_Input: inputGroup(
      generateInputGroup(
        'div.new-item-side-panel div.panel-title__container div.accordion__container div.input-wrapper',
        true,
        true,
        true
      )
    ),
    Data_Inputs_Accordion: {
      Accordion_Header: By.css(
        '.new-item-side-panel__body .accordion__container:nth-of-type(1) h5'
      ),
      Collapse_Button: By.css(
        '.new-item-side-panel__body .accordion__container:nth-of-type(1) button.new-item-side-panel__expand-icon'
      ),
      Data_Source_Input_Sources_Table: commonTable(dataSourceInputSourcesTable),
      Default_Input_Path_Input: inputGroup(
        generateInputGroup(
          '.new-item-side-panel__body .accordion__container:nth-of-type(1) .panel-section:nth-of-type(2) .input-wrapper:nth-of-type(1)',
          true,
          false,
          false
        )
      ),
      Default_Artifact_Path_Input: inputGroup(
        generateInputGroup(
          '.new-item-side-panel__body .accordion__container:nth-of-type(1) .panel-section:nth-of-type(2) .input-wrapper:nth-of-type(2)',
          true,
          false,
          false
        )
      )
    },
    Parameters_Accordion: {
      Accordion_Header: By.css(
        '.new-item-side-panel__body .accordion__container:nth-of-type(2) h5'
      ),
      Collapse_Button: By.css(
        '.new-item-side-panel__body .accordion__container:nth-of-type(2) button.new-item-side-panel__expand-icon'
      ),
      Parameters_Additional_Settings_Input: inputGroup(
        generateInputGroup(
          '.new-item-side-panel__body .accordion__container:nth-of-type(2) .panel-section__body .parameters-additional-settings-container .parameters-additional-settings:nth-of-type(2) .input-wrapper',
          true,
          false,
          false
        )
      ),
      Result_Input: inputGroup(
        generateInputGroup(
          '.new-item-side-panel__body .accordion__container:nth-of-type(2) .panel-section__body .parameters-additional-settings-container .parameters-additional-settings:nth-of-type(3) .input-wrapper',
          true,
          false,
          false
        )
      ),
      Turning_Stratedgy_Dropdown: dropdownComponent(
        generateDropdownGroup(
          '.new-item-side-panel__body .accordion__container:nth-of-type(2) .panel-section__body .parameters-additional-settings-container .parameters-additional-settings:nth-of-type(2) .select',
          '.select__label',
          '.select__body .select__item',
          '.data-ellipsis .data-ellipsis'
        )
      ),
      Criteria_Dropdown: dropdownComponent(
        generateDropdownGroup(
          '.new-item-side-panel__body .accordion__container:nth-of-type(2) .panel-section__body .parameters-additional-settings-container .parameters-additional-settings:nth-of-type(3) .select',
          '.select__label',
          '.select__body .select__item',
          '.data-ellipsis .data-ellipsis'
        )
      ),
      Job_Custom_Parameters_Table: commonTable(jobCustomParametersTable),
      Job_Predefined_Parameters_Table: commonTable(jobPredefinedParametersTable)
    },
    Resouces_Accordion: {
      Accordion_Header: By.css(
        '.new-item-side-panel__body .accordion__container:nth-of-type(3) h5'
      ),
      Collapse_Button: By.css(
        '.new-item-side-panel__body .accordion__container:nth-of-type(3) button.new-item-side-panel__expand-icon'
      ),
      Volumes_Subheader: labelComponent(
        generateLabelGroup(
          '.new-item-side-panel__body .accordion__container:nth-of-type(3) .job-panel__item > .panel-section:nth-of-type(2)',
          'h5',
          true
        )
      ),
      Volume_Paths_Table: commonTable(volumePathsTable),
      Memory_Unit_Dropdown: dropdownComponent(
        generateDropdownGroup(
          '.new-item-side-panel__body .accordion__container:nth-of-type(3) .inputs div.memory .select',
          '.select__value',
          '.select__body .select__item',
          '.data-ellipsis .data-ellipsis'
        )
      ),
      Memory_Request_Number_Input: numberInputGroup(
        generateNumberInputGroup(
          '.new-item-side-panel__body .accordion__container:nth-of-type(3) .inputs .memory .range-dense:nth-of-type(2)',
          {
            inc_btn: '.range__buttons button[class*=increase]',
            dec_btn: '.range__buttons button[class*=decrease]'
          },
          true,
          false
        )
      ),
      Memory_Limit_Number_Input: numberInputGroup(
        generateNumberInputGroup(
          '.new-item-side-panel__body .accordion__container:nth-of-type(3) .inputs .memory .range-dense:nth-of-type(3)',
          false,
          true,
          false
        )
      ),
      CPU_Unit_Dropdown: dropdownComponent(
        generateDropdownGroup(
          '.new-item-side-panel__body .accordion__container:nth-of-type(3) .inputs div.cpu .select',
          '.select__value',
          '.select__body .select__item',
          '.data-ellipsis .data-ellipsis'
        )
      ),
      CPU_Request_Number_Input: numberInputGroup(
        generateNumberInputGroup(
          '.new-item-side-panel__body .accordion__container:nth-of-type(3) .inputs .cpu .range-dense:nth-of-type(2)',
          false,
          true,
          false
        )
      ),
      CPU_Limit_Number_Input: numberInputGroup(
        generateNumberInputGroup(
          '.new-item-side-panel__body .accordion__container:nth-of-type(3) .inputs .cpu .range-dense:nth-of-type(3)',
          false,
          true,
          false
        )
      ),
      GPU_Limit_Number_Input: numberInputGroup(
        generateNumberInputGroup(
          '.new-item-side-panel__body .accordion__container:nth-of-type(3) .inputs .section-gpu .range-dense',
          false,
          true,
          false
        )
      ),
      Resources_Node_Selector_Table: commonTable(resourcesNodeSelectorTable)
    },
    Advanced_Accordion: {
      Accordion_Header: By.css(
        '.new-item-side-panel__body .accordion__container:nth-of-type(4) h5'
      ),
      Collapse_Button: By.css(
        '.new-item-side-panel__body .accordion__container:nth-of-type(4) button.new-item-side-panel__expand-icon'
      ),
      Advanced_Environment_Variables_Table: commonTable(
        advancedEnvironmentVariablesTable
      ),
      Advanced_Secrets_Table: commonTable(advancedSecretsTable)
    },
    Shedule_For_Later_Button: By.css(
      '.new-item-side-panel__body .new-item-side-panel__buttons-container .data-ellipsis:nth-of-type(1) button'
    ),
    Run_Now_Button: By.css(
      '.new-item-side-panel__body .new-item-side-panel__buttons-container .data-ellipsis:nth-of-type(2) button'
    )
  }
}
