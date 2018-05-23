/**
 * Created by Administrator on 2017/7/16.
 */

var channel="";
var type = $("#areaSelect").val();
var typeSelect=['PV','UV','IP','EVENT','USER'];
var areaNewsD={};
var ipcountMax='';

//筛选条件
document.getElementById('click').addEventListener('click', function() {
    isVerification=true;
    project_id = $("#projectid").val();
    equipmentType = $('input:radio[name="device"]:checked').val();
    getAreaTotal(project_id,startTime,endTime,equipmentType,channel);
    getRegionTotal(project_id,startTime,endTime,equipmentType,channel,type);
});

function  createObj(value,name){
    this.value = value;
    this.name= name;
}

//地域PV.UV.IP.新访客总统计
function getAreaTotal(project_id,startTime,endTime,equipmentType,channel) {
    $.ajax({
        type:"post",
        url:path+"/region/basicNum",
        data:{projectId:project_id,startTime:startTime,endTime:endTime,deviceType:equipmentType,channel:channel},
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success:function(data){

            var datainfo='地域分布统计';
            data=getState(data,datainfo);

            var basicNum = data.basicNum;
            if(basicNum){
                $("#pageview").show();
                $(".brand_peos .data_none").hide();

                var pageview= '<thead><th width="25%" title="页面浏览次数">'+'PV'
                    +'</th><th width="25%" title="访问用户数">'+'UV'
                    +'</th><th width="25%" title="访问IP数">'+'独立IP'
                    +'</th><th width="25%" title="">'+"新访客" +'</th></thead>';
                pageview+=
                    '<tbody><tr><td>'+basicNum.pv
                    +'</td><td>'+basicNum.uv+'</td>'
                    +'<td>'+basicNum.countIp+'</td>'
                    +'<td>'+basicNum.newId+'</td></tr></tbody>';
                $("#pageview").html(pageview);
            }else{
                $("#pageview").hide();
                $(".brand_peos .data_none").show();
            }
            isVerification=false;
        }
    })
};
getAreaTotal(project_id,startTime,endTime,equipmentType,channel);

