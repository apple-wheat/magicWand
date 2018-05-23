/**
 * Created by Administrator on 2017/4/24.
 */

var channel='';
var deviceType='';
var areaNewsD={};
var visitorSave={};
var UTContentD={};
var ipcountMax='';

function createObj(value, name) {
    this.value = value;
    this.name = name;
}

areaAction();
timeAction();
periodAction();

document.getElementById('click').addEventListener('click', function () {
    isVerification = true;
    project_id = $("#projectid").val();
    startTime = $('#startTime').val();
    endTime = $('#endTime').val();
    areaAction();
    timeAction();
    periodAction();
},false);

$('#project_id').on("change",function () {
    project_id=$('#project_id').data('id');
    getChannel(project_id);
});


function areaAction() {
    channel = $("#channel").val();
    $.ajax({
        type : 'post',
        url : path + "/user/userAreaNum",
        data : {projectId : project_id, startTime : startTime, endTime : endTime, channel : channel, deviceType : deviceType},
        xhrFields : {
            withCredentials : true
        },
        crossDomain : true,
        success : function(data) {
            var datainfo='用户地域分布';
            data=getState(data,datainfo);

            areaNewsD = {
                data : [],
            };
            var ipAreaData = data;
            if (ipAreaData) {
                $("#area_dis").show();
                $(".area .data_none").hide();
                var ipcount = [];
                for (var i = 0; i < ipAreaData.length; i++) {
                    ipcount.push(ipAreaData[i].count);
                    areaNewsD.data.push(new createObj(ipAreaData[i].count,
                        ipAreaData[i].area));
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
            } else {
                $("#area_dis").hide();
                $(".area .data_none").show();
            }
            AreaNews();
            isVerification = false;
        }
    });
}

function timeAction() {
    channel = $("#channel").val();
    $.ajax({
        type : 'post',
        url : path + "/user/userVisitTime",
        data : {projectId : project_id, startTime : startTime, endTime : endTime, channel : channel, deviceType : deviceType},
        xhrFields : {
            withCredentials : true
        },
        crossDomain : true,
        success : function(data) {

            var datainfo='访问次数分布';
            data=getState(data,datainfo);

            visitorSave = {
                xAxis:[],
                yAxis:[]
            };

            var visitorTotal = data;
            if(visitorTotal){
                $("#visitor").show();
                $(".visit .data_none").hide();
                visitorSave.yAxis[0] = visitorTotal.one;
                visitorSave.yAxis[1] = visitorTotal.two;
                visitorSave.yAxis[2] = visitorTotal.four;
                visitorSave.yAxis[3] = visitorTotal.ten;
            }else{
                $("#visitor").hide();
                $(".visit .data_none").show();
            }
            visitorChange();
            isVerification = false;
        }
    });
}

//使用时段分布数据请求函数
function periodAction() {
    channel = $("#channel").val();
    $.ajax({
        type : 'post',
        url : path + "/user/userUserPeriod",
        data : {
            projectId : project_id,
            startTime : startTime,
            endTime : endTime,
            channel : channel,
            deviceType : deviceType
        },
        xhrFields : {
            withCredentials : true
        },
        crossDomain : true,
        success : function(data) {

            var datainfo='使用时段分布';
            data=getState(data,datainfo);

            UTContentD = {
                xAxis : [],
                yAxis : []
            };
            // 使用时段分布
            var timeIntervalData = data;

            if (timeIntervalData.length>0) {
                $("#usertime").show();
                $(".brand_total .data_none").hide();

                for (var i = 0; i < timeIntervalData.length; i++) {
                    UTContentD.xAxis[i] = (timeIntervalData[i].date+'时'); // 横轴时间
                    UTContentD.yAxis[i] = timeIntervalData[i].num;
                }
            } else {
                $("#usertime").hide();
                $(".brand_total .data_none").show();
            }
            timeChange();
            isVerification = false;
        }
    });
}

// 地域分布
function AreaNews() {
    var myChart = echarts.init(document.getElementById("area_dis"));
    option = {
        tooltip : {
            trigger : 'item'
        },
        dataRange : {
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
        roamController : {
            show : true,
            x : 'right',
            mapTypeControl : {
                'china' : true
            }
        },
        series : [ {
            name : 'PV',
            type : 'map',
            mapType : 'china',
            roam : false,
            itemStyle : {
                // 当前不显示地域名
                normal : {
                    label : {
                        show : false
                    }
                },
                // 鼠标移上显示地域名
                emphasis : {
                    label : {
                        show : true
                    }
                }
            },
            data : areaNewsD.data
        } ]
    };

    myChart.setOption(option);
    window.addEventListener("resize",function(){
        myChart.resize();
    });
}

//访问次数分布
function visitorChange() {
    var myChart = echarts.init(document.getElementById('visitor'));

    //使得每个柱状图上面有气泡显示
    var visistorSave=[];
    for(var i in visitorSave.yAxis){
        visistorSave.push({
            coord:[parseInt(i),visitorSave.yAxis[i]]
        })
    }

    myChart.setOption({
        tooltip : {
            trigger : 'axis'
        },
        calculable : true,
        xAxis : [ {
            type : 'category',
            data : [ '1次', '2-3次', '4-10次', '10次以上' ],
            axisTick : {show : false}
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
                }
            }
        } ],
        series : [ {
            name:'访问用户数',
            type : 'bar',
            data : visitorSave.yAxis,
            barWidth : 30,
            itemStyle : {
                normal : {
                    // label : {
                    //     show : true,
                    //     position : 'top',
                    //     textStyle : {
                    //         color: '#ffc000'
                    //     }
                    // },
                    color : '#ffc000',
                    borderColor : '#ffc000',
                }
            },
            markPoint : {
                data : visistorSave
            }
        } ]
    });
    window.addEventListener("resize",function(){
        myChart.resize();
    });
}


// 使用时段分析
function timeChange() {
    var myChart = echarts.init(document.getElementById('usertime'));
    myChart.setOption({
        tooltip : {
            trigger : 'axis',
            axisPointer : {
                type : 'line',
                lineStyle : {
                    color : '#57617B'
                }
            }
        },
        grid : {
            // 控制折线图的大小
            top : "10",
            left: '2%',
            right:'3%',
            bottom: '0',
            containLabel : true
        },
        xAxis : [ {
            type : 'category',
            boundaryGap : false,
            axisTick : {
                show : false
            },
            // data: ['2月1日','2月7日','2月13日','2月19日','2月26日','2月31日'],
            data : UTContentD.xAxis
        } ],
        yAxis : [ {
            type : 'value',
            axisTick : {
                show : false
            },
            axisLine : {
                show : false
            },
            axisLabel : {
                margin : 2,
                textStyle : {
                    fontSize : 12,
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
            name : '平均UV',
            type : 'line',
            smooth : false,
            symbol : 'circle',
            symbolSize : 7,
            showSymbol : false,
            lineStyle : {
                normal : {
                    width : 2
                }
            },
            lineStyle: {
                normal: {
                    width: 2,
                    color:'#0085ca',
                }
            },
            itemStyle: {
                normal: {
                    color: '#ffc000',
                    borderColor: '#ffecb2'
                }
            },
            areaStyle: {normal: {
                color:'#daf8ff',
            }},
            // data:[12000, 13200, 10100, 13400, 9000, 23000, 20000,30000]
            data : UTContentD.yAxis,
        }, ]
    });
    window.addEventListener("resize",function(){
        myChart.resize();
    });
}


