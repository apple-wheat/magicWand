var pid = '0';

function menuChange(pid) {
    $.ajax({
        type: 'post',
        url: path + "/author/menus",
        data: {
            pid: pid
        },
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {

            var datainfo = '侧边导航';
            data = getState(data, datainfo);

            var dataLen = data.length;
            var defaults = {
                speed: 300,
                showDelay: 0,
                hideDelay: 0
            };
            var menushow = '<li class="active" data-order=' + 1 + '><a class="navin-con" data-href=' + data[0].url + ' href="#" data-title=' + data[0].title + '><span class="item01 item001"></span>' + data[0].title + '</a></li>';
            var menuhide = '<li class="active" data-order=' + 1 + '><a class="navout-con" data-href=' + data[0].url + ' href="#" data-title=' + data[0].title + '><span class="item01 item001"></span></a></li>';

            for (var i = 1; i < data.length - 2; i++) {
                // 字符串截取；字符串直接转int类型去零；字符串遍历取非零字符然后拼接；
                /*var str=data[i].id;
                var pos = str.indexOf('0');
                data[i].id= str.substring(pos+3,str.length);
                data[i].title=data[i].title.replace(/\//g, "");*/

                if (data[i].submenu == '1') {
                    menushow += '<li data-order=' + (i + 1) + '><a class="navin-con" data-href=' + data[i].url + ' href="#" data-title=' + data[i].title + '><span class=' + data[i].pic + '></span>' + data[i].title + '</a></li>';
                } else {
                    menushow += '<li class="user" data-id=' + data[i].id + ' data-order=' + (i + 1) + '><a class="navin-con" data-href=' + data[i].url + ' href="#" data-title=' + data[i].title + '><span class=' + data[i].pic + '></span>' + data[i].title + '</a><span class="submenu-indicator">∨</span><ul class="submenu"></ul></li>';
                }
                menuhide += '<li data-order=' + (i + 1) + '><a class="navout-con" data-href=' + data[i].url + ' href="#"><span class=' + data[i].pic + '></span></a></li>';
            }

            menushow += '<li id="set" class="setout"><b></b><span class=' + data[dataLen - 2].pic + '></span>' + data[dataLen - 2].title + '</li>' +
                '<li id="logout" class="setout"><b class="cur"></b><span class=' + data[dataLen - 1].pic + '></span>' + data[dataLen - 1].title + '</li>';
            $("#demo-list").html(menushow);

            menuhide += '<li id="set2" class="setout2"><b></b><span class=' + data[dataLen - 2].pic + '></span></li>' +
                '<li id="logout2" class="setout2"><b class="cur"></b><span class=' + data[dataLen - 1].pic + '></span></li>';
            $("#demo-list2").html(menuhide);


            //发生点击事件，再根据submenu,pid请求【当前一级菜单】的二级菜单并进行填充；
            $("#demo-list").on("click", "li>span", function () {
                //寻找兄弟元素nextSibling，next,prev,prevAll,nextAll
                if ($(this).siblings(".submenu").css("display") == "none") {
                    $(this).prev('a').addClass("submenu-indicator-minus");
                    // $(this).siblings(".submenu").css("display","block");
                    $(this).siblings(".submenu").delay(defaults.showDelay).slideDown(defaults.speed);
                    //通过给li添加data-id属性来特别标记当前一级菜单
                    pid = $(this).parent().data("id");

                    //调用函数，函数内this指向不明
                    //submenuChange(pid);
                    //使用其他变量接收this值再进行传递
                    var that = this;

                    $.ajax({
                        type: 'post',
                        url: path + "/author/menus",
                        data: {
                            pid: pid
                        },
                        xhrFields: {
                            withCredentials: true
                        },
                        crossDomain: true,
                        success: function (data) {

                            var datainfo = '二级菜单';
                            data = getState(data, datainfo);

                            var submenu = '';
                            for (var i = 0; i < data.length; i++) {
                                submenu += '<li data-id=' + data[i].id + '><span></span><a data-href=' + data[i].url + ' href="#" data-title=' + data[i].title + '>' + data[i].title + '</a></li>';
                            }
                            $(that).siblings(".submenu").html(submenu);
                        }
                    });
                } else {
                    $(this).prev('a').removeClass("submenu-indicator-minus");
                    $(this).siblings(".submenu").delay(defaults.showDelay).slideUp(defaults.speed);
                }

            });

        }
    });
}
menuChange(pid);


//    iframe高度自适应,为啥部分页面有问题
//    change();
//    function change() {
//        var iframe = document.getElementById("content");
//        iframe.style.height = 'initial';
//        iframe.onload = function () {
//            var ifmHeight = iframe.contentWindow.document.body.offsetHeight;
//            iframe.style.height = ifmHeight + 'px';
//            iframe.parentNode.style.height = ifmHeight + 'px';
//        }
//    }

//     iframe高度自适应
//;(function() {
//    var iframe = document.getElementById('content');
//    iframe.onload = function() {
//        iframe.style.height = 'initial';
//        var star = new Date();
//        var timer = setInterval(function() {
//            if(new Date() - star < 5000){
//                var body = iframe.contentWindow.document.body;
//                if(body==null) return;
//                var pageContent = document.querySelector('.page-content');
//                pageContent.style.height = iframe.style.height = body.scrollHeight + 'px' ;
//            }else{
//                clearInterval(timer);
//            }
//        })
//    };
//})();

