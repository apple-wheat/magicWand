/**
 * Created by Administrator on 2017/4/24.
 */

//筛选条件
document.getElementById('click').addEventListener('click', function () {
    isVerification = true;
    project_id = $("#projectid").val();
    channel = $("#channel").val();
    equipmentType = $('input:radio[name="device"]:checked').val();
    getData(project_id,startTime,endTime,equipmentType,channel);
},false);


// 请求数据函数
function getData(project_id,startTime,endTime,equipmentType,channel){
    channel= $("#channel").val();
    $.ajax({
        type:'post',
        url:path+"/overview/pageAnalysis",
        data:{project_id:project_id,startTime:startTime,endTime:endTime,equipmentType:equipmentType,channel:channel},
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success:function(data){
            //获取全部数据

            var datainfo='总体指标及页面详情';
            data=getState(data,datainfo);

            var topData=data.topData;
            if(topData) {
                $("#page_num").show();
                $(".page_num-no .data_none").hide();
                var visview= '<thead><tr><th width="15%" title="页面浏览次数">'+'PV'
                    +'</th><th width="15%" title="访问用户数">'+'UV'
                    +'</th><th width="20%" title="访问IP数">'+'独立IP'
                    +'</th><th width="20%" title="">'+"平均停留时间"
                    +'</th><th width="30%" title="">'+"平均浏览页面个数" +'</th></tr></thead><tbody>';
                // var topLenth = 5;
                visview+=
                    '<tr><td width="15%">'+topData.PVcount+'</td>'
                    +'<td width="15%">'+topData.UVcount
                    +'</td><td width="20%">'+topData.IPcount
                    +'</td><td width="20%">'+formatTime(topData.AVGcount)
                    +'</td><td width="30%">'+topData.AVGPage+'个</td></tr></tbody>';
                $("#page_num").html(visview);
            }else{
                $("#page_num").hide();
                $(".page_num-no .data_none").show();
            }


            var bottomTable=data.bottomTable;
            if(bottomTable.length>0) {
                $("#page_url").show();
                $(".page_url-no .data_none").hide();

                var pageview= '<table><thead><tr><th width="10%">'+'页面名称'
                    +'</th><th width="45%">'+'页面URL'
                    +'</th><th width="10%" title="页面浏览次数">'+'PV'
                    +'</th><th width="10%" title="访问用户数">'+'UV'
                    +'</th><th width="10%" title="访问IP数">'+'独立IP'
                    +'</th><th width="15%" title="">'+"平均停留时间" +'</th></tr></thead>';

                var bottomLenth = 5;
                if(bottomTable.length < 5){
                    bottomLenth = bottomTable.length;
                }
                //for(var i=0;i<bottomTable.length;i++){
                for(var i=0;i< bottomLenth;i++){
                    if(bottomTable[i].page_name == ' '){
                        pageview+=
                            '<tbody><tr><a width="10%" class="left">'+'页面'+i
                            +'<td width="45%" class="left" title="'+bottomTable[i].page_url+'"><a href="'+bottomTable[i].page_url+'" target="_blank">'+bottomTable[i].page_url+'</a></td>'
                            +'<td width="10%" class="right">'+bottomTable[i].PV+'</td>'
                            +'<td width="10%" class="right">'+bottomTable[i].UV+'</td>'
                            +'<td width="10%" class="right">'+bottomTable[i].IP+'</td>'
                            +'<td width="15%" class="right">'+formatTime(bottomTable[i].AVG)+'</td></tr>';
                    }else{
                           pageview+=
                               '<tbody><tr><td width="10%" class="left">'+bottomTable[i].page_name
                               +'</td><td width="45%" class="left" title="'+bottomTable[i].page_url+'"><a href="'+bottomTable[i].page_url+'" target="_blank">'+bottomTable[i].page_url
                               +'</a></td><td width="10%" class="right">'+bottomTable[i].PV
                               +'</td><td width="10%" class="right">'+bottomTable[i].UV
                               +'</td><td width="10%" class="right">'+bottomTable[i].IP
                               +'</td><td width="15%" class="right">'+formatTime(bottomTable[i].AVG)+'</td></tr>';
                    }
                }
                pageview+='</tbody>';
                $("#page_url").html(pageview);
                }else{
                $("#page_url").hide();
                $(".page_url-no .data_none").show();
            }
            isVerification=false;
        }
    });
}
getData(project_id,startTime,endTime,equipmentType,channel);















