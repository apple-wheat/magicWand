/**
 * Created by Administrator on 2017/7/16.
 * */

//必须先获取project_id再获取code,否则code的值会被覆盖
function GetQueryID(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
project_id=GetQueryID("project_id");
// console.log('pid: '+project_id);

//传递任务号
function GetQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

// 调用方法
var code=GetQueryString("code");
// console.log('code: '+code);

//获得信息
function updateAfter(project_id,code){
    // console.log('code: '+code);
    // console.log('pid: '+project_id);
    $.ajax({
        type:'post',
        url: path+"/market/getTask",
        data:{projectId:project_id,code:code},
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success:function(data){

            var datainfo='任务详情';
            data=getState(data,datainfo);
            var taskDetails=data.tasks;

            // var areainfo= taskDetails[0].area.substr(0,36) + '...' ;
            var arealen= taskDetails[0].area.length*10.5;

            $("#name").val(taskDetails[0].name);
            $("#userNum").val(taskDetails[0].userNum);

            if(taskDetails[0].type==''){
                $("#type").val('短信，外呼');
            }else if(taskDetails[0].type=='1'){
                $("#type").val('短信');
            }else{
                $("#type").val('外呼');
            }

            if(taskDetails[0].sex==''){
                $("#sex").val('男，女');
            }else if(taskDetails[0].sex=='1'){
                $("#sex").val('男');
            }else{
                $("#sex").val('女');
            }

            $("#age").val(taskDetails[0].age);
            $("#area").val(taskDetails[0].area);
            $("#actionTimes").val(taskDetails[0].actionTimes);
            $("#duration").val(taskDetails[0].duration);

            if(taskDetails[0].area.length>40){
                // $("#area").hide();
                // $("#area_more").show();
                $("#area").width(arealen);
            }
            isVerification=false;
        }
    });
}
updateAfter(project_id,code);


$("#backpro").on("click",function(){
    isVerification = true;
    window.location.href="marketManage.html?project_id="+project_id+"";
});


