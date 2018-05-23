/**
 * Created by Administrator on 2017/4/24.
 */

//默认参数

var eventId = $("#AllEventName").val();
var ipcountMax='';

//筛选条件
document.getElementById('click').addEventListener('click', function(){
    isVerification = true;
    project_id = $("#projectid").val();
    equipmentType = $('input:radio[name="device"]:checked').val();
    getEventTotal(startTime,endTime,equipmentType,project_id);
},false);

var areaNewsD={};
var BTContentD={};

function  createObj(value,name){
    this.value = value;
    this.name= name;
}

function createEventInfo(x,y){
    this.eventId=x;
    this.eventName=y;
}

function creEventObj(name,data){
    this.name=name;
    this.type="line";
    this.data=data;
}

var event_ids =[];
var lineEventName='';
var eventID;

//获取事件统计信息
function getEventTotal(startTime,endTime,equipmentType,project_id){
    $("#AllEventName").html('');
    event_ids = [];
	//事件统计列表
	$.ajax({
		type:"post",
		url:path + "/eventAnalysisPage",
		async: true,
		data:{startTime:startTime,endTime:endTime,deviceType:equipmentType,projectId:project_id},
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success:function(data){

            var datainfo='事件统计列表';
            data=getState(data,datainfo);

        	var eventInfo = data.eventInfo;
        	if(eventInfo!=null){
                $("#event_display").show();
                $(".brand_page .data_none").hide();

                 var eventView= '';
                 for(var i=0;i< eventInfo.length;i++){

                     if(eventInfo[i].event_id==eventId){
                     	eventView+= '<option selected value="'+eventInfo[i].event_id+'">'+eventInfo[i].event_name+'</option>';
                     }else{
                     	eventView+= '<option value="'+eventInfo[i].event_id+'">'+eventInfo[i].event_name+'</option>';
                     }

                 }
                 $("#AllEventName").html(eventView);

        		//冒泡排序  从大到小
            	for(var i=1;i<eventInfo.length;i++){
            		for(var j=0;j<eventInfo.length-i;j++){
            			if(eventInfo[j].eventCount<eventInfo[j+1].eventCount){
            				var t = eventInfo[j];
            				eventInfo[j] = eventInfo[j+1];
            				eventInfo[j+1] = t;
            			}
            		}
            	}

                var pageview= '<thead><th width="55%">'+'事件名称'
                	+'</th><th width="15%">'+'触发次数'
                    +'</th><th width="15%">'+'触发人数'
                    +'</th><th width="15%">'+"触发率" +'</th></thead><tbody>';

                var tableLength = 5;
                if(eventInfo.length < 5){
                    tableLength = eventInfo.length;
                }

                for(var i=0;i< tableLength;i++){
                    //小数改为百分数，tofixed(2)保存两位小数
//                    var str=Number(eventInfo[i].pv_percent*100).toFixed(2);
                    if(i==0){
                        pageview+=
                            '<tr><td>&emsp;<input type="checkbox" id="checkSome" onchange="getSelected();" checked name="'+eventInfo[i].event_name+'" value="'+eventInfo[i].event_id+'"/>&emsp;'
                            +eventInfo[i].event_name+'</td>'
                            +'<td class="right">'+eventInfo[i].eventCount+'</td>'
                            +'<td class="right">'+eventInfo[i].triggerCount+'</td>'
                            +'<td class="right">'+eventInfo[i].triggerPercentage+'%</td></tr>';
                        eventID=new createEventInfo(eventInfo[i].event_id,eventInfo[i].event_name);
                    }else{
                        pageview+=
                            '<tr><td>&emsp;<input type="checkbox" id="checkSome" onchange="getSelected();" name="'+eventInfo[i].event_name+'" value="'+eventInfo[i].event_id+'"/>&emsp;'
                            +eventInfo[i].event_name+'</td>'
                            +'<td class="right">'+eventInfo[i].eventCount+'</td>'
                            +'<td class="right">'+eventInfo[i].triggerCount+'</td>'
                            +'<td class="right">'+eventInfo[i].triggerPercentage+'%</td></tr>';
                    }

                }
                pageview+='</tbody>';
                $("#event_display").html(pageview);

                $('input[type="checkbox"]:checked').each(function () {
                    event_ids.push(eventID);
                });
        	}else{
        	    $("#event_display").hide();
        	    $(".brand_page .data_none").show();
            }
            getEventTrend(startTime,endTime,equipmentType,project_id,event_ids);
            // getSelected();
            getArea(startTime,endTime,equipmentType,project_id,eventId);
            isVerification=false;
        }
	});
};
getEventTotal(startTime,endTime,equipmentType,project_id);

