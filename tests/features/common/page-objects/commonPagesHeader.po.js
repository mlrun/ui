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

import breadcrumbsComponent from '../components/breadcrumbs.component'
import commonTable from '../components/table.component'

const generalInfoQuickLinks = {
  root: '.navbar .navbar__body .navbar-links',
  header: {},
  body: {
    row: {
      root: '.nav-link',
      fields: {
        link: '.nav-link__button span'
      }
    }
  }
}

module.exports = {
  loader: By.css('.loader-wrapper .loader'),
  See_On_Github: By.css('header.header a[alt="MLRUN on Gihub"]'),
  See_On_Slack: By.css('header.header a[alt="MLRUN on Slack"]'),
  Common_Hint: By.css('#overlay_container .tip'),
  Common_Tolltip: By.css('#overlay_container .tooltip'),
  Common_Options: By.css(
    '#overlay_container .options-menu .options-menu__body'
  ),
  MLRun_Logo: By.css('.header .header__logo'),
  No_Data_Message: By.css('.no-data-block h3'),
  Breadcrumbs: breadcrumbsComponent,
  General_Info_Quick_Links: commonTable(generalInfoQuickLinks),
  Project_Navigation_Toggler: By.css(
    '.ml-app .navbar'
  ),
  Project_Settings_Button: By.css(
    '.navbar .navbar__body .navbar__additional .navbar-links .nav-link__button .nav-link__label'
  ),
  Project_Settings_Icon: By.css(
    '.ml-app .navbar .navbar__additional .navbar-links svg'
  ),
  Pin_Quick_Link_Button: By.css(
    '.navbar .navbar__body .tooltip-wrapper button.round-icon-cp__circle'
  ),
  Navigation_Bar: By.css('.ml-app .navbar'),
  Project_Monitoring_Button: By.css('#monitor > span'),
  Project_Monitoring_Icon: By.css('#monitor > svg'),
  Quick_actions_Button: By.css('#quick-actions > span'),
  Quick_actions_Icon: By.css('#quick-actions > svg'),
  Feature_Store_Button: By.css('#feature-store > span'),
  Feature_Store_Icon: By.css('#feature-store > svg'),
  Datasets_Button: By.css('#datasets > span'),
  Datasets_Icon: By.css('#datasets > svg'),
  Artifacts_Button: By.css('#files > span'),
  Artifacts_Icon: By.css('#files > svg'),
  Models_Button: By.css('#models > span'),
  Models_Icon: By.css('#models > svg'),
  Jobs_And_Workflows_Button: By.css('#jobs > span'),
  Jobs_And_Workflows_Icon: By.css('#jobs > svg'),
  ML_Functions_Button: By.css('#ml-functions > span'),
  ML_Functions_Icon: By.css('#ml-functions > svg'),
  Real_Time_Functions_Button: By.css('.ml-app .navbar .navbar__content .navbar-links .nav-link:nth-of-type(9) span'),
  Real_Time_Functions_Icon: By.css('.ml-app .navbar .navbar__content .navbar-links .nav-link:nth-of-type(9) svg'),
  API_Gateways_Button: By.css('.ml-app .navbar .navbar__content .navbar-links .nav-link:nth-of-type(10) span'),
  API_Gateways_Icon: By.css('.ml-app .navbar .navbar__content .navbar-links .nav-link:nth-of-type(10) svg'),
  General_Info_Quick_Panel: By.css('.ml-app .navbar .navbar__body'),
  Project_Quick_Actions_Instance: By.css('.project-details__details .link'),
  Quick_actions_Active: By.css('#quick-actions'),
  Project_Monitoring_First_Instance: By.css('.project-details__details .link'),
  Project_Monitoring_Second_Instance: By.css('.project-overview-card:nth-of-type(3) .link:nth-of-type(4)'),
  Project_Monitoring_Active: By.css('#monitor'),
  Step_1_Button: By.css('.modal .modal__content .modal__body .wizard-steps .btn:nth-of-type(1)'),
  Step_1_Button_text: By.css('.modal .modal__content .modal__body .wizard-steps .btn:nth-of-type(1) div'),
  Step_2_Button: By.css('.modal .modal__content .modal__body .wizard-steps .btn:nth-of-type(2)'),
  Step_2_Button_text: By.css('.modal .modal__content .modal__body .wizard-steps .btn:nth-of-type(2) div'),
  Step_3_Button: By.css('.modal .modal__content .modal__body .wizard-steps .btn:nth-of-type(3)'),
  Step_3_Button_text: By.css('.modal .modal__content .modal__body .wizard-steps .btn:nth-of-type(3) div'),
  Step_4_Button: By.css('.modal .modal__content .modal__body .wizard-steps .btn:nth-of-type(4)'),
  Step_4_Button_text: By.css('.modal .modal__content .modal__body .wizard-steps .btn:nth-of-type(4) div'),
  Step_5_Button: By.css('.modal .modal__content .modal__body .wizard-steps .btn:nth-of-type(5)'),
  Step_5_Button_text: By.css('.modal .modal__content .modal__body .wizard-steps .btn:nth-of-type(5) div'),
  Step_6_Button: By.css('.modal .modal__content .modal__body .wizard-steps .btn:nth-of-type(6)'),
  Step_6_Button_text: By.css('.modal .modal__content .modal__body .wizard-steps .btn:nth-of-type(6) div'),
  Step_7_Button: By.css('.modal .modal__content .modal__body .wizard-steps .btn:nth-of-type(7)'),
  Step_7_Button_text: By.css('.modal .modal__content .modal__body .wizard-steps .btn:nth-of-type(7) div'),
  Form_Header_Function_Selection: By.css('.job-wizard__function-selection .form-row .form-step-title'),
  Form_Header_Run_Details: By.css('.job-wizard__run-details .form-row .form-step-title'),
  Form_Header_Data_Inputs: By.css('.job-wizard__data-inputs .form-row .form-step-title'),
  Form_Header_Parameters: By.css('.job-wizard__parameters .form-row .form-step-title'),
  Form_Header_Resources: By.css('.job-wizard__resources .form-row .form-step-title'),
  Form_Header_Advanced: By.css('.job-wizard__advanced .form-row .form-step-title'),
  Form_Header_Hyperparameter_Strategy: By.css('.job-wizard__hyperparameter-strategy .form-row .form-step-title'),
}
