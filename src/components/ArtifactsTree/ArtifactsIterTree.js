import React, { useState } from 'react'
import arrow from '../../images/nested_arrow.png'
import templateArifacts from './ArtifactsTemplate'
import { truncateUid } from '../../utils'
const IterTree = ({ isOpen, items }) => {
  const [isIterOpen, setIterOpen] = useState(false)
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
        {isOpen === true && isIterOpen === false && templateArifacts(items[0])}
      </div>
      {isIterOpen &&
        items.map((_item, index) => {
          return (
            <div key={_item.hash + index} className="iter_container">
              <div className="iter_container_name">
                <div className="iter_value">{_item.iter}</div>
              </div>
              {templateArifacts(_item)}
            </div>
          )
        })}
    </>
  )
}

export default IterTree