//绘制事件趋势图
function getEventTrend(startTime,endTime,equipmentType,project_id,event_ids) {
    if(event_ids!=''){
        $.ajax({
            type:'post',
            url:path+"/eventAnalysisPage1",
            data:{startTime:startTime,endTime:endTime,deviceType:equipmentType,projectId:project_id,eventId:JSON.stringify(event_ids)},
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success:function(data){

                BTContentD={
                    xAxis:[],
                    yAxisArr:[],
                    series:[]

                };

                if(data.state==1){
                    data=data;
                }else{
                    var datainfo='事件趋势';
                    data=getState(data,datainfo);
                }

                if(data.length>0){

                    $("#page_display").show();
                    $(".brand_event .data_none").hide();

                    if(data.length>5){
                        alert("最多只显示5条数据，请取消勾选多余的事件");
                        return;
                    }

                    for(var i=0;i<data.length;i++){
                        BTContentD.yAxisArr[i]=new Array();
                        lineEventName = data[i].eventName;

                        var eventCountList =data[i].eventCountList;

                        for(var j=0;j<eventCountList.length;j++){
                            var count = eventCountList[j].COUNT;
                            var create_time = eventCountList[j].CREATE_TIME;
                            BTContentD.xAxis[j]=create_time;
                            BTContentD.yAxisArr[i][j]=count;
                        }
                    }

                    var seriesLen=BTContentD.yAxisArr.length;

                    if(seriesLen>0){
                        for(var i=0;i<seriesLen;i++){
                            if(BTContentD.series[BTContentD.series.length]){
                                BTContentD.series[BTContentD.series.length]=[];
                            }else{
                                BTContentD.series[BTContentD.series.length]=new creEventObj(data[i].eventName,BTContentD.yAxisArr[i]);
                            }
                        }
                        // console.log(BTContentD.series);
                        eventChange();
                        isVerification=false;
                    }
                }else{
                    $("#page_display").hide();
                    $(".brand_event .data_none").show();
                }


            }
        });
    }
};

//复选框选中绘图
function getSelected(){

    if($('input[type="checkbox"]:checked').length>5){
        alert("最多只允许选择5个事件");
        event.srcElement.checked=false;
        return;
    }
    event_ids=[];
    $('input[type="checkbox"]:checked').each(function () {

        var event_id=$(this).val();
        var name = $(this).attr("name");
        eventID=new createEventInfo(event_id,name);
        event_ids.push(eventID);
    });

    if(event_ids.length==1){
        $('input[type="checkbox"]:checked').attr('disabled', 'disabled');
    }else if(event_ids.length==2){
        $('input[type="checkbox"]:checked').removeAttr('disabled');
    }

    getEventTrend(startTime,endTime,equipmentType,project_id,event_ids);

};


//触发用户分布请求数据函数
function getArea(startTime,endTime,equipmentType,project_id,eventId){
    eventId = $("#AllEventName").val();
    $.ajax({
        type:'post',
        url:path+"/eventAreaNum",
        data:{startTime:startTime,endTime:endTime,deviceType:equipmentType,projectId:project_id,eventId:eventId},
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success:function(data){

            areaNewsD={
                data:[],
                dataMax:0
            };

            var datainfo='触发用户分布';
            data=getState(data,datainfo);

            //地域分布
            var ipAreaData=data.areaNum;

            if(ipAreaData){
                $("#area_dis").show();
                $(".area .data_none").hide();
                var ipcount = [];
                for(var i=0;i< ipAreaData.length;i++){
                    ipcount.push(ipAreaData[i].COUNT);
                    areaNewsD.data.push(new createObj(ipAreaData[i].COUNT,ipAreaData[i].AREA));
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
            }else{
                $("#area_dis").hide();
                $(".area .data_none").show();
            }
            AreaNews();
            isVerification=false;
        }
    });
}

//事件切换
$('#AllEventName').on('change',function () {
    isVerification = true;
    var event_id = $(this).val();
    getArea(startTime,endTime,equipmentType,project_id,event_id);
});

//事件折线图
function eventChange(){

    var myChart = echarts.init(document.getElementById('page_display'));
    //刷新重新初始化，避免之前的最后一条数据遗留
    myChart.clear();
    //反选不消失，多次调用option，添加setOption的第二个参数true【避免差异合并】
    myChart.setOption(
        {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line',
                lineStyle: {
                    color: '#57617B'
                }
            }
        },
        grid: {
            //控制折线图的大小
            top:"10",
            left: '3%',
            right:'6%',
            bottom: '8',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisTick: {
                show: false
            },
            data: BTContentD.xAxis
        }],
        yAxis: [{
            type: 'value',
            axisTick: {
                show: false
            },
            axisLine: {
                show:false
            },
            axisLabel: {
                margin: 2,
                textStyle: {
                    fontSize: 12,
                    color:'#0085ca'
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#d2e9f6',
                }
            }
        }],
        series: BTContentD.series
    },true);

    window.addEventListener("resize",function(){
        myChart.resize();
    });
};

//触发用户分布地图
function AreaNews(){
    var myChart = echarts.init(document.getElementById("area_dis"));
    var option = {
        tooltip : {
            trigger: 'item'
        },
        dataRange: {
            min: 0,
            max: ipcountMax,
            x: 'left',
            y: 'center',
            text:['高','低'],           // 文本，默认为数值文本
            // calculable : true,
            //控制左侧栏边距
            left:20,
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
                name: 'PV',
                type: 'map',
                mapType: 'china',
                roam: false,
                layoutCenter:['50%','50%'],
                layoutSize: 500,
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
}


















