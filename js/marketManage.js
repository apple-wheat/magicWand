/**
 * Created by Administrator on 2017/7/12.
 */
//合理利用全局变量
// getTask(project_id);getTask(project_id,page,pageSize);
// 想要在ajax外面请求ajax内部的数据需要设置async:false

var code='';
var page='1';
var pageSize='15';
var totalNum='';
var content='';
var current= page;
var totalPage= '';

//请求项目记录
function getTask(project_id,page,pageSize){
    $.ajax({
        type:'post',
        url: path+"/market/getTask",
        data:{projectId:project_id,page:page,pageSize:pageSize},
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success:function(data){

            var datainfo='任务记录';
            data=getState(data,datainfo);
            totalNum=data.total;
            totalPage = Math.ceil(totalNum/pageSize);
            var table=data.tasks;

            var proview= '<thead><tr class="protr"><td id="proname" width="50%">'+'任务名称'
                +'</td><td>'+'任务状态'
                +'</td><td>'+'创建时间'
                +'</td><td>'+'任务类型'
                +'</td><td>'+'包含用户数'
                +'</td><td>'+'操作'
                +'</td></tr></thead><tbody>';
            if(table.length>0){
                $('.trtip').html("");

                //根据project_name控制图片切换
                // var startimg='images/all.png';
                // if(project_name=='二次营销'){
                //     // startimg=$('.proedit').attr('src', 'images/start.png'); //不可行
                //     startimg=$(".proedit")[0].src='images/start.png';
                // }

                for(var i=0;i< table.length;i++){
                    //学会从已有的数据下手
                    //判断每页显示的为当前具体的记录数

                    if(table[i].type=="1"){
                        table[i].type='短信';
                    }else {
                        table[i].type='外呼';
                    }
                    proview+=
                        '<tr class="protd" data-id="'+table[i].code+'" id='+table[i].code+'>'
                        // +'<td>'+(i+1+(page-1)*15)+'. '+table[i].name+'<span class="ready">&nbsp;√</span></td>'
                        +'<td>'+(i+1+(page-1)*15)+'. '+table[i].name+'</td>'
                        +'<td style="text-align: center">'+'未执行'+'</td>'
                        +'<td>'+table[i].createTime+'</td>'
                        +'<td>'+table[i].type+'</td>'
                        +'<td>'+table[i].userNum+'</td>'
                        +'<td>'
                        +'<img class="prosee" src="images/edit.png" alt="任务信息" title="任务信息">&emsp;'
                        // +'<img class="proedit" src='+startimg+'  alt="任务执行" title="任务执行">&emsp;'
                        +'<img class="proedit" src="images/start.png"  alt="任务执行" title="任务执行">&emsp;'
                        +'<img class="proimg" src="images/delete.png" alt="删除任务" title="删除任务"></td></tr>';
                }
                // console.log($(".proedit")[0].src);
                proview+='</tbody>';
                $("#proinfo").html(proview);
            }else{
                $("#proinfo").html("")
                $('.trtip').html("抱歉，暂时无数据。");
            }
            pageChange();
            isVerification=false;
        }
    });
}
getTask(project_id,page,pageSize);

function deleteTask(code) {
    var r=confirm("确定要删除吗？");
    if(r==true){
        $.ajax({
            type:'post',
            url: path+"/market/deleteTask",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            data:{code:code},
            success:function(data){
                if(data.state=='0'){
                    $(".info").html("");
                    window.location.href="marketManage.html?project_id="+project_id+"";
                }
                getTask(project_id,page,pageSize);
                isVerification=false;
            }
        });
    }else{
        window.location.href="marketManage.html?project_id="+project_id+"";
    }
}


