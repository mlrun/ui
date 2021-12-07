import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { debounce } from 'lodash'

import PopUpDialog from '../../common/PopUpDialog/PopUpDialog'
import Button from '../../common/Button/Button'
import Input from '../../common/Input/Input'

import projectsIguazioApi from '../../api/projects-iguazio-api'
import { deleteUnsafeHtml } from '../../utils'
import { LABEL_BUTTON, SECONDARY_BUTTON } from '../../constants'

import { ReactComponent as SearchIcon } from '../../images/search.svg'

import './changeOwnerPopUp.scss'

const ChangeOwnerPopUp = ({ changeOwnerCallback, closePopUp, projectId }) => {
  const [searchValue, setSearchValue] = useState('')
  const [newOwnerId, setNewOwnerId] = useState('')
  const [usersList, setUsersList] = useState([])
  const [showSuggestionList, setShowSuggestionList] = useState(false)
  const searchInputRef = useRef(null)
  const searchRowRef = useRef(null)

  const { width: dropdownWidth } =
    searchRowRef?.current?.getBoundingClientRect() || {}

  const closeSuggestionList = useCallback(
    event => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSuggestionList(false)
      }
    },
    [searchInputRef]
  )

  useEffect(() => {
    window.addEventListener('click', closeSuggestionList)

    return () => {
      window.removeEventListener('click', closeSuggestionList)
    }
  }, [closeSuggestionList])

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
      closePopUp()
    }
  }

  const discardChanges = () => {
    closePopUp()
  }

  const generateSuggestionList = useCallback(
    debounce(async resolve => {
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
            id: user.id,
            role: ''
          }
        })
      )

      resolve()
    }, 200),
    []
  )

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
    <PopUpDialog
      className="change-owner__pop-up"
      closePopUp={discardChanges}
      headerText="Change owner"
    >
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
              customPosition={{
                element: searchRowRef,
                position: 'bottom-right'
              }}
              style={{ width: `${dropdownWidth}px` }}
            >
              <div className="members-list">
                {usersList
                  .filter(member => {
                    return member.name.includes(searchValue)
                  })
                  .map(member => {
                    const memberClassNames = classnames(
                      'member-row',
                      member.role && 'disabled'
                    )

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
                            __html: member.name.replace(
                              new RegExp(searchValue, 'gi'),
                              match => (match ? `<b>${match}</b>` : match)
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
      </div>
      <div className="footer-actions">
        <div className="apply-discard-buttons">
          <Button
            className="pop-up-dialog__btn_cancel"
            label="Discard"
            onClick={discardChanges}
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
      <div className="footer-annotation">
        Previous owner will still have Admin access to this project.
      </div>
      <div className="divider" />
    </PopUpDialog>
  )
}

ChangeOwnerPopUp.propTypes = {
  changeOwnerCallback: PropTypes.func.isRequired,
  closePopUp: PropTypes.func.isRequired,
  projectId: PropTypes.string.isRequired
}

export default ChangeOwnerPopUp
