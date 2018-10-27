
$(function(){
  // 发送ajax请求，获取用户列表数据
  var page = 1;
  var pageSize = 5;
  var id = 0;
  var isDelete = 0;

  render()

  
// 1.给启用或禁用注册点击事件
// 注意：注册事件一定要用委托事件，因为按钮时动态生成的
$("tbody").on('click','button', function () {
  // console.log('哈哈')
  // 显示模态框
  $('#userModal').modal('show')
   id = $(this)
  .parent()
  .data('id')
  // console.log(id)
   isDelete = $(this).hasClass('btn-success') ? 0 : 1
  //  console.log(id,isDelete)
})
$('.confirm').on('click',function () {
  $.ajax({
    type: 'post',
    url:'/user/updateUser',
    data: {
      id:id,
      isDelete:isDelete
    },
    success:function(info) {

      if(info.success){

        // 1.关闭模态框
      $('#userModal').modal('hide')
      // 2.渲染页面
      render()

      }
      console.log(info)
      
    }
  })
})
// 2.显示模态框
// 3.用户点了确定，才发送请求启用或者禁用





// 因为分页的时候也要发送ajax请求

 function render() {
  $.ajax({
    type:'get',
    url:'/user/queryUser',
    data:{
      page:page,
      pageSize:pageSize
    },
    success: function(info) {
      // console.log(info)
      // 渲染模板
      var html = template('tpl',info)
      $('tbody').html(html)

      // 分页功能一定要在ajax数据返回之后
      $('#paginator').bootstrapPaginator({
        // 如果使用了bootsstrap3的版本，必须指定版本
        bootstrapMajorVersion: 3,
        // 当前页
        currentPage:page,
        // 总页数，应该由总条数算出来
        totalPages: Math.ceil(info.total / info.size),
        onPageClicked:function(a,b,c,p){
          // 注意：不能和外面的page重名，不然访问不到外面的page
          page = p
          render()
        }
      })

    }
  })
 }
})
