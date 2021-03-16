$(function () {
    let layer = layui.layer;
    let form = layui.form;

    // console.log(location.search.split("=")[1]);
    let letter_id = location.search.split("=")[1];
    initFormBase();

    function initFormBase() {
        $.ajax({
            url: '/my/article/' + letter_id,
            method: 'GET',
            dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, {
                        icon: 5
                    });
                }
                layer.msg(res.message, {
                    icon: 6
                });
                form.val("form-edit-lay", res.data);
                // if(res.cate_id === 1){

                // }
                tinyMCE.activeEditor.setContent(res.data.content);
                if (!res.data.cover_img) {
                    return layer.msg("用户未曾上传头像", {
                        icon: 5
                    });
                }

                let newImgUrl = baseURL + res.data.cover_img;
                $image.cropper("destroy")
                    .attr("src", newImgUrl)
                    .cropper(options)
            }
        })
    }

    initCate();

    function initCate() {
        $.ajax({
            url: '/my/article/cates/',
            method: "GET",
            success: (res) => {
                // console.log(res.data);
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, {
                        icon: 5
                    });
                }
                let htmlStr = template("tpl-art-cate", {
                    data: res.data
                });
                $("[name=cate_id]").html(htmlStr);
                layui.form.render();
            }
        })
    }

    // 初始化富文本编辑器
    initEditor();

    // 1. 初始化图片裁剪器
    let $image = $('#image')

    // 2. 裁剪选项
    let options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options);

    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    });

    $("#coverFile").on("change", function (e) {
        let file = e.target.files[0];
        if (file === undefined) {
            return layer.msg("请选择上传图片");
        }

        var newImgURL = URL.createObjectURL(file)
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    var art_state = '已发布';
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    });

    function publishArticle(fd) {
        $.ajax({
            url: '/my/article/edit',
            type: 'POST',
            data: fd,
            contentType: false,
            processData: false,
            dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, {
                        icon: 5
                    });
                }
                layer.msg(res.message, {
                    icon: 6
                });
                // location.href = "/article/art_list.html";
                setTimeout(() => {
                    window.parent.document.querySelector("#art_list").click();
                }, 1000)
            }
        })
    }

    $('#form-pub').on('submit', function (e) {
        // 1. 阻止表单的默认提交行为
        e.preventDefault()
        // 2. 基于 form 表单，快速创建一个 FormData 对象
        var fd = new FormData($(this)[0])
        // 3. 将文章的发布状态，存到 fd 中
        fd.append('state', art_state);
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                fd.append("Id", letter_id);
                // 6. 发起 ajax 数据请求
                // console.log(...fd);
                publishArticle(fd)
            })
    });

})