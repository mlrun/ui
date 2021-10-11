import { formatDatetime } from './datetime'
import { getFunctionIdentifier } from './getUniqueIdentifier'

const createFunctionsContent = (functions, isSelectedItem) =>
  functions.map(func => {
    const identifier = getFunctionIdentifier(func, true)

    return {
      name: {
        id: `name${identifier}`,
        value: func.name,
        class: 'functions_medium',
        identifier: getFunctionIdentifier(func),
        identifierUnique: identifier
      },
      kind: {
        id: `kind${identifier}`,
        value: func.type,
        class: 'functions_small',
        type: 'type',
        hidden: isSelectedItem
      },
      hash: {
        id: `hash${identifier}`,
        value: func.hash,
        class: 'functions_small',
        type: 'hash',
        hidden: isSelectedItem
      },
      updated: {
        id: `updated${identifier}`,
        value: formatDatetime(new Date(func.updated), 'N/A'),
        class: 'functions_small',
        type: 'date',
        hidden: isSelectedItem
      },
      command: {
        id: `command${identifier}`,
        value: func.command,
        class: 'functions_big',
        hidden: isSelectedItem
      },
      image: {
        id: `image${identifier}`,
        value: func.image,
        class: 'functions_big',
        hidden: isSelectedItem
      },
      description: {
        id: `description${identifier}`,
        value: func.description,
        class: 'functions_small',
        hidden: isSelectedItem
      },
      tag: {
        id: `tag${identifier}`,
        value: func.tag,
        type: 'hidden',
        hidden: isSelectedItem
      }
    }
  })

export default createFunctionsContent
