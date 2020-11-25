export const generateMetadata = selectedItem => {
  return selectedItem.schema
    ? selectedItem.schema.fields.map(field => ({
        'primary-key': 'primary-key',
        name: field.name,
        type: field.type,
        count: selectedItem?.stats?.[field.name]?.count,
        mean: selectedItem?.stats?.[field.name]?.mean,
        std: selectedItem?.stats?.[field.name]?.std?.toFixed(8),
        min: selectedItem?.stats?.[field.name]?.min,
        '25%': selectedItem?.stats?.[field.name]?.['25%'],
        '50%': selectedItem?.stats?.[field.name]?.['50%'],
        '75%': selectedItem?.stats?.[field.name]?.['75%'],
        max: selectedItem?.stats?.[field.name]?.max
      }))
    : selectedItem.entities
        .map(item => ({ ...item, entity: 'entity' }))
        .concat(selectedItem.features)
        .map(item => ({
          entity: item.entity,
          name: item.name,
          partition: selectedItem.partition_keys.includes(item.name),
          type: item.value_type,
          count: selectedItem?.stats?.[item.name]?.count,
          mean: selectedItem?.stats?.[item.name]?.mean,
          std: selectedItem?.stats?.[item.name]?.std?.toFixed(8),
          min: selectedItem?.stats?.[item.name]?.min,
          '25%': selectedItem?.stats?.[item.name]?.['25%'],
          '50%': selectedItem?.stats?.[item.name]?.['50%'],
          '75%': selectedItem?.stats?.[item.name]?.['75%'],
          max: selectedItem?.stats?.[item.name]?.max
        }))
}
