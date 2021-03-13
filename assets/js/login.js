$(function () {
    // login and register change
    $("#link_reg").on("click", function () {
        $(".login-box").hide();
        $(".reg-box").show();
    })

    $("#link_login").on("click", function () {
        $(".login-box").show();
        $(".reg-box").hide();
    })

    // vertiry
    let form = layui.form;
    form.verify({
        username: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }

            //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
            if (value === 'xxx') {
                alert('用户名不能为敏感词');
                return true;
            }
        },
        pass: [
            /^[\S]{6,12}$/,
            "密码不能为空，长度6-12位"
        ],
        repass: function (value, item) {
            // console.log(value, item);
            // console.log($(".reg-box input[name=password]").val());
            if (value !== $(".reg-box input[name=password]").val()) {
                return "两次密码不一致"
            }
        }
    })

    // register-btn
    let layer = layui.layer;
    $("#form_reg").on("submit", function (e) {
        e.preventDefault();
        let username = $(".reg-box input[name=username]").val();
        let password = $(".reg-box input[name=password]").val();

        $.ajax({
            url: '/api/reguser',
            type: 'post',
            data: {
                username: username,
                password: password
            },
            dataType: 'json',
            success: (res) => {
                console.log(res);
                if (res.status != 0) {
                    // alert("注册失败");
                    // return;
                    return layer.msg(res.message, {
                        icon: 5
                    });
                }
                // alert(res.message);
                layer.msg(res.message, {
                    icon: 6
                });

                $("#link_login").click();
                $("#form_reg")[0].reset();
            }
        })
    })

    // login-btn
    $("#form_login").on("submit", function (e) {
        e.preventDefault();
        // let username = $(".login-box input[name=username]").val();
        // let password = $(".login-box input[name=password]").val();

        $.ajax({
            url: '/api/login',
            type: 'post',
            data: $("#form_login").serialize(),
            dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, {
                        icon: 5
                    })
                }
                layer.msg(res.message, {
                    icon: 6
                });
                location.href = "/index.html";
                localStorage.setItem("myToken", res.token);
            }
        })

    })
})