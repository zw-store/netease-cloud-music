export const timestampFormat = (time: number) => {
  const min = String(Math.floor(time / 1000 / 60)).padStart(2, '0')
  const sec = String(Math.floor((time / 1000) % 60)).padStart(2, '0')
  return `${min}:${sec}`
}

export const titleWithDuplicate = (title: string, suffix: string) => {
  const reg = /(.*)-(.*)-(.*)/
  return title
    .replace(new RegExp(`(\\.${suffix})`, 'g'), '')
    .replace(reg, (_match, p1, p2, p3) => {
      if (p1.includes(p3)) {
        return `${p1}-${p2}` + `.${suffix}`
      }
      return `${p1}-${p2}-${p3}` + `.${suffix}`
    })
}
