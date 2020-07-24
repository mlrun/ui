export default (startTime, endTime) => {
  let d, h, m, s
  let now = new Date()
  let time = null
  if (endTime) {
    time =
      endTime.getTime() - startTime.getTime() > 0
        ? endTime.getTime() - startTime.getTime()
        : 0
  } else {
    time = now.getTime() - startTime.getTime()
  }

  d = time / (1000 * 60 * 60 * 24)
  h = (d - ~~d) * 24
  m = (h - ~~h) * 60
  s = (m - ~~m) * 60

  const hours = `${~~h}:${~~m}:${~~s}`

  return ~~d > 0 ? `${~~d} ${d > 1 ? 'days ' : 'day '}` + hours : hours
}
