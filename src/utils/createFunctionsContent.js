import { formatDatetime } from './datetime'
import { getFunctionIdentifier } from './getUniqueIdentifier'
import { REAL_TIME_PIPELINES_TAB } from '../constants'
import { page } from '../components/Models/models.util'

const createFunctionsContent = (functions, isSelectedItem, params) =>
  functions.map(func => {
    return params.pageTab === REAL_TIME_PIPELINES_TAB
      ? {
          name: {
            value: func.nuclio_name || func.name,
            class: 'functions_medium',
            identifier: getFunctionIdentifier(func),
            identifierUnique: getFunctionIdentifier(func, true),
            getLink: hash => {
              return `/projects/${params.projectName}/${page.toLowerCase()}/${
                params.pageTab
              }/pipeline/${hash}`
            }
          },
          kind: {
            value: func.graph?.kind === 'router' ? 'Router' : 'Flow',
            class: 'functions_big',
            type: 'type'
          }
        }
      : {
          name: {
            value: func.name,
            class: 'functions_medium',
            identifier: getFunctionIdentifier(func),
            identifierUnique: getFunctionIdentifier(func, true)
          },
          kind: {
            value: func.type,
            class: 'functions_small',
            type: 'type',
            hidden: isSelectedItem
          },
          hash: {
            value: func.hash,
            class: 'functions_small',
            type: 'hash',
            hidden: isSelectedItem
          },
          updated: {
            value: formatDatetime(new Date(func.updated), 'N/A'),
            class: 'functions_small',
            type: 'date',
            hidden: isSelectedItem
          },
          command: {
            value: func.command,
            class: 'functions_big',
            hidden: isSelectedItem
          },
          image: {
            value: func.image,
            class: 'functions_big',
            hidden: isSelectedItem
          },
          description: {
            value: func.description,
            class: 'functions_small',
            hidden: isSelectedItem
          },
          tag: {
            value: func.tag,
            type: 'hidden',
            hidden: isSelectedItem
          }
        }
  })

export default createFunctionsContent
