import { formatDatetime } from './datetime'
import { getFunctionIdentifier } from './getUniqueIdentifier'

const createFunctionsContent = (functions, isSelectedItem) =>
  functions.map(func => {
    return {
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
