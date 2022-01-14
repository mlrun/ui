import { By } from 'selenium-webdriver'
import commonTable from '../components/table.component'
import dropdownComponent from '../components/dropdown.component'
import actionMenu from '../components/action-menu.component'
import inputGroup from '../components/input-group.component'
import labelComponent from '../components/label.component'
import {
  generateInputGroup,
  generateDropdownGroup,
  generateLabelGroup
} from '../../common-tools/common-tools'

// Feature Sets
const tabSelector = {
  root: '.content-menu',
  header: {},
  body: {
    root: '.content-menu__list',
    row: {
      root: '.content-menu__item',
      fields: {
        tab: 'a'
      }
    }
  }
}

const actionMenuStructure = {
  root: '.actions-menu__container',
  menuElements: {
    open_button: 'button',
    options: '.actions-menu__body .actions-menu__option'
  }
}

const labelsTable = {
  root: '.table-body__cell:nth-of-type(3)',
  header: {},
  body: {
    root: '.chips-wrapper',
    row: {
      root: '.chip-block',
      field: {
        label: '.chip > .chip_short'
      }
    }
  }
}

const labelsDropdown = {
  root: '.table-body__cell:nth-of-type(3)',
  dropdownElements: {
    open_button: '.chip-block span.chips_button',
    options:
      '.chip-block .chip-block-hidden_visible .data-ellipsis.tooltip-wrapper',
    option_name: '.chip > .chip_short'
  }
}

const featureSetsTable = {
  root: '.content .table-container .table__content',
  header: {
    root: '.table-head',
    sorters: {
      name: '.table-head__item:nth-of-type(1) .data-ellipsis',
      description: '.table-head__item:nth-of-type(2) .data-ellipsis',
      labels: '.table-head__item:nth-of-type(3) .data-ellipsis',
      entity: '.table-head__item:nth-of-type(4) .data-ellipsis',
      targets: '.table-head__item:nth-of-type(5) .data-ellipsis'
    }
  },
  body: {
    root: '.table-body',
    row: {
      root: '.table-body__row',
      fields: {
        expand_btn: '.table-body__cell:nth-of-type(1) svg.expand-arrow',
        name: '.table-body__cell:nth-of-type(1) a .link',
        tag: '.table-body__cell:nth-of-type(1) .item-tag',
        description: '.table-body__cell:nth-of-type(2) > .data-ellipsis',
        labels_table: {
          componentType: commonTable,
          structure: labelsTable
        },
        labels_dropdown: {
          componentType: dropdownComponent,
          structure: labelsDropdown
        },
        entity: '.table-body__cell:nth-of-type(4) > .data-ellipsis',
        targets: '.table-body__cell:nth-of-type(5) > .data-ellipsis',
        copy_uri: '.table-body__cell:nth-of-type(6) > button',
        action_menu: {
          componentType: actionMenu,
          structure: actionMenuStructure
        }
      }
    }
  }
}

// Features
const featuresTable = {
  root: '.table-container .table .table__content',
  header: {
    root: '.table-head',
    sorters: {
      feature_name: '.table-head__item:nth-of-type(1) .data-ellipsis',
      feature_set: '.table-head__item:nth-of-type(2) .data-ellipsis',
      type: '.table-head__item:nth-of-type(3) .data-ellipsis',
      entity: '.table-head__item:nth-of-type(4) .data-ellipsis',
      description: '.table-head__item:nth-of-type(5) .data-ellipsis',
      labels: '.table-head__item:nth-of-type(6) .data-ellipsis',
      targets: '.table-head__item:nth-of-type(7) .data-ellipsis',
      validator: '.table-head__item:nth-of-type(8) .data-ellipsis'
    }
  },
  body: {
    root: '.table-body',
    row: {
      root: '.table-body__row',
      fields: {
        expand_btn: '.table-body__cell:nth-of-type(2) svg.expand-arrow',
        feature_name: '.table-body__cell:nth-of-type(1) .data-ellipsis',
        feature_set: '.table-body__cell:nth-of-type(2) .link',
        type: '.table-body__cell:nth-of-type(3) .data-ellipsis',
        entity: '.table-body__cell:nth-of-type(4) .data-ellipsis',
        description: '.table-body__cell:nth-of-type(5) .data-ellipsis',
        labels: '.table-body__cell:nth-of-type(6)',
        targets: '.table-body__cell:nth-of-type(7)',
        validator:
          '.table-body__cell:nth-of-type(8) .feature-validator .data-ellipsis',
        action_menu: {
          componentType: actionMenu,
          structure: actionMenuStructure
        }
      }
    }
  }
}

