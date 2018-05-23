/**
 * Created by Administrator on 2017/7/12.
 */

//请求项目记录
function getProject(){

    $.ajax({
        type:'post',
        url: path+"/project/allDatas",
        data:{},
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success:function(data){

            var datainfo='项目记录';
            data=getState(data,datainfo);

            var table=data.table;

            var proview= '<thead><tr class="protr"><td id="proname" width="40%">'+'项目名称'
                +'</td><td width="10%">'+'今日访问用户'
                +'</td><td width="10%">'+'今日新增用户'
                +'</td><td width="20%">'+'累计用户'
                +'</td><td>'+'操作'
                +'</td></tr></thead><tbody>';
            for(var i=0;i< table.length;i++){
                proview+=
                    '<tr class="protd" data-id="'+table[i].project_id+'" id='+table[i].project_id+'>'
                    +'<td width="40%">'+table[i].project_name+'</td>'
                    +'<td width="10%">'+table[i].todayUserNum+'</td>'
                    +'<td width="10%">'+table[i].todayNewUserNum+'</td>'
                    +'<td width="15%">'+table[i].userNum+'</td>'
                    +'<td>'
                    +'<img class="prosee" src="images/all.png" alt="查看数据" title="查看数据">&emsp;'
                    +'<img class="proedit" src="images/edit.png"  alt="信息修改" title="信息修改">&emsp;'
                    +'<img class="proimg" src="images/delete.png" alt="删除" title="删除"></td></tr>';

                // project_id=table[i].project_id;
            }
            proview+='</tbody>';
            $("#proinfo").html(proview);
            isVerification=false;
        }
    });
}
getProject();

//删除项目
$("#proinfo").on("click",".proimg",function() {
    isVerification = true;
    project_id=$(this).parent().parent().attr("id");
    deleteProject(project_id);
});

//编辑项目
$("#proinfo").on("click",".proedit",function() {
    isVerification = true;
    //两种方法检测,以下这句话是错误的
    // project_id = $("#proinfo tbody td").parent().attr("id");
    project_id=$(this).parent().parent().attr("id");
    window.location.href="baseInfo.html?project_id="+project_id+"";
});

//查看总览
//思路：每次页面加载时判断当前页面然后再改变导航高亮
//或者：项目管理查看数据点击后改变总览的颜色；
$("#proinfo").on("click",".prosee",function() {
    isVerification = true;
    //重点在于parent,以下是三种方式
    // var Obj1 = parent.document.getElementById("list-first");
    // var Obj2 = parent.document.getElementById("list-last");
    // $(Obj1).addClass("active");
    // $(Obj2).removeClass("active");

    //在二级嵌套的页面，parent ==  top,top是最顶层的window窗口
    // $(selector,context)第二个参数context，决定了jquery去哪个窗口里寻找dom元素
    // $('#demo-list li:first',top.document).addClass('active').siblings().removeClass('active');
    // $('#demo-list li:first',parent.document).addClass('active').siblings().removeClass('active');

    parent.$('#demo-list li:first').addClass('active').siblings().removeClass('active');
    //找到倒数第三个li。//('li').get().reverse()[3]
    parent.$('#demo-list').find('li:eq(-3)').children("a").children("span").removeClass("item009");
    parent.$('#demo-list li:first').children("a").children("span").addClass("item001");

    parent.$('#demo-list2 li:first').addClass('active').siblings().removeClass('active');
    parent.$('#demo-list2').find('li:eq(-3)').children("a").children("span").removeClass("item009");
    parent.$('#demo-list2 li:first').children("a").children("span").addClass("item001");

    project_id=$(this).parent().parent().attr("id");
    window.location.href="pandect.html?project_id="+project_id+"";
});
function deleteProject(project_id) {

    // 使用confirm来进行弹窗判断
    var r=confirm("确定要删除吗？");
    if(r==true){
        $.ajax({
            type:'post',
            url: path+"/project/deleteProject",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            data:{project_id:project_id},
            success:function(data){
                if(data.state=='0'){
                    $(".info").html("");
                    window.location.href="projectManage.html";
                }
                getProject();
                isVerification=false;
            }
        });
    }else{
        window.location.href="projectManage.html";
    }

    // parent.layer.confirm('确定删除吗?'
    //     ,{ icon: 3, title:'删除操作'}
    //     ,{  btn: ['确定']
    //         ,yes:function(index,layero){
    //             layer.close(index);
    //         }
    //     // layer.close(index);
    // });
    // layer.confirm('纳尼？', {
    //     btn: ['按钮一', '按钮二', '按钮三'] //可以无限个按钮
    // }, function(index, layero){
    //     //按钮【按钮一】的回调
    // }, function(index){
    //     //按钮【按钮二】的回调
    // });

}

//input输入框
$(function(){
    $('table tbody td:nth-child(1)').click(function(){
        if(!$(this).is('.input')){
            $(this).addClass('input')
                .html('<input type="text" class="tdinput" value="'+ $(this).text() +'" />')
                .find('input').focus().blur(function(){
                $(this).parent().removeClass('input').html($(this).val() || 0);
            });
        }
    });

});

//search搜索功能的实现
$(function(){
    $('#go').click(function(){
        isVerification = true;
        var sstxt=$('#search').val();
        $("table tbody tr").hide().filter(":contains('"+sstxt+"')").show();
    })
})


