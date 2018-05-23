/**
 * Created by Administrator on 2017/4/24.
 */

//默认参数
var pageVisitSelect="other";
var pageTypeSelect="PV";
var referUrlSelect="week";
var referTypeSelect="REFER"
var ipAreaSelect="week";
var timeIntervalSelect="day";
var type=['PV','UV','IP','AVG','NEW'];
var BTContentD ={};
var UTContentD ={};
var volumePerD={};
var areaNewsD={};
var ipcountMax = '';

// 不同页面之间传递参数
function GetQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)
        return  unescape(r[2]);
    return null;
}

if(GetQueryString("project_id")!=null){
    project_id=GetQueryString("project_id");
}

//监测网址是否合格
var strRegex="^((https|http|ftp|rtsp|mms)?://)"
    + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" // ftp的user@
    + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
    + "|" // 允许IP和DOMAIN（域名）
    + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
    + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
    + "[a-z]{2,6})" // first level domain- .com or .museum
    + "(:[0-9]{1,4})?" // 端口- :80
    + "((/?)|" // a slash isn't required if there is no file name
    + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";

var re=new RegExp(strRegex);

function  createObj(value,name){
    this.value = value;
this.name= name;
}

//时间转换
function infoDate(date){
    var month = date.getMonth() + 1; //月
    var strDate = date.getDate();    //日
    return month + "月" + strDate +"日";
}

// 请求数据函数
function getData(){
    currentVistors(project_id);
    getTrend(pageVisitSelect,pageTypeSelect,project_id);
    getTime(project_id);
    getArea(ipAreaSelect,project_id);
    getSource(referUrlSelect,referTypeSelect,project_id);
    getPage(project_id);
    getEvent(project_id);
}
getData();


//今日流量请求数据函数
function currentVistors(project_id) {
    $.ajax({
        type:'post',
        dataType: "json",
        url:path+"/overview/redisData",
        data:{project_id:project_id},
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success:function(data){

            var datainfo='今日流量';
            data=getState(data,datainfo);
            // 当前访问人数
            var redisData=data;
            if(redisData!='') {
            	$("#page_views").show();
                $(".brand_news .data_none").hide();

                var visview= '<table><thead><tr><th width="10%">'+''
                    +'</th><th width="10%" title="页面浏览次数">'+'PV'
                    +'</th><th width="10%" title="访问用户数">'+'UV'
                    +'</th><th width="10%" title="访问IP数">'+'独立IP'
                    +'</th><th width="10%">'+'平均停留时间'
                    +'</th><th width="10%">'+'新增用户数'
                    +'</th><th width="10%" title="本日访问用户次日访问比率">'+"次日留存率" +'</th></tr></thead>';
                // for(var i=0;i< redisData.length;i++){
                visview+=
                    '<tbody><tr><td width="10%">'+'今日'
                    +'</td><td width="10%" class="right">'+redisData.todayData.PVCountToday+'<b class="pvtoday"></b></td>'
                    +'<td width="10%" class="right">'+redisData.todayData.UVCountToday+'<b class="uvtoday"></b></td>'
                    +'<td width="10%" class="right">'+redisData.todayData.IPCountToday+'<b class="iptoday"></b></td>'
                    +'<td width="10%" class="right">'+formatTime(redisData.todayData.AverageTimeToday)+'<b class="avgtoday"></b></td>'
                    +'<td width="10%" class="right">'+redisData.todayData.NewUserNumToday+'</td>'
                    +'<td width="10%" class="right">-</td></tr>'
                    +'<tr><td width="10%">'+'昨日'
                    +'</td><td width="10%" class="right">'+redisData.yesterdayData.PVCountYesterday+'</td>'
                    +'<td width="10%" class="right">'+redisData.yesterdayData.UVCountYesterday+'</td>'
                    +'<td width="10%" class="right">'+redisData.yesterdayData.IPCountYesterday+'</td>'
                    +'<td width="10%" class="right">'+formatTime(redisData.yesterdayData.AverageTimeYesterday)+'</td>'//
                    +'<td width="10%" class="right">'+redisData.yesterdayData.NewUserNumYesterday+'</td>'
                    +'<td width="10%" class="right">'+redisData.yesterdayData.RetentionYesterday+'%</td></tr>'
                    +'<tr><td width="10%">'+'每日平均'
                    +'</td><td width="10%" class="right">'+redisData.avgdayData.PVavgday+'</td>'
                    +'<td width="10%" class="right">'+redisData.avgdayData.UVavgday+'</td>'
                    +'<td width="10%" class="right">'+redisData.avgdayData.IPavgday+'</td>'
                    +'<td width="10%" class="right">'+formatTime(redisData.avgdayData.AVGavgday)+'</td>'
                    +'<td width="10%" class="right">'+redisData.avgdayData.NEWavgday+'</td>'
                    +'<td width="10%" class="right">'+redisData.avgdayData.RETENTIONavgday+'%</td></tr>'
	                +'<tr><td width="10%">'+'历史总计'
	                +'</td><td width="10%" class="right">'+redisData.histroyData.PVcount+'</td>'
	                +'<td width="10%" class="right">'+redisData.histroyData.UVcount+'</td>'
	                +'<td width="10%" class="right">'+redisData.histroyData.IPcount+'</td>'
	                +'<td width="10%" class="right">-</td>'
	                +'<td width="10%" class="right">'+redisData.histroyData.NEWcount+'</td>'
	                +'<td width="10%" class="right">-</td></tr>';
                // }
                visview+='</tbody></table>';
                $("#page_views").html(visview);
            }else{
                $("#page_views").hide();
                $(".brand_news .data_none").show();
            }
        }
    });
}

