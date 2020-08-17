import { formatDatetime } from './datetime'

const createFunctionsContent = functions =>
  functions.map(func => {
    return {
      name: {
        value: func.name,
        class: 'functions_medium'
      },
      kind: {
        value: func.type,
        class: 'table-body__cell functions_small',
        type: 'type'
      },
      hash: {
        value: func.hash,
        class: 'functions_small',
        type: 'hash'
      },
      updated: {
        value: formatDatetime(new Date(func.updated), 'N/A'),
        class: 'functions_small',
        type: 'date'
      },
      command: {
        value: func.command,
        class: 'functions_big'
      },
      image: {
        value: func.image,
        class: 'functions_big'
      },
      description: {
        value: func.description,
        class: 'functions_small'
      },
      tag: {
        value: func.tag,
        type: 'hidden'
      }
    }
  })

export default createFunctionsContent
