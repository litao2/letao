
$(document).ajaxStart(function (){
// 开始进度条
NProgress.start()
// console.log('ajax要开始了')
})
$(document).ajaxStop(function (){
  // console.log('ajax要开始了')
  // 结束进度条
NProgress.done()
})
