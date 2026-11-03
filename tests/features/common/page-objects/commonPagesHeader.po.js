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

import breadcrumbsComponent from '../components/breadcrumbs.component.js'
import sidebarComponent from '../components/sidebar.component.js'

export default {
  loader: By.css('.loader-wrapper .loader-output'),
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
  Sidebar: sidebarComponent,
  General_Info_Quick_Links: sidebarComponent.content,
  Project_Navigation_Toggler: sidebarComponent.body,
  Project_Settings_Button: sidebarComponent.linkLabel('Project settings'),
  Project_Settings_Icon: sidebarComponent.linkIcon('Project settings'),
  Pin_Quick_Link_Button: sidebarComponent.pinButton,
  Navigation_Bar: sidebarComponent.root,
  Project_Monitoring_Button: sidebarComponent.linkLabel('Project monitoring'),
  Project_Monitoring_Icon: sidebarComponent.linkIcon('Project monitoring'),
  Data_And_Artifacts_Button: sidebarComponent.groupLabel('Data and artifacts'),
  Data_And_Artifacts_Icon: sidebarComponent.groupIcon('Data and artifacts'),
  Feature_Store_Button: sidebarComponent.linkLabel('Feature store'),
  Datasets_Button: sidebarComponent.linkLabel('Datasets'),
  Documents_Button: sidebarComponent.linkLabel('Documents'),
  LLM_Prompts_Button: sidebarComponent.linkLabel('LLM prompts'),
  Artifacts_Button: sidebarComponent.linkLabel('Other artifacts'),
  Models_Button: sidebarComponent.groupLabel('Models'),
  Models_Icon: sidebarComponent.groupIcon('Models'),
  Monitoring_App_Button: sidebarComponent.linkLabel('Monitoring app'),
  Jobs_And_Workflows_Button: sidebarComponent.groupLabel('Jobs and workflows'),
  Jobs_And_Workflows_Icon: sidebarComponent.groupIcon('Jobs and workflows'),
  ML_Functions_Button: sidebarComponent.linkLabel('ML functions'),
  ML_Functions_Icon: sidebarComponent.linkIcon('ML functions'),
  Nuclio_Button: sidebarComponent.groupLabel('Nuclio'),
  Nuclio_Icon: sidebarComponent.groupIcon('Nuclio'),
  Real_Time_Functions_Button: sidebarComponent.linkLabel('Real-time functions'),
  API_Gateways_Button: sidebarComponent.linkLabel('API gateways'),
  Alerts_Button: sidebarComponent.linkLabel('Alerts'),
  Alerts_Icon: sidebarComponent.linkIcon('Alerts'),
  General_Info_Quick_Panel: sidebarComponent.content,
  Step_1_Button: By.css('.modal .modal__content .modal__body .wizard-steps .btn:nth-of-type(1)'),
  Step_1_Button_text: By.css('.modal .modal__content .modal__body .wizard-steps .btn:nth-of-type(1) .data-ellipsis span'),
  Step_2_Button: By.css('.modal .modal__content .modal__body .wizard-steps .btn:nth-of-type(2)'),
  Step_2_Button_text: By.css('.modal .modal__content .modal__body .wizard-steps .btn:nth-of-type(2) .data-ellipsis span'),
  Step_3_Button: By.css('.modal .modal__content .modal__body .wizard-steps .btn:nth-of-type(3)'),
  Step_3_Button_text: By.css('.modal .modal__content .modal__body .wizard-steps .btn:nth-of-type(3) .data-ellipsis span'),
  Step_4_Button: By.css('.modal .modal__content .modal__body .wizard-steps .btn:nth-of-type(4)'),
  Step_4_Button_text: By.css('.modal .modal__content .modal__body .wizard-steps .btn:nth-of-type(4) .data-ellipsis span'),
  Step_5_Button: By.css('.modal .modal__content .modal__body .wizard-steps .btn:nth-of-type(5)'),
  Step_5_Button_text: By.css('.modal .modal__content .modal__body .wizard-steps .btn:nth-of-type(5) .data-ellipsis span'),
  Step_6_Button: By.css('.modal .modal__content .modal__body .wizard-steps .btn:nth-of-type(6)'),
  Step_6_Button_text: By.css('.modal .modal__content .modal__body .wizard-steps .btn:nth-of-type(6) .data-ellipsis span'),
  Step_7_Button: By.css('.modal .modal__content .modal__body .wizard-steps .btn:nth-of-type(7)'),
  Step_7_Button_text: By.css('.modal .modal__content .modal__body .wizard-steps .btn:nth-of-type(7) .data-ellipsis span'),
  Form_Header_Function_Selection: By.css('.job-wizard__function-selection .form-row .form-step-title'),
  Form_Header_Run_Details: By.css('.job-wizard__run-details .form-row .form-step-title'),
  Form_Header_Data_Inputs: By.css('.job-wizard__data-inputs .form-row .form-step-title'),
  Form_Header_Parameters: By.css('.job-wizard__parameters .form-row .form-step-title'),
  Form_Header_Resources: By.css('.job-wizard__resources .form-row .form-step-title'),
  Form_Header_Advanced: By.css('.job-wizard__advanced .form-row .form-step-title'),
  Form_Header_Hyperparameter_Strategy: By.css('.job-wizard__hyperparameter-strategy .form-row .form-step-title'),
}
