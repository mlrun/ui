export const generateMetadata = selectedItem => {
  return selectedItem.schema
    ? selectedItem.schema.fields.map(field => ({
        primaryKeyIcon: {
          value: 'primary-key',
          type: 'icon icon-key',
          iconTooltip: 'Primary key'
        },
        name: {
          value: field.name,
          type: 'text'
        },
        type: {
          value: field.type,
          type: 'text'
        },
        count: {
          value: selectedItem?.stats?.[field.name]?.count ?? '',
          type: 'text'
        },
        mean: {
          value: selectedItem?.stats?.[field.name]?.mean ?? '',
          type: 'text'
        },
        std: {
          value: selectedItem?.stats?.[field.name]?.std?.toFixed(8) ?? '',
          type: 'text'
        },
        min: {
          value: selectedItem?.stats?.[field.name]?.min ?? '',
          type: 'text'
        },
        '25%': {
          value: selectedItem?.stats?.[field.name]?.['25%'] ?? '',
          type: 'text'
        },
        '50%': {
          value: selectedItem?.stats?.[field.name]?.['50%'] ?? '',
          type: 'text'
        },
        '75%': {
          value: selectedItem?.stats?.[field.name]?.['75%'] ?? '',
          type: 'text'
        },
        max: {
          value: selectedItem?.stats?.[field.name]?.max ?? '',
          type: 'text'
        }
      }))
    : selectedItem.entities
        .map(item => ({ ...item, entity: 'entity' }))
        .concat(selectedItem.features)
        .map(item => ({
          entityIcon: {
            value: item.entity,
            type: 'icon icon-key',
            iconTooltip: 'Entity'
          },
          partitionIcon: {
            value: selectedItem.partition_keys.includes(item.name),
            type: 'icon icon-partition',
            iconTooltip: 'Partition'
          },
          name: {
            value: item.name,
            type: 'text'
          },
          type: {
            value: item.value_type,
            type: 'text'
          },
          count: {
            value: selectedItem?.stats?.[item.name]?.count ?? '',
            type: 'text'
          },
          mean: {
            value: selectedItem?.stats?.[item.name]?.mean ?? '',
            type: 'text'
          },
          std: {
            value: selectedItem?.stats?.[item.name]?.std?.toFixed(8) ?? '',
            type: 'text'
          },
          min: {
            value: selectedItem?.stats?.[item.name]?.min ?? '',
            type: 'text'
          },
          '25%': {
            value: selectedItem?.stats?.[item.name]?.['25%'] ?? '',
            type: 'text'
          },
          '50%': {
            value: selectedItem?.stats?.[item.name]?.['50%'] ?? '',
            type: 'text'
          },
          '75%': {
            value: selectedItem?.stats?.[item.name]?.['75%'] ?? '',
            type: 'text'
          },
          max: {
            value: selectedItem?.stats?.[item.name]?.max ?? '',
            type: 'text'
          }
        }))
}
