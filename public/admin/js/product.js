
$(function () {
  var page = 1;
  var pageSize = 5;
  var imgs = [];

  // 页面渲染函数
  function render() {
    // 发送ajax请求，获取用户信息
    $.ajax({
      type: 'get',
      url: '/product/queryProductDetailList',
      data: {
        page: page,
        pageSize: pageSize
      },
      success: function (info) {
        console.log(info)
        $('tbody').html(template('tpl', info))

        // 分页功能 
        $('#paginator').bootstrapPaginator({
          //  bootstrap的版本
          bootstrapMajorVersion: 3,
          // 当前页
          currentPage: page,
          // 总页数，应该由总页数算出来
          totalPages: Math.ceil(info.total / info.size),
          // 当按钮被点击
          onPageClicked: function (a, b, c, p) {
            // 注意：不能和外面的page重名，不然访问不到外面的page
            page = p
            render()
          },
          // 设置控件大小
          size: 'normal',
          // 配置每个按钮的文字的显示
          // 返回值就是按钮的显示内容
          // type表示按钮的类型 first prev page next last
          // page: 按钮的页码值
          itemTexts: function (type, page) {
            switch (type) {
              case 'first':
                return '首页'
              case 'prev':
                return '上一页'
              case 'page':
                return page
              case 'next':
                return '下一页'
              case 'last':
                return '尾页'
            }
          },
          tooltipTitles: function (type, page) {
            switch (type) {
              case 'first':
                return '首页'
              case 'prev':
                return '上一页'
              case 'page':
                return '第' + page + '页'
              case 'next':
                return '下一页'
              case 'last':
                return '尾页'
            }
          },
          useBootstrapTooltip: true
        })
      }
    })
  }
  render()

  //添加商品
  // 1.准备商品添加的模态框
  // 2.二级分类的加载以及选择功能
  // a.点击添加商品的时候，动态加载所有的二级分类的数据
  // b.结合模板引擎渲染二级分类的数据
  // c.需要给二级分类的注册点击事件
  // d.完成二级分类选择功能
  // 3.商品图片上传的功能
  // 4.表单验证功能
  // 5.添加商品的功能
  // 6.提交代码

  // 添加商品功能
  $('.btn_add').on('click', function () {
    // console.log('呵呵')
    $('#addModal').modal('show')

    // 发送ajax请求 加载二级分类的数据
    $.ajax({
      type: 'get',
      url: '/category/querySecondCategoryPaging',
      data: {
        page: page,
        pageSize: 100
      },
      success: function (info) {
        // console.log(info)
        $('.dropdown-menu').html(template('tpl2', info))
      }
    })
  })

  //二级分类选择功能
  $('.dropdown-menu').on('click', 'a', function () {
    // 1.获取到当前a的文本，设置按钮
    $('.dropdown-text').html($(this).html())
    // 2.获取到当前a的id,设置给隐藏表单
    $('[name=brandId]').val($(this).data('id'))
    // 让brandId效验成功
    $('form')
      .data('bootstrapValidator').updateStatus('brandId', 'VALID')
  })

  // 商品图片上传功能
  $('#file').fileupload({
    // 图片上传后的回调函数
    done: function (e, data) {
      console.log(data.result)
      if (imgs.length >= 3) {
        alert('不要在上传了哟')
        return
      }
      // 1. 把上传成功后的图片显示出来
      $('<img src="' + data.result.picAddr + '" width="100" height="100" alt="">').appendTo('.img_box')
      //2. 要把商品上传成功的结果保存起来
      imgs.push(data.result)
      //3. 根据数组的长度，来修改picStatus的状态 如果长度为3 手动校验成功
      if (imgs.length === 3) {
        $('form')
          .data('bootstrapValidator').updateStatus('picStatus', 'VALID')
      } else {
        $('form')
          .data('bootstrapValidator').updateStatus('picStatus', 'INVALID')
      }
    }
  })

  // 表单校验功能
  $('form').bootstrapValidator({
    excluded: [],
    // 配置的效验的小图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-thumbs-up',
      invalid: 'glyphicon glyphicon-thumbs-down',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      brandId: {
        validators: {
          notEmpty: {
            message: '请选择二级分类'
          }
        }
      },
      proName: {
        validators: {
          notEmpty: {
            message: '商品名称不能为空'
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: '商品描述不能为空'
          }
        }
      },
      num: {
        // 必须是1-99999之间的有效数字
        validators: {
          notEmpty: {
            message: '商品库存不能为空'
          },
          // 正则校验
          regexp: {
            regexp: /^[1-9]\d{0,4}$/,
            message: '请输入有效的库存(1-99999)'
          }
        }
      },
      size: {
        validators: {
          notEmpty: {
            message: '商品尺码不能为空'
          },
          //
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '请输入正确的尺码格式(xx-xx)'
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: '商品原价不能为空'
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: '商品价格不能为空'
          }
        }
      },
      picStatus: {
        validators: {
          notEmpty: {
            message: '请上传3张商品图片'
          }
        }
      }
    }
  })

  // 注册表单效验成功事件
  $('form').on('success.form.bv', function (e) {
    e.preventDefault()
    
    //先拼好参数
    var param = $('form').serialize()
    // 在拼上6个
    param += '&picName1=' + imgs[0].picName + '&picAddr1=' + imgs[0].picAddr
    param += '&picName2=' + imgs[1].picName + '&picAddr2=' + imgs[1].picAddr
    param += '&picName3=' + imgs[2].picName + '&picAddr3=' + imgs[2].picAddr
      console.log(imgs);
      
    // 发送ajax请求
    $.ajax({
      type:'post',
      url:'/product/addProduct',
      data:param,
      success:function(info) {
        if(info.success) {
          // 关闭模态框
          $('#addModal').modal('hide')
          // 重新渲染
          page = 1
          render()

          // 重置样式
          $('form')
          .data('bootstrapValidator')
          .resetForm(true)
          
          // 手动清除
          $('.dropdown-text').html('请选择二级分类')
          $('.img_box img').remove()
          // 天坑 数组要清空
          imgs = []
        }
      }
    })
  })
})