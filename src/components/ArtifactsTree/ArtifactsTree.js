import React, { useState } from 'react'
import PropTypes from 'prop-types'
import IterTree from '../ArtifactsIterTree/ArtifactsIterTree'
import arrow from '../../images/nested_arrow.png'
import ArtifactsTreeView from './ArtifactsTreeView'

const ArtifactsTree = ({ items, match }) => {
  const [isOpen, setOpen] = useState(false)
  const iterTree = items.tree.map((_items, index) => {
    return (
      <IterTree
        key={_items[0].hash + index}
        isOpen={isOpen}
        items={_items}
        match={match}
      ></IterTree>
    )
  })

  return (
    <div
      className={isOpen ? 'table_body_item active' : 'table_body_item hover'}
    >
      <div className="column_name">
        <div
          onClick={() => {
            setOpen(!isOpen)
          }}
          className="column_name_item"
        >
          <img src={arrow} className={isOpen ? 'open' : 'close'} alt="arrow" />
          <div>{items.key}</div>
        </div>
      </div>
      {isOpen && <div className="tree_container">{iterTree}</div>}
      {/*show first value by default*/}
      {isOpen === false && ArtifactsTreeView(items.tree[0][0])}
    </div>
  )
}

ArtifactsTree.propTypes = {
  items: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired
}

export default ArtifactsTree