// Feature Vectors
const featureVectorTable = {
  root: '.table-container .table .table__content',
  header: {
    root: '.table-head',
    sorters: {
      name: '.table-head__item:nth-of-type(1) .data-ellipsis',
      description: '.table-head__item:nth-of-type(2) .data-ellipsis',
      labels: '.table-head__item:nth-of-type(3) .data-ellipsis',
      updated: '.table-head__item:nth-of-type(4) .data-ellipsis'
    }
  },
  body: {
    root: '.table-body',
    row: {
      root: '.table-body__row',
      fields: {
        expand_btn: '.table-body__cell:nth-of-type(1) svg.expand-arrow',
        name: '.table-body__cell:nth-of-type(1) a .link',
        tag: '.table-body__cell:nth-of-type(1) .item-tag',
        description: '.table-body__cell:nth-of-type(2) .data-ellipsis',
        labels_table: {
          componentType: commonTable,
          structure: labelsTable
        },
        updated: '.table-body__cell:nth-of-type(4) .data-ellipsis',
        copy_uri: '.table-body__cell:nth-of-type(6) > button',
        action_menu: {
          componentType: actionMenu,
          structure: actionMenuStructure
        }
      }
    }
  }
}

const addToFeatureVectorTable = {
  root: '.table-container .table .table__content',
  header: {
    root: '.table-head',
    sorters: {
      featureName: '.table-head__item:nth-of-type(1) .data-ellipsis',
      featureSet: '.table-head__item:nth-of-type(2) .data-ellipsis',
      type: '.table-head__item:nth-of-type(3) .data-ellipsis',
      entities: '.table-head__item:nth-of-type(4) .data-ellipsis'
    }
  },
  body: {
    root: '.table-body',
    row: {
      root: '.table-body__row',
      fields: {
        expand_btn: '.table-body__cell:nth-of-type(1) svg.expand-arrow',
        featureName: '.table-body__cell:nth-of-type(1) .data-ellipsis',
        featureSet: '.table-body__cell:nth-of-type(2) a .link',
        type: '.table-body__cell:nth-of-type(3) .data-ellipsis',
        entities: '.table-body__cell:nth-of-type(4) .chips-wrapper',
        add_feature_btn: '.add-feature-button svg'
      }
    }
  }
}

const featuresPanelTable = {
  root: '.table__panel-container .features-panel__expand-content',
  header: {},
  body: {
    row: {
      root: '.feature-row',
      fields: {
        feature: '.feature-row__feature-template',
        set_as_label_btn: '.feature-row__actions svg.set-as-label',
        remove_btn: '.feature-row__actions svg.remove'
      }
    }
  }
}

const featuresByProjectsTable = {
  root:
    '.table__panel-container .features-panel__divider:nth-of-type(4) + div + .accordion__container',
  header: {},
  body: {
    row: {
      root: '.feature-row',
      fields: {
        feature: '.feature-row__feature-template'
      }
    }
  }
}

// Datasets
const datasetsTable = {
  root: '.table-container .table .table__content',
  header: {
    root: '.table-head',
    sorters: {
      name: '.table-head__item:nth-of-type(1) .data-ellipsis'
    }
  },
  body: {
    root: '.table-body',
    row: {
      root: '.table-body__row',
      fields: {
        expand_btn: '.table-body__cell:nth-of-type(1) svg.expand-arrow',
        name: '.table-body__cell:nth-of-type(1) a span.link',
        labels: '.table-body__cell:nth-of-type(2)',
        producer: '.table-body__cell:nth-of-type(3) .data-ellipsis a.link',
        owner: '.table-body__cell:nth-of-type(4) .data-ellipsis',
        uploaded: '.table-body__cell:nth-of-type(5) .data-ellipsis',
        size: '.table-body__cell:nth-of-type(6) .data-ellipsis',
        artifact_preview_btn: '.table-body__cell:nth-of-type(7) button',
        download_btn: '.table-body__cell:nth-of-type(8) .download-container',
        copy_uri: '.table-body__cell:nth-of-type(9) > button',
        action_menu: {
          componentType: actionMenu,
          structure: actionMenuStructure
        }
      }
    }
  }
}

