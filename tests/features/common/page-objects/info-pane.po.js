import actionMenu from '../components/action-menu.component'
import commonTable from '../components/table.component'
import {
  generateInputGroup,
  generateLabelGroup
} from '../../common-tools/common-tools'
import labelComponent from '../components/label.component'
import inputGroup from '../components/input-group.component'
const { By } = require('selenium-webdriver')

// TO DO: that is dublicate from Feature Store PO. In feuture that should be fixed
const actionMenuStructure = {
  root: 'div.table__item div.item-header__buttons>div.actions-menu__container',
  menuElements: {
    open_button: 'button',
    options: 'div.actions-menu__body div.actions-menu__option'
  }
}

const infoPaneTabSelector = {
  root: '.table__item .details-menu__tabs',
  header: {},
  body: {
    row: {
      root: 'a',
      fields: {
        tab: '.details-menu__tab'
      }
    }
  }
}

const infoPaneOverviewHeaders = {
  root: '.table__item .item-info__details:nth-of-type(1)',
  header: {},
  body: {
    row: {
      root: 'li:not(li.details-item_hidden)',
      fields: {
        tab: '.details-item__header'
      }
    }
  }
}

const filesInfoSourcesTable = {
  root: '.info-sources .info-sources-table',
  header: {
    root: '.info-sources-table__header',
    sorters: {
      name: '.info-sources-table__header-item:nth-of-type(1)',
      path: '.info-sources-table__header-item:nth-of-type(2)'
    }
  },
  body: {
    row: {
      root: '.info-sources-table__content',
      fields: {
        name: '.info-sources-table__content-key .data-ellipsis',
        path: '.info-sources-table__content-value'
      }
    }
  }
}

// Features Info Pane Table
const featuresInfoPaneTable = {
  root: '.table__item .details-metadata .details-metadata__table',
  header: {
    root: 'div.artifact-metadata__table-header',
    sorters: {
      icon: 'div.metadata-cell_icon div.data-ellipsis',
      name: 'div.metadata-cell_name div.data-ellipsis',
      type: 'div.metadata-cell_type div.data-ellipsis',
      description: 'div.metadata-cell_description div.data-ellipsis',
      labels: 'div.metadata-cell_labels div.data-ellipsis',
      validators: 'div.metadata-cell_validators div.data-ellipsis'
    }
  },
  body: {
    root: 'div.artifact-metadata__table-body',
    row: {
      root: 'div.artifact-metadata__table-row',
      fields: {
        icon: 'div.metadata-cell_icon div.data-ellipsis svg',
        name: 'div.metadata-cell_name div.data-ellipsis',
        type: 'div.metadata-cell_type div.data-ellipsis',
        description: 'div.metadata-cell_description div.data-ellipsis',
        labels: 'div.metadata-cell_labels div.data-ellipsis',
        validators: 'div.metadata-cell_validators div.data-ellipsis'
      }
    }
  }
}

// preview Info Pane Table
const previewInfoPaneTable = {
  root: 'div.table__item div.preview_container div.artifact-preview__table',
  header: {
    root: 'div.artifact-preview__table-header',
    sorters: {
      department:
        'div.artifact-preview__table-content:nth-of-type(1) div.data-ellipsis',
      parent_id:
        'div.artifact-preview__table-content:nth-of-type(2) div.data-ellipsis',
      room:
        'div.artifact-preview__table-content:nth-of-type(3) div.data-ellipsis',
      bad:
        'div.artifact-preview__table-content:nth-of-type(4) div.data-ellipsis',
      gender:
        'div.artifact-preview__table-content:nth-of-type(5) div.data-ellipsis',
      age:
        'div.artifact-preview__table-content:nth-of-type(6) div.data-ellipsis'
    }
  },
  body: {
    root: 'div.artifact-preview__table-body',
    row: {
      root: 'div.artifact-preview__table-row',
      fields: {
        department: 'div.data-ellipsis:nth-of-type(1)',
        parent_id: 'div.data-ellipsis:nth-of-type(2)',
        room: 'div.data-ellipsis:nth-of-type(3)',
        bad: 'div.data-ellipsis:nth-of-type(4)',
        gender: 'div.data-ellipsis:nth-of-type(5)',
        age: 'div.data-ellipsis:nth-of-type(6)'
      }
    }
  }
}

