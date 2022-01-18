import { formatDatetime } from './datetime'
import { getFunctionIdentifier } from './getUniqueIdentifier'
import { REAL_TIME_PIPELINES_TAB } from '../constants'
import { page } from '../components/Models/models.util'

const createFunctionsContent = (functions, isSelectedItem, params) =>
  functions.map(func => {
    const identifierUnique = getFunctionIdentifier(func, true)

    return params.pageTab === REAL_TIME_PIPELINES_TAB
      ? {
          name: {
            id: `name.${identifierUnique}`,
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
            id: `kind.${identifierUnique}`,
            value: func.graph?.kind === 'router' ? 'Router' : 'Flow',
            class: 'functions_big',
            type: 'type'
          }
        }
      : {
          name: {
            id: `name.${identifierUnique}`,
            value: func.name,
            class: 'functions_medium',
            identifier: getFunctionIdentifier(func),
            identifierUnique: identifierUnique
          },
          kind: {
            id: `kind.${identifierUnique}`,
            value: func.type,
            class: 'functions_small',
            type: 'type',
            hidden: isSelectedItem
          },
          hash: {
            id: `hash.${identifierUnique}`,
            value: func.hash,
            class: 'functions_small',
            type: 'hash',
            hidden: isSelectedItem
          },
          updated: {
            id: `updated.${identifierUnique}`,
            value: formatDatetime(new Date(func.updated), 'N/A'),
            class: 'functions_small',
            type: 'date',
            hidden: isSelectedItem
          },
          command: {
            id: `command.${identifierUnique}`,
            value: func.command,
            class: 'functions_big',
            hidden: isSelectedItem
          },
          image: {
            id: `image.${identifierUnique}`,
            value: func.image,
            class: 'functions_big',
            hidden: isSelectedItem
          },
          description: {
            id: `description.${identifierUnique}`,
            value: func.description,
            class: 'functions_small',
            hidden: isSelectedItem
          },
          tag: {
            id: `tag.${identifierUnique}`,
            value: func.tag,
            type: 'hidden',
            hidden: isSelectedItem
          }
        }
  })

export default createFunctionsContent
