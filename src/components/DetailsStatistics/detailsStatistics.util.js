import { generateCustomTooltip } from '../../common/Chart/mlChart.util'

export const generateStatistics = selectedItem => {
  return selectedItem.entities
    ? generateStatisticFromEntities(selectedItem)
    : generateStatisticFromFeatures(selectedItem)
}

export const generateStatisticFromEntities = selectedItem => {
  return selectedItem.entities
    .map(item => ({ ...item, entity: 'entity' }))
    .concat(selectedItem.features)
    .map(item => {
      return {
        name: {
          value: item.name ?? '',
          type: 'text',
          visible: true
        },
        count: {
          value: selectedItem?.stats?.[item.name]?.count ?? '',
          type: 'text',
          visible: true
        },
        mean: {
          value: selectedItem?.stats?.[item.name]?.mean ?? '',
          type: 'text',
          visible: true
        },
        std: {
          value: selectedItem?.stats?.[item.name]?.std?.toFixed(8) ?? '',
          type: 'text',
          visible: true
        },
        min: {
          value: selectedItem?.stats?.[item.name]?.min ?? '',
          type: 'text',
          visible: true
        },
        max: {
          value: selectedItem?.stats?.[item.name]?.max ?? '',
          type: 'text',
          visible: true
        },
        unique: {
          value: selectedItem?.stats?.[item.name]?.unique ?? '',
          type: 'text',
          visible: true
        },
        top: {
          value: selectedItem?.stats?.[item.name]?.top ?? '',
          type: 'text',
          visible: true
        },
        freq: {
          value: selectedItem?.stats?.[item.name]?.freq ?? '',
          type: 'text',
          visible: true
        },
        histogram: {
          value: selectedItem?.stats?.[item.name]?.hist ?? [[], []],
          type: 'chart',
          visible: true
        }
      }
    })
}

export const generateStatisticFromFeatures = selectedItem => {
  return selectedItem.features.map(item => {
    return {
      name: {
        value: item.name ?? '',
        type: 'text',
        visible: true
      },
      count: {
        value: selectedItem?.stats?.[item.name]?.count ?? '',
        type: 'text',
        visible: true
      },
      mean: {
        value: selectedItem?.stats?.[item.name]?.mean ?? '',
        type: 'text',
        visible: true
      },
      std: {
        value: selectedItem?.stats?.[item.name]?.std?.toFixed(8) ?? '',
        type: 'text',
        visible: true
      },
      min: {
        value: selectedItem?.stats?.[item.name]?.min ?? '',
        type: 'text',
        visible: true
      },
      max: {
        value: selectedItem?.stats?.[item.name]?.max ?? '',
        type: 'text',
        visible: true
      },
      unique: {
        value: selectedItem?.stats?.[item.name]?.unique ?? '',
        type: 'text',
        visible: true
      },
      top: {
        value: selectedItem?.stats?.[item.name]?.top ?? '',
        type: 'text',
        visible: true
      },
      freq: {
        value: selectedItem?.stats?.[item.name]?.freq ?? '',
        type: 'text',
        visible: true
      }
    }
  })
}

export const getHistogramChartConfig = () => {
  return {
    type: 'bar',
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: 5
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: false,
          external: generateCustomTooltip,
          mode: 'index',
          intersect: false,
          callbacks: {
            title: () => ''
          }
        }
      },
      scales: {
        x: { display: false },
        y: { display: false }
      }
    }
  }
}
