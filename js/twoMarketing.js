/**
 * Created by Administrator on 2017/4/24.
 */

//可触达用户、性别、年龄、访问情况、访问时长、地域分布

var UserSave={};
var SexSave={};
var AgeSave={};
var VisitSave={};
var durationSave={};
var AreaSave={};
var ipcountMax='';

var isSex=true;
var isTime=true;

//筛选条件
document.getElementById('click').addEventListener('click', function () {
    isVerification = true;
    project_id = $("#projectid").val();
    startTime = $('#startTime').val();
    console.log(startTime);

    endTime = $('#endTime').val();
    getData(project_id,startTime,endTime);
    durationChangeNum();
    userInfo(project_id, startTime, endTime);
},false);


function  createObj(value,name){
    this.value = value;
    this.name= name;
}

//基础属性切换
$(".brand_total").on("click","li a",function(e){
    //阻止浏览器的默认行为
    e.preventDefault();
    isVerification = true;
    var id=$(this).attr("href");
    if(id=='#browserType'){
        $("#pli").removeClass("current").addClass("pancel");
        $(this).removeClass("browser").addClass("current");
        $('#panelResolution').hide();
        $('#browserType').show();
        sexChange();
        isSex=true;
    }else{
        $("#bli").removeClass("current").addClass("browser");
        $(this).removeClass("pancel").addClass("current");
        $('#browserType').hide();
        $('#panelResolution').show();
        ageChange();
        isSex=false;
    }

});

//访问情况切换
$(".brand_visit").on("click","li a",function(e){
    //阻止浏览器的默认行为,柱状图不会闪一下
    e.preventDefault();
    isVerification = true;
    var id=$(this).attr("href");
    if(id=='#visitTimes'){
        $("#dli").removeClass("current").addClass("duration");
        $(this).removeClass("times").addClass("current");
        $('#visitDuration').hide();
        $('#visitTimes').show();
        timesChange();
        isTime=true;
    }else{
        $("#tli").removeClass("current").addClass("times");
        $(this).removeClass("duration").addClass("current");
        $('#visitTimes').hide();
        $('#visitDuration').show();
        durationChange();
        isTime=false;
    }
});

$(function(){
    $('#panelResolution').hide();
    $('#visitDuration').hide();
    getData(project_id,startTime,endTime);
    durationChangeNum();
    userInfo(project_id, startTime, endTime);
});

