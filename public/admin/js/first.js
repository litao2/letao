
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
  
  // 添加一级分类
  $('.btn_add').on('click',function () {
    // console.log('呵呵')
    $('#addModal').modal('show')
  })

  // 表单验证的初始化
  $('form').bootstrapValidator({
    // 指定所有字段的效验规则
    fields: {
      categoryName: {
          validators: {
              notEmpty: {
                  message: '一级分类的名称不能为空'
              }
          }
      }
  },
  // 配置的效验的小图标
  feedbackIcons: {
    valid: 'glyphicon glyphicon-thumbs-up',
    invalid: 'glyphicon glyphicon-thumbs-down',
    validating: 'glyphicon glyphicon-refresh'
  }
 })
  // 注册表单效验成功事件
  $('form').on('success.form.bv',function(e) {
    e.preventDefault()
    $.ajax({
      type:'post',
      url:'/category/addTopCategory',
      data: $('form').serialize(),
      success:function(info) {
        // console.log(info)
        if(info.success){
          // 1.关闭模态框
          $('#addModal').modal('hide')
          // 2.渲染页面
          render()
        }
        console.log(info)
      }
    })
  })
})