//趋势图请求数据函数
function getTrend(pageVisitSelect,pageTypeSelect,project_id){
    $.ajax({
        type:'post',
        dataType: "json",
        url:path+"/overview/pageVisitData",
        data:{pageVisitSelect:pageVisitSelect,pageTypeSelect:pageTypeSelect,project_id:project_id},
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success:function(data){

            var datainfo='趋势图';
            data=getState(data,datainfo);

            BTContentD ={
                xAxis:[],
                yAxis:[],
                type:''
            };
            var pageVisitData=data.pageVisitData;

            if(pageVisitData.length>0) {
                $("#volume-content").show();
                $(".brand_total .data_none").hide();

                for (var i = 0; i < pageVisitData.length; i++) {
                    if(pageVisitSelect=='day'){
                        BTContentD.xAxis[i] = (pageVisitData[i].create_time+'时');
                        BTContentD.yAxis[i] = pageVisitData[i].count;
                    }else{
                        var date = new Date(pageVisitData[i].create_time);
                        BTContentD.xAxis[i] = infoDate(date);  //横轴时间
                        BTContentD.yAxis[i] = pageVisitData[i].count;

                    }
                }
                //获取typename
                for(i=0;i<type.length;i++){
                    if(pageTypeSelect==type[i]){
                        BTContentD.type=type[i];
                    }
                }
            }else{
                $("#volume-content").hide();
                $(".brand_total .data_none").show();
            }
            brandChange();
            isVerification=false;
        }
    });

}

//使用时段分布请求数据函数
function getTime(project_id) {
    $.ajax({
        type:'post',
        dataType: "json",
        url:path+"/overview/timeIntervalData",
        data:{project_id:project_id},
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success:function(data){

            var datainfo='趋势图';
            data=getState(data,datainfo);
            // console.log(data);
            UTContentD ={
                xAxis:[],
                yAxis:[]
            };
            // 使用时段分布
            var timeIntervalData=data.timeIntervalData;
            if(timeIntervalData.length>0) {
                $("#usertime").show();
                $(".brand_total .data_none2").hide();

                for (var i = 0; i < timeIntervalData.length; i++) {
                    UTContentD.xAxis[i] = (timeIntervalData[i].create_time+'时');  //横轴时间
                    UTContentD.yAxis[i] = timeIntervalData[i].count;
                }
            }else{
                $("#usertime").hide();
                $(".brand_total .data_none2").show();
            }
            timeChange();
            isVerification=false;
        }
    });
}

