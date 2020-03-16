import { formatDatetime } from './datetime'
import { truncateUid } from './string'

const createFunctionsContent = functions =>
  functions.map(func => {
    return {
      name: {
        value: func.name,
        size: 'functions_medium'
      },
      kind: {
        value: func.kind,
        size: 'functions_small'
      },
      hash: {
        value: truncateUid(func.hash),
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
      },
      state: {
        value: func.state,
        size: 'functions_small'
      }
    }
  })

export default createFunctionsContent
