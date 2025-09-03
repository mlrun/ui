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
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isEmpty } from 'lodash'
import { useNavigate, useParams } from 'react-router-dom'

import Breadcrumbs from '../../../common/Breadcrumbs/Breadcrumbs'
import NoData from '../../../common/NoData/NoData'
import ProjectAction from '../ProjectAction/ProjectAction'
import ProjectDetailsHeader from '../../../common/ProjectDetailsHeader/ProjectDetailsHeader'
import ProjectOverviewTableRow from '../ProjectOverviewTableRow/ProjectOverviewTableRow'
import { ConfirmDialog, Loader } from 'igz-controls/components'

import { handleClick, getInitialCards } from './ProjectOverview.util'
import { handleFetchProjectError } from '../project.utils'
import { openPopUp } from 'igz-controls/utils/common.util'
import { useMode } from '../../../hooks/mode.hook'
import { fetchProject } from '../../../reducers/projectReducer'

import './ProjectOverview.scss'

const ProjectOverview = () => {
  const [confirmData, setConfirmData] = useState(null)
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isDemoMode } = useMode()
  const project = useSelector(store => store.projectStore.project)

  const cards = useMemo(() => {
    return params.projectName ? getInitialCards(params, navigate, isDemoMode) : {}
  }, [isDemoMode, navigate, params])

  const handlePathExecution = handleClick(navigate, openPopUp)

  useEffect(() => {
    dispatch(fetchProject({ project: params.projectName }))
      .unwrap()
      .catch(error => handleFetchProjectError(error, navigate, setConfirmData, dispatch))
  }, [dispatch, navigate, params.projectName])

  if (project.error) {
    return (
      <div className="project__error-container">
        {confirmData ? (
          <ConfirmDialog
            closePopUp={confirmData.confirmHandler}
            confirmButton={{
              handler: confirmData.confirmHandler,
              label: confirmData.btnConfirmLabel,
              variant: confirmData.btnConfirmType
            }}
            isOpen={Boolean(confirmData)}
            message={confirmData.message}
            messageOnly={confirmData.messageOnly}
          />
        ) : (
          <h1>{project.error.message}</h1>
        )}
      </div>
    )
  }

  return (
    <div className="project-overview">
      <div className="content__header">
        <Breadcrumbs />
      </div>
      <div className="project-overview__header">
        <ProjectDetailsHeader projectData={project.data} projectName={params.projectName} />
      </div>
      {project.loading && <Loader />}
      {isEmpty(project.data) && !project.loading ? (
        <NoData />
      ) : (
        <div className="project-overview__content">
          {/* move to card */}
          {Object.keys(cards).map(card => {
            const { additionalLinks, actions, subTitle, title } = cards[card]
            return (
              <div className="project-overview-card" key={card}>
                <div className="project-overview-card__top">
                  <div className="project-overview-card__header">
                    <h3 className="project-overview-card__header-title">{title}</h3>
                    <p className="project-overview-card__header-subtitle">{subTitle ?? ''}</p>
                  </div>
                  <div className="project-overview-card__actions">
                    <ProjectAction actions={actions} onClick={handlePathExecution} />
                  </div>
                </div>
                <div className="project-overview-card__center">
                  <ProjectOverviewTableRow />
                </div>

                <div className="project-overview-card__bottom">
                  <p className="label">Resources</p>
                  <div className="additional-links">
                    {additionalLinks &&
                      additionalLinks.map(({ id, label, handleClick }) => (
                        <span
                          key={id}
                          className="link"
                          onClick={() => handlePathExecution(handleClick)}
                        >
                          {label}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ProjectOverview
