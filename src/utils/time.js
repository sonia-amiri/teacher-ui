import moment from 'moment'

export function forDate (timestamp) {
  return moment.unix(timestamp).format('YYYY-MM-DD')
}

export function forDateTime (timestamp) {
  return moment.unix(timestamp).format('YYYY-MM-DD hh:mm:ss')
}

export function dateFormatter (row, col, cellVal, index) {
  return forDate(cellVal)
}

export function dateTimeFormatter (row, col, cellVal, index) {
  return forDateTime(cellVal)
}

export function now () {
  return Math.trunc(moment.now() / 1000)
}

export default {
  forDate, forDateTime
}
