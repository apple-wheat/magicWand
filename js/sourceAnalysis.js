/**
 * Created by Administrator on 2017/4/24.
 */

var selectRefer=$('input:radio[name="circular"]:checked').val();
var selectType = $("#selectType").val();

//筛选条件
document.getElementById('click').addEventListener('click', function () {
    isVerification = true;
    project_id = $("#projectid").val();
    // console.log(project_id);
	equipmentType = $('input:radio[name="device"]:checked').val();
    getSarea(project_id,startTime,endTime,equipmentType,selectType,selectRefer);
	getData(project_id,startTime,endTime,equipmentType,selectType,selectRefer);
	bottomTable(project_id,startTime,endTime,equipmentType,selectRefer);
},false);


//趋势图、饼图
var BTContentD ={};
var volumePerD={};

function  createObj(value,name){
    this.value = value;
    this.name= name;
}

//折线图使用的时间描点
function  createObj2(data,name){
    this.data = data;
    this.type = "line";
    this.name= name;
    this.smooth = false;
    this.symbol='circle';
    this.symbolSize = 3;
    this.showSymbol = false;
    this.lineStyle={
        normal: {
            width: 2
        }
    };
    this.itemStyle = {
        normal: {
            borderWidth: 12,
        }
    };
}

//饼图请求数据函数
function getSarea(project_id,startTime,endTime,equipmentType,selectType,selectRefer){
	$.ajax({
        type:'post',
        url:path+"/overview/referAnalysis",
        data:{project_id:project_id,startTime:startTime,endTime:endTime,equipmentType:equipmentType,selectType:selectType,selectRefer:selectRefer},
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success:function(data){

            // console.log(data);

            var datainfo='来源类型';
            data=getState(data,datainfo);
            volumePerD={
                legend:[],
                data:[]
            };

            //获取饼图数据
            var CircularAndTable=data.circularData;
            if(CircularAndTable.length>0){
                $(".source .data_none").hide();
                $("#volume_per").show();

                var circularLenth = 5;
                if(CircularAndTable.length < 5){
                	circularLenth = CircularAndTable.length;
                }
                //for(var i=0;i<CircularAndTable.length;i++){
                for(var i=0;i<circularLenth;i++){
                    if(CircularAndTable[i].refer ==''){
                    	volumePerD.legend[i]='直接访问';
                        volumePerD.data.push(new createObj(CircularAndTable[i].count,'直接访问'));
                    }else{
                    	volumePerD.legend[i]=CircularAndTable[i].refer;
                        volumePerD.data.push(new createObj(CircularAndTable[i].count,CircularAndTable[i].refer));
                    }
                }
            }else{
                $("#volume_per").hide();
                $(".source .data_none").show();
            }
            volumePer();
            isVerification = false;
        }
    });
}
getSarea(project_id,startTime,endTime,equipmentType,selectType,selectRefer);

//趋势图请求数据函数
function getData(project_id,startTime,endTime,equipmentType,selectType,selectRefer){
	$.ajax({
        type:'post',
        url:path+"/overview/referLine",
        data:{project_id:project_id,startTime:startTime,endTime:endTime,equipmentType:equipmentType,selectType:selectType,selectRefer:selectRefer},
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success:function(data){

            var datainfo='变化趋势';
            data=getState(data,datainfo);
            //初始化
            BTContentD ={
                xAxis:[],
                yAxis:[],
                series:[]
            };
            //趋势图数据
            var lineData=data.LineData;
            if(lineData) {
                $(".brand_total .data_none").hide();
                $("#volume-content").show();

                var lineLenth = 5;
                if(lineData.length < 5){
                	lineLenth = lineData.length;
                }
                //for(var i=0;i<lineData.length;i++){
                for(var i=0;i<lineLenth;i++){
                    BTContentD.yAxis[i]=new Array();
                    var countList=lineData[i].list;
                    for(var j=0;j<countList.length;j++){
                        BTContentD.xAxis[j]=countList[j].create_time;
                    	BTContentD.yAxis[i][j]=countList[j].count;
                    }
                }
                for(var i=0;i<BTContentD.yAxis.length;i++){
                    if(lineData[i].refer == ' ' || lineData[i].refer == ''){
                    	BTContentD.series[BTContentD.series.length]=new createObj2(BTContentD.yAxis[i],'直接访问');
                    }else{
                    	BTContentD.series[BTContentD.series.length]=new createObj2(BTContentD.yAxis[i],lineData[i].refer);
                    }
        		}
            }else{
                $("#volume-content").hide();
                 $(".brand_total .data_none").show();
            }
            brandChange();
            isVerification = false;
        }
    });
}
getData(project_id,startTime,endTime,equipmentType,selectType,selectRefer);

