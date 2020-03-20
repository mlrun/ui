import React from 'react'

import './contentMenu.scss'

const ContentMenu = () => {
  return (
    <div className="content__menu">
      <ul className="content__menu__list">
        <li className="content__menu__list_item active">Monitor</li>
        {/*<li className="jobs__menu__list_item">Edit</li>*/}
        {/*<li className="jobs__menu__list_item">Create</li>*/}
      </ul>
    </div>
  )
}

export default ContentMenu