// statistics Info Pane Table
const statisticsInfoPaneTable = {
  root: 'div.table__item div.details-statistics div.details-statistics__table',
  header: {
    root: 'div.details-statistics__table-header',
    sorters: {
      name: 'div.statistics-cell_name div.data-ellipsis',
      count: 'div.statistics-cell_count div.data-ellipsis',
      mean: 'div.statistics-cell_mean div.data-ellipsis',
      std: 'div.statistics-cell_std div.data-ellipsis',
      min: 'div.statistics-cell_min div.data-ellipsis',
      max: 'div.statistics-cell_max div.data-ellipsis',
      unique: 'div.statistics-cell_unique div.data-ellipsis',
      top: 'div.statistics-cell_top div.data-ellipsis',
      Freq: 'div.statistics-cell_freq div.data-ellipsis',
      histogram: 'div.statistics-cell_histogram div.data-ellipsis'
    }
  },
  body: {
    root: 'div.details-statistics__table-body',
    row: {
      root: 'div.details-statistics__table-row',
      fields: {
        name: 'div.statistics-cell_name div.data-ellipsis',
        count: 'div.statistics-cell_count div.data-ellipsis',
        mean: 'div.statistics-cell_mean div.data-ellipsis',
        std: 'div.statistics-cell_std div.data-ellipsis',
        min: 'div.statistics-cell_min div.data-ellipsis',
        max: 'div.statistics-cell_max div.data-ellipsis',
        unique: 'div.statistics-cell_unique div.data-ellipsis',
        top: 'div.statistics-cell_top div.data-ellipsis',
        Freq: 'div.statistics-cell_freq div.data-ellipsis',
        histogram: 'div.statistics-cell_histogram div.data-ellipsis'
      }
    }
  }
}

const inputsTable = {
  root: '.table__item .inputs_container',
  header: {
    root: '',
    sorters: {}
  },
  body: {
    root: 'ul.table__item_inputs',
    row: {
      root: 'li',
      fields: {
        name: 'div:nth-of-type(1)',
        path: 'div:nth-of-type(2)'
      }
    }
  }
}

const artifactsTable = {
  root: '.table__item .item-artifacts',
  header: {
    root: '',
    sorters: {}
  },
  body: {
    row: {
      root: '.item-artifacts__row-wrapper',
      fields: {
        name: '.item-artifacts__row-item:nth-of-type(1) span.link',
        path: '.item-artifacts__row-item:nth-of-type(2) .data-ellipsis',
        size: '.item-artifacts__row-item:nth-of-type(3) .data-ellipsis',
        updated: '.item-artifacts__row-item:nth-of-type(4) .data-ellipsis',
        show_details:
          '.item-artifacts__row-item:nth-of-type(5) .data-ellipsis a',
        download:
          '.item-artifacts__row-item:nth-of-type(6) .download-container svg'
      }
    }
  }
}

const resultsTable = {
  root: '.table__item .table__item-results',
  header: {
    root: '',
    sorters: {}
  },
  body: {
    root: '.results-table',
    row: {
      root: '.results-table__row',
      fields: {
        key: '.results-table__cell:nth-of-type(1)',
        value: '.results-table__cell:nth-of-type(2)'
      }
    }
  }
}

const featureSetsInfoPaneLabelsTable = {
  root: '.item-info__details .details-item__data-chips',
  header: {},
  body: {
    root: 'div.chips-wrapper',
    add_row_btn: 'button.button-add',
    row: {
      root: 'div.chip-block',
      fields: {
        key_input: 'input.input-label-key',
        value_input: 'input.input-label-value',
        label: '.chip',
        remove_btn: '.item-icon-close'
      }
    }
  }
}

