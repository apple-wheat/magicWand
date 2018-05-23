/**
 * Created by Administrator on 2017/7/16.
 * */

//复制常用代码、监测事件代码
var i = j = 5;
$(function () {
    $('#pcode').zclip({
        path: 'js/ZeroClipboard.swf',
        copy: function () { //复制内容
            return $('#pid').text();
        },
        afterCopy: function () { //复制成功
            $("#pcode").click(function () {
                setInterval(function () {
                    //this指代的不同，上一个是元素本身，下一个指的是window
                    // console.log(this);
                    // $('#pcode').text('复制代码');
                    i--;
                    if (i >= 0) {
                        $('#pcode').text("复制成功(" + i + ")");
                    } else {
                        $('#pcode').text("复制代码");
                    }
                }, 800);
            });
        }
    });
    $('#ecode').zclip({
        path: 'js/ZeroClipboard.swf',
        copy: function () { //复制内容
            return $('#eid').val();
            e
        },
        afterCopy: function () { //复制成功
            $("#ecode").click(function () {
                setInterval(function () {
                    j--;
                    if (j >= 0) {
                        $('#ecode').text("复制成功(" + j + ")");
                    } else {
                        $('#ecode').text("复制代码");
                    }
                }, 800);
            });
        }
    });
});



//不同页面之间传递参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

// 调用方法
var project_id = GetQueryString("project_id");

function editconf() {
    layer.confirm('确定要修改吗?', {
        icon: 3,
        title: '提示'
    }, function (index) {
        //    layer.close(index);
    });
}

//获得信息
function updateAfter(project_id) {

    $.ajax({
        type: 'post',
        url: path + "/project/updateAfter",
        data: {
            project_id: project_id
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {

            var datainfo = '获得信息';
            data = getState(data, datainfo);
            // $("#proname").value=data[0].project_name;
            // $("#pid").val(data[0].project_id);
            $("#proname").val(data[0].project_name);
            $("#weburl").val(data[0].project_url);
            $("#createtime").val(data[0].create_time);
            $("#keyword").text(data[0].project_id);
            isVerification = false;
        }
    });
}
updateAfter(project_id);

//修改项目
var pnflag = 0;
var wuflag = 0;

$("#savepro").on("click", function () {

    isVerification = true;
    //获取输入框的值
    var project_id = $("#keyword").text();
    var project_name = $("#proname").val();
    var project_url = $("#weburl").val();

    //用户输入判断
    if (project_name == "") {
        $(".nametips").html("请输入项目名称！");
    } else {
        var regular = /^([^\`\+\~\!\#\$\%\^\&\*\(\)\|\}\{\=\"\'\！\￥\……\（\）\——]*[\+\~\!\#\$\%\^\&\*\(\)\|\}\{\=\"\'\`\！\?\:\<\>\•\“\”\；\‘\‘\〈\ 〉\￥\……\（\）\——\｛\｝\【\】\\\/\;\：\？\《\》\。\，\、\[\]\,]+.*)$/;
        if (regular.test(project_name)) {
            //不正确并清空
            $(".nametips").html("项目名称不能输入特殊字符！");
            $('#proname').val("");
        } else {
            pnflag = 1;
        }
    }

    if (project_url == "") {
        $(".urlips").html("网站域名不能为空！");
    } else {
        // var strRegex = "^(?=^.{3,255}$)(http(s)?:\\/\\/)?(www\\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\\d+)*(\\/\\w+\\.\\w+)*";
        // var re = new RegExp(strRegex);
        // if (re.test(project_url)) {
        wuflag = 1;
        // } else {
        //     $(".urltips").html("请输入项目名称！");
        //     alert("网站域名格式不正确！");
        //     $('#weburl').val("");
        // }
    }

    if ((pnflag == 1) && (wuflag == 1)) {
        updateProject(project_id, project_name, project_url);
    }

});


$("#backpro").on("click", function () {
    isVerification = true;
    window.location.href = "projectManage.html";
});


// 修改信息
function updateProject(project_id, project_name, project_url) {

    // layer.confirm("确认要修改吗？", { title: "修改确认" }, function (index) {
    //     parent.layer.open(data, {
    //         type:3,
    //         title: "修改操作",
    //         btn: ['确定'],
    //         yes: function(layero){
    //             layero.find("iframe")[0].contentWindow.parent = parent;
    //             parent.location.reload();
    //             $.ajax({
    //                 type:'post',
    //                 url: path+"/project/updateProject",
    //                 data:{project_id:project_id,project_name:project_name,project_url:project_url},
    //                 xhrFields: {
    //                     withCredentials: true
    //                 },
    //                 crossDomain: true,
    //                 success:function(data){
    //                     if(data.state=='0'){
    //                         $(".info").html("");
    //                         window.location.href="projectManage.html";
    //                     }
    //                     isVerification=false;
    //                 }
    //             });
    //         },
    //         cancel: function(){
    //             layer.close(index);
    //         }
    //     });
    // });

    var r = confirm("确定要修改吗？");
    if (r == true) {
        $.ajax({
            type: 'post',
            url: path + "/project/updateProject",
            data: {
                project_id: project_id,
                project_name: project_name,
                project_url: project_url
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function (data) {
                if (data.state == '0') {
                    $(".info").html("");
                    window.location.href = "projectManage.html";
                }
                isVerification = false;
            }
        });
    } else {
        window.location.href = "projectManage.html";
    }

}