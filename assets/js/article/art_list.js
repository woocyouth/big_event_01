$(function () {
    template.defaults.imports.dateFormat = function (dateStr) {
        let dt = new Date(dateStr);
        let y = addZero(dt.getFullYear());
        let m = addZero(dt.getMonth() + 1);
        let d = addZero(dt.getDay());
        let hh = addZero(dt.getHours());
        let mm = addZero(dt.getMinutes());
        let ss = addZero(dt.getSeconds());

        return `${y}-${m}-${d}  ${hh}:${mm}:${ss}`;
    }

    function addZero(time) {
        return time < 10 ? "0" + time : time;
    }

    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    let q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }
    initTable()

    function initTable() {
        $.ajax({
            url: '/my/article/list',
            method: 'GET',
            data: q,
            dataType: 'json',
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, {
                        icon: 5
                    });
                }
                let htmlStr = template("tpl-art-table", {
                    data: res.data
                });
                $("tbody").html(htmlStr);
                renderPage(res.total);
            }
        })
    }
    let laypage = layui.laypage;

    function renderPage(total) {
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 5, 10],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数

                //首次不执行
                if (!first) {
                    //do something
                    q.pagenum = obj.curr;
                    q.pagesize = obj.limit;
                    initTable();
                }
            }
            // theme: "#0750f5"
        });
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

    $("#selectForm").on("submit", function (e) {
        e.preventDefault();
        let cate_id = $("[name=cate_id]").val();
        let state = $("[name=state]").val();

        console.log(cate_id, state);
        q.cate_id = cate_id;
        q.state = state;
        initTable();
    })

    $("tbody").on("click", ".btn-del", function () {
        let Id = $(this).attr("data-id");
        // console.log(Id);

        layer.confirm('是否删除文章', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            $.ajax({
                url: '/my/article/delete/' + Id,
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
                    if ($(".btn-del").length === 1 && q.pagenum > 1) q.pagenum--;
                    initTable();
                }
            })
            layer.close(index);
        });


    })
})