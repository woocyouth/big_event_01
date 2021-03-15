$(window).on("load", function () {
    // 1.1 获取裁剪区域的 DOM 元素
    let $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options);

    $("#upload").on("click", function () {
        $("#img_file").click();
    });

    // 为文件选择框绑定 change 事件
    $('#img_file').on('change', function (e) {

        // 1. 拿到用户选择的文件
        let file = e.target.files[0];
        // console.log(file.name.slice(file.name.lastIndexOf(".")));
        let fileName = file.name.slice(file.name.lastIndexOf("."));
        // || fileName != ".png" || fileName != ".jpg" || fileName != ".jpeg"
        let src_name = [".png", ".jpg", ".jpeg"];
        if (file === undefined) {
            return layui.layer.msg('请选择照片！')
        }

        let flag = false;
        $.each(src_name, (index, item) => {
            if (fileName == item) {
                flag = true;
            }
        })

        if (flag == false) {
            return layui.layer.msg('照片格式为 .png, .jpg, .jpeg');
        }
        // 2. 将文件，转化为路径
        let imgURL = URL.createObjectURL(file)
        // 3. 重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });

    $("#tarUpload").on("click", function () {
        let dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png');

        $.ajax({
            url: '/my/update/avatar',
            method: 'POST',
            data: {
                avatar: dataURL
            },
            dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layui.layer.msg(res.message, {
                        icon: 5
                    });
                }
                layui.layer.msg("更换头像成功！");
                window.parent.getUserInfo();
            }
        })
    })
})