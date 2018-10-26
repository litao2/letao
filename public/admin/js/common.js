
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

//  二级分类 
// 1.先注册点击事件
$('.category>a').on('click', function(){
  // 2.在通过下一个兄弟元素添加显示隐藏
  $(this).next().slideToggle()
})

// 侧边栏显示隐藏
$('.icon_menu').on('click',function() {
  // 2.给元素添加隐藏功能
  $('body').toggleClass('active')
  $('.lt_aside').toggleClass('active')
})

// 1.给退出按钮注册点击事件
// 2.弹出模态框
// 3.等用户点击的时候在退出
$('.icon_logout').on('click',function (){
  // 弹出模态框
  $('#logoutModal').modal('show')
})

$('.logout').on('click',function () {
  // 发送ajax请求
  $.ajax({
    type:'get',
    url:'/employee/employeeLogout',
    success:function(info) {
      if(info.success) {
        // 退出成功，跳转到登录页面
        location.href = 'login.html'
      }
    }
  })
})