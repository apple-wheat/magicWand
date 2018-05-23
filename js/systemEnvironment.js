
//默认参数
var UserSave={};
var panelSave = {};
var isBrowser=true;

//筛选条件
document.getElementById('click').addEventListener('click', function () {
    isVerification = true;
    panelSave = {};
    project_id = $("#projectid").val();
    startTime = $('#startTime').val();
    endTime = $('#endTime').val();
    equipmentType = $('input:radio[name="device"]:checked').val();
    browserTypeNum();
    panelResolutionNum();
},false);


$(".brand_total").on("click","li a",function(e){
    //阻止浏览器的默认行为,柱状图不会闪一下
    e.preventDefault();
    isVerification = true;
    var id=$(this).attr("href");
    if(id=='#browserType'){
        $("#pli").removeClass("current").addClass("pancel");
        $(this).removeClass("browser").addClass("current");
        $('#panelResolution').hide();
        $('#browserType').show();
        browserChange();
        isBrowser=true;
    }else{
        $("#bli").removeClass("current").addClass("browser");
        $(this).removeClass("pancel").addClass("current");
        $('#browserType').hide();
        $('#panelResolution').show();
        pancelChange();
        isBrowser=false;
    }
});


$(function(){
    $('#panelResolution').hide();
    browserTypeNum();
    panelResolutionNum();
});

//浏览器类型
function browserTypeNum() {
	channel = $("#channel").val();
    $.ajax({
        type : 'post',
        url : path + "/deviceTypeCount",
        data : {
            projectId : project_id,
            startTime : startTime,
            endTime : endTime,
            channel : channel,
            deviceType : equipmentType
        },
        xhrFields : {
            withCredentials : true
        },
        crossDomain : true,
        success : function(data) {
            var datainfo='浏览器类型';
            data=getState(data,datainfo);
            UserSave = {
                xAxis:[],
                yAxis:[]
            };

            var deviceTypeCount = data.deviceTypeCount;

            if(deviceTypeCount.length>0){
            	for(var i=0;i<deviceTypeCount.length;i++){
                    UserSave.xAxis[i] = deviceTypeCount[i].BROWSER_NAME;
                    UserSave.yAxis[i] = deviceTypeCount[i].COUNT;
                }
            }
            browserChange();
            isVerification = false;
        }

    });
}

//屏幕分辨率
function panelResolutionNum() {
    channel = $("#channel").val();
    $.ajax({
        type : 'post',
        url : path + "/deviceTypePixelCount",
        data : {
            projectId : project_id,
            startTime : startTime,
            endTime : endTime,
            channel : channel,
            deviceType : equipmentType
        },
        xhrFields : {
            withCredentials : true
        },
        crossDomain : true,
        success : function(data) {

            var datainfo='屏幕分辨率';
            data=getState(data,datainfo);
            panelSave = {
                xAxis:[],
                yAxis:[]
            };
            var deviceTypeTotal = data.deviceTypeCount;
            if(deviceTypeTotal.length>0){
                //控制仅显示前10条数据
                var deviceTypeLenth = 10;
                if(deviceTypeTotal.length < 10){
                    deviceTypeLenth = deviceTypeTotal.length;
                }
                for(var i=0;i<deviceTypeLenth;i++){
                    panelSave.yAxis[i] = deviceTypeTotal[i].COUNT;
                    //分辨率第三位截取小数点后两位
                    if(deviceTypeTotal[i].PIXEL.length>13){
                        panelSave.xAxis[i] = deviceTypeTotal[i].PIXEL.substr(0,13);
                    }else{
                        panelSave.xAxis[i] = deviceTypeTotal[i].PIXEL.substr(0,12);
                    }
                }
            }
            if(isBrowser){
                browserChange();
            }else{
                pancelChange();
            }

            isVerification = false;
        }
    });
}

//浏览器类型
function browserChange() {
	var myChart = echarts.init(document.getElementById('browser'));

    //使得每个柱状图上面有气泡显示
    var userSave=[];
    for(var i in UserSave.yAxis){
        userSave.push({
            coord:[parseInt(i),UserSave.yAxis[i]]
        })
    }
	myChart.setOption({
        title:{
            text:'浏览器类型',
            left:'center',
            top:'-4',
            textStyle:{
                color:'#0085ca',
                fontWeight:'normal',
                fontSize:15
            }
        },
        tooltip : {
            trigger : 'axis'
        },
        calculable : true,
        xAxis : [ {
            type : 'category',
            data : UserSave.xAxis,
            axisTick : {
                show : false
            }
        } ],
        yAxis : [ {
            type : 'value',
            axisLine : {
                show : false
            },
            axisTick : {
                show : false
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
                    // type:'dashed'
                }
            }
        } ],
        series : [ {
            name:  'PV',
            type : 'bar',
            data : UserSave.yAxis,
            barWidth : 30,
            itemStyle : {
                normal : {
                    color : '#ffc000',
                    borderColor : '#ffc000',
                }
            },
            markPoint : {
                data:userSave
            }
        } ]
    });
    window.addEventListener("resize",function(){
        myChart.resize();
    });
}
browserChange();

//屏幕分辨率
function pancelChange() {
    var myChart = echarts.init(document.getElementById('pancel'));

    //使得每个柱状图上面有气泡显示
    var panelsave=[];
    for(var i in panelSave.yAxis){
        panelsave.push({
            coord:[parseInt(i),panelSave.yAxis[i]]
        })
    }

    myChart.setOption({
        title:{
            text:'屏幕分辨率',
            left:'center',
            top:'-4',
            textStyle:{
                color:'#0085ca',
                fontWeight:'normal',
                fontSize:15
            }
        },
        tooltip : {
            trigger : 'axis'
        },
        calculable : true,
        xAxis : [ {
            type : 'category',
            data : panelSave.xAxis,
            axisTick : {
                show : false
            }
        } ],
        yAxis : [ {
            type : 'value',
            axisLine : {
                show : false
            },
            axisTick : {
                show : false
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
                    // type:'dashed'
                }
            }
        } ],
        series : [ {
            name:  'PV',
            type : 'bar',
            data : panelSave.yAxis,
            barWidth : 30,
            itemStyle : {
                normal : {
                    color : '#ffc000',
                    borderColor : '#ffc000',
                }
            },
            markPoint : {
               data:panelsave
            }
        } ]
    });

    window.addEventListener("resize",function(){
        myChart.resize();
    });
}