//分地域统计相关信息  和  地域分布地图请求数据函数
function getRegionTotal(project_id,startTime,endTime,equipmentType,channel,type){
    $.ajax({
        type:"post",
        url:path+"/region/getAllAreaInfoNum",
        data:{projectId:project_id,startTime:startTime,endTime:endTime,deviceType:equipmentType,channel:channel},
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success:function(data){

            var datainfo='地域分布地图及表';
            data=getState(data,datainfo);

            areaNewsD={
                data:[],
                type:''
            };
            var areaInfoNum=data.areaInfoNum;
            if(areaInfoNum.length>0){
                $("#area_dis").show();
                $(".brand_total .data_none").hide();

                $("#page_views").show();
                $(".brand_area .data_none").hide();

                var regionNUm = '<thead><th width="15%">'+''
                    +'</th><th width="15%" title="页面浏览次数">'+'PV'
                    +'</th><th width="15%" title="访问用户数">'+'UV'
                    +'</th><th width="15%" title="访问IP数">'+'独立IP'
                    +'</th><th width="15%" title="">'+'新访客'
                    +'</th><th width="15%" title="">'+'平均访问时长' +'</th></thead>';
                var tableLength = 5;
                if(areaInfoNum.length < tableLength){
                    tableLength = areaInfoNum.length;
                }
                for(i=0;i<tableLength;i++){
                    //分地域统计表
                    regionNUm+='<tbody><tr><td>'+areaInfoNum[i].area
                        +'</td><td class="right">'+areaInfoNum[i].pv+'</td>'
                        +'<td class="right">'+areaInfoNum[i].uv+'</td>'
                        +'<td class="right">'+areaInfoNum[i].countIp+'</td>'
                        +'<td class="right">'+areaInfoNum[i].newId+'</td>'
                        +'<td class="right">'+formatTime(areaInfoNum[i].timeAvg)+'</td></tr>';
                }
                var ipcount = [];
                for(var i=0;i<areaInfoNum.length;i++){

                    if(type == 'PV'){
                        //地域统计分布图
                        ipcount.push(areaInfoNum[i].pv);
                        areaNewsD.data.push(new createObj(areaInfoNum[i].pv,areaInfoNum[i].area));
                    }else if(type == 'UV'){
                        ipcount.push(areaInfoNum[i].uv);
                        areaNewsD.data.push(new createObj(areaInfoNum[i].uv,areaInfoNum[i].area));
                    }else if(type == 'IP'){
                        ipcount.push(areaInfoNum[i].countIp);
                        areaNewsD.data.push(new createObj(areaInfoNum[i].countIp,areaInfoNum[i].area));
                    }else if(type == 'USER'){
                        ipcount.push(areaInfoNum[i].newId);
                        areaNewsD.data.push(new createObj(areaInfoNum[i].newId,areaInfoNum[i].area));
                    }else if(type == 'EVENT'){
                        ipcount.push(areaInfoNum[i].timeAvg);
                        areaNewsD.data.push(new createObj(areaInfoNum[i].timeAvg,areaInfoNum[i].area));
                    }
                }
                if (ipcount.length > 0) {
                    ipcountMax = Math.max.apply(null, ipcount);
                    if (ipcountMax > 30000) {
                        ipcountMax = ipcountMax / 100;
                    } else {
                        ipcountMax = ipcountMax;
                    }
                } else {
                    ipcountMax = 1000;
                }
                console.log(ipcountMax);

                regionNUm+='</tbody>';
                $("#page_views").html(regionNUm);

                //获取typename
                for(i=0;i<typeSelect.length;i++){
                    if(type=='PV'){
                        areaNewsD.type='页面访问次数';
                    }else if(type=='UV'){
                        areaNewsD.type='访问用户数';
                    }else if(type=='IP'){
                        areaNewsD.type='访问IP数';
                    }else if(type=='EVENT'){
                        areaNewsD.type='平均访问时长';
                    }else{
                        areaNewsD.type='新增用户数';
                    }
                }

            }else{
                $("#area_dis").hide();
                $(".brand_total .data_none").show();

                $("#page_views").hide();
                $(".brand_area .data_none").show();
            }
            AreaNews();
            isVerification=false;
        }
    });
};
getRegionTotal(project_id,startTime,endTime,equipmentType,channel,type);


$("#areaSelect").change(function () {
    isVerification = true;
    type = $(this).val();
    getRegionTotal(project_id,startTime,endTime,equipmentType,channel,type);
    if(type=='PV'){
        $('.area_y').html("展示指标：页面访问次数（单位：次）");
    }else if(type=='UV'){
        $('.area_y').html("展示指标：访问用户数（单位：人）");
    }else if(type=='IP'){
        $('.area_y').html("展示指标：访问IP数（单位：个）");
    }else if(type=='EVENT'){
        $('.area_y').html("展示指标：平均访问时长（单位：秒）");
    }else{
        $('.area_y').html("展示指标：新增用户数（单位：人）");
    }
});

//地域分布地图
function AreaNews(){
    var myChart = echarts.init(document.getElementById("area_dis"));
    myChart.resize();
    var option = {
        tooltip : {
            trigger: 'item'
        },
        dataRange: {
            min: 0,
            max: ipcountMax,
            x: 'left',
            y: 'bottom',
            text:['高','低'],           // 文本，默认为数值文本
            // calculable : true,
            left:10,
            inRange: {
                color: ['#b4e2fa', '#7fc7eb', '#59b3e2', '#2899d5','#0487cb']
            }
        },
        roamController: {
            show: true,
            x: 'right',
            mapTypeControl: {
                'china': true
            }
        },
        series : [
            {
                name: areaNewsD.type,
                type: 'map',
                mapType: 'china',
                roam: false,
                itemStyle:{
                    //当前不显示地域名
                    normal:{
                        label: {
                            show:false
                        }
                    },
                    //鼠标移上显示地域名
                    emphasis:{
                        label:{
                            show:true
                        }
                    }
                },
                data: areaNewsD.data
            }
        ]
    };

    myChart.setOption(option);
    window.addEventListener("resize",function(){
        myChart.resize();
    });
};