//地域分布请求数据函数
function getArea(ipAreaSelect,project_id){
    $.ajax({
        type:'post',
        dataType: "json",
        url:path+"/overview/ipAreaData",
        data:{ipAreaSelect:ipAreaSelect,project_id:project_id},
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success:function(data){

            var datainfo='地域分布';
            data=getState(data,datainfo);

            areaNewsD={
                data:[],
            };

            //地域分布
            var ipAreaData=data.ipAreaData;
            if(ipAreaData){
                $("#area_dis").show();
                $(".area .data_none").hide();
                var ipcount = [];
                for(var i=0;i< ipAreaData.length;i++){
                    ipcount.push(ipAreaData[i].count);
                    areaNewsD.data.push(new createObj(ipAreaData[i].count,ipAreaData[i].area));
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

//来源分布请求数据函数
function getSource(referUrlSelect,referTypeSelect,project_id){

    $.ajax({
        type:'post',
        dataType: "json",
        url:path+"/overview/referUrlData",
        data:{referUrlSelect:referUrlSelect,referTypeSelect:referTypeSelect,project_id:project_id},
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success:function(data){

            var datainfo='来源分布';
            data=getState(data,datainfo);

            volumePerD={
                legend:[],
                data:[]
            };

            //来源分布
            var referUrlData=data.referUrlData;
            if(referUrlData.length>0){
                $("#volume_per").show();
                $(".source .data_none").hide();

                for(var i=0;i<referUrlData.length;i++){
                // for(var i=0;i<5;i++){
                    if(referUrlData[i].name==''){
                        volumePerD.legend[i]='直接访问';
                        volumePerD.data.push(new createObj(referUrlData[i].referNum,'直接访问'));
                    }else{
                        volumePerD.legend[i]=referUrlData[i].name;
                        volumePerD.data.push(new createObj(referUrlData[i].referNum,referUrlData[i].name));
                    }
                }
            }else{
                $("#volume_per").hide();
                $(".source .data_none").show();
            }

            volumePer();
            isVerification=false;
        }
    });

}

//页面访问请求数据函数
function getPage(project_id) {
    $.ajax({
        type:'post',
        dataType: "json",
        url:path+"/overview/pagetUrlData",
        data:{project_id:project_id},
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success:function(data){

            var datainfo='页面访问';
            data=getState(data,datainfo);

            var pagetUrlData=data.pagetUrlData;
            if(pagetUrlData.length>0){
                $("#page_display").show();
                $(".brand_event .data_none").hide();

                var pageview= '<thead><th width="50%">'+'页面地址'
                    +'</th><th width="22%">'+'PV'
                    +'</th><th width="22%">'+'PV占比'
                    +'</th></thead><tbody>';
                for(var i=0;i< pagetUrlData.length;i++){
                    var str=Number(pagetUrlData[i].pv_percent*100).toFixed(2);

                    //判断网址是否可以点击,针对某一些数据处理
                    // if(re.test(pagetUrlData[i].page_url)){
                        pageview+=
                            '<tr><td id="purl" class="left" title="'+pagetUrlData[i].page_url+'"><a href="'+pagetUrlData[i].page_url+'" target="_blank">'+pagetUrlData[i].page_url+'</a></td>'
                            +'<td class="right">'+pagetUrlData[i].pv+'</td>'
                            +'<td class="right">'+str+'%</td>'
                            +'</tr>';
                    // }
                }
                pageview+='</tbody>';
                $("#page_display").html(pageview);
            }else{
                $("#page_display").hide();
                $(".brand_event .data_none").show();
            }
            isVerification=false;
        }
    });
}

//事件触发请求数据函数
function getEvent(project_id) {
    $.ajax({
        type:'post',
        dataType: "json",
        url:path+"/overview/eventUrlData",
        data:{project_id:project_id},
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success:function(data){

            var datainfo='事件触发';
            data=getState(data,datainfo);

            var eventUrlData=data.eventUrlData;

            if(eventUrlData.length>0){
                $("#event_display").show();
                $(".brand_event .data_none").hide();

                var eventview= '<thead><th width="70%">'+'事件名称'
                    +'</th><th width="15%">'+'触发次数'
                    +'</th><th width="15%">'+'触发占比'
                    +'</th></thead><tbody>';
                for(var i=0;i< eventUrlData.length;i++){
                    var str=Number(eventUrlData[i].click_percent*100).toFixed(2);
                    eventview+=
                        '<tr><td class="left">'+eventUrlData[i].event_name +'</td>'
                        +'</td><td class="right">'+eventUrlData[i].click_num +'</td>'
                        +'<td class="right">'+str+'%</td>';
                        +'<td class="right">'+''+'%</td></tr>';
                }
                eventview+='</table>';
                $("#event_display").html(eventview);
            }else{
                $("#event_display").hide();
                $(".brand_event .data_none").show();
            }
            isVerification=false;
        }
    });
}

//项目选择参数切换
$("#projectid").on("change",function() {
    project_id = $(this).val();
    isVerification = true;
    getData();
//    问题关键是保存此处的project_id然后传递给common.js
});

//趋势图参数切换
$("#trends").on("change",function() {
    pageTypeSelect = $(this).val();
    isVerification = true;
    getTrend(pageVisitSelect,pageTypeSelect,project_id);
    if(pageTypeSelect=='PV'){
        $('.trend_y').html("纵轴指标：页面访问次数（单位：次）");
    }else if(pageTypeSelect=='UV'){
        $('.trend_y').html("纵轴指标：访问用户数（单位：人）");
    }else if(pageTypeSelect=='IP'){
        $('.trend_y').html("纵轴指标：访问IP数（单位：个）");
    }else if(pageTypeSelect=='AVG'){
        $('.trend_y').html("纵轴指标：平均访问时长（单位：秒）");
    }else{
        $('.trend_y').html("纵轴指标：新增用户数（单位：人）");
    }
});

$(":radio[name='trend']").click(function(){
    isVerification = true;
    pageVisitSelect=$('input:radio[name="trend"]:checked').val();
    if(pageVisitSelect == 'day'){
    	$('.trend_x').html("横轴指标：显示时刻（单位：每小时）");
    }else if(pageVisitSelect == 'other'){
    	$('.trend_x').html("横轴指标：显示时刻（单位：每天）");
    }
    getTrend(pageVisitSelect,pageTypeSelect,project_id);


});

//来源分布参数切换
$("#source").on("change",function() {
    referTypeSelect = $(this).val();
    isVerification = true;
    getSource(referUrlSelect,referTypeSelect,project_id);
});

$(":radio[name='time']").click(function(){
    referUrlSelect=$('input:radio[name="time"]:checked').val();
    isVerification = true;
    getSource(referUrlSelect,referTypeSelect,project_id);
});

$(":radio[name='use']").click(function(){
    timeIntervalSelect=$('input:radio[name="use"]:checked').val();
    isVerification = true;
    getTime(project_id);
});

// 地域分布参数切换
$(":radio[name='area']").click(function(){
    ipAreaSelect=$('input:radio[name="area"]:checked').val();
    isVerification = true;
    getArea(ipAreaSelect,project_id);
});


//趋势图
function brandChange(){
    var myChart = echarts.init(document.getElementById('volume-content'));

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
            left: '1%',
            right:'3%',
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
                    // type:'dashed'
                }
            }
        }],
        series: [
            {
                name:BTContentD.type,
                type: 'line',
                smooth: false,
                symbol: 'circle',
                symbolSize: 7,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 2,
                        color: '#ffc000'
                    }
                    },
                itemStyle: {
                    normal: {
                        color: '#0085ca'
                    }
                },
                areaStyle: {
                    normal: {
                        color:'#daf8ff'
                    }
                },
                data:BTContentD.yAxis
            }
        ]
    });

    window.addEventListener("resize",function(){
        myChart.resize();
    });
}