// 总请求数据函数
function getData(project_id,startTime,endTime){
    $.ajax({
        type:'post',
        dataType: "json",
        url:path+"/market/market",
        data:{projectId:project_id,startTime:startTime,endTime:endTime},
       
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success:function(data){

            var datainfo='二次营销';
            data=getState(data,datainfo);
            // 后台把数据存在了message中导致.data取不出
            // var data = JSON.parse(data.message);
            // console.log(data);
            //可触达用户
            UserSave={
                legend:[],
                data:[]
            };
            var personNum=data.personNum[0].phoneNumCount;
            var total=data.total;
            var otherPerson;

            if(total<=personNum){
                otherPerson=0;
            }else{
                otherPerson=total-personNum;
            }

            //自行把后台数据整理为自己需要的格式
            var user = [{userType : '可触达用户',userCount:personNum}, {userType : '不可触达用户',userCount:otherPerson}];
            if(user.length>0){
                $("#volume_per").show();
                $(".source .data_none").hide();

                for(var i=0;i<user.length;i++){
                    UserSave.legend[i]=user[i].userType;
                    UserSave.data.push(new createObj(user[i].userCount,user[i].userType));
                }

            }else{
                $("#volume_per").hide();
                $(".source .data_none").show();
            }
            userChange();

            //基础属性-性别
            SexSave = {
                yAxis:[]
            };
            var sexNum = data.sexNum;
            if(sexNum.length>0){
                for(var i=0;i<sexNum.length;i++){
                    SexSave.yAxis[0] = sexNum[i].sexCount1;
                    SexSave.yAxis[1] = sexNum[i].sexCount2;
                }
            }
            
            //基础属性-年龄
            // AgeSave = {
            //     xAxis:[],
            //     yAxis:[]
            // };

            //需要解析的是数组的第0项
            //数据格式：[<18:0,25-30:1,....]
            // var ageSum = data.ageSum[0];
            // if(ageSum){
            //     for(var key in ageSum){
            //         //两种方法，数据多的时候.length比较高效
            //         // AgeSave.xAxis[AgeSave.xAxis.length] = key;
            //         // AgeSave.yAxis[AgeSave.yAxis.length] = ageSum[key];
            //         AgeSave.xAxis.push(key);
            //         AgeSave.yAxis.push(ageSum[key]);
            //     }
            // }
            AgeSave = {
                yAxis:[]
            };
            var ageSum = data.ageSum;

            if(ageSum.length>10){
                ageSum=[0,0,0,0,0,0,0,0,0,0];
                for(var i=0;i<ageSum.length;i++){
                    AgeSave.yAxis[i] = ageSum[i];
                }
            }else{
                for(var i=0;i<ageSum.length;i++){
                    AgeSave.yAxis[i] = ageSum[i];
                }
            }

            if(isSex){
                sexChange();
            }else{
                ageChange();
            }

            //访问情况-访问次数
            VisitSave={
                data:[],
            };
            var clickCount=data.clickCount;
            if(clickCount){
                $("#volume_per").show();
                $(".source .data_none").hide();
                for(var i=0;i<clickCount.length;i++){
                    //数据格式不同导致取数据的方法不同
                    VisitSave.data.push(new createObj(clickCount[i].one,'1次'));
                    VisitSave.data.push(new createObj(clickCount[i].twoAndThree,'2-3次'));
                    VisitSave.data.push(new createObj(clickCount[i].overThree,'>3次'));
                }
            }else{
                $("#volume_per").hide();
                $(".source .data_none").show();
            }

            if(isTime){
                timesChange();
            }else{
                durationChange();
            }

            //地域分布
            AreaSave={
                data:[],
            };
            var areaNo=data.areaNo;
            if(areaNo){
                $("#area_dis").show();
                $(".area .data_none").hide();
                var ipcount = [];
                for(var i=0;i< areaNo.length;i++){
                    ipcount.push(areaNo[i].phoneNumCount);
                    AreaSave.data.push(new createObj(areaNo[i].phoneNumCount,areaNo[i].AREA));
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

//访问情况-访问时长请求数据函数
function durationChangeNum() {
    $.ajax({
        type:'post',
        dataType: "json",
        url:path+"/market/duration",
        data:{projectId:project_id,startTime:startTime,endTime:endTime},
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success:function(data){

            var datainfo='二次营销';
            data=getState(data,datainfo);

            durationSave={
                yAxis:[]
            }
            var vistimes = data;
            if(vistimes.length>0){
                for(var i=0;i<data.length;i++){
                    durationSave.yAxis[i] = data[i];
                }
            }
            isVerification = false;
        }
    });
}


// 用户信息请求数据函数
function userInfo(project_id, startTime, endTime) {
    //已采集到用户信息
    // var allProjectID;
    // $.ajax({
    //     type: "post",
    //     url: pathLogin,
    //     xhrFields: {
    //         withCredentials: true
    //     },
    //     async: false,
    //     crossDomain: true,
    //     success: function (data) {
    //         data = getState(data, datainfo);
    //         allProjectID = data.allProjectID;
    //     }
    // });

    // //把所属项目栏的字符转换为文字
    // function queryPro(id) {
    //     var len = allProjectID.length;
    //     for (var i = 0; i < len; i++) {
    //         if (id == allProjectID[i].project_id) {
    //             return allProjectID[i].project_name;
    //         }
    //     }
    // }

    $.ajax({
        type: 'post',
        dataType: "json",
        url: path + "/market/market",
        data: { projectId: project_id, startTime: startTime, endTime: endTime },

        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {

            var datainfo = '二次营销用户信息';
            data = getState(data, datainfo);

           
            var phoneData = data.phoneData;
            var len = phoneData.length;
            var html = '';
           
            // console.log(phoneData);

            if (len <=0) {
                getDataFailed();
            } else {
                getPhoneData();
            }
            //当前获取到数据不为空
            function getPhoneData() {
                $("#info .data_none").hide();
                $("#info .border-head").show();
                for (var i = 0; i < len; i++) {
                    if (phoneData[i].age == "") {
                        phoneData[i].age = "-";
                    }
                    var gender = phoneData[i].sex == 1 ? "男" : "女";
                    // var adCode = queryPro(phoneData[i].adCode);
                    var adCode = $('#projectid').find("option:selected").text();
                    html +=
                        '<li><ol><li>' + phoneData[i].phoneNum + '</li><li>' + phoneData[i].age + '</li><li>' + gender + '</li><li>' + phoneData[i].AREA + '</li><li>' + adCode + '</li><li>' + phoneData[i].createTime + '</li></ol></li>'
                }
                $("#list").html(html);
            }
            

            // 当前获取到的数据为空
            function getDataFailed() {
               
                var timer=null;
                for(let i=1;i<9;++i){  
                    clearTimeout(timer);
                    timer=setTimeout(function(){
                        
                        // 更新startTime之前存储正确时间区间
                        var nowTime=startTime;

                        $('#startTime').val(laydate.now(-7*i, 'YYYY-MM-DD'));
                        startTime = $('#startTime').val();
                        userInfo(project_id, startTime, endTime);

                        // 还原时间至当前用户选择的时间，laydate.now()修改时间的局限
                        $('#startTime').val(JSON.stringify(nowTime).replace(/\"/g, ""));
                    },500);
                           
                }
                
            }
            isVerification = false;
        }
    });


   

}


//echarts绘图函数
//可触达用户
function userChange(){
    var myChart = echarts.init(document.getElementById('volume_per'));
    myChart.setOption({
        // title: {
        //     text: UserSave.data[0].value,
        //     // left:'42%',
        //     // top:'49%',
        //     textStyle:{
        //         fontSize:26,
        //         rich: {
        //             textStyle: {
        //                 width: 100,
        //                 height: 100,
        //             }
        //         }
        //     }
        // },
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
            data: UserSave.legend
        },
        series: [{
            type: 'pie',
            avoidLabelOverlap:false,
            //环形图的中心显示数字
            label:{
                normal:{
                    show:true,
                    position:'center',
                    formatter:function () {
                        return UserSave.data[1].value
                    },
                    fontSize:'36',
                    textStyle:{
                        color:'#000'
                    }
                }
            },
            labelLine:{
                show:true
            },
            radius: ['50%', '70%'],
            center:['46%','54%'],  //调整位置
            color: ['#0098e7','#ffc000','#31d079', '#2ffffd','#ffef00'],
            //数据反转使得label中心显示的值和传输的数据保持一致
            data: UserSave.data.reverse()
        }]
    });

    window.addEventListener("resize",function(){
        myChart.resize();
    });
}

//基础属性-性别
function sexChange() {
    var myChart = echarts.init(document.getElementById('browser'));

    //使得每个柱状图上面有气泡显示
    var sexsave=[];
    for(var i in SexSave.yAxis){
        sexsave.push({
            coord:[parseInt(i),SexSave.yAxis[i]]
        })
    }

    myChart.setOption({

        title:{
            left:'center',
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
            // data : SexSave.xAxis,
            data : ['男','女'],
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
                }
            }
        } ],
        series : [ {
            name:  'PV',
            type : 'bar',
            data : SexSave.yAxis,
            barWidth : 30,
            itemStyle : {
                normal : {
                    color : '#ffc000',
                    borderColor : '#ffc000',
                }
            },
            markPoint : {
                data:sexsave
            }
        } ]
    });
    window.addEventListener("resize",function(){
        myChart.resize();
    });
}

//基础属性-年龄
function ageChange() {

    var myChart = echarts.init(document.getElementById('pancel'));

    //使得每个柱状图上面有气泡显示
    var agesave=[];
    for(var i in AgeSave.yAxis){
        agesave.push({
            coord:[parseInt(i),AgeSave.yAxis[i]]
        })
    }

    myChart.setOption({
        title:{
            left:'center',
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
            // data : AgeSave.xAxis,
            data : ['<18','18-25','25-30','30-35','35-40','40-45','45-50','50-55','55-60','>60'],
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
                }
            }
        } ],
        series : [ {
            name:  'PV',
            type : 'bar',
            data : AgeSave.yAxis,
            barWidth : 30,
            itemStyle : {
                normal : {
                    color : '#ffc000',
                    borderColor : '#ffc000',
                }
            },
            markPoint : {
                data:agesave
            }
        } ]
    });

    window.addEventListener("resize",function(){
        myChart.resize();
    });


}

//访问情况-访问次数
function timesChange() {
    var myChart = echarts.init(document.getElementById('times'));
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
            data:['1次','2-3次','>3次'],
        },
        series: [{
            type: 'pie',
            radius: ['50%', '70%'],
            center:['45%','48%'],  //调整位置
            color: ['#ffc000','#31d079', '#2ffffd','#ecdf20','#0085ca'],
            data:VisitSave.data
        }
        ]
    });
    window.addEventListener("resize",function(){
        myChart.resize();
    });
}

//访问情况-访问时长
function durationChange() {
    var myChart = echarts.init(document.getElementById('duration'));

    //使得每个柱状图上面有气泡显示
    var durationsave=[];
    for(var i in durationSave.yAxis){
        durationsave.push({
            coord:[parseInt(i),durationSave.yAxis[i]]
        })
    }
    myChart.setOption({
        title:{
            left:'center',
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
            // data : TimeSave.xAxis,
            data:['1-10秒','10-30秒','30-60秒','1分钟以上'],
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
                }
            }
        } ],
        series : [ {
            name:  'PV',
            type : 'bar',
            data : durationSave.yAxis,
            barWidth : 30,
            itemStyle : {
                normal : {
                    color : '#ffc000',
                    borderColor : '#ffc000',
                }
            },
            markPoint : {
                data:durationsave
            }
        } ]
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
                name: '可触达用户数',
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
                data: AreaSave.data
            }
        ]
    };

    myChart.setOption(option);
    window.addEventListener("resize",function(){
        myChart.resize();
    });
}

