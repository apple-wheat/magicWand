/**
 * Created by Administrator on 2017/3/22 0022.
 */

equipmentType = $('input:radio[name="device"]:checked').val();


//格式化秒为   HH:mm:dd格式
function formatTime(time){
    var hh;
    var mm;
    var ss;
    //传入的时间为空或小于0
    if(time==null||time<0){
        return;
    }
    //得到小时
    hh=time/3600|0;
    time=parseInt(time)-hh*3600;
    if(parseInt(hh)<10){
        hh="0"+hh;
    }
    //得到分
    mm=time/60|0;
    //得到秒
    ss=parseInt(time)-mm*60;
    if(parseInt(mm)<10){
        mm="0"+mm;
    }
    if(ss<10){
        ss="0"+ss;
    }
    return hh+":"+mm+":"+ss;
}

// 不同页面之间传递参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)
        return  unescape(r[2]);
    return null;
}
// console.log(project_id);

//获得当前权限下的项目
$.ajax({
    type:"post",
    url:pathLogin,
    xhrFields: {
        withCredentials: true
    },
    async: false,
    crossDomain: true,
    success:function(data){

        //异步请求导致页面不能完整展示
        isVerification = true;
        var datainfo='项目选择';
        data=getState(data,datainfo);

        var allProjectID=data.allProjectID;
        var projectview= '';

        if(GetQueryString("project_id")==null){
            project_id=allProjectID[0].project_id;
            for(var i=0;i< allProjectID.length;i++){
                if(i==0){
                    projectview+= '<option selected value="'+allProjectID[0].project_id+'">'+allProjectID[0].project_name+'</option>';
                }else {
                    projectview+= '<option value="'+allProjectID[i].project_id+'">'+allProjectID[i].project_name+'</option>';
                }
            }
        }else{
            project_id=GetQueryString("project_id");
            for(var i=0;i< allProjectID.length;i++){
                if(allProjectID[i].project_id==project_id){
                    projectview+= '<option selected value="'+project_id+'">'+allProjectID[i].project_name+'</option>';
                }else {
                    projectview+= '<option value="'+allProjectID[i].project_id+'">'+allProjectID[i].project_name+'</option>';
                }
            }
        }
        // console.log(project_id);
        $("#projectid").html(projectview);

        //或者写回调函数强制函数在接收id之后再执行
    },
    error:function(){
        showAlert=false;
        window.parent.location.href=loginUrl;
        return;
    }

});

//获取渠道
function getChannel(project_id) {
    $.ajax({
        type: 'post',
        url: path + "/overview/allReferID",
        data: { project_id: project_id },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {

            var datainfo = '来源渠道';
            data = getState(data, datainfo);
            var channelview = '<option value="">全部</option>';
            for (var i = 0; i < data.length; i++) {
                channelview += '<option value="' + data[i].channel + '">' + data[i].channel + '</option>';
            }
            $("#channel").html(channelview);
        }
    });
}

getChannel(project_id);
var channel = '';
if (document.getElementById('projectid')){
    document.getElementById('projectid').addEventListener('change', function () {
        isVerification = true;
        project_id = $("#projectid").val();
        getChannel(project_id);
    }, false);
}

