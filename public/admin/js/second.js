

$(function () {
  var page = 1;
  var pageSize = 5;

  // 页面渲染函数
  function render() {
    // 发送ajax请求，获取用户信息
    $.ajax({
      type: 'get',
      url: '/category/querySecondCategoryPaging',
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (info) {
        console.log(info)
        $('tbody').html(template('tpl', info))

        // 分页功能
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          // 当前页
          currentPage: page,
          // 总页数，应该由总页数算出来
          totalPages: Math.ceil(info.total / info.size),
          onPageClicked: function (a, b, c, p) {
            // 注意：不能和外面的page重名，不然访问不到外面的page
            page = p
            render()
          }
        })
      }
    })
  }
  render()

  // 添加二级分类功能
  $('.btn_add').on('click', function () {
    // console.log("呵呵")
    $('#addModal').modal('show')

    // 渲染一级分类
    $.ajax({
      type: 'get',
      url: '/category/querySecondCategoryPaging',
      data: {
        page: 1,
        pageSize: 100
      },
      success: function (info) {
        console.log(info)
        $('.dropdown-menu').html(template('tpl2', info))
      }
    })
  })

  // 一级分类选择功能
  $('.dropdown-menu').on('click', 'li', function () {
    // console.log('呵呵')
    // 修改了内容
    var content = $(this).children().html()
    $('.dropdown-text').html(content)

    // 把id值赋值给input框
    $('[name=categoryId]').val($(this).data('id'))

    // 通过updateStatus方法,把效验改成成功
    // 当上传图片的时候，手动把categoryId改成VALID
    $('form').data('bootstrapValidator').updateStatus('categoryId','VALID')
  })

  // 二级分类图片上传功能
  $('#file').fileupload({
    // 图片上传后的回调函数
    done: function (e, data) {
      // 显示图片
      $('.img_box img').attr('src', data.result.picAddr)
      // 把图片笛子设置给隐藏表单
      $('[name=brandLogo]').val(data.result.picAddr)

      // 通过updateStatus方法,把效验改成成功
      // 当上传图片的时候，手动把brandLogo改成VALID
    $('form').data('bootstrapValidator').updateStatus('brandLogo','VALID')
    }
  })

  //表单效验功能
  $('form').bootstrapValidator({
    excluded: [],
    // 配置的效验的小图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-thumbs-up',
      invalid: 'glyphicon glyphicon-thumbs-down',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      brandName: {
        validators: {
          notEmpty: {
            message: '二级分类的名称不能为空'
          }
        }
      },
      categoryId: {
        validators: {
          notEmpty: {
            message: '请选择一个一级分类'
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: '请上传二级分类的图片'
          }
        }
      }
    }
  })

  // 注册表单效验成功事件
  // 阻止默认行为
  // 发送ajax请求
  // 如果成功了，重新渲染 关闭模态框 重置样式
  $('form').on('success.form.bv',function (e) {
    e.preventDefault()
    $.ajax({
      type:'post',
      url:'/category/addSecondCategory', 
      data:$('form').serialize(),
      success:function(info) {
        if(info.success) {
          //重新渲染第一页
          page = 1
          render()

          // 关闭模态框
          $("#addModal").modal('hide')
          // 重置样式
          $('form').data('bootstrapValidator').resetForm(true)
        
          // 手动重置按钮的值和图片
          $('.dropdown-text').html('请选择一级分类')
          $('.img_box img ').attr('src', 'images/none.png')
        }
      }
    })
  })
})