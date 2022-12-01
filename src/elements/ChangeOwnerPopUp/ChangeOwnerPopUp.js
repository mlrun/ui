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
import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { debounce } from 'lodash'

import Input from '../../common/Input/Input'
import { Button, PopUpDialog } from 'igz-controls/components'

import projectsIguazioApi from '../../api/projects-iguazio-api'
import { deleteUnsafeHtml } from '../../utils'
import { FORBIDDEN_ERROR_STATUS_CODE, SECONDARY_BUTTON, LABEL_BUTTON } from 'igz-controls/constants'
import { useDetectOutsideClick } from 'igz-controls/hooks'

import { ReactComponent as SearchIcon } from 'igz-controls/images/search.svg'

import './changeOwnerPopUp.scss'

const ChangeOwnerPopUp = ({ changeOwnerCallback, projectId, setNotification }) => {
  const [searchValue, setSearchValue] = useState('')
  const [newOwnerId, setNewOwnerId] = useState('')
  const [usersList, setUsersList] = useState([])
  const [showSuggestionList, setShowSuggestionList] = useState(false)
  const searchInputRef = useRef(null)
  const searchRowRef = useRef(null)
  useDetectOutsideClick(searchInputRef, () => setShowSuggestionList(false))

  const { width: dropdownWidth } = searchRowRef?.current?.getBoundingClientRect() || {}

  const handleOnClose = () => {
    setSearchValue('')
    setNewOwnerId('')
    setUsersList([])
    setShowSuggestionList(false)
  }

  useEffect(() => {
    usersList.forEach(item => {
      if (item.name === searchValue || item.username === searchValue) {
        setNewOwnerId(item.id)
      }
    })

    if (
      usersList.filter(member => {
        return member.label.toLowerCase().includes(searchValue.toLowerCase())
      }).length === 0
    ) {
      setShowSuggestionList(false)
    }

    return () => {
      setNewOwnerId('')
    }
  }, [searchValue, usersList])

  const applyChanges = () => {
    if (newOwnerId) {
      const projectData = {
        data: {
          type: 'project',
          attributes: {},
          relationships: {
            owner: {
              data: {
                id: newOwnerId,
                type: 'user'
              }
            }
          }
        }
      }

      projectsIguazioApi
        .editProject(projectId, projectData)
        .then(changeOwnerCallback)
        .then(() => {
          setNotification({
            status: 200,
            id: Math.random(),
            message: 'Owner updated successfully'
          })
        })
        .catch(error => {
          setNotification({
            status: error.response?.status || 400,
            id: Math.random(),
            message:
              error.response?.status === FORBIDDEN_ERROR_STATUS_CODE
                ? 'Missing edit permission for the project.'
                : 'Failed to edit project data.',
            retry:
              error.response?.status === FORBIDDEN_ERROR_STATUS_CODE
                ? null
                : () => applyChanges(newOwnerId)
          })
        })
        .finally(handleOnClose)
    }
  }

  const generateSuggestionList = debounce(async resolve => {
    const response = await projectsIguazioApi.getScrubbedUsers({
      params: {
        'filter[assigned_policies]': '[$contains_any]Developer,Project Admin'
      }
    })
    const {
      data: { data: users }
    } = response

    setUsersList(
      users.map(user => {
        return {
          name: `${user.attributes.first_name} ${user.attributes.last_name}`,
          username: user.attributes.username,
          label: `${user.attributes.first_name} ${user.attributes.last_name} (${user.attributes.username})`,
          id: user.id,
          role: ''
        }
      })
    )

    resolve()
  }, 200)

  const onSearchChange = memberName => {
    const memberNameEscaped = deleteUnsafeHtml(memberName)
    setSearchValue(memberNameEscaped)

    if (memberNameEscaped !== '') {
      generateSuggestionList(() => {
        setShowSuggestionList(true)
      })
    } else {
      setNewOwnerId('')
    }
  }

  return (
    <div className="change-owner">
      <div className="owner-table">
        <div className="search-row" ref={searchRowRef}>
          <div className="search-input">
            <SearchIcon />
            <Input
              density="dense"
              onChange={onSearchChange}
              placeholder="Type to select new owner..."
              ref={searchInputRef}
              type="text"
              value={searchValue}
              withoutBorder
            />
          </div>
          <div className="search-role">Owner</div>
          {showSuggestionList && (
            <PopUpDialog
              className="search-dropdown"
              headerIsHidden
              customPosition={{
                element: searchRowRef,
                position: 'bottom-right'
              }}
              style={{ width: `${dropdownWidth}px` }}
            >
              <div className="members-list">
                {usersList
                  .filter(member => {
                    return member.label.toLowerCase().includes(searchValue.toLowerCase())
                  })
                  .map(member => {
                    const memberClassNames = classnames('member-row', member.role && 'disabled')

                    return (
                      <div
                        className={memberClassNames}
                        key={member.id}
                        onClick={() => {
                          if (!member.role) {
                            setNewOwnerId(member.id)
                            setSearchValue(member.name)
                            setShowSuggestionList(false)
                          }
                        }}
                      >
                        <span
                          className="member-name"
                          dangerouslySetInnerHTML={{
                            __html: member.label.replace(new RegExp(searchValue, 'gi'), match =>
                              match ? `<b>${match}</b>` : match
                            )
                          }}
                        />
                        <span className="member-role">{member.role}</span>
                      </div>
                    )
                  })}
              </div>
            </PopUpDialog>
          )}
        </div>

        <div className="footer-actions">
          <div className="apply-discard-buttons">
            <Button
              disabled={!newOwnerId}
              className="pop-up-dialog__btn_cancel"
              label="Discard"
              onClick={handleOnClose}
              variant={LABEL_BUTTON}
            />
            <Button
              disabled={!newOwnerId}
              label="Apply"
              onClick={applyChanges}
              variant={SECONDARY_BUTTON}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

ChangeOwnerPopUp.propTypes = {
  changeOwnerCallback: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired,
  setNotification: PropTypes.func.isRequired
}

export default ChangeOwnerPopUp
