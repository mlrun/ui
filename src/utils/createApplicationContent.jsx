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

export const createApplicationContent = application => {
  let identifierUnique = 'identifierUnique' + application.name

  return {
    data: {
      ...application
    },
    content: [
      {
        id: `key.${identifierUnique}`,
        headerId: 'name',
        headerLabel: 'Name',
        value: application.name,
        className: 'table-cell-name',
        getLink: () => 'qqwewqewqewqewqewqeqwe'
      },
      {
        id: `invocations.${identifierUnique}`,
        headerId: 'invocations',
        headerLabel: 'Invocations',
        value: application.invocations,
        className: 'table-cell-1'
      },
      {
        id: `alerts.${identifierUnique}`,
        headerId: 'alerts',
        headerLabel: 'Alerts',
        value: application.alerts,
        className: 'table-cell-1'
      },
      {
        id: `detections.${identifierUnique}`,
        headerId: 'detections',
        headerLabel: 'Detections',
        value: application.detections,
        className: 'table-cell-1'
      },
      {
        id: `possibleDetections.${identifierUnique}`,
        headerId: 'possibleDetections',
        headerLabel: 'Possible Detections',
        value: application.possibleDetections,
        className: 'table-cell-1'
      },
      {
        id: `class.${identifierUnique}`,
        headerId: 'class',
        headerLabel: 'Class',
        value: application.class,
        className: 'table-cell-2'
      },
      {
        id: `startedAt.${identifierUnique}`,
        headerId: 'startedAt',
        headerLabel: 'Started At',
        value: application.startedAt,
        className: 'table-cell-2'
      },
      {
        id: `updated.${identifierUnique}`,
        headerId: 'updated',
        headerLabel: 'Updated',
        value: application.updated,
        className: 'table-cell-2'
      },
      {
        id: `duration.${identifierUnique}`,
        headerId: 'duration',
        headerLabel: 'Duration',
        value: application.duration,
        className: 'table-cell-2'
      },
      {
        id: `nuclioFunction.${identifierUnique}`,
        headerId: 'nuclioFunction',
        headerLabel: 'Nuclio Function',
        value: application.nuclioFunction,
        className: 'table-cell-2'
      }
    ]
  }
}
