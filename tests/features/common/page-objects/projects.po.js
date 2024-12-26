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
import dropdownComponent from '../components/dropdown.component'
import actionMenu from '../components/action-menu.component'
import {
  generateDropdownGroup,
  generateInputGroup,
  generateLabelGroup
} from '../../common-tools/common-tools'
import inputGroup from '../components/input-group.component'
import labelComponent from '../components/label.component'

const ProjectsTableSelector = {
  root: '.projects .projects-content',
  header: {},
  body: {
    row: {
      root: '.project-card',
      fields: {
        name: '.project-card__general-info .project-card__header .project-card__header-title .data-ellipsis.tooltip-wrapper.project-card__title',
        description:
          '.project-card__general-info .project-card__content .project-card__description .data-ellipsis',
        running: {
          componentType: labelComponent,
          structure: generateLabelGroup(
            '.project-card__content .project-card__statistic .project-data-card__statistics-item:nth-of-type(1)',
            false,
            false,
            '.tooltip .tooltip__text span'
          )
        },
        failed: {
          componentType: labelComponent,
          structure: generateLabelGroup(
            '.project-card__content .project-card__statistic .project-data-card__statistics-item:nth-of-type(2)',
            false,
            false,
            '.tooltip .tooltip__text span'
          )
        },
        labels_key: {
          componentType: labelComponent,
          structure: generateLabelGroup(
            '[data-testid="project-card__labels"] .chip-block .input-label-key',
            false,
            false,
            '.tooltip .tooltip__text span'
          )
        },
        labels_value: {
          componentType: labelComponent,
          structure: generateLabelGroup(
            '[data-testid="project-card__labels"] .chip-block .input-label-value',
            false,
            false,
            '.tooltip .tooltip__text span'
          )
        },
        labels: {
          componentType: dropdownComponent,
          structure: generateDropdownGroup(
            '.project-card__labels',
            '.chip-block span.chips_button',
            '.chip-block .chip-block-hidden_visible .data-ellipsis.tooltip-wrapper',
            false,
            true
          )
        },
        creation: '.project-card__header-title .project-card__info span',
        action_menu: {
          componentType: actionMenu,
          structure: {
            root: '.project-card__actions-menu',
            menuElements: {
              open_button: 'button',
              options: '#overlay_container .actions-menu__option'
            }
          }
        }
      }
    }
  }
}

