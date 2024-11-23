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

import { formatDatetime } from './datetime'
import { JOB_KIND_SPARK } from '../constants'

export const createAlertRowData = ({ name, ...alert }) => {
  return {
    data: {
      ...alert
    },
    content: [
      {
        id: 'key.alert', // @TODO create id
        headerId: 'alertname',
        headerLabel: 'Alert Name',
        value: name,
        className: 'table-cell-1',
        getLink: () => {},
        showStatus: true,
        tooltip: name,
        type: 'link'
      },
      {
        headerId: 'projectname',
        headerLabel: 'Project name',
        id: 'projectname',
        // id: `projectName.${identifierUnique}`, @TODO create projectName.id
        value: alert.project,
        className: 'table-cell-1'
      },
      {
        headerId: 'eventtype',
        headerLabel: 'Event Type',
        id: 'eventtype',
        // id: `type.${identifierUnique}`,  @TODO create id
        value: alert.event_kind,
        className: 'table-cell-1'
      },
      {
        headerId: 'entityid',
        headerLabel: 'Entity ID',
        id: 'entityid',
        // id: `uid.${identifierUnique}`,//@TODO create id
        value: alert.entity_id, // @TODO add id based on type
        className: 'table-cell-1'
      },
      {
        headerId: 'entitytype',
        headerLabel: 'Entity Type',
        id: 'entitytype',
        // id: `entitytype.${identifierUnique}`,//@TODO create id
        // value: type, //@TODO add jobs label type to alert object in response
        value: 'job',
        className: 'table-cell-small',
        type: 'type'
      },
      {
        // id: `timestamp.${alert.ui.identifierUnique}`, //@TODO create id
        headerId: 'timestamp',
        id: 'timestamp',
        headerLabel: 'Timestamp',
        value: formatDatetime(alert.activation_time, '-'),
        className: 'table-cell-1'
      },
      {
        headerId: 'severity',
        headerLabel: 'severity',
        id: 'severity',
        // id: `severity.${identifierUnique}`, //@TODO create id
        // value: alert.severity,
        value: JOB_KIND_SPARK,
        text: alert.severity,
        className: 'table-cell-1',
        type: 'type'
      },
      {
        headerId: 'criteriacount',
        id: 'criteriacount',
        headerLabel: 'Trigger count',
        // id: `severity.${identifierUnique}`, //@TODO create id
        value: alert.criteria.count,
        className: 'table-cell-1'
      },
      {
        // id: `criteriatime.${alert.ui.identifierUnique}`,//@TODO create id
        id: 'criteriatime',
        headerId: 'criteriatime',
        headerLabel: 'Trigger time',
        value: alert.criteria.period,
        // value: formatDatetime(alert.status?.first_request, '-'),
        className: 'table-cell-1'
      },
      {
        // id: `notifications.${alert.ui.identifierUnique}`,//@TODO create id
        id: 'notifications',
        headerId: 'notifications',
        headerLabel: 'Notifications',
        value: alert.notifications || [],
        className: 'table-cell-1'
      }
    ]
  }
}
