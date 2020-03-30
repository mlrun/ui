import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import { ReactComponent as Checked } from '../../svg/checkbox-checked.svg'
import { ReactComponent as Unchecked } from '../../svg/checkbox-unchecked.svg'

const SelectOption = ({ item, link, match, onClick, status, value }) => {
  if (link) {
    return (
      <Link
        className="select__item"
        to={`/projects/${match.params.projectName}/jobs/create-${item
          .toLowerCase()
          .split(' ')
          .join('-')}`}
      >
        {item}
      </Link>
    )
  } else {
    return (
      <div className="select__item" onClick={() => onClick(item)}>
        {status && (
          <>
            {value === item ? <Checked /> : <Unchecked />}
            <span className={`status_${item.toLowerCase()}`} />
          </>
        )}
        {item}
      </div>
    )
  }
}

SelectOption.defaultProps = {
  onClick: () => {}
}

SelectOption.propTypes = {
  item: PropTypes.string.isRequired,
  link: PropTypes.bool.isRequired,
  match: PropTypes.shape({}).isRequired,
  onClick: PropTypes.func,
  status: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired
}

export default SelectOption
