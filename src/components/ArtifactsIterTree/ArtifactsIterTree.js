import React, { useState } from 'react'
import PropTypes from 'prop-types'
import arrow from '../../images/nested_arrow.png'
import ArtifactsTreeView from '../ArtifactsTree/ArtifactsTreeView'
import { truncateUid } from '../../utils'
import { Link } from 'react-router-dom'
import actionArtifacts from '../../actions/artifacts'
import { useDispatch } from 'react-redux'

const IterTree = ({ isOpen, items, match }) => {
  const [isIterOpen, setIterOpen] = useState(false)
  const dispatch = useDispatch()
  return (
    <>
      <div
        className={
          isOpen ? 'tree_container_wrraper hover' : 'tree_container_wrraper'
        }
      >
        <div
          className="tree_container_item"
          onClick={() => {
            setIterOpen(!isIterOpen)
          }}
        >
          <div className="tree_container_name">
            <img
              src={arrow}
              className={isIterOpen ? 'open' : 'close'}
              alt="arrow"
            />
            <div title={items[0].tree}>{truncateUid(items[0].tree)}</div>
          </div>
        </div>
        {isOpen === true && isIterOpen === false && ArtifactsTreeView(items[0])}
      </div>
      {isIterOpen &&
        items.map((_item, index) => {
          return (
            <div key={_item.hash + index} className="iter_container">
              <div className="iter_container_name">
                <div
                  className="iter_value"
                  onClick={() =>
                    dispatch(actionArtifacts.selectArtifact(_item))
                  }
                >
                  <Link
                    to={`/artifacts/${_item.key}/${_item.tree}/${
                      _item.iter ? _item.iter : 0
                    }/${match.params.tab ? match.params.tab : 'info'}`}
                  >
                    {_item.iter ? _item.iter : 0}
                  </Link>
                </div>
              </div>
              {ArtifactsTreeView(_item)}
            </div>
          )
        })}
    </>
  )
}

IterTree.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  items: PropTypes.array.isRequired
}

export default IterTree
