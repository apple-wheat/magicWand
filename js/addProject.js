/**
 * Created by Administrator on 2017/7/16.
 */

var pnflag = 1;
var wuflag = 1;

//创建项目
$("#createpro").on("click", function () {
    isVerification = true;
    //获取输入框的值
    var project_name = $("#proname").val();
    var project_url = $("#weburl").val();

    //用户输入判断
    if (project_name == "") {
        $(".nametips").html("请输入项目名称！");
    } else {
        var regular = /^([^\`\+\~\!\#\$\%\^\&\*\(\)\|\}\{\=\"\'\！\￥\……\（\）\——]*[\+\~\!\#\$\%\^\&\*\(\)\|\}\{\=\"\'\`\！\?\:\<\>\•\“\”\；\‘\‘\〈\ 〉\￥\……\（\）\——\｛\｝\【\】\\\/\;\：\？\《\》\。\，\、\[\]\,]+.*)$/;
        if (regular.test(project_name)) {
            $(".nametips").html("项目名称不能输入特殊字符！");
            $('#proname').val("");
        } else {
            pnflag = 0;
        }
    }

    if (project_url == "") {
        $(".urltips").html("网站域名不能为空！");
    } else {
        // var strRegex = "^(?=^.{3,255}$)(http(s)?:\\/\\/)?(www\\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\\d+)*(\\/\\w+\\.\\w+)*$";
        // var re=new RegExp(strRegex);
        // if(re.test(project_url)){
        wuflag = 0;
        // }else{
        //     $(".urltips").html("网站域名格式不正确！");
        //     $('#weburl').val("");
        // }
    }

    if (pnflag == 0 && wuflag == 0) {
        createProject(project_name, project_url);
    }
    // $('.modal',top.document).show();
});

$("#backpro").on("click", function () {
    isVerification = true;
    window.location.href = "projectManage.html";
});

function createProject(project_name, project_url) {
    //问题所在是需要用判断包裹ajax
    var r = confirm("确定要添加吗？");
    if (r == true) {
        $.ajax({
            type: 'post',
            url: path + "/project/insertProject",
            data: {
                project_name: project_name,
                project_url: project_url
            },
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            dataType: "json",
            success: function (data) {
                if (data.state == '0') {
                    $(".info").html("");
                    window.location.href = "projectManage.html";
                } else {
                    $(".nametips").html("项目名称与已有的项目重复！");
                    $("#proname").val();
                }
                isVerification = false;
            }
        });
    } else {
        window.location.href = "projectManage.html";
    }
}