module.exports = {
  Retrieving_projects_message: By.css('[data-testid=no-data]'),
  New_Project_Button: By.css(
    '.projects__wrapper .projects-content-header-item .page-actions-container .btn_register'
  ),
  Refresh_Projects_Button: By.css('.projects-content-header .data-ellipsis button'),
  Projects_Table: commonTable(ProjectsTableSelector),
  Overlay: By.css('#overlay_container .chip-block-hidden_visible'),
  Active_Projects_Button: By.css(
    '.projects__wrapper .projects-content-header .projects-content-header-item [data-testid="active"] span'
  ),
  Archive_Projects_Button: By.css(
    '.projects__wrapper .projects-content-header .projects-content-header-item [data-testid=archived] a'
  ),
  Projects_Sorter: By.css('.projects-content-header-item .sort .split-btn__button:nth-of-type(1)'),
  Projects_Sort_Dropdown: dropdownComponent(
    generateDropdownGroup(
      '.projects-content-header-item .sort .split-btn__button:nth-of-type(2)',
      'button svg', // Open Component
      '.select__item', // Options
      '.data-ellipsis > .tooltip-wrapper' // Option value
    )
  ),
  No_Archived_Projects_Label: '.projects .projects__wrapper .projects-content .no-filtered-data',
  Search_Projects_Input: inputGroup(
    generateInputGroup('.projects__wrapper .projects-content-header .search-container')
  ),
  Projects_Monitoring_Container: {
    Monitoring_Container: By.css('.projects .projects-monitoring-container'),
    Monitoring_Container_Title: By.css(
      '.projects-monitoring-container .page-header__title'
    ),
    Monitoring_Jobs_Box: By.css(
      '.projects-monitoring-container .projects-monitoring-stats .stats-card:nth-of-type(1)'
    ),
    Monitoring_Workflows_Box: By.css(
      '.projects-monitoring-container .projects-monitoring-stats .stats-card:nth-of-type(2)'
    ),
    Monitoring_Scheduled_Box: By.css(
      '.projects-monitoring-container .projects-monitoring-stats .stats-card:nth-of-type(3)'
    ),
    Monitoring_Alerts_Box: By.css(
      '.projects-monitoring-container .projects-monitoring-stats .stats-card:nth-of-type(3)'
    )
  },
  Monitoring_Jobs_Box: {
    Monitoring_Jobs_Box_Title: By.css(
      '.projects-monitoring-stats .stats-card:nth-of-type(1) .stats-card__title'
    ),
    Filtering_Time_Period: By.css('.stats-card:nth-of-type(1) .stats-card__col > div > span'),
    Total_Counter_Title: By.css(
      '.stats-card:nth-of-type(1) .stats-card__col > div > div > span'
    ),
    Total_Counter_Number: By.css(
      '.stats-card:nth-of-type(1) .stats-card__col > div > div .stats__counter'
    ),
    Counter_Running_Status_Number: By.css(
      '.stats-card:nth-of-type(1) [data-testid="jobs_running_counter"] .stats__counter'
    ),
    Counter_Running_Status_Subtitle: By.css(
      '.stats-card:nth-of-type(1) [data-testid="jobs_running_counter"] .stats__subtitle'
    ),
    Counter_Running_Status_Icon: By.css(
      '.stats-card:nth-of-type(1) [data-testid="jobs_running_counter"] .state-running'
    ),
    Counter_Failed_Status_Number: By.css(
      '.stats-card:nth-of-type(1) [data-testid="jobs_failed_counter"] .stats__counter'
    ),
    Counter_Failed_Status_Subtitle: By.css(
      '.stats-card:nth-of-type(1) [data-testid="jobs_failed_counter"] .stats__subtitle'
    ),
    Counter_Failed_Status_Icon: By.css(
      '.stats-card:nth-of-type(1) [data-testid="jobs_failed_counter"] .state-failed' 
    ),
    Counter_Completed_Status_Number: By.css(
      '.stats-card:nth-of-type(1) [data-testid="jobs_completed_counter"] .stats__counter' 
    ),
    Counter_Completed_Status_Subtitle: By.css(
      '.stats-card:nth-of-type(1) [data-testid="jobs_completed_counter"] .stats__subtitle' 
    ),
    Counter_Completed_Status_Icon: By.css(
      '.stats-card:nth-of-type(1) [data-testid="jobs_completed_counter"] .state-completed'
    )
  },
  Monitoring_Workflows_Box: {
    Monitoring_Workflows_Box_Title: By.css(
      '.projects-monitoring-stats .stats-card:nth-of-type(2) .stats-card__title'
    ),
    Filtering_Time_Period: By.css('.stats-card:nth-of-type(2) .stats-card__col > div > span'),
    Total_Counter_Title: By.css(
      '.stats-card:nth-of-type(2) .stats-card__col > div > div > span'
    ),
    Total_Counter_Number: By.css(
      '.stats-card:nth-of-type(2) .stats-card__col > div > div .stats__counter'
    ),
    Counter_Running_Status_Number: By.css(
      '.stats-card:nth-of-type(2) [data-testid="wf_running_counter"] .stats__counter'
    ),
    Counter_Running_Status_Subtitle: By.css(
      '.stats-card:nth-of-type(2) [data-testid="wf_running_counter"] .stats__subtitle'
    ),
    Counter_Running_Status_Icon: By.css(
      '.stats-card:nth-of-type(2) [data-testid="wf_running_counter"] .state-running'
    ),
    Counter_Failed_Status_Number: By.css(
      '.stats-card:nth-of-type(2) [data-testid="wf_failed_counter"] .stats__counter'
    ),
    Counter_Failed_Status_Subtitle: By.css(
      '.stats-card:nth-of-type(2) [data-testid="wf_failed_counter"] .stats__subtitle'
    ),
    Counter_Failed_Status_Icon: By.css(
      '.stats-card:nth-of-type(2) [data-testid="wf_failed_counter"] .state-failed'
    ),
    Counter_Completed_Status_Number: By.css(
      '.stats-card:nth-of-type(2) [data-testid="wf_completed_counter"] .stats__counter'
    ),
    Counter_Completed_Status_Subtitle: By.css(
      '.stats-card:nth-of-type(2) [data-testid="wf_completed_counter"] .stats__subtitle'
    ),
    Counter_Completed_Status_Icon: By.css(
      '.stats-card:nth-of-type(2) [data-testid="wf_completed_counter"] .state-completed'
    )
  },
  Monitoring_Scheduled_Box: {
    Monitoring_Scheduled_Box_Title: By.css(
      '.projects-monitoring-stats .stats-card:nth-of-type(3) .stats-card__title'
    ),
    Filtering_Time_Period: By.css('.stats-card:nth-of-type(3) .stats-card__col > div > span'),
    Total_Job_Counter_Title: By.css(
      '.stats-card:nth-of-type(3) [data-testid="scheduled_jobs_counter"] .stats__subtitle'
    ),
    Total_Workflows_Counter_Title: By.css(
      '.stats-card:nth-of-type(3) [data-testid="scheduled_wf_counter"] .stats__subtitle'
    ),
    Total_Scheduled_Title: By.css(
      '.stats-card:nth-of-type(3) .stats-card__col > div > div > span'
    ),
    Total_Job_Counter_Number: By.css(
      '.stats-card:nth-of-type(3) [data-testid="scheduled_jobs_counter"] .stats__counter'
    ),
    Total_Workflows_Counter_Number: By.css(
      '.stats-card:nth-of-type(3) [data-testid="scheduled_wf_counter"] .stats__counter'
    ),
    Total_Scheduled_Number: By.css(
      '.stats-card:nth-of-type(3) .stats-card__col > div > div .stats__counter'
    )
  },
  Monitoring_Alerts_Box: {
    Monitoring_Alerts_Box_Title: By.css(
      '.projects-monitoring-stats .stats-card:nth-of-type(4) .stats-card__title'
    ),
    Monitoring_Alerts_Box_Title_Icon: By.css(
      '.projects-monitoring-stats .stats-card:nth-of-type(4) .stats-card__title svg'
    ),
    Filtering_Time_Period: By.css('.stats-card:nth-of-type(4) .stats-card__col > div > span'),
    Total_Endpoint_Counter_Number: By.css(
      '.stats-card:nth-of-type(4) [data-testid="alerts_endpoint_counter"] .stats__counter'
    ),
    Total_Endpoint_Counter_Title: By.css(
      '.stats-card:nth-of-type(4) [data-testid="alerts_endpoint_counter"] .stats__subtitle'
    ),
    Total_Jobs_Counter_Number: By.css(
      '.stats-card:nth-of-type(4) [data-testid="alerts_jobs_counter"] .stats__counter'
    ),
    Total_Jobs_Counter_Title: By.css(
      '.stats-card:nth-of-type(4) [data-testid="alerts_jobs_counter"] .stats__subtitle'
    ),
    Total_Application_Counter_Number: By.css(
      '.stats-card:nth-of-type(4) [data-testid="alerts_application_counter"] .stats__counter'
    ),
    Total_Application_Counter_Title: By.css(
      '.stats-card:nth-of-type(4) [data-testid="alerts_application_counter"] .stats__subtitle'
    ),
    Total_Alerts_Title: By.css(
      '.stats-card:nth-of-type(4) .stats-card__col > div > div > span'
    ),
    Total_Alerts_Number: By.css(
      '.stats-card:nth-of-type(4) .stats-card__col > div > div .stats__counter'
    )
  }
}
