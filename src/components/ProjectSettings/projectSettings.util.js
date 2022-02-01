import React from 'react'

import {
  PROJECTS_SETTINGS_GENERAL_TAB,
  PROJECTS_SETTINGS_PAGE,
  PROJECTS_SETTINGS_SECRETS_TAB
} from '../../constants'

import { ReactComponent as Settings } from '../../images/settings.svg'
import { ReactComponent as Secrets } from '../../images/lock-icon.svg'

export const ARTIFACT_PATH = 'artifact_path'
export const SOURCE_URL = 'source'

export const tabs = [
  { id: PROJECTS_SETTINGS_GENERAL_TAB, label: 'General', icon: <Settings /> },
  { id: PROJECTS_SETTINGS_SECRETS_TAB, label: 'Secrets', icon: <Secrets /> }
]

export const validTabs = [
  PROJECTS_SETTINGS_GENERAL_TAB,
  PROJECTS_SETTINGS_SECRETS_TAB
]

export const page = PROJECTS_SETTINGS_PAGE
