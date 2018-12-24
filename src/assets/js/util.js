import storage from 'good-storage'
/* storage */
// 主要是操作和 Storage 相关的逻辑
export function saveStorageData(key, val) {
  // 存储到storage
  storage.set(key, val)
  // 返回
  return val
}
// 读取本地存储
export function loadStorageData(key) {
  return storage.get(key)
}
// 清空Key记录
export function clearStorageData(key) {
  storage.remove(key)
  return []
}