//jq写法，iframe高度自适应
$('iframe#content').on('load', function () {
    updateIframeHeight();
});

function updateIframeHeight(callback) {
    $('iframe#content').css('height', 'initial');
    var iframe = $('iframe#content')[0];
    var star = new Date();
    var timer = setInterval(setIframeHeight);

    function setIframeHeight() {
        var height;
        var body = iframe.contentWindow.document.body;
        if (new Date() - star < 5000 && $(body).length != 0) {
            height = body.scrollHeight + 'px';
            $(iframe).css("height", height);
            $(iframe).parent().css("height", height);

        } else {
            clearInterval(timer);
            callback && callback();
        }
    }
};

$(function () {

    $('.navin').on("click", "a", function () {
        isVerification = true;
        // project_id = document.querySelector('#content').contentWindow.document.querySelector('#projectid').value;
        project_id = $($('#content')[0].contentWindow.document).find('#projectid').val();

        var href = $(this).data('href');
        // $('iframe').attr('src',href);
        //获取当前页面的project_id 拼接到href上
        // $('iframe').attr('src',href+'?project_id=7035e363240e4c27bc82d2760508bc7b');
        if (project_id == undefined) {
            $('iframe').attr('src', href);
        } else {
            $('iframe').attr('src', href + '?project_id=' + project_id);
        }
        // project_id = $('select option:selected').val();
    });

    $('.navout').on("click", "a", function () {
        isVerification = true;
        project_id = $($('#content')[0].contentWindow.document).find('#projectid').val();
        var href = $(this).data('href');
        $('iframe').attr('src', href + '?project_id=' + project_id);
    });

    var order;
    //顶部导航切换
    //先确定了父级元素再使用onclick绑定li，适用于动态生成的内容；（Tips）
    $("#demo-list").on("click", "li", function () {
        order = $(this).data("order");
        $(this).siblings("li").children("b").removeClass("cur");
        $(this).addClass("active").siblings("li").removeClass("active");
        $(this).children("a").children("span").addClass("item00" + order);
        for (var i = 1; i <= 9; i++) {
            if (i != order) {
                $(this).siblings().children("a").children("span").removeClass("item00" + i);
            }
        }
        if ($("#demo-list >li:not('.user')").hasClass("active")) {
            $("#demo-list").find("li .submenu").css("display", "none");
            $("#demo-list").find("li a").removeClass("submenu-indicator-minus");
        }
    });

    $("#demo-list2").on("click", "li", function () {
        order = $(this).data("order");
        $(this).siblings("li").children("b").removeClass("cur");
        $(this).addClass("active").siblings("li").removeClass("active");
        $(this).children("a").children("span").addClass("item00" + order);
        for (var i = 1; i <= 10; i++) {
            if (i != order) {
                $(this).siblings().children("a").children("span").removeClass("item00" + i);
            }
        }
    });

    //侧边栏控制
    $('#navout').hide();
    $('#goin').on("click", function () {
        isVerification = true;
        $('#navin').hide();
        $('#navout').show();
        $('#goout').show();
        $('#pagecon').addClass('big');

        // console.log(order);
        $('#demo-list2 li').each(function () {
            if ($(this).data("order") == order && $(this).data("order") != undefined) {
                $(this).siblings("li").children("b").removeClass("cur");
                $(this).addClass("active").siblings("li").removeClass("active");
                $(this).children("a").children("span").addClass("item00" + order);
                for (var i = 1; i <= 8; i++) {
                    if (i != order) {
                        $(this).siblings().children("a").children("span").removeClass("item00" + i);
                    }
                }
            }
        });
    });

    $("#goout").on("click", function () {
        isVerification = true;
        $('#goout').hide();
        $('#navout').hide();
        $('#navin').show();
        $('#pagecon').removeClass('big');

        $("#demo-list li").each(function () {
            if ($(this).data("order") == order && $(this).data("order") != undefined) {
                $(this).siblings("li").children("b").removeClass("cur");
                $(this).addClass("active").siblings("li").removeClass("active");
                $(this).children("a").children("span").addClass("item00" + order);
                for (var i = 1; i <= 10; i++) {
                    if (i != order) {
                        $(this).siblings().children("a").children("span").removeClass("item00" + i);
                    }
                }
            }
        });
    });

    $("#demo-list").on("click", ".setout", function () {
        isVerification = true;
        $(this).children("b").addClass("cur");
        $(this).siblings("li").removeClass("active");
        $(this).siblings("li").children("b").removeClass("cur");
    });

    $("#demo-list2").on("click", ".setout2", function () {
        isVerification = true;
        $(this).children("b").addClass("cur");
        $(this).siblings("li").removeClass("active");
        $(this).siblings("li").children("b").removeClass("cur");
    });


    $("#demo-list").on("click", "#logout", function () {
        isVerification = true;
        logOut();
    });
    $("#demo-list2").on("click", "#logout2", function () {
        isVerification = true;
        logOut();
    });

    $("#demo-list").on("click", ".submenu li", function () {
        isVerification = true;
        $(this).children("span").addClass("current");
        $(this).siblings().children("span").removeClass("current");
    });

});


function logOut() {
    $.ajax({
        type: 'post',
        url: path + "/login/logout",
        data: {},
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true,
        success: function (data) {
            if (data.state == 0) {
                window.location.href = paths + "/login.html";
            }
        }
    });
}