//分页逻辑
function pageChange() {
    //每次先清空再重置
    content='';
    content += "<span id='firstPage'>首页</span><span id='prePage'>上一页</span>";

    //总页数大于6时候显示...
    if(totalPage > 6) {
        //当前页数大于6时显示省略号
        if(current < 5) {
            for(var i = 1; i < 6; i++) {
                if(current == i) {
                    content += "<a class='current'>" + i + "</a>";
                } else {
                    content += "<a>" + i + "</a>";
                }
            }
            content += ". . .";
            content += "<a>"+totalPage+"</a>";
        } else {
            //判断页码在末尾的时候
            if(current < totalPage - 3) {
                for(var i = current - 2; i < current + 3; i++) {
                    if(current == i) {
                        content += "<a class='current'>" + i + "</a>";
                    } else {
                        content += "<a>" + i + "</a>";
                    }
                }
                content += ". . .";
                content += "<a>"+totalPage+"</a>";
                //页码在中间部分时候
            } else {
                content += "<a>1</a>";
                content += ". . .";
                for(var i = totalPage - 4; i < totalPage + 1; i++) {
                    if(current == i) {
                        content += "<a class='current'>" + i + "</a>";
                    } else {
                        content += "<a>" + i + "</a>";
                    }
                }
            }
        }
        //页面总数小于6的时候
    } else {
        for(var i = 1; i < totalPage + 1; i++) {
            if(current == i) {
                content += "<a class='current'>" + i + "</a>";
            } else {
                content += "<a>" + i + "</a>";
            }
        }
    }
    content +=
        "<span id='nextPage'>下一页</span>" +
        "<span id='lastPage'>尾页</span>" +
        "<span class='totalPages'> 第<span>"+page+"</span>页 </span>" +
        "<span class='totalPages'> <span>"+'15'+"</span>条/页 </span>" +
        "<span class='totalPages'> 共<span>"+totalPage+"</span>页 </span>" +
        "<span class='totalSize'> 共<span>"+totalNum+"</span>条记录 </span>";
    $('#page').html(content);
}

//项目选择参数切换
$("#projectid").on("change",function() {
    isVerification = true;
    project_id = $(this).val();
    //获取当前选中项的ID和项目名称text
    // project_name = $('select option:selected').text();
    getTask(project_id,page,pageSize);
});

$(".addtask").on("click",function() {
    window.location.href="addTask.html?project_id="+project_id+"";
});

//查看任务
$("#proinfo").on("click",".prosee",function() {
    isVerification = true;
    code=$(this).parent().parent().attr("id");
    window.location.href="taskInfo.html?code="+code+"&project_id="+project_id+"";
});

//执行任务
$("#proinfo").on("click",".proedit",function() {});

// 删除项目
$("#proinfo").on("click",".proimg",function() {
    isVerification = true;
    code=$(this).parent().parent().attr("id");
    deleteTask(code);
});


//两个翻页写一起报400错误即参数传递错误
$("#page").on("click","a",function(){
    var page = $(this).html();
    current=page;
    $(this).addClass('current');
    page = +page;
    getTask(project_id,page,pageSize);
});

$("#page").on("click","span",function(){

    var pageid=$(this).attr("id");
    switch (pageid)
    {
        case 'firstPage':
            page = 1;
            break;
        case 'lastPage':
            page = totalPage;
            break;
        case 'prePage':
            page == 1?page = 1:page = +page - 1;
            break;
        case 'nextPage':
            page == totalPage?page = 1:page = +page +1;
            break;
    }
    //思考比胡乱的试管用的多
    current=page;
    $(this).addClass('current');
    getTask(project_id,page,pageSize);
});

//search搜索功能的实现
$(function(){
    $('#go').click(function(){
        isVerification = true;
        var sstxt=$('#search').val();
        $("table tbody tr").hide().filter(":contains('"+sstxt+"')").show();
        var trLen = $("table tbody tr").length;
        if(trLen==0){
            $('.trtip').html("抱歉，未查询到数据。");
        }
        $('#search').val("");
    })
    $("table tbody tr").show();
    $('.trtip').html("");
})
