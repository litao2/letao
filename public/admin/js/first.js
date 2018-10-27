
$(function () {
  var page =1;
  var pageSize = 2 ;
  // 发送ajax请求，获取用户信息
  function render(){
    $.ajax({
      type:'get',
      url:'/category/queryTopCategoryPaging',
      data:{
        page:page,
        pageSize:pageSize
      },
      success: function(info){
        console.log(info)
        $('tbody').html(template('tpl',info))

        // 分页功能
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          // 当前页
          currentPage:page,
          // 总页数，应该由总条数算出来
          totalPages: Math.ceil(info.total / info.size),
          onPageClicked:function(a,b,c,p){
            // 注意：不能和外面的page重名,不然访问不到外面的page
            page = p 
            render()
          }
        })
      }
    })
  }
  render()
})