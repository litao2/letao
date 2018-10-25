$(function() {
  /* 
    1. 用户名必填    2-6位
    2. 密码必须填    密码的长度必须是6-12位
   */

  // 找到表单，调用 bootstrapValidator方法
  // bootstrapValidator这个插件会在表单提交的时候校验，保证表单能够提交
  // 如果校验失败了，插件组件表单的提交，必须等到校验成功了，才能正常提交
  $('form').bootstrapValidator({
    // 配置校验的规则
    fields: {
      // 配置用户名的校验
      username: {
        validators: {
          notEmpty: {
            message: '用户名不能为空'
          },
          stringLength: {
            min: 2,
            max: 6,
            message: '用户名长度必须是2-6位'
          },
          callback: {
            message: '用户名不存在'
          }
        }
      },
      // 配置password校验规则
      password: {
        validators: {
          notEmpty: {
            message: '用户密码不能为空'
          },
          stringLength: {
            min: 6,
            max: 12,
            message: '用户密码的长度必须是6-12位'
          },
          callback: {
            message: '密码错误'
          }
        }
      }
    },
    // 配置的校验的小图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-thumbs-up',
      invalid: 'glyphicon glyphicon-thumbs-down',
      validating: 'glyphicon glyphicon-refresh'
    }
  })

  // 给表单注册一个表单校验成功的事件，表单校验成功的时候才会触发
  $('form').on('success.form.bv',function(e){
    e.preventDefault()
    // 发送ajax请求
    $.ajax({
      url:'/employee/employeeLogin',
      type:'post',
      data:$('form').serialize(),
      // 自动根据后端返回的content-type进行判断， content-type:text/plain
      success: function(info) {
        if(info.success) {
          // 登录成功
          location.href = "index.html"
        }
        if(info.error === 1000) {
          // 让用户不合法
          $('form')
          .data('bootstrapValidator')
          .updateStatus('username','INVALID', 'callback')
        }
        if(info.error === 1001) {
          // 让password不合法
          $('form')
          .data('bootstrapValidator')
          .updateStatus('password','INVALID', 'callback')
        }
      }
    })
  })

  // 重置表单的功能
  $('[type=reset]').on('click',function(){
    // 重置表单
    $('form')
    .data('bootstrapValidator')
    .resetForm(true)
  })
})
 