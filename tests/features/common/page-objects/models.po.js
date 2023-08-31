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
import inputGroup from '../components/input-group.component'
import {
  generateInputGroup,
  generateDropdownGroup,
  generateLabelGroup
} from '../../common-tools/common-tools'
import dropdownComponent from '../components/dropdown.component'
import checkboxComponent from '../components/checkbox.component'
import commonTable from '../components/table.component'
import actionMenu from '../components/action-menu.component'
import labelComponent from '../components/label.component'
import graph from '../components/graph.component'

const actionMenuStructure = {
  root: '.actions-menu__container',
  menuElements: {
    open_button: 'button',
    options: '.actions-menu__body .actions-menu__option'
  }
}

const tabSelector = {
  root: '.content .content-menu',
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

const modelsTable = {
  root: '.table-container .table__flex .table__content',
  header: {
    root: '.table-head',
    sorters: {
      name: '.table-head__item:nth-of-type(1) .data-ellipsis',
      labels: '.table-head__item:nth-of-type(2) .data-ellipsis',
      producer: '.table-head__item:nth-of-type(3) .data-ellipsis',
      owner: '.table-head__item:nth-of-type(4) .data-ellipsis',
      updated: '.table-head__item:nth-of-type(5) .data-ellipsis',
      metrics: '.table-head__item:nth-of-type(6) .data-ellipsis',
      frameworkAndAlgorithm: '.table-head__item:nth-of-type(7) .data-ellipsis'
    }
  },
  body: {
    root: '.table-body',
    row: {
      root: '.table-row',
      fields: {
        name: '.table-body__cell:nth-of-type(1) a .name-wrapper .link', 
        name_expand_btn: '.table-body__cell:nth-of-type(1) a .name-wrapper .item-tag',
        expand_btn: '.table-body__cell:nth-of-type(1) svg.expand-arrow',
        labels: {
          componentType: dropdownComponent,
          structure: generateDropdownGroup(
            '.table-body__cell:nth-of-type(2)',
            '.chip-block span.chips_button',
            '.chip-block .data-ellipsis.tooltip-wrapper', 
            false,
            true
          )
        },
        producer: '.table-body__cell:nth-of-type(3) .data-ellipsis a',
        owner: '.table-body__cell:nth-of-type(4) .data-ellipsis',
        updated: '.table-body__cell:nth-of-type(5) .data-ellipsis',
        metrics: '.table-body__cell:nth-of-type(6) .data-ellipsis',
        frameworkAndAlgorithm: '.table-body__cell:nth-of-type(7) .chips-wrapper',
        preview: '.table-body__cell:nth-of-type(8) button .data-ellipsis svg',
        download: '.table-body__cell:nth-of-type(9) button .download-container svg',
        uri: '.table-body__cell:nth-of-type(10) button .data-ellipsis svg',
        action_menu: {
          componentType: actionMenu,
          structure: actionMenuStructure
        }
      }
    }
  }
}

const modelsEndpointTable = {
  root: '.table-container .table__flex .table__content',
  header: {
    root: '.table-head',
    sorters: {
      name: '.table-head__item:nth-of-type(1) .data-ellipsis',
      function: '.table-head__item:nth-of-type(2) .data-ellipsis',
      version: '.table-head__item:nth-of-type(3) .data-ellipsis',
      class: '.table-head__item:nth-of-type(4) .data-ellipsis',
      labels: '.table-head__item:nth-of-type(5) .data-ellipsis',
      uptime: '.table-head__item:nth-of-type(6) .data-ellipsis',
      last_prediction: '.table-head__item:nth-of-type(7) .data-ellipsis',
      average_latency: '.table-head__item:nth-of-type(8) .data-ellipsis',
      error_count: '.table-head__item:nth-of-type(9) .data-ellipsis',
      drift: '.table-head__item:nth-of-type(10) .data-ellipsis'
    }
  },
  body: {
    root: '.table-body',
    row: {
      root: '.table-row',
      fields: {
        name: '.table-body__cell:nth-of-type(1) a',
        function: '.table-body__cell:nth-of-type(2) .data-ellipsis',
        version: '.table-body__cell:nth-of-type(3) .data-ellipsis',
        class: '.table-body__cell:nth-of-type(4) .data-ellipsis',
        labels: {
          componentType: dropdownComponent,
          structure: generateDropdownGroup(
            '.table-body__cell:nth-of-type(5)',
            '.chip-block span.chips_button',
            '.chip-block .data-ellipsis.tooltip-wrapper', 
            false,
            true
          )
        },
        uptime: '.table-body__cell:nth-of-type(6) .data-ellipsis',
        last_prediction: '.table-body__cell:nth-of-type(7) .data-ellipsis',
        average_latency: '.table-body__cell:nth-of-type(8) .data-ellipsis',
        error_count: '.table-body__cell:nth-of-type(9) .data-ellipsis',
        drift: '.table-body__cell:nth-of-type(10) .data-ellipsis',
        action_menu: {
          componentType: actionMenu,
          structure: actionMenuStructure
        }
      }
    }
  }
}

const realTimePipelinesTable = {
  root: '.table-container .table__flex .table__content',
  header: {
    root: '.table-head',
    sorters: {
      name: '.table-head__item:nth-of-type(1) .data-ellipsis',
      type: '.table-head__item:nth-of-type(2) .data-ellipsis',
      function: '.table-head__item:nth-of-type(3) .data-ellipsis'
    }
  },
  body: {
    root: '.table-body',
    row: {
      root: '.table-body__row',
      fields: {
        expand_btn: '.table-body__cell:nth-of-type(1) .expand-arrow',
        status: {
          componentType: labelComponent,
          structure: generateLabelGroup(
            '.table-body__cell:nth-of-type(1) .status',
            'i',
            true,
            '.tooltip .tooltip__text span'
          )
        },
        name: '.table-body__cell:nth-of-type(1) a.data-ellipsis',
        type: '.table-body__cell:nth-of-type(2) .data-ellipsis',
        function: '.table-body__cell:nth-of-type(3) a.data-ellipsis',
        action_menu: {
          componentType: actionMenu,
          structure: actionMenuStructure
        }
      }
    }
  }
}

const realTimePipelinesGraph = {
  root: '.react-flow',
  elements: {
    workflowGraphNodesTable: {
      componentType: commonTable,
      structure: {
        root: '',
        header: {},
        body: {
          root: '.react-flow__nodes',
          row: {
            root: '.react-flow__node-ml-node',
            fields: {
              name: '.react-flow__node-label .data-ellipsis .data-ellipsis',
              top_handler: '.data-ellipsis .react-flow__handle-top',
              bottom_handler: '.data-ellipsis .react-flow__handle-bottom'
            }
          }
        }
      }
    },
    workflowGraphConnectionsTable: {
      componentType: commonTable,
      structure: {
        root: '',
        header: {},
        body: {
          root: '.react-flow__edges g[transform]',
          row: {
            root: '.react-flow__edge',
            fields: {
              path: '.react-flow__edge-path'
            }
          }
        }
      }
    },
    svg: '.react-flow__edges',
    zoomPane: '.react-flow__nodes'
  }
}

// Common components
const tableRefreshButton = By.css('.content .action-bar .tooltip-wrapper #refresh')

module.exports = {
  modelsTab: {
    Models_Tab_Selector: commonTable(tabSelector),
    Table_Name_Filter_Input: inputGroup(
      generateInputGroup(
        '.content .content__action-bar-wrapper .action-bar .name-filter .form-field-input',
        true
      )
    ),
    Table_Refresh_Button: tableRefreshButton,
    Models_Table: commonTable(modelsTable),
    Overlay: By.css('#overlay_container .chip-block-hidden_visible'),
    Register_Model_Button: By.css('.page-actions-container .btn_register'),
    Table_FilterBy_Button: By.css('.content .content__action-bar-wrapper .action-bar__filters .filters-button button')
  },
  modelEndpoints: {
    Table_Refresh_Button: tableRefreshButton,
    Table_Label_Filter_Input: inputGroup(
      generateInputGroup(
        '.content .content__action-bar-wrapper .input-wrapper:nth-of-type(1)',
        true,
        false,
        true
      )
    ),
    Table_Sort_By_Filter: dropdownComponent(
      generateDropdownGroup(
        '.content__action-bar-wrapper .filters .select:nth-of-type(2)',
        '.select__header',
        '.select__body .select__item',
        '.data-ellipsis .data-ellipsis'
      )
    ),
    Model_Endpoints_Table: commonTable(modelsEndpointTable),
    Overlay: By.css('#overlay_container .chip-block-hidden_visible')
  },
  realTimePipelinesTab: {
    Table_Name_Filter_Input: inputGroup(
      generateInputGroup('.content .content__action-bar-wrapper .filters .input-wrapper', true, false, true)
    ),
    Table_Refresh_Button: tableRefreshButton,
    Real_Time_Pipelines_Table: commonTable(realTimePipelinesTable),
    Real_Time_Pipelines_Graph: graph(realTimePipelinesGraph)
  }
}
