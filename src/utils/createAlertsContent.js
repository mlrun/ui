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
// import {parseUri} from "./parseUri";
// import {validateArguments} from "./validateArguments";
// import {generateFunctionDetailsLink, generateLinkToDetailsPanel} from "./link-helper.util";
// import {MODEL_ENDPOINTS_TAB, MODELS_TAB} from "../constants";
// import {parseKeyValues} from "./object";
// import {formatDatetime} from "./datetime";

// import { JOBS_PAGE, MONITOR_JOBS_TAB } from '../constants'

export const createAlertRowData = (alert, project) => {
  // console.log(alert)
  const { name } = alert
  // const { name, tag = '-' } = (artifact.spec?.model ?? '').match(/^(?<name>.*?)(:(?<tag>.*))?$/)?.groups ?? {}
  // const functionUri = artifact.spec?.function_uri ? `store://functions/${artifact.spec.function_uri}` : ''
  // const { key: functionName } = parseUri(functionUri)
  // const isEndpointTypeRouter = artifact?.status?.endpoint_type === 2

  // for jobs
  // const type = alert.labels?.find(label => label.includes('kind:'))?.replace('kind: ', '') ?? ''

  return {
    data: {
      ...alert
    },
    content: [
      //  Alert Name
      {
        // id: `key.${alert.ui.identifierUnique}`, // @TODO create id
        id: 'key.alert', // @TODO create id
        headerId: 'alertname',
        headerLabel: 'Alert Name',
        value: name,
        className: '',
        getLink: () => `/projects/${alert.project}/alerts/${alert.name}`,
        showStatus: true,
        tooltip: name
      },
      //   Project Name
      {
        headerId: 'projectname',
        headerLabel: 'Project name',
        id: 'projectname',
        // id: `projectName.${identifierUnique}`, @TODO create projectName.id
        value: alert.project,
        className: ''
      },
      // Event Type
      {
        headerId: 'eventtype',
        headerLabel: 'Event Type',
        id: 'eventtype',
        // id: `type.${identifierUnique}`,  @TODO create id
        value: alert.event_kind,
        className: ''
        // type: 'type' @TODO check if type for icon
      },
      // Entity ID
      {
        headerId: 'entityid',
        headerLabel: 'Entity ID',
        id: 'entityid',
        // id: `uid.${identifierUnique}`,//@TODO create id
        value: alert.entity_id, // @TODO add id based on type
        className: ''
      },
      // Entity Type
      {
        headerId: 'entitytype',
        headerLabel: 'Entity Type',
        id: 'entitytype',
        // id: `entitytype.${identifierUnique}`,//@TODO create id
        // value: type, //@TODO add jobs label type to alert object in response
        className: 'table-cell-1',
        type: 'type'
      },
      // Timestamp
      {
        // id: `timestamp.${alert.ui.identifierUnique}`, //@TODO create id
        headerId: 'timestamp',
        id: 'timestamp',
        headerLabel: 'First prediction',
        // value: formatDatetime(alert.status?.first_request, '-'),
        className: 'table-cell-1'
      },
      //   Severity
      {
        headerId: 'severity',
        headerLabel: 'severity',
        id: 'severity',
        // id: `severity.${identifierUnique}`, //@TODO create id
        value: alert.severity,
        className: 'table-cell-1'
      },
      // Trigger criteria count
      {
        headerId: 'criteriacount',
        id: 'criteriacount',
        headerLabel: 'Trigger criteria count',
        // id: `severity.${identifierUnique}`, //@TODO create id
        // value: alert.criteria.count,
        // value: alert.criteria.count,
        className: 'table-cell-1'
      },
      //   Trigger criteria time period
      {
        // id: `criteriatime.${alert.ui.identifierUnique}`,//@TODO create id
        id: 'criteriatime',
        headerId: 'criteriatime',
        headerLabel: 'Trigger criteria time period',
        // value: formatDatetime(alert.status?.first_request, '-'),
        className: 'table-cell-1'
      },
      // Notifications
      {
        // id: `notifications.${alert.ui.identifierUnique}`,//@TODO create id
        id: 'notifications',
        headerId: 'notifications',
        headerLabel: 'Notifications',
        // value: alert[] //TODO: create notification  support
        // value: formatDatetime(alert.status?.first_request, '-'),
        className: 'table-cell-1'
      }
    ]
  }
}
