/**
 * Created by Administrator on 2017/7/12.
 */
//合理利用全局变量
// getTask(project_id);getTask(project_id,page,pageSize);
// 想要在ajax外面请求ajax内部的数据需要设置async:false

var code = '';
var page = '1';
var pageSize = '15';
var totalNum = '';
var content = '';
var current = page;
var totalPage = '';
var channel = $("#channel").val();
var type = $("#loadid").val();

var end = {
    elem: '#endTime',
    event: 'focus',
    format: 'YYYY-MM-DD',
    min: '2017-06-29',
    max: laydate.now(0, 'YYYY-MM-DD'),
    istime: false,
    isclear: false,
    istoday: false,
    choose: function (datas) {
        endTime = datas;
    }
};
laydate(end);
$('#endTime').val(laydate.now(0, 'YYYY-MM-DD'));
laydate.skin('danlan');
var date = $('#endTime').val();
var deviceType = $('input:radio[name="device"]:checked').val();
var loadType = '页面分析详单';
// 未点击状态
// var isClick=1;
// 分情况筛选
$("#click").on("click", function () {
    isVerification = true;

    project_id = $('#projectid').val();
    type = $("#loadid").val();
    date = $('#endTime').val();
    channel = $("#channel").val();
    deviceType = $('input:radio[name="device"]:checked').val();

    loadType = $('#loadid option:selected').text();
    $('.title h3').html(loadType);

    getLog(project_id, type, date, channel, deviceType, page, pageSize);
    current = 1;
});

$('.exportDetail').on("click", function () {
    if ($('.exportDetail').hasClass("exportNone")) {
        return;
    } else {
        project_id = $('#projectid').val();
        type = $("#loadid").val();
        date = $('#endTime').val();
        channel = $("#channel").val();
        deviceType = $('input:radio[name="device"]:checked').val();

        getExcel(project_id, type, date, channel, deviceType);
    }
    $("#click").click();
});

// 判断json字段名是否存在
function formatter(data) { //table[i]
    var pagewhiteList = ['projectId', 'deviceId', 'pageUrl', 'startTime', 'duration', 'refer', 'os', 'browser', 'ip', 'userAgent', 'deviceType', 'pixel', 'topDomain', 'channel', 'title', 'createTime'];
    var eventwhiteList = ['projectId', 'deviceId', 'pageUrl', 'startTime', 'duration', 'refer', 'os', 'browser', 'ip', 'userAgent', 'deviceType', 'pixel', 'topDomain', 'channel', 'title', 'createTime'];

    pagewhiteList.forEach(function (key) {
        data[key] || (data[key] = '——');
    });

    eventwhiteList.forEach(function (key) {
        data[key] || (data[key] = '——');
    });

    // for(var key in data){
    //     if (whiteList.indexOf(key) < 0){
    //             data[key] == '--';
    //     }
    // }
};