//获取底部表数据
function bottomTable(project_id,startTime,endTime,equipmentType,selectRefer) {
	$.ajax({
        type:'post',
        url:path+"/overview/refers",
        data:{project_id:project_id,startTime:startTime,endTime:endTime,equipmentType:equipmentType,selectRefer:selectRefer},
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success:function(data){

            var datainfo='指标详情';
            data=getState(data,datainfo);

            var tableData=data.TableData;
            if(tableData.length>0) {
                $("#page_views").show();
                $(".soutype .data_none").hide();
                var visview= '<table><thead><tr><th width="20%">'+''
                    +'</th><th width="16%" title="页面浏览次数">'+'PV'
                    +'</th><th width="16%" title="访问用户数">'+'UV'
                    +'</th><th width="16%" title="访问IP数">'+'IP'
                    +'</th><th width="16%" >'+'平均访问时长'
                    +'</th><th width="16%" >'+'新访客'
                    +'</th></tr></thead>';
                var tableLenth = 5;
                if(tableData.length < 5){
                	tableLenth = tableData.length;
                }
                //for(var i=0;i< tableData.length;i++){
                for(var i=0;i< tableLenth;i++){
                	if(tableData[i].refer == ''){
                		visview+=
                            '<tbody><tr><td width="20%" class="left">直接访问'
                            +'</td><td width="16%" class="right">'+tableData[i].PV+'</td>'
                            +'<td width="16%" class="right">'+tableData[i].UV+'</td>'
                            +'<td width="16%" class="right">'+tableData[i].IP+'</td>'
                            +'<td width="16%" class="right">'+formatTime(tableData[i].AVG)+'</td>'
                            +'<td width="16%" class="right">'+tableData[i].NEW+'</td></tr>';
                	}else{
                		visview+=
                            '<tbody><tr><td width="20%" class="left">'+tableData[i].refer
                            +'</td><td width="16%" class="right">'+tableData[i].PV+'</td>'
                            +'<td width="16%" class="right">'+tableData[i].UV+'</td>'
                            +'<td width="16%" class="right">'+tableData[i].IP+'</td>'
                            +'<td width="16%" class="right">'+formatTime(tableData[i].AVG)+'</td>'
                            +'<td width="16%" class="right">'+tableData[i].NEW+'</td></tr>';
                	}
                	
                 }
                visview+='</tbody></table>';
                $("#page_views").html(visview);
            }else{
                $("#page_views").hide();
                $(".soutype .data_none").show();
            }
            isVerification = false;
        }
    });
}
bottomTable(project_id,startTime,endTime,equipmentType,selectRefer);

//饼图
function volumePer(){
    var data=volumePerD.data;
    var myChart = echarts.init(document.getElementById('volume_per'));
    myChart.resize();
    myChart.setOption({
        backgroundColor: '#fff',
        tooltip: {
            show: true,
            trigger: 'item',
            formatter: "{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            itemWidth:8,
            itemHeight:8,
            itemGap:5,
            right:10,
            bottom: '20',
            itemWidth:10,
            itemHeight:10,
            data: volumePerD.legend,
        },
        series: [{
        	type: 'pie',
            radius: ['50%', '70%'],
            center:['45%','57%'],  //调整位置
            color: ['#ffc000','#31d079', '#2ffffd','#ecdf20','#0085ca'],
            data: data
        }
        ],
    });
    window.addEventListener("resize",function(){
        myChart.resize();
    });
}

//趋势图
function brandChange(){
    var myChart = echarts.init(document.getElementById('volume-content'));
    myChart.resize();
    myChart.setOption({
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
            left: '2%',
            right:'6%',
            bottom: '0',
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
    });
    window.addEventListener("resize",function(){
        myChart.resize();
    });
}

//饼图参数切换
$("#source").on("change",function() {
    isVerification = true;
    selectType = $(this).val();
    getSarea(project_id,startTime,endTime,equipmentType,selectType,selectRefer);
    if( selectType=='PV'){
        $('.source_1').html("展示指标：页面访问次数（单位：次）");
    }else if( selectType=='UV'){
        $('.source_1').html("展示指标：访问用户数目（单位：人）");
    }else if( selectType=='IP'){
        $('.source_1').html("展示指标：访问独立IP数（单位：个）");
    }else{
        $('.source_1').html("展示指标：该时段新访客（单位：人）");
    }
});

$(":radio[name='circular']").click(function(){
    isVerification = true;
	selectRefer=$('input:radio[name="circular"]:checked').val();
	getSarea(project_id,startTime,endTime,equipmentType,selectType,selectRefer);
});

//趋势图参数切换
$("#selectType").on("change",function() {
    isVerification = true;
    selectType = $(this).val();
    getData(project_id,startTime,endTime,equipmentType,selectType,selectRefer);
    if( selectType=='PV'){
        $('.source_2').html("纵轴指标：页面访问次数（单位：次）");
    }else if( selectType=='UV'){
        $('.source_2').html("纵轴指标：访问用户数目（单位：人）");
    }else if( selectType=='IP'){
        $('.source_2').html("纵轴指标：访问独立IP数（单位：个）");
    }else{
        $('.source_2').html("纵轴指标：该时段新访客（单位：人）");
    }
});

$(":radio[name='trend']").click(function(){
    isVerification = true;
	selectRefer=$('input:radio[name="trend"]:checked').val();
	getData(project_id,startTime,endTime,equipmentType,selectType,selectRefer);
});

//表格参数切换
$(".soutype #selectRefer").on("change",function() {
    isVerification = true;
	selectRefer = $(this).val();
	bottomTable(project_id,startTime,endTime,equipmentType,selectRefer);
});

