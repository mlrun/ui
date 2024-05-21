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
export const getLineChartMetricConfig = () => {
  return {
    type: 'line',
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
          mode: 'index',
          callbacks: {
            label: function (label) {
              return JSON.stringify(label.parsed, null, 2)
            }
          }
        }
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: '',
            font: 10,
            color: '#4B4760'
          },
          ticks: {
            color: '#4B4760',
            autoSkip: true,
            align: 'start',
            maxTicksLimit: 10
          },
          grid: {
            drawOnChartArea: true,
            borderWidth: 2,
            color: '#E9E8EB',
            lineWidth: 1
          }
        },
        y: {
          ticks: {
            color: '#4B4760',
            stepSize: 10
          },
          grid: {
            drawBorder: false,
            color: '#E9E8EB',
            borderColor: 'E9E8EB'
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
    type: 'bar',
    options: {
      layout: {
        padding: 0
      },
      barThickness: 5,
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
          mode: 'index',
          callbacks: {
            label: function (label) {
              return JSON.stringify(label.parsed, null, 2)
            }
          }
        }
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Value',
            font: 10,
            color: '#4B4760'
          },
          ticks: {
            color: '#4B4760',
            align: 'start',
            maxTicksLimit: 4
          },
          grid: {
            drawOnChartArea: false,
            borderWidth: 2,
            color: '#E9E8EB',
            lineWidth: 1
          }
        },
        y: {
          step: 10,
          title: {
            display: true,
            text: 'Percentage',
            font: 10
          },
          ticks: {
            maxTicksLimit: 10
          },
          grid: {
            drawBorder: false,
            color: '#E9E8EB',
            borderColor: 'E9E8EB'
          }
        }
      }
    }
  }
}

export const getGradientLineChart = () => {
  return {
    type: 'line',
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
          mode: 'index',
          callbacks: {
            label: function (label) {
              return JSON.stringify(label.parsed, null, 2)
            }
          }
        }
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: true
          },
          ticks: {
            color: '#4B4760',
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
