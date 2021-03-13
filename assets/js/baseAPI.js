let baseURL = "http://api-breakingnews-web.itheima.net";

$.ajaxPrefilter(function (options) {
    console.log(options.url);
    options.url = baseURL + options.url;
    console.log(options.url);
})