//使用时段分析
function timeChange(){
    var myChart = echarts.init(document.getElementById('usertime'));

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
            left: '1%',
            right:'3%',
            bottom: '0',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            axisTick: {
                show: false
            },
             data: UTContentD.xAxis
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
                    // type:'dashed'
                }
            }
        }],
        series: [
            {
                name:'UV',
                type: 'line',
                smooth: false,
                symbol: 'circle',
                symbolSize: 7,
                showSymbol: false,
                lineStyle: {
                    normal: {
                        width: 2,
                        color:'#0085ca'
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#ffc000',
                        borderColor: '#ffecb2'
                    }
                },
                areaStyle: {
                    normal: {
                        color:'#daf8ff'
                    }
                },
                data:UTContentD.yAxis
            }
        ]
    });

    window.addEventListener("resize",function(){
        myChart.resize();
    });
}

//来源分布
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
            right:'5%',
            bottom: '20',
            itemWidth:10,
            itemHeight:10,
            data: volumePerD.legend,
        },
        series: [{
            type: 'pie',
            radius: ['50%', '70%'],
            center:['46%','54%'],  //调整位置
            color: ['#0098e7','#ffc000','#31d079', '#2ffffd','#ffef00'],
            data: data
        }
        ],
    });

    window.addEventListener("resize",function(){
        myChart.resize();
    });
}

//地域分布
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
                name: 'PV',
                type: 'map',
                mapType: 'china',
                roam: false,
                itemStyle:{
                    normal:{
                        label: {
                            show:false
                        }
                    },
                    emphasis:{
                        label:{
                            show:true
                        },
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

