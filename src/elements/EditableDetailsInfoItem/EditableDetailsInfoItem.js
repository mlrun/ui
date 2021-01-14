import React from 'react'

import Input from '../../common/Input/Input'
// import PropTypes from 'prop-types';

const EditableDetailsInfoItem = ({ infoItem }) => {
  if (infoItem.editModeType === 'input') {
    return <Input focused value={infoItem.value} onChange={infoItem.onChange} />
  }
}

EditableDetailsInfoItem.propTypes = {}

export default EditableDetailsInfoItem
