let baseURL = "http://api-breakingnews-web.itheima.net";

$.ajaxPrefilter(function (options) {
    // console.log(options.url);
    options.url = baseURL + options.url;
    // console.log(options.url);

    if (options.url.indexOf("/my/") != -1) {
        options.headers = {
            Authorization: localStorage.getItem("myToken") || ""
        };
        options.complete = function (res) {
            console.log(res.responseJSON);
            let resResp = res.responseJSON;
            if (resResp.status === 1 && resResp.message === "身份认证失败！") {
                localStorage.removeItem("myToken");
                location.href = "/login.html";
            }
        }
    }
})