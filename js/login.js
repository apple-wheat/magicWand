
//    回车键实现登录

function keyLogin(){
    //这是超级厉害的一句话
    var event=arguments.callee.caller.arguments[0]||window.event;//消除浏览器差异
    if (event.keyCode == 13){
        $("#login_btn").click();
    }

}

//验证码
// $("#imgcode").attr("src", path+"/login/graphic?a=" + Math.random());
// $(function () {
//     $("#getcode").on("click",function(){
//         $("#imgcode").attr("src", path+"/login/graphic?a=" + Math.random());
//     });
// });


//    用户名、密码验证
$("#login_btn").on("click",function(){

    var code = $("#code").val(), pwd = $("#pwd").val(), identify = $("#identify").val();

    $.ajax({
        type:'post',
        url:path+"/login/login",
        data:{code:code,pwd:pwd,identify:identify},
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        dataType : "json",//数据类型为jsonp
        success:function(data){

            if(data.state==0){
                $(".info").html("");
                window.location.href=paths+"/index.html";
            }else{
                if(code==''||pwd==''){
                    $(".info").html("用户名、密码均不能为空！");
                }else if(pwd.length<1){
                    $(".info").html("密码长度不得少于6位！");
                    $('#pwd').val("");
                }else{
                    $(".info").html(data.message+'!');
                }
            }
        },
        error:function(){

        }
    });

});

//placeholder在IE版本兼容问题
$(function(){
    if(!placeholderSupport()){   // 判断浏览器是否支持 placeholder
        $('[placeholder]').focus(function() {
            var input = $(this);
            if (input.val() == input.attr('placeholder')) {
                input.val('');
                input.removeClass('placeholder');
            }
        }).blur(function() {
            var input = $(this);
            if (input.val() == '' || input.val() == input.attr('placeholder')) {
                input.addClass('placeholder');
                input.val(input.attr('placeholder'));
            }
        }).blur();
    };
})
function placeholderSupport() {
    return 'placeholder' in document.createElement('input');
}













