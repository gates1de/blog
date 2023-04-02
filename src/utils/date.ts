export const getDayOfWeek = (date: Date) => {
  const day = date.toUTCString().slice(0, 3)
  switch (day) {
    case 'Mon':
      return '月'
    case 'Tue':
      return '火'
    case 'Wed':
      return '水'
    case 'Thu':
      return '木'
    case 'Fri':
      return '金'
    case 'Sat':
      return '土'
    case 'Sun':
      return '日'
    default:
      return ''
  }
}

export const formatDate = (date: Date, format: string): string => {
  return format
    .replace(/yyyy/g, date.getFullYear().toString())
    .replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2))
    .replace(/dd/g, ('0' + date.getDate()).slice(-2))
    .replace(/HH/g, ('0' + date.getHours()).slice(-2))
    .replace(/mm/g, ('0' + date.getMinutes()).slice(-2))
    .replace(/ss/g, ('0' + date.getSeconds()).slice(-2))
    .replace(/SSS/g, ('00' + date.getMilliseconds()).slice(-3))
}
