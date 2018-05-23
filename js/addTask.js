
var type='';
var sex='';
var age='';
var area='';
var times='';
var duration='';
var name='';
var taskflag=1;
var checkflag=1;

//默认全选
$(function () {
    $("input[type=checkbox]").attr("checked",true);
})

//当某个全选按钮取消选中
$("#sex_all").click(function(){
    $('input[name=sex]:checked').removeAttr('disabled');
    if(this.checked){
        $("input[name=sex]").prop('checked', true);
    }else{
        $("input[name=sex]").attr('checked', false);
    }
});

// $("#age_all,#sex_all").click(function () {
//     var type = $(this).attr('id').split('_')[0];
//     $('input[name=' + type + ']:checked').removeAttr('disabled');
//     if (this.checked) {
//         $("input[name=" + type + "]").prop('checked', true);
//     } else {
//         $("input[name=" + type + "]").attr('checked', false);
//     }
// });

$("#age_all").click(function(){
    $('input[name=age]:checked').removeAttr('disabled');
    if(this.checked){
        $("input[name=age]").prop('checked', true);
    }else{
        $("input[name=age]").attr('checked', false);
    }
});
$("#area_all").click(function(){
    $('input[name=area]:checked').removeAttr('disabled');
    if(this.checked){
        $("input[name=area]").prop('checked', true);
    }else{
        $("input[name=area]").attr('checked', false);
    }
});
$("#times_all").click(function(){
    $('input[name=times]:checked').removeAttr('disabled');
    if(this.checked){
        $("input[name=times]").prop('checked', true);
    }else{
        $("input[name=times]").attr('checked', false);
    }
});
$("#duration_all").click(function(){
    $('input[name=duration]:checked').removeAttr('disabled');
    if(this.checked){
        $("input[name=duration]").prop('checked', true);
    }else{
        $("input[name=duration]").attr('checked', false);
    }
});

//设置选中不可取消状态

var sexlen=$("input[name=sex]").length-1;
$('input[name=sex]').click(function(){
    if($("input[name=sex]:checked").length ==sexlen) {
        $("#sex_all").attr('checked', false);
        $('input[name=sex]:checked').attr('disabled', 'true');
    }else{
        $('input[name=sex]:checked').removeAttr('disabled');
    }
});

var agelen=$("input[name=age]").length-1;
$('input[name=age]').click(function(){
    if($("input[name=age]:checked").length == agelen) {
        $("#age_all").attr('checked', false);
    }else if($("input[name=age]:checked").length == 1){
        $("#age_all").attr('checked', false);
        // $('input[name=age]:checked').attr('disabled', 'true');
    }else{
        $('input[name=age]:checked').removeAttr('disabled');
    }
});

var arealen=$("input[name=area]").length-1;
$('input[name=area]').click(function(){
    if($("input[name=area]:checked").length == arealen) {
        $("#area_all").attr('checked', false);
    }else if($("input[name=area]:checked").length == 1) {
        $("#area_all").attr('checked', false);
        // $('input[name=area]:checked').attr('disabled', 'true');
    }else{
        $('input[name=area]:checked').removeAttr('disabled');
    }
});

var timeslen=$("input[name=times]").length-1;
$('input[name=times]').click(function(){
    if($("input[name=times]:checked").length == timeslen) {
        $("#times_all").attr('checked', false);
    }else if($("input[name=times]:checked").length == 1) {
        $("#times_all").attr('checked', false);
        // $('input[name=times]:checked').attr('disabled', 'true');
    }else{
        $('input[name=times]:checked').removeAttr('disabled');
    }
});

var durationlen=$("input[name=duration]").length-1;
$('input[name=duration]').click(function(){
    if($("input[name=duration]:checked").length == durationlen) {
        $("#duration_all").attr('checked', false);
    }else if($("input[name=duration]:checked").length == 1) {
        $("#duration_all").attr('checked', false);
        // $('input[name=duration]:checked').attr('disabled', 'true');
    }else{
        $('input[name=duration]:checked').removeAttr('disabled');
    }
});


