export const parseKeyValues = (object = {}) =>
  object == null
    ? []
    : Object.entries(object).map(([key, value]) => {
        return Array.isArray(value)
          ? `${key}: [${value.map(arrayItem => {
              return ` {${Object.entries(arrayItem).map(
                ([arrayItemKey, arrayItemValue]) =>
                  ` ${arrayItemKey}: ${arrayItemValue} `
              )}} `
            })}]`
          : typeof value === 'object'
          ? `${key}: {${Object.entries(value).map(
              ([valueKey, valueContent]) => ` ${valueKey}: ${valueContent} `
            )}}`
          : `${key}: ${value}`
      })
