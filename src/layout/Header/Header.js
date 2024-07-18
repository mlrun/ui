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
import React from 'react'
import { useSelector } from 'react-redux'

import { ReactComponent as Logo } from 'igz-controls/images/mlrun-blue-logo.svg'
import { ReactComponent as GithubIcon } from 'igz-controls/images/github-icon.svg'
import { ReactComponent as SlackIcon } from 'igz-controls/images/slack-icon.svg'

import './header.scss'

const Header = () => {
  const frontendSpec = useSelector(store => store.appStore.frontendSpec)

  return (
    <header className="header" data-testid="header">
      <div className="header__brand">
        <a href={`${process.env.PUBLIC_URL}/`}><Logo className="header__logo" alt="MLRun" /></a>
        <div>
          <div>The Open Source MLOps</div>
          <div>Orchestration Framework</div>
        </div>
      </div>

      <div className="header__actions">
        <a
          href="https://docs.mlrun.org/en/latest/"
          className="header__documentation"
          target="_blank"
          rel="noopener noreferrer"
        >
          Documentation
        </a>
        <a
          href="https://www.mlrun.org/hub/"
          className="header__documentation"
          target="_blank"
          rel="noopener noreferrer"
        >
          Function Hub
        </a>
        <a
          alt="MLRUN on Slack"
          href="https://go.iguazio.com/mlopslive/joincommunity"
          className="header__icon"
          target="_blank"
          rel="noopener noreferrer"
        >
          <SlackIcon />
        </a>
        <a
          alt="MLRUN on Gihub"
          href="https://github.com/mlrun/mlrun"
          className="header__icon"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GithubIcon />
        </a>
        {frontendSpec.ce?.version && (
          <span className="ml-app-version">Version: {frontendSpec.ce.version}</span>
        )}
      </div>
    </header>
  )
}

export default Header