// common components
const header = By.css('div.table__item div.item-header__data h3')
const updated = By.css('div.table__item div.item-header__data span')
const cancelButton = By.css(
  'div.table__item div.item-header__buttons > div.data-ellipsis:nth-of-type(1) button'
)
const applyChangesButton = By.css(
  'div.table__item div.item-header__buttons > div.data-ellipsis:nth-of-type(2) button'
)
const commonActionMenu = actionMenu(actionMenuStructure)
const crossCloseButton = By.css(
  'div.table__item div.item-header__buttons a div.data-ellipsis'
)
const commonDownloadButton = By.css(
  'div.table__item .item-header__buttons .download-container'
)
const commonInfoPaneTabSelector = commonTable(infoPaneTabSelector)

module.exports = {
  featureSetsInfoPane: {
    Header: header,
    Updated: updated,
    Cancel_Button: cancelButton,
    Apply_Changes_Button: applyChangesButton,
    Action_Menu: commonActionMenu,
    Cross_Close_Button: crossCloseButton,
    Info_Pane_Tab_Selector: commonInfoPaneTabSelector,
    Overview_General_Headers: commonTable(infoPaneOverviewHeaders),
    Description_Field: By.css(
      '.item-info__details .details-item:nth-of-type(1) .data-ellipsis'
    ),
    Description_Input: inputGroup(
      generateInputGroup(
        '.item-info__details .details-item:nth-of-type(1) .input-wrapper',
        true,
        false,
        true
      )
    ),
    Labels_Field: By.css(
      '.item-info__details .details-item:nth-of-type(2) .data-ellipsis'
    ),
    Labels_Table: commonTable(featureSetsInfoPaneLabelsTable),
    Apply_Button: By.css('.item-info__details .details-item__input-btn')
  },
  featuresInfoPane: {
    Header: header,
    Updated: updated,
    Cancel_Button: cancelButton,
    Apply_Changes_Button: applyChangesButton,
    Action_Menu: commonActionMenu,
    Cross_Close_Button: crossCloseButton,
    Info_Pane_Tab_Selector: commonInfoPaneTabSelector,
    Features_Tab_Info_Pane_Table: commonTable(featuresInfoPaneTable)
  },
  featureVectorsInfoPane: {
    Header: header,
    Updated: updated,
    Cancel_Button: cancelButton,
    Apply_Changes_Button: applyChangesButton,
    Action_Menu: commonActionMenu,
    Cross_Close_Button: crossCloseButton,
    Info_Pane_Tab_Selector: commonInfoPaneTabSelector,
    Overview_General_Headers: commonTable(infoPaneOverviewHeaders)
  },
  datasetsInfoPane: {
    Header: header,
    Updated: updated,
    Cancel_Button: cancelButton,
    Apply_Changes_Button: applyChangesButton,
    Download_Button: commonDownloadButton,
    Action_Menu: commonActionMenu,
    Cross_Close_Button: crossCloseButton,
    Info_Pane_Tab_Selector: commonInfoPaneTabSelector,
    Overview_General_Headers: commonTable(infoPaneOverviewHeaders),
    Overview_Hash_Header: labelComponent(
      generateLabelGroup(
        '.item-info__details:nth-of-type(1) .details-item:nth-of-type(1) .details-item__header',
        false,
        true
      )
    ),
    Overview_UID_Header: labelComponent(
      generateLabelGroup(
        '.item-info__details:nth-of-type(1) .details-item:nth-of-type(7) .details-item__header',
        false,
        true
      )
    ),
    Expand_Sources: By.css('.details-item .info-sources'),
    Info_Sources_Table: commonTable(filesInfoSourcesTable)
  },
  transformationsInfoPane: {
    Header: header,
    Updated: updated,
    Cancel_Button: cancelButton,
    Apply_Changes_Button: applyChangesButton,
    Action_Menu: commonActionMenu,
    Cross_Close_Button: crossCloseButton,
    Info_Pane_Tab_Selector: commonInfoPaneTabSelector
  },
  previewInfoPane: {
    Header: header,
    Updated: updated,
    Cancel_Button: cancelButton,
    Apply_Changes_Button: applyChangesButton,
    Action_Menu: commonActionMenu,
    Cross_Close_Button: crossCloseButton,
    Info_Pane_Tab_Selector: commonInfoPaneTabSelector,
    Preview_Tab_Info_Pane_Table: commonTable(previewInfoPaneTable)
  },
  statisticsInfoPane: {
    Header: header,
    Updated: updated,
    Cancel_Button: cancelButton,
    Apply_Changes_Button: applyChangesButton,
    Action_Menu: commonActionMenu,
    Cross_Close_Button: crossCloseButton,
    Info_Pane_Tab_Selector: commonInfoPaneTabSelector,
    Statistics_Tab_Info_Pane_Table: commonTable(statisticsInfoPaneTable)
  },
  analysisInfoPane: {
    Header: header,
    Updated: updated,
    Cancel_Button: cancelButton,
    Apply_Changes_Button: applyChangesButton,
    Action_Menu: commonActionMenu,
    Cross_Close_Button: crossCloseButton,
    Info_Pane_Tab_Selector: commonInfoPaneTabSelector
  },
  mlFunctionInfoPane: {
    Header: header,
    Updated: updated,
    Action_Menu: commonActionMenu,
    Cross_Close_Button: crossCloseButton,
    Info_Pane_Tab_Selector: commonInfoPaneTabSelector,
    Overview_Headers: commonTable(infoPaneOverviewHeaders)
  },
  jobsMonitorTabInfoPane: {
    Arrow_Back: By.css('div.table__item a.item-header__back-btn'),
    Header: header,
    Updated: updated,
    Action_Menu: commonActionMenu,
    Cross_Close_Button: crossCloseButton,
    Info_Pane_Tab_Selector: commonInfoPaneTabSelector,
    Overview_Headers: commonTable(infoPaneOverviewHeaders)
  },
  workflowsMonitorTabInfoPane: {
    Arrow_Back: By.css('.workflow-header a.link-back__icon'),
    Header: By.css('.workflow-header .link-back__title .data-ellipsis'),
    Updated: updated,
    Action_Menu: commonActionMenu,
    Cross_Close_Button: crossCloseButton,
    Info_Pane_Tab_Selector: commonInfoPaneTabSelector,
    Overview_Headers: commonTable(infoPaneOverviewHeaders)
  },
  inputsInfoPane: {
    Inputs_Table: commonTable(inputsTable)
  },
  artifactsInfoPane: {
    Artifacts_Table: commonTable(artifactsTable),
    Artifact_Preview_Button: By.css(
      '.item-artifacts .item-artifacts__preview .data-ellipsis svg'
    )
  },
  resultsInfoPane: {
    Results_Table: commonTable(resultsTable)
  },
  filesInfoPane: {
    Header: header,
    Updated: updated,
    Download_Button: commonDownloadButton,
    Action_Menu: commonActionMenu,
    Cross_Close_Button: crossCloseButton,
    Info_Pane_Tab_Selector: commonInfoPaneTabSelector,
    Overview_General_Headers: commonTable(infoPaneOverviewHeaders),
    Overview_Hash_Header: labelComponent(
      generateLabelGroup(
        '.item-info__details:nth-of-type(1) .details-item:nth-of-type(1) .details-item__header',
        false,
        true
      )
    ),
    Overview_UID_Header: labelComponent(
      generateLabelGroup(
        '.item-info__details:nth-of-type(1) .details-item:nth-of-type(7) .details-item__header',
        false,
        true
      )
    ),
    Expand_Sources: By.css('.details-item .info-sources'),
    Info_Sources_Table: commonTable(filesInfoSourcesTable)
  },
  modelsInfoPane: {
    Header: header,
    Updated: updated,
    Download_Button: commonDownloadButton,
    Action_Menu: commonActionMenu,
    Cross_Close_Button: crossCloseButton,
    Info_Pane_Tab_Selector: commonInfoPaneTabSelector,
    Overview_General_Headers: commonTable(infoPaneOverviewHeaders),
    Overview_Hash_Header: labelComponent(
      generateLabelGroup(
        '.item-info__details:nth-of-type(1) .details-item:nth-of-type(1) .details-item__header',
        false,
        true
      )
    ),
    Overview_UID_Header: labelComponent(
      generateLabelGroup(
        '.item-info__details:nth-of-type(1) .details-item:nth-of-type(10) .details-item__header',
        false,
        true
      )
    ),
    Expand_Sources: By.css('.details-item .info-sources'),
    Info_Sources_Table: commonTable(filesInfoSourcesTable)
  }
}
