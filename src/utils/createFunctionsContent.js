import { formatDatetime } from './datetime'

const createFunctionsContent = functions =>
  functions.map(func => {
    return {
      name: {
        value: func.name,
        size: 'functions_medium'
      },
      kind: {
        value: func.type,
        size: 'functions_small',
        type: 'type'
      },
      hash: {
        value: func.hash,
        size: 'functions_small',
        type: 'hash'
      },
      updated: {
        value: formatDatetime(new Date(func.updated)),
        size: 'functions_small'
      },
      command: {
        value: func.command,
        size: 'functions_big'
      },
      image: {
        value: func.image,
        size: 'functions_big'
      },
      description: {
        value: func.description,
        size: 'functions_small'
      }
    }
  })

export default createFunctionsContent