// Common components
const featureStoreTabSelector = commonTable(tabSelector)
const tableRefreshButton = By.css('.content__action-bar .actions #refresh')
const pageHeaderButton = By.css(
  '.content__header .page-actions-container button'
)
const commonNameFilterInput = inputGroup(
  generateInputGroup(
    '.content .content__action-bar .input-wrapper:nth-of-type(2)',
    true,
    false,
    true
  )
)
const commonLabelFilterInput = inputGroup(
  generateInputGroup(
    '.content .content__action-bar .input-wrapper:nth-of-type(3)',
    true,
    false,
    true
  )
)
const commonTableTreeFilterDropdown = dropdownComponent(
  generateDropdownGroup(
    '.content .content__action-bar .filters .tag-filter',
    'input',
    '.tag-filter__dropdown .tag-filter__dropdown-item',
    '',
    true // options_in_root ?
  )
)

module.exports = {
  featureSetsTab: {
    Table_Refresh_Button: tableRefreshButton,
    Create_Set_Button: pageHeaderButton,
    Table_Expand_Rows_Button: By.css(
      '.feature-store-container .content__action-bar .data-ellipsis:nth-of-type(2) button'
    ),
    Table_Tag_Filter_Dropdown: commonTableTreeFilterDropdown,
    Table_Name_Filter_Input: commonNameFilterInput,
    Table_Label_Filter_Input: commonLabelFilterInput,
    Feature_Sets_Table: commonTable(featureSetsTable),
    Feature_Store_Tab_Selector: featureStoreTabSelector
  },
  featuresTab: {
    Feature_Store_Tab_Selector: featureStoreTabSelector,
    Add_To_Feature_Vector_Button: By.css(
      '.content__action-bar .data-ellipsis  button.btn-secondary'
    ),
    Table_Name_Filter_Input: commonNameFilterInput,
    Table_Label_Filter_Input: commonLabelFilterInput,
    Table_Tag_Filter_Dropdown: commonTableTreeFilterDropdown,
    Table_Refresh_Button: tableRefreshButton,
    Features_Table: commonTable(featuresTable)
  },
  featureVectorsTab: {
    Feature_Store_Tab_Selector: featureStoreTabSelector,
    Create_Vector_Button: pageHeaderButton,
    Table_Name_Filter_Input: commonNameFilterInput,
    Table_Label_Filter_Input: commonLabelFilterInput,
    Table_Tag_Filter_Dropdown: commonTableTreeFilterDropdown,
    Table_Refresh_Button: tableRefreshButton,
    Feature_Vectors_Table: commonTable(featureVectorTable)
  },
  datasets: {
    Feature_Store_Tab_Selector: featureStoreTabSelector,
    Register_Dataset_Button: pageHeaderButton,
    Table_Name_Filter_Input: commonNameFilterInput,
    Table_Label_Filter_Input: commonLabelFilterInput,
    Table_Tree_Filter_Dropdown: commonTableTreeFilterDropdown,
    Table_Refresh_Button: tableRefreshButton,
    Feature_Datasets_Table: commonTable(datasetsTable)
  },
  addToFeatureVector: {
    Table_Tree_Filter_Dropdown: commonTableTreeFilterDropdown,
    Table_Name_Filter_Input: commonNameFilterInput,
    Table_Label_Filter_Input: commonLabelFilterInput,
    Table_Projects_Filter_Dropdown: dropdownComponent(
      generateDropdownGroup(
        '.content .content__action-bar .filters .select',
        'svg',
        '.select__options-list .select__item',
        ''
      )
    ),
    Table_Refresh_Button: tableRefreshButton,
    Add_To_Feature_Vector_Table: commonTable(addToFeatureVectorTable),
    Add_Button: By.css('.features-panel__buttons .btn-primary'),
    Cancel_Button: By.css('.features-panel__buttons .btn-label'),
    Features_Panel_Title: labelComponent(
      generateLabelGroup(
        '.add-to-feature-vector .features-panel__header',
        false,
        true
      )
    ),
    Edit_Feature_Vector_Button: By.css(
      '.add-to-feature-vector .features-panel__header-vector-actions button'
    ),
    Selected_Project_Accordion: {
      Features_Panel_Table: commonTable(featuresPanelTable)
    },
    Features_By_Projects_Accordion: {
      Collapse_Button: By.css(
        '.table__panel-container .features-panel__divider:nth-of-type(4) + div + .accordion__container .round-icon-cp__icon'
      ),
      Features_By_Projects_Table: commonTable(featuresByProjectsTable)
    }
  }
}
