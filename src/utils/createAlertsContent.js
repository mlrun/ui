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

import { ReactComponent as Application } from 'igz-controls/images/entity-type-application.svg'
import { ReactComponent as Endpoint } from 'igz-controls/images/entity-type-endpoint.svg'
import { ReactComponent as Error } from 'igz-controls/images/severity-warning.svg'
import { ReactComponent as Critical } from 'igz-controls/images/severity-critical.svg'
import { ReactComponent as Email } from 'igz-controls/images/email-icon.svg'
import { ReactComponent as Git } from 'igz-controls/images/git-icon.svg'
import { ReactComponent as High } from 'igz-controls/images/severity-high.svg'
import { ReactComponent as Job } from 'igz-controls/images/entity-type-job.svg'
import { ReactComponent as Low } from 'igz-controls/images/severity-low.svg'
import { ReactComponent as Normal } from 'igz-controls/images/severity-normal.svg'
import { ReactComponent as Slack } from 'igz-controls/images/slack-icon-colored.svg'
import { ReactComponent as Webhook } from 'igz-controls/images/webhook-icon.svg'

import {
  APPLICATION,
  ENDPOINT,
  DETAILS_ALERT_APPLICATION,
  JOB,
  MODEL_ENDPOINT_RESULT,
  MODEL_MONITORING_APPLICATION,
  SEVERITY,
  SEVERITY_CRITICAL,
  SEVERITY_HIGH,
  SEVERITY_LOW,
  SEVERITY_MEDIUM
} from '../constants'

const getEntityTypeData = entityType => {
  switch (entityType) {
    case MODEL_ENDPOINT_RESULT:
      return {
        value: <Endpoint />,
        detailsValue: (
          <div className="alert-row__details-alert-icon-cell">
            <Endpoint /> <span>{upperFirst(ENDPOINT)}</span>
          </div>
        ),
        tooltip: upperFirst(ENDPOINT)
      }
    case MODEL_MONITORING_APPLICATION:
      return {
        value: <Application />,
        detailsValue: (
          <div className="alert-row__details-alert-icon-cell">
            <Application /> <span>{upperFirst(APPLICATION)}</span>
          </div>
        ),
        tooltip: upperFirst(APPLICATION)
      }
    case JOB:
      return {
        value: <Job />,
        detailsValue: (
          <div className="alert-row__details-alert-icon-cell">
            <Job /> <span>{upperFirst(upperFirst(JOB))}</span>
          </div>
        ),
        tooltip: upperFirst(JOB)
      }
    default:
      return {
        value: <span />
      }
  }
}
export const getTriggerCriticalTimePeriod = line => {
  const units = {
    y: 'year',
    w: 'week',
    d: 'day',
    h: 'hour',
    m: 'minute',
    s: 'second',
    ms: 'millisecond'
  }

  const formatPart = part => {
    const unit = Object.keys(units).find(key => part.endsWith(key))
    if (!unit) return 'N/A'

    const value = part.slice(0, -unit.length)
    const isPlural = parseInt(value, 10) > 1

    return `${value} ${units[unit]}${isPlural ? 's' : ''}`
  }

  return line ? line.split(/,?\s+/).map(formatPart).join(', ') : 'N/A'
}

