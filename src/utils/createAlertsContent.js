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
import { upperFirst } from 'lodash'

import { formatDatetime } from './datetime'

import { ReactComponent as Application } from 'igz-controls/images/application-icon.svg'
import { ReactComponent as Endpoint } from '../components/ProjectsAlerts/endpoint.svg'
import { ReactComponent as Job } from '../components/ProjectsAlerts/job.svg'
import { ReactComponent as Low } from '../components/ProjectsAlerts/low.svg'
import { ReactComponent as Normal } from '../components/ProjectsAlerts/normal.svg'
import { ReactComponent as High } from '../components/ProjectsAlerts/critical.svg'
import { ReactComponent as Git } from '../components/ProjectsAlerts/git.svg'
import { ReactComponent as Mail } from '../components/ProjectsAlerts/mail.svg'
import { ReactComponent as Webhook } from '../components/ProjectsAlerts/webhook.svg'
import { ReactComponent as Slack } from '../components/ProjectsAlerts/slack.svg'

import {
  APPLICATION,
  ENDPOINT,
  JOB,
  MODEL_ENDPOINT_RESULT,
  MODEL_MONITORING_APPLICATION,
  SEVERITY,
  SEVERITY_HIGH,
  SEVERITY_LOW,
  SEVERITY_MEDIUM
} from '../constants'

const getEntityTypeData = entityType => {
  switch (entityType) {
    case MODEL_ENDPOINT_RESULT:
      return {
        value: <Endpoint />,
        tooltip: upperFirst(ENDPOINT)
      }
    case MODEL_MONITORING_APPLICATION:
      return {
        value: <Application />,
        tooltip: upperFirst(APPLICATION)
      }
    case JOB:
      return {
        value: <Job />,
        tooltip: upperFirst(JOB)
      }
    default:
      return {
        value: <span />
      }
  }
}

const getSeverityData = severity => {
  switch (severity) {
    case SEVERITY_LOW:
      return {
        value: (
          <div className="severity-cell">
            <Low />
            <span>{upperFirst(SEVERITY_LOW)}</span>
          </div>
        ),
        tooltip: upperFirst(SEVERITY_LOW)
      }
    case SEVERITY_MEDIUM:
      return {
        value: (
          <div className="severity-cell">
            <Normal />
            <span>{upperFirst(SEVERITY_MEDIUM)}</span>
          </div>
        ),
        tooltip: upperFirst(SEVERITY_MEDIUM)
      }
    case SEVERITY_HIGH:
      return {
        value: (
          <div className="severity-cell">
            <High />
            <span>{upperFirst(SEVERITY_MEDIUM)}</span>
          </div>
        ),

        tooltip: upperFirst(SEVERITY_HIGH)
      }
    default:
      return {
        value: <span />
      }
  }
}

const alertsNotifications = {
  webhook: <Webhook />,
  git: <Git />,
  slack: <Slack />,
  email: <Mail />
}

const getNotificationData = notifications =>
  notifications.map(notification => {
    return {
      icon: (
        <div
          className={`table-cell-notification__content ${notification.err !== '' ? 'notification-fail' : ''}`}
        >
          {alertsNotifications[notification.kind]}
        </div>
      ),
      tooltip: upperFirst(notification.kind)
    }
  })

export const createAlertRowData = ({ name, ...alert }) => {
  const createAlertsId = (activationTime = new Date().toISOString()) => {
    const date = new Date(activationTime)

    return date.getTime().toString(36).slice(-7)
  }
  alert.id = createAlertsId(alert.activation_time)

  return {
    data: {
      ...alert
    },
    content: [
      {
        id: `alertName.${alert.id}`,
        headerId: 'alertName',
        headerLabel: 'Alert Name',
        value: name,
        className: 'table-cell-1',
        getLink: () => {}, //TODO: Implement in ML-8368
        showStatus: true,
        tooltip: name,
        type: 'link'
      },
      {
        id: `projectName.${alert.id}`,
        headerId: 'projectName',
        headerLabel: 'Project name',
        value: alert.project,
        className: 'table-cell-1'
      },
      {
        id: `eventType.${alert.id}`,
        headerId: 'eventType',
        headerLabel: 'Event Type',
        value: alert.event_kind.split('-').join(' '),
        className: 'table-cell-1'
      },
      {
        id: `entityId.${alert.id}`,
        headerId: 'entityId',
        headerLabel: 'Entity ID',
        value: alert.entity_id,
        className: 'table-cell-1'
      },
      {
        id: `entityType.${alert.id}`,
        headerId: 'entityType',
        headerLabel: 'Entity Type',
        value: getEntityTypeData(alert.entity_kind).value,
        className: 'table-cell-small',
        tooltip: getEntityTypeData(alert.entity_kind).tooltip
      },
      {
        id: `timestamp.${alert.id}`,
        headerId: 'timestamp',
        headerLabel: 'Timestamp',
        value: formatDatetime(alert.activation_time, '-'),
        className: 'table-cell-1'
      },
      {
        id: `severity.${alert.id}`,
        headerId: SEVERITY,
        headerLabel: upperFirst(SEVERITY),
        value: getSeverityData(alert.severity).value,
        tooltip: getSeverityData(alert.severity).tooltip,
        className: 'table-cell-1'
      },
      {
        id: `criteriaCount.${alert.id}`,
        headerId: 'criteriaCount',
        headerLabel: 'Trigger criteria count',
        value: alert.criteria.count,
        className: 'table-cell-1'
      },
      {
        id: `criteriaTime.${alert.id}`,
        headerId: 'criteriaTime',
        headerLabel: 'Trigger criteria time period',
        value: alert.criteria.period,
        className: 'table-cell-1'
      },
      {
        id: `notifications.${alert.id}`,
        headerId: 'notifications',
        headerLabel: 'Notifications',
        value: getNotificationData(alert.notifications),
        className: 'table-cell-small table-cell-notification',
        type: 'icons'
      }
    ]
  }
}
