import React from 'react'

import MuiBreadcrumbs from '@material-ui/core/Breadcrumbs'
import Typography from '@material-ui/core/Typography'

import { startCase } from 'lodash'

import Link from './Link'

const Breadcrumbs = (props = { match: { path: '', url: '' } }) => {
  const pathItems = props.match.path.slice(1).split('/')
  const urlItems = props.match.url.slice(1).split('/')
  return (
    <MuiBreadcrumbs aria-label="breadcrumb" separator="›">
      {urlItems.map((item, index) => {
        const param = pathItems[index].startsWith(':')
        const label = param ? item : startCase(item)
        const to = `/${urlItems.slice(0, index + 1).join('/')}`
        const last = index === urlItems.length - 1
        return last ? (
          <Typography key={index} color="textPrimary" aria-current="page">
            {label}
          </Typography>
        ) : (
          <Link key={index} to={to}>
            {label}
          </Link>
        )
      })}
    </MuiBreadcrumbs>
  )
}

export default Breadcrumbs