//请求log信息
function getLog(project_id, type, date, channel, deviceType, page, pageSize) {
    $.ajax({
        type: 'get',
        url: path + "/load/logInfo",
        data: {
            projectId: project_id,
            type: type,
            date: date,
            channel: channel,
            deviceType: deviceType,
            page: page,
            pageSize: pageSize
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
            console.log(data);
            var datainfo = 'log信息';
            data = getState(data, datainfo);

            totalNum = data.total;
            totalPage = Math.ceil(totalNum / pageSize);
            var table = data.list;

            if (loadType === '页面分析详单') {
                var paviewhead = '<tr class="protr"><td>' + '序号' +
                    '</td><td>' + '项目ID' +
                    '</td><td>' + '设备号' +
                    '</td><td>' + '页面地址' +
                    '</td><td>' + '起始时间' +
                    '</td><td>' + '访问时长' +
                    '</td><td>' + '上级页面' +
                    '</td><td>' + '操作系统' +
                    '</td><td>' + '浏览器' +
                    '</td><td>' + 'IP地址' +
                    '</td><td>' + 'USER_AGENT' +
                    '</td><td>' + '设备标示' +
                    '</td><td>' + '分辨率' +
                    '</td><td>' + '上级域名' +
                    '</td><td>' + '页面名称' +
                    '</td><td>' + '渠道' +
                    '</td><td>' + '创建时间' +
                    '</td></tr>';
                var paviewbody = '';
                if (table.length > 0) {
                    $('.trtip').html("");
                    for (var i = 0; i < table.length; i++) {

                        if (table[i].deviceType == '') {
                            table[i].deviceType = '全部';
                        } else if (table[i].deviceType == '1') {
                            table[i].deviceType = 'PC';
                        } else {
                            table[i].deviceType = '移动设备';
                        }
                        if (table[i].refer == '') {
                            table[i].refer = '——';
                        }
                        if (table[i].channel == '') {
                            table[i].channel = '全部';
                        }
                        if (table[i].topDomain == '') {
                            table[i].topDomain = '——';
                        }
                        formatter(table[i]);
                        paviewbody +=
                            '<tr class="protd" data-id="' + table[i].projectId + '" id=' + table[i].projectId + '>' +
                            '<td>' + (i + 1 + (page - 1) * 15) + '</td>' +
                            '<td>' + table[i].projectId + '</td>' +
                            '<td>' + table[i].deviceId + '</td>' +
                            '<td title="' + table[i].pageUrl + '"><a href="' + table[i].pageUrl + '" target="_blank">' + table[i].pageUrl + '</a></td>' +
                            '<td>' + table[i].startTime + '</td>' +
                            '<td>' + table[i].duration + '&nbsp;s</td>' +
                            '<td title="' + table[i].refer + '"><a href="' + table[i].refer + '" target="_blank">' + table[i].refer + '</a></td>' +
                            '<td>' + table[i].os + '</td>' +
                            '<td>' + table[i].browser + '</td>' +
                            '<td>' + table[i].ip + '</td>' +
                            '<td title="' + table[i].userAgent + '"><a href="javascript:void(0);">' + table[i].userAgent + '</a></td>' +
                            '<td>' + table[i].deviceType + '</td>' +
                            '<td>' + table[i].pixel + '</td>' +
                            '<td>' + table[i].topDomain + '</td>' +
                            '<td>' + table[i].channel + '</td>' +
                            '<td>' + table[i].title + '</td>' +
                            '<td>' + table[i].createTime + '</td></tr>';
                    }
                    $('.exportDetail').removeClass("exportNone");
                    $('#proinfo').find("thead").html(paviewhead);
                    $('#proinfo').find("tbody").html(paviewbody);
                    pageChange();
                } else {
                    $('.page_div').html('');
                    $('.exportDetail').addClass("exportNone");
                    $('#proinfo').find("thead").html(paviewhead);
                    $('#proinfo').find("tbody").html("");
                    $('.trtip').html("抱歉，暂时无数据。");
                }
            } else {
                var evviewhead = '<tr class="protr"><td>' + '序号' +
                    '</td><td>' + '项目ID' +
                    '</td><td>' + '设备号' +
                    '</td><td>' + '页面地址' +
                    '</td><td>' + '起始时间' +
                    '</td><td>' + '参数' +
                    '</td><td>' + '标签' +
                    '</td><td>' + '点击数' +
                    '</td><td>' + '事件ID' +
                    '</td><td>' + '设备标示' +
                    '</td><td>' + 'USERAGENT' +
                    '</td><td>' + '页面名称' +
                    '</td><td>' + 'IP地址' +
                    '</td><td>' + '渠道' +
                    '</td><td>' + '操作系统' +
                    '</td><td>' + '浏览器' +
                    '</td><td>' + '创建时间' +
                    '</td></tr>';
                var evviewbody = '';
                if (table.length > 0) {
                    $('.trtip').html("");
                    for (var i = 0; i < table.length; i++) {

                        if (table[i].deviceType == '') {
                            table[i].deviceType = '全部';
                        } else if (table[i].deviceType == '1') {
                            table[i].deviceType = 'PC';
                        } else {
                            table[i].deviceType = '移动设备';
                        }
                        if (table[i].refer == '') {
                            table[i].refer = '——';
                        }
                        if (table[i].channel == '') {
                            table[i].channel = '全部';
                        }
                        formatter(table[i]);
                        evviewbody +=
                            '<tr class="protd" data-id="' + table[i].projectId + '" id=' + table[i].projectId + '>' +
                            '<td>' + (i + 1 + (page - 1) * 15) + '</td>' +
                            '<td>' + table[i].projectId + '</td>' +
                            '<td>' + table[i].deviceId + '</td>' +
                            '<td title="' + table[i].pageUrl + '"><a href="' + table[i].pageUrl + '" target="_blank">' + table[i].pageUrl + '</a></td>' +
                            '<td>' + table[i].startTime + '</td>' +
                            '<td>' + table[i].date + '</td>' +
                            '<td>' + table[i].label + '</td>' +
                            '<td>' + table[i].count + '&nbsp;次</td>' +
                            '<td>' + table[i].eventId + '</td>' +
                            '<td>' + table[i].deviceType + '</td>' +
                            '<td title="' + table[i].userAgent + '"><a href="javascript:void(0);">' + table[i].userAgent + '</a></td>' +
                            '<td>' + table[i].title + '</td>' +
                            '<td>' + table[i].ip + '</td>' +
                            '<td>' + table[i].channel + '</td>' +
                            '<td>' + table[i].os + '</td>' +
                            // 某个字段undefined情况下为--
                            // '<td>' + table[i].os||'--' + '</td>' +
                            '<td>' + table[i].browser + '</td>' +
                            '<td>' + table[i].createTime + '</td></tr>';
                    }
                    $('.exportDetail').removeClass("exportNone");
                    $("#proinfo").find("thead").html(evviewhead);
                    $("#proinfo").find("tbody").html(evviewbody);
                    pageChange();
                } else {
                    $('.page_div').html('');
                    $('.exportDetail').addClass("exportNone");
                    $("#proinfo").find("thead").html(evviewhead);
                    $("#proinfo").find("tbody").html('');
                    $('.trtip').html("抱歉，暂时无数据。");
                }
            }

            // 1.写在.html()之后；2.保证数据加载完毕；
            setTimeout(function () {
                // 保证iframe高度被撑开之后再添加滚动条
                top.updateIframeHeight(function () {
                    $('#page_views').prop("scrollLeft", 1).prop("scrollLeft", 0);
                    // document.querySelector('#page_views').scrollLeft = 1;
                    // document.querySelector('#page_views').scrollLeft = 0;
                });
            });

            isVerification = false;
        }
    });
}
getLog(project_id, type, date, channel, deviceType, page, pageSize);


