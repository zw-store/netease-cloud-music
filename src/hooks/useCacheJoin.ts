// /**
//  * download: {
//  *  我喜欢的音乐: 167876,282112
//  * }
//  */
// export const cacheJoin = (() => {
//   const keystr = 'download'
//   const setItem = (group, id) => {
//     const cache = JSON.parse(localStorage.getItem(keystr) || '{}')
//     if (cache[group]) {
//       const cacheArr = cache[group].split(',')
//       if (cacheArr.includes(id)) return
//       cacheArr.push('' + id)
//       localStorage.setItem(
//         keystr,
//         JSON.stringify({ ...cache, [group]: cacheArr.join(',') }),
//       )
//     } else {
//       localStorage.setItem(
//         keystr,
//         JSON.stringify({ ...cache, [group]: '' + id }),
//       )
//     }
//   }

//   const getItem = (group) => {
//     const cache = JSON.parse(localStorage.getItem(keystr) || '{}')
//     return cache[group] ? cache[group].split(',') : []
//   }

//   const removeItem = (group) => {
//     const cache = JSON.parse(localStorage.getItem(keystr) || '{}')
//     delete cache[group]
//     localStorage.setItem(keystr, JSON.stringify({ ...cache }))
//   }

//   return {
//     setItem,
//     getItem,
//     removeItem,
//   }
// })()

import { reactive, watch } from 'vue'

export const useCacheJoin = () => {
  const keystr = 'download'
  const cache = reactive(JSON.parse(localStorage.getItem(keystr) || '{}'))

  const updateLocalStorage = () => {
    localStorage.setItem(keystr, JSON.stringify(cache))
  }

  const setItem = (group, id) => {
    if (cache[group]) {
      const cacheArr = cache[group].split(',')
      if (cacheArr.includes(id)) return
      cacheArr.push('' + id)
      cache[group] = cacheArr.join(',')
      updateLocalStorage()
    } else {
      cache[group] = '' + id
      updateLocalStorage()
    }
  }

  const getItem = (group) => {
    return cache[group] ? cache[group].split(',') : []
  }

  const removeItem = (group) => {
    delete cache[group]
    updateLocalStorage()
  }

  // 监听cache对象的变化，并在变化时更新 localStorage
  watch(cache, updateLocalStorage, { deep: true })

  return {
    cache,
    setItem,
    getItem,
    removeItem,
  }
}
