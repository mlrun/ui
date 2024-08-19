/*
Copyright 2019 Iguazio Systems Ltd.

Licensed under the Apache License, Version 2.0 (the "License") with
an addition restriction as set forth herein. You may not use this
file except in compliance with the License. You may obtain a copy of
the License at http://www.apache.org/licenses/LICENSE-2.0.

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing
permissions and limitations under the License.

In addition, you may not use the software for any purposes that are
illegal under applicable law, and the grant of the foregoing license
under the Apache 2.0 license is conditioned upon your compliance with
such restriction.
*/
import { CHART_TYPE_BAR, CHART_TYPE_LINE } from '../constants'

// TODO: Combine getLineChartMetricConfig, getBarChartMetricConfig, and getGradientLineChart into one function.
export const getLineChartMetricConfig = () => {
  return {
    type: CHART_TYPE_LINE,
    options: {
      layout: {
        padding: 0
      },
      maintainAspectRatio: false,
      animation: false,
      responsive: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            font: 10
          },
          ticks: {
            autoSkip: true,
            align: 'start',
            maxTicksLimit: 10
          },
          grid: {
            drawOnChartArea: true,
            borderWidth: 2,
            lineWidth: 1
          }
        },
        y: {
          grid: {
            drawBorder: true
          },
          title: {
            display: false
          }
        }
      },
      elements: {
        point: {
          radius: 0
        }
      }
    }
  }
}

export const getBarChartMetricConfig = () => {
  return {
    type: CHART_TYPE_BAR,
    options: {
      layout: {
        padding: 0
      },
      barThickness: 20,
      maintainAspectRatio: false,
      animation: false,
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: true,
          intersect: false,
          mode: 'index'
        }
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            font: 10
          },
          ticks: {
            align: 'left',
            autoSkip: false,
            offset: -20
          },
          grid: {
            drawOnChartArea: false,
            borderWidth: 2,
            lineWidth: 1
          }
        },
        y: {
          grid: {
            drawBorder: false,
            borderColor: 'E9E8EB'
          },
          title: {
            display: true
          }
        }
      }
    }
  }
}

export const getGradientLineChartConfig = () => {
  return {
    type: CHART_TYPE_LINE,
    options: {
      layout: {
        padding: 0
      },
      maintainAspectRatio: false,
      animation: false,
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: true,
          intersect: false,
          mode: 'index'
        }
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: true
          },
          ticks: {
            align: 'start',
            maxTicksLimit: 5
          }
        },
        y: {
          display: true,
          grid: {
            display: true
          },
          ticks: {
            display: true
          }
        }
      },
      elements: {
        point: {
          radius: 0
        }
      }
    }
  }
}