// 导出Excel
function getExcel(project_id, type, date, channel, deviceType) {

    $.ajax({
        type: 'get',
        url: path + "/load/excel",
        data: {
            projectId: project_id,
            type: type,
            date: date,
            channel: channel,
            deviceType: deviceType,
        },
        success: function (data) {
            var loadUrl = this.url;
            window.location.href = '' + loadUrl + '?projectId=' + project_id + '&type=' + type + 'date=' + date + '&channel=' + channel + 'deviceType=' + deviceType + '';
        }
    });
}

//分页逻辑
function pageChange() {
    //每次先清空再重置
    content = '';
    content += "<span id='firstPage'>首页</span><span id='prePage'>上一页</span>";

    //总页数大于6时候显示...
    if (totalPage > 6) {
        //字符串和数字比较，永不相等，导致无限循环；
        current = parseInt(current);
        //当前页数大于6时显示省略号
        if (current < 5) {
            for (var i = 1; i < 6; i++) {
                if (current == i) {
                    content += "<a class='current'>" + i + "</a>";
                } else {
                    content += "<a>" + i + "</a>";
                }
            }
            content += ". . .";
            content += "<a>" + totalPage + "</a>";
        } else {
            //判断页码在末尾的时候
            if (current < totalPage - 3) {
                for (var j = current - 2; j < current + 3; j++) {
                    // debugger;
                    if (current == j) {
                        content += "<a class='current'>" + j + "</a>";
                    } else {
                        content += "<a>" + j + "</a>";
                    }
                }
                content += ". . .";
                content += "<a>" + totalPage + "</a>";
                //页码在中间部分时候
            } else {
                content += "<a>1</a>";
                content += ". . .";
                for (var z = totalPage - 4; z < totalPage + 1; z++) {
                    if (current == z) {
                        content += "<a class='current'>" + z + "</a>";
                    } else {
                        content += "<a>" + z + "</a>";
                    }
                }
            }
        }
        //页面总数小于6的时候
    } else {
        for (var i = 1; i < totalPage + 1; i++) {
            if (current == i) {
                content += "<a class='current'>" + i + "</a>";
            } else {
                content += "<a>" + i + "</a>";
            }
        }
    }
    content +=
        "<span id='nextPage'>下一页</span>" +
        "<span id='lastPage'>尾页</span>" +
        "<span class='totalPages'> 第<span>" + page + "</span>页 </span>" +
        "<span class='totalPages'> <span>" + '15' + "</span>条/页 </span>" +
        "<span class='totalPages'> 共<span>" + totalPage + "</span>页 </span>" +
        "<span class='totalSize'> 共<span>" + totalNum + "</span>条记录 </span>";
    $('#page').html(content);
}



//两个翻页写一起报400错误即参数传递错误
$("#page").on("click", "a", function () {
    var page = $(this).html();
    current = page;
    $(this).addClass('current');
    page = +page;
    getLog(project_id, type, date, channel, deviceType, page, pageSize);
});

$("#page").on("click", "span", function () {

    var pageid = $(this).attr("id");
    switch (pageid) {
        case 'firstPage':
            page = 1;
            break;
        case 'lastPage':
            page = totalPage;
            break;
        case 'prePage':
            page == 1 ? page = 1 : page = +page - 1;
            break;
        case 'nextPage':
            page == totalPage ? page = 1 : page = +page + 1;
            break;
    }
    //思考比胡乱的试管用的多
    current = page;
    $(this).addClass('current');
    getLog(project_id, type, date, channel, deviceType, page, pageSize);
});