$(function () {
    let layer = layui.layer;
    let form = layui.form;
    let indexAdd = null;
    initAtrList();

    function initAtrList() {
        $.ajax({
            url: '/my/article/cates',
            method: 'GET',
            dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layui.layer.msg(res.message);
                }
                let htmlStr = template("tpl-art-cate", {
                    list: res.data
                });
                $("tbody").html(htmlStr);
            }
        })
    };

    $("#btnAdd").on("click", function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $("#dialog-add").html()
        });
    })

    $("body").on("submit", "#dialog-form", function (e) {
        e.preventDefault();
        let formInfo = $("#dialog-form").serialize();
        $.ajax({
            url: '/my/article/addcates',
            method: 'POST',
            data: formInfo,
            dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                layer.close(indexAdd);
                $("#dialog-form")[0].reset();
                initAtrList();
            }
        })
    })

    let indexEdit = null;
    $("tbody").on("click", ".btn-edit", function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $("#dialog-edit").html()
        });

        let Id = $(this).attr("data-id");
        console.log('sadf');
        $.ajax({
            url: '/my/article/cates/' + Id,
            method: "GET",
            dataType: 'json',
            success: (res) => {
                console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                form.val("formEditInfo", res.data);
            }
        })
    })

    $("body").on("submit", "#dialog-form-edit", function (e) {
        e.preventDefault();
        let formInfo = $("#dialog-form-edit").serialize();
        $.ajax({
            url: '/my/article/updatecate',
            method: 'POST',
            data: formInfo,
            dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                layer.close(indexEdit);
                // $("#dialog-form-edit")[0].reset();
                initAtrList();
            }
        })
    })

    $("tbody").on("click", ".btn-del", function () {
        let Id = $(this).attr("data-id");
        indexDel = layer.confirm('确认删除？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            $.ajax({
                url: '/my/article/deletecate/' + Id,
                method: "GET",
                dataType: 'json',
                success: (res) => {
                    console.log(res);
                    if (res.status != 0) {
                        return layer.msg(res.message, {
                            icon: 5
                        });
                    }
                    layer.msg(res.message, {
                        icon: 6
                    });
                    initAtrList();
                }
            })
            layer.close(index);
        });

    })
})