//创建任务
$("#savetsk").on("click",function(){

    isVerification = true;
    project_id = $('select option:selected').val();
    //营销方式
    $("input:radio[name=type]:checked").each(function(){
        type = $(this).val();
    });

    // jq1.6以上版本不能用attr()需要用prop()
    //基础属性-性别
    if($('#sex_all').prop('checked')) {
        // $("input[name=sex]").not("input:checked").each(function(i){});
        $("input:checkbox[name=sex]:checked").each(function(i){
            if(i==0){
                sex = $(this).val();
            }else{
                sex += (","+$(this).val());
            }
        });
    }else{
        $("input:checkbox[name=sex]:checked").each(function(i){
            if(i==0){
                sex = $(this).val();
            }else{
                sex += (","+$(this).val());
            }
        });
    }

    //基础属性-年龄
    if($('#age_all').prop('checked')) {
        $("input:checkbox[name=age]:checked").each(function(i){
            if(i==0){
                age = $(this).val();
            }else{
                age += (","+$(this).val());
            }
        });
    }else{
        $("input:checkbox[name=age]:checked").each(function(i){
            if(i==0){
                age = $(this).val();
            }else{
                age += (","+$(this).val());
            }
        });
    }

    //地域分布-归属省份
    if($('#area_all').prop('checked')) {
        $("input:checkbox[name=area]:checked").each(function(i){
            if(i==0){
                area = $(this).val();
            }else{
                area += (","+$(this).val());
            }
        });
    }else{
        $("input:checkbox[name=area]:checked").each(function(i){
            if(i==0){
                area = $(this).val();
            }else{
                area += (","+$(this).val());
            }
        });
    }

    //行为特征-访问次数
    if($('#times_all').prop('checked')) {
        $("input:checkbox[name=times]:checked").each(function(i){
            if(i==0){
                times = $(this).val();
            }else{
                times += (","+$(this).val());
            }
        });
    }else{
        $("input:checkbox[name=times]:checked").each(function(i){
            if(i==0){
                times = $(this).val();
            }else{
                times += (","+$(this).val());
            }
        });
    }

    //行为特征-访问时长
    if($('#duration_all').prop('checked')) {
        $("input:checkbox[name=duration]:checked").each(function(i){
            if(i==0){
                duration = $(this).val();
            }else{
                duration += (","+$(this).val());
            }
        });
    }else{
        $("input:checkbox[name=duration]:checked").each(function(i){
            if(i==0){
                duration = $(this).val();
            }else{
                duration += (","+$(this).val());
            }
        });
    }

    checkTasks(project_id,name);

    if(taskflag==0&&checkflag==0){
        createProject(project_id,type,sex,age,area,times,duration,name);
    }
});

function checkTasks() {
    name=$('.taskname').val();
    if(name==""){
        $(".tips").html("请输入任务名称！");
    }else{
        var regular = /^([^\`\+\~\!\#\$\%\^\&\*\(\)\|\}\{\=\"\'\！\￥\……\（\）\——]*[\+\~\!\#\$\%\^\&\*\(\)\|\}\{\=\"\'\`\！\?\:\<\>\•\“\”\；\‘\‘\〈\ 〉\￥\……\（\）\——\｛\｝\【\】\\\/\;\：\？\《\》\。\，\、\[\]\,]+.*)$/;
        if(regular.test(name)){
            $(".tips").html("任务名称不能输入特殊字符！");
            $('.taskname').val("");
        }else{
            taskflag=0;
        }
    }
    //设置ajax同步则不会创建任务要点击两次才提示创建成功
    $.ajax({
        type:'post',
        url:path+"/market/checkTaskname",
        data:{projectId:project_id,taskname:name},
        async: false,
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        dataType : "json",//数据类型为jsonp
        success:function(data){

            var datainfo='任务名称';
            data=getState(data,datainfo);

            var isExist=data.isExist;
            if(isExist){
                checkflag=1;
                $(".tips").html("任务名称与已有任务重复！");
            }else {
                checkflag=0;
            }
            isVerification=false;
        }
    });
}


function  createProject(project_id,type,sex,age,area,times,duration,name) {

    var r=confirm("确定要添加吗？");
    if(r==true){
        $.ajax({
            type:'post',
            url:path+"/market/setTask",
            data:{projectId:project_id,type:type,sex:sex,age:age,area:area,times:times,duration:duration,name:name},
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            dataType : "json",//数据类型为jsonp
            success:function(data){

                // var datainfo='任务详情';
                // data=getState(data,datainfo);
                if(data.state=='0'){
                    $(".info").html("");
                    window.location.href="marketManage.html?project_id="+project_id+"";
                }
                isVerification=false;
            }
        });
    }else{
        window.location.href="marketManage.html?project_id="+project_id+"";
    }
}

$("#backtsk").on("click",function(){
    isVerification = true;
    window.location.href="marketManage.html?project_id="+project_id+"";
});




