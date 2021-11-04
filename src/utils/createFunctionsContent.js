import { formatDatetime } from './datetime'
import { getFunctionIdentifier } from './getUniqueIdentifier'

const createFunctionsContent = (functions, isSelectedItem) =>
  functions.map(func => {
    const identifierUnique = getFunctionIdentifier(func, true)

    return {
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
