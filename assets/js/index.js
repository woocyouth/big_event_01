$(function () {
    getUserInfo();
})

function getUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        headers: {
            Authorization: localStorage.getItem("myToken") || ""
        },
        success: (res) => {
            // console.log(res);
            if (res.status != 0) {
                return layui.layer.msg(res.message, {
                    icon: 5
                })
            }
            render(res.data);
        }
    })
}

function render(data) {
    console.log(data);
    let name = data.nickname || data.username;
    // console.log(name.toUpperCase());
    $("#welcome").text("欢迎  " + name);
    $(".userinfo-name").text(name);
    if (data.user_pic == null) {
        $(".text-avatar").show();
        $(".text-avatar").text(name[0].toUpperCase())
        $(".layui-nav-img").hide();
    } else {
        $(".text-avatar").hide();
        $(".layui-nav-img").show();
        $(".layui-nav-img").attr("src", data.user_pic);
    }
}