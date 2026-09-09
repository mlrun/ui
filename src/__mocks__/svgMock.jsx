import React from 'react'

function SvgMock({ ref, ...props }) {
  return <svg ref={ref} {...props} />
}

export default SvgMock
