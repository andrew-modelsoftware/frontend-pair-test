export const formatDateTime = (dateTime: string): string => {
    
  const localISODate = new Date(dateTime).toISOString();
  const [year, month, day] = localISODate.substr(0,10).split('-')
    
  return `${day}/${month}/${year}`
}
