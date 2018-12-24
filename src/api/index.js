import api from './api'
// 首页信息
export function getPbIndex(data) {
  return api.postWithCommonArgs('/sl/pb/index', data)
}
// 获取绘本系列
export function getPbSerieBooks(data) {
  return api.postWithCommonArgs('/sl/pb/serie/books', data)
}
// 获取绘本内容
export function getPbBook(data) {
  return api.postWithCommonArgs('/sl/pb/book', data)
}
// 获取绘本习题
export function getPbBookQuestions(data) {
  return api.postWithCommonArgs('/sl/pb/book/questions', data)
}
// 学生完成阅读提交
export function pbSubmitRead(data) {
  return api.postWithCommonArgs('/sl/pb/submit/read', data)
}
// 学生完成答题提交
export function pbSubmit(data) {
  return api.postWithCommonArgs('/sl/pb/submit', data)
}
