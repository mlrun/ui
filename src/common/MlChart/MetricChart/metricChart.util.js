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

export const hexToRGB = (hex, alpha = 0) => {
  if (typeof hex !== 'string') return
  const r = parseInt(hex.substring(1, 3), 16)
  const g = parseInt(hex.substring(3, 5), 16)
  const b = parseInt(hex.substring(5, 7), 16)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export const setChartGradient = (chart, ctx, backgroundColor, canvasHeight = 200) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight)
  gradient.addColorStop(0, hexToRGB(backgroundColor || '#FFF', 0.7))
  gradient.addColorStop(1, hexToRGB(backgroundColor))
  chart.data.datasets.forEach(dataset => {
    dataset.backgroundColor = gradient
  })
}