const getSeverityData = severity => {
  switch (severity) {
    case SEVERITY_LOW:
      return {
        value: (
          <div className="alert-row__details-alert-icon-cell">
            <Low />
            <span>{upperFirst(SEVERITY_LOW)}</span>
          </div>
        ),
        tooltip: upperFirst(SEVERITY_LOW)
      }
    case SEVERITY_MEDIUM:
      return {
        value: (
          <div className="alert-row__details-alert-icon-cell">
            <Normal />
            <span>{upperFirst(SEVERITY_MEDIUM)}</span>
          </div>
        ),
        tooltip: upperFirst(SEVERITY_MEDIUM)
      }
    case SEVERITY_HIGH:
      return {
        value: (
          <div className="alert-row__details-alert-icon-cell">
            <High />
            <span>{upperFirst(SEVERITY_HIGH)}</span>
          </div>
        ),
        tooltip: upperFirst(SEVERITY_HIGH)
      }
    case SEVERITY_CRITICAL:
      return {
        value: (
          <div className="alert-row__details-alert-icon-cell">
            <Critical />
            <span>{upperFirst(SEVERITY_CRITICAL)}</span>
          </div>
        ),
        tooltip: upperFirst(SEVERITY_CRITICAL)
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
  email: <Email />
}

const getNotificationData = notifications =>
  notifications.map(notification => {
    return {
      icon: (
        <div
          data-testid={`${notification.kind}-${notification.err.length === 0 ? 'success' : 'fail'}`}
          className="alert-row-notification"
        >
          {alertsNotifications[notification.kind]}
          {notification?.err && (
            <div className="notification-fail">
              <Error />
            </div>
          )}
        </div>
      ),
      tooltip: upperFirst(
        `${notification.summary.succeeded} success, ${notification.summary.failed} failed`
      ),
      kind: notification.kind,
      succeeded: notification.summary.succeeded,
      failed: notification.summary.failed
    }
  })

export const createAlertRowData = ({ ...alert }, isCrossProjects, showExpandButton = false) => {
  const { name } = alert

  const getLink = alert => {
    const queryString = window.location.search
    const { alertName, entity_kind: entityType, entity_id, id: alertId, job, project, uid } = alert

    if (entityType === MODEL_ENDPOINT_RESULT) {
      const [endpointId, , , name] = entity_id.split('.')
      return `/projects/*/alerts/${project}/${alertName}/${alertId}/${name}/${endpointId}/${DETAILS_ALERT_APPLICATION}${queryString}`
    }

    if (entityType === JOB) {
      return job
        ? `/projects/*/alerts/${project}/${alertName}/${alertId}/${job.name}/${job.jobUid}/${DETAILS_ALERT_APPLICATION}${queryString}`
        : ''
    }

    if (entityType === MODEL_MONITORING_APPLICATION) {
      const [, applicationName] = entity_id.split('_')
      return `/projects/*/alerts/${project}/${alertName}/${alertId}/${applicationName}/${uid}/${DETAILS_ALERT_APPLICATION}${queryString}`
    }

    return ''
  }

  const severity = {
    value: getSeverityData(alert.severity).value,
    tooltip: getSeverityData(alert.severity).tooltip
  }

  const entityType = {
    value: getEntityTypeData(alert.entity_kind).value,
    detailsValue: getEntityTypeData(alert.entity_kind).detailsValue,
    tooltip: getEntityTypeData(alert.entity_kind).tooltip
  }
  const notifications = getNotificationData(alert.notifications)
  alert.activationTime = formatDatetime(alert.activation_time, '-')
  alert.alertName = alert.name
  alert.id = `${alert.id}`

  if (alert.entity_kind === JOB) {
    alert.uid = alert.entity_id.split('.')[1]
    alert.job = {
      name: alert.entity_id.split('.')[0],
      jobUid: alert.entity_id.split('.')[1],
      kind: alert.entity_kind
    }
  }

  if (alert.entity_kind === MODEL_ENDPOINT_RESULT) {
    const [uid, endpointName, ...rest] = alert.entity_id.split('.')
    const fullName = [endpointName, ...rest].join('.')
    alert.endpointName = endpointName
    alert.uid = uid
    alert.fullName = `${alert.project}.${fullName}`
  }

  if (alert.entity_kind === MODEL_MONITORING_APPLICATION) {
    alert.uid = alert.id
    alert.applicationName = alert.entity_id.split('_')[1]
  }
  return {
    data: {
      ...alert,
      severity,
      entityType,
      notifications
    },
    content: [
      {
        id: `alertName.${alert.id}`,
        headerId: 'alertName',
        headerLabel: 'Alert Name',
        value: name,
        className: 'table-cell-name',
        getLink: () => (!showExpandButton ? getLink(alert) : ''),
        tooltip: name,
        type: 'link',
        showExpandButton
      },
      {
        id: `projectName.${alert.id}`,
        headerId: 'projectName',
        headerLabel: 'Project name',
        value: alert.project,
        className: 'table-cell-1',
        hidden: !isCrossProjects
      },
      {
        id: `eventType.${alert.id}`,
        headerId: 'eventType',
        headerLabel: 'Event Type',
        value: alert.event_kind?.split('-')?.join(' '),
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
        tooltip: getEntityTypeData(alert.entity_kind).tooltip,
        hidden: !isCrossProjects && showExpandButton
      },
      {
        id: `timestamp.${alert.id}`,
        headerId: 'timestamp',
        headerLabel: 'Timestamp',
        value: alert.activationTime,
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
        value: alert.criteria?.count,
        className: 'table-cell-1'
      },
      {
        id: `criteriaTime.${alert.id}`,
        headerId: 'criteriaTime',
        headerLabel: 'Trigger criteria time period',
        value: getTriggerCriticalTimePeriod(alert.criteria?.period),
        className: 'table-cell-1'
      },
      {
        id: `notifications.${alert.id}`,
        headerId: 'notifications',
        headerLabel: 'Notifications',
        value: getNotificationData(alert.notifications),
        className: 'icons-container alert-row-notification-cell',
        type: 'icons'
      }
    ]
  }
}
