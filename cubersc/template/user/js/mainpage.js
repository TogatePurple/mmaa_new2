// js/mainpage.js
$(document).ready(function () {
    function kv_movescrollevt() {
        if ($(".kv_scrolltarget").length < 1) {
            return;
        }
        var _tar = $(".kv_scrolltarget").offset().top;
        $("body,html").stop().animate({ scrollTop: _tar }, 800);
    }

    $(".kv_scrolldown").on("click", kv_movescrollevt);

    function mainEventPop() {
        var _deviceChk = $(window).width();

        if (_deviceChk > 1024) {
            mainEventPc();
        } else {
            mainEventMo();
        }
    }

    function mainEventPc() {
        //console.log("pc");
        $(".link_pc").focus();
    }

    function mainEventMo() {
        //console.log("mo");
        $(".link_mo").focus();
    }

    mainEventPop();

    /* a태그 # 인 것 반응 이벤트 지우기 */
    $('a[href="#"]').each(function () {
        $(this).attr("href", "javascript:;");
    });

    /********** 메인 이벤트 팝업 슬라이드 (신규) ***********/
    $(".main_imgarea_slider").slick({
        dots: true,
        infinite: true,
        autoplay: true,
        speed: 300,
        slidesToShow: 1,
        prevArrow: $(".main_imgarea_indicator .slick-prev"),
        nextArrow: $(".main_imgarea_indicator .slick-next"),
    });

    $(".main_imgarea_slider .slick-dots").wrapAll("<div class='box_popbtns'></div>");
    $(".box_popbtns").prepend("<a href='javascript:;' class='btn_popcontrol'><span class='blind'>슬라이드 멈추기</span></a>");

    $(".btn_popcontrol").on("click", function () {
        var _this = $(this);
        var _orgtxt = "슬라이드 멈추기";
        var _cancletxt = "슬라이드 재생하기";
        var _target = $(".box_popbtns .blind");

        if (_this.hasClass("play")) {
            _this.removeClass("play");
            _this.find(".blind").text(_orgtxt);
            $(".main_imgarea_slider").slick("slickPlay");
        } else {
            _this.addClass("play");
            _this.find(".blind").text(_cancletxt);
            $(".main_imgarea_slider").slick("slickPause");
        }
    });

    $(".visual .v-slider").slick({
        // 메인 슬라이드
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        prevArrow: $(".v-prev"),
        nextArrow: $(".v-next"),
        dots: true,
        autoplay: true,
        pauseOnFocus: false,
        pauseOnHover: false,
        fade: true,
        //speed: 700
        speed: 300,
    });

    $(".v-prev").click(function () {
        $(".visual .v-slider").slick("slickPrev");
    });

    $(".v-next").click(function () {
        $(".visual .v-slider").slick("slickNext");
    });

    $(".visual .v-slider").on("afterChange", function (event, slick, currentSlide, nextSlide) {
        var _target = $(".box_kvcontwrap .txt_curcnt");
        /*console.log("current = ",currentSlide+1);*/
        _target.text(currentSlide + 1);
    });

    function setCount() {
        var _box = $(".box_kvcontwrap");
        var _setcurr = 1;
        var _settotal = $(".a-pc.v-slider .slide").length;

        _box.find(".txt_curcnt").text(_setcurr);
        _box.find(".txt_totalcnt").text(_settotal);
    }

    setCount();

    $(".visual .v-Play").hide();

    $(".visual .v-Pause").click(function () {
        // 메인 슬라이드 정지
        var _setPlayText = "슬라이드 시작";
        var _setPauseText = "슬라이드 정지";

        $(this).toggleClass("clicked");

        if ($(this).hasClass("clicked")) {
            $(".visual .v-slider").slick("slickPause");
            $(this).removeClass("v-Pause").addClass("v-Play");
            $(this).find(".blind").text(_setPlayText);
        } else {
            $(".visual .v-slider").slick("slickPlay");
            $(this).removeClass("v-Play").addClass("v-Pause");
            $(this).find(".blind").text(_setPauseText);
        }
    });

    /*$(".visual .v-Play").click(function(){ // 메인  슬라이드 시작
        $(".visual .v-slider").slick("slickPlay");
        $(this).hide();
        $(".v-Pause").show();
    });*/

    $(".login-box .tabs li").click(function () {
        var tab_id = $(this).attr("data-tab");

        $(".login-box .tabs li").removeClass("active");
        $(".login-box .tab-content").removeClass("active");
        $(this).addClass("active");
        $("#" + tab_id).addClass("active");
    });

    $(".two-area .nav li").click(function () {
        var tab_id = $(this).attr("data-tab");

        $(".two-area .nav li").removeClass("active");
        $(".two-area .tab-slider").removeClass("active");

        $(this).addClass("active");
        $("#" + tab_id).addClass("active");

        $(".two-area .tab-slider").slick("setPosition");
    });

    $(".two-area:not(.new-two-area) .tab-slider").slick({
        // 저축대여 슬라이드
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
        prevArrow: "<button type='button' class='two-prev'>이전</button>",
        nextArrow: "<button type='button' class='two-next'>다음</button>",
        dots: false,
        autoplay: false,
        speed: 700,
        responsive: [
            {
                breakpoint: 1341,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 1025,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 1001,
                settings: {
                    slidesToShow: 2,
                    dots: true,
                },
            },
            /*{  
                            breakpoint: 521,
                            settings: {
                                slidesToShow: 4,
                                arrows : false,
                                dots : true,
                            } 
                        },
                        {  
                            breakpoint: 436,
                            settings: {
                                slidesToShow: 3,
                                arrows : false,
                                dots : true,
                            } 
                        }*/
        ],
    });

    $(".two-area.new-two-area .tab-slider").slick({
        // 저축대여 슬라이드
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        prevArrow: $(".for-prev2"),
        nextArrow: $(".for-next2"),
        dots: false,
        autoplay: true,
        //fade : true,
        pauseOnFocus: false,
        pauseOnHover: false,
        speed: 300,
    });

    $(".v-prev2").click(function () {
        $(".two-area.new-two-area .tab-slider").slick("slickPrev");
    });

    $(".v-next2").click(function () {
        $(".two-area.new-two-area .tab-slider").slick("slickNext");
    });

    $(".two-area.new-two-area .tab-slider").on("afterChange", function (event, slick, currentSlide, nextSlide) {
        var _target = $(".box_kvcontwrap2 .txt_curcnt2");
        /*console.log("current = ",currentSlide+1);*/
        _target.text(currentSlide + 1);
    });

    function setCount2() {
        var _box = $(".box_kvcontwrap2");
        var _setcurr = 1;
        var _settotal = $(".two-area.new-two-area .tab-slider .slick-slide:not(.slick-cloned)").length;

        _box.find(".txt_curcnt2").text(_setcurr);
        _box.find(".txt_totalcnt2").text(_settotal);
    }

    setCount2();

    $(".content2 .cardbox.in1").on("mouseenter focus click", function () {
        $(".content.content2").addClass("hover");
    });

    $(".content2 .cardbox.in1").on("mouseleave focusout", function () {
        $(".content.content2").removeClass("hover");
    });

    $(".v-Play2").hide();

    $(".v-Pause2").click(function () {
        // 메인 슬라이드 정지
        var _setPlayText = "슬라이드 시작";
        var _setPauseText = "슬라이드 정지";

        $(this).toggleClass("clicked");

        if ($(this).hasClass("clicked")) {
            $(".two-area.new-two-area .tab-slider").slick("slickPause");
            $(this).removeClass("v-Pause2").addClass("v-Play2");
            $(this).find(".blind").text(_setPlayText);
        } else {
            $(".two-area.new-two-area .tab-slider").slick("slickPlay");
            $(this).removeClass("v-Play2").addClass("v-Pause2");
            $(this).find(".blind").text(_setPauseText);
        }
    });

    $(".for-area .nav li").click(function () {
        var tab_id = $(this).attr("data-tab");

        $(".for-area .nav li").removeClass("active");
        $(".for-area .nav li > a").attr("title", "");
        $(".for-area .boxs").removeClass("active");

        $(this).addClass("active");
        $(this).find("> a").attr("title", "선택됨");
        $("#" + tab_id).addClass("active");
    });

    $(".for-area .banner").slick({
        // 플러스되는 소식 슬라이드
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        prevArrow: $(".for-prev"),
        nextArrow: $(".for-next"),
        dots: true,
        autoplay: true,
        fade: true,
        pauseOnFocus: false,
        pauseOnHover: false,
        speed: 300,
    });
    $(".for-area .b-Pause").click(function () {
        // 플러스되는 소식 슬라이드 정지
        $(".for-area .banner").slick("slickPause");
        $(this).css("display", "none");
        $(".b-Play").css("display", "block");
    });
    $(".for-area .b-Play").click(function () {
        // 플러스되는 소식  슬라이드 시작
        $(".for-area .banner").slick("slickPlay");
        $(this).css("display", "none");
        $(".b-Pause").css("display", "block");
    });

    $(".five-area .sns-slider").slick({
        // sns 슬라이드
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
        prevArrow: "<button type='button' class='five-prev'>이전</button>",
        nextArrow: "<button type='button' class='five-next'>다음</button>",
        dots: true,
        autoplay: false,
        autoplayspeed: 1000,
        speed: 300,
        responsive: [
            {
                breakpoint: 1241,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                },
            },
        ],
    });

    /* 메인 페이지 스크롤 이벤트
    if($(window).width() >= 1024) {
        $(window).on('scroll',function(){
            if ($(window).scrollTop() > 150) {
                $('.two-area .tab-sliders').addClass("current");
            }
            if ($(window).scrollTop() > 650) {
                $('.thr-area .left .boxs').addClass("current");
                $('.thr-area .right .box').addClass("current");
            }
            if ($(window).scrollTop() > 850) {
                $('.for-area .left .forboxs').addClass("current");
                $('.for-area .right .banner .slick-list').addClass("current");
            }
            if ($(window).scrollTop() > 1300) {
                $('.five-area .sns-slider').addClass("current");
            }
        });
        } else {
            $(window).on('scroll',function(){
                if ($(window).scrollTop() > 200) {
                    $('.two-area .tab-sliders').addClass("current");
                }
                if ($(window).scrollTop() > 400) {
                    $('.thr-area .left .boxs').addClass("current");
                }
                if ($(window).scrollTop() > 600) {
                    $('.thr-area .right .box').addClass("current");
                }
                if ($(window).scrollTop() > 800) {
                    $('.for-area .left .forboxs').addClass("current");
                }
                if ($(window).scrollTop() > 1000) {
                    $('.for-area .right .banner .slick-list').addClass("current");
                }
                if ($(window).scrollTop() > 1200) {
                    $('.five-area .sns-slider').addClass("current");
                }
            });
        }*/

    /*quick menu popub*/

    $(".w-close").click(function () {
        $(".q-pop").fadeOut("slow", function () {
            $("body").removeClass("hidden");
        });
        var chktests = $("#nottoday").prop("checked");
        var chktests2 = $("#nottoday2").prop("checked");
        var chktests3 = $("#notmore").prop("checked");
        var chktests4 = $("#nottoday3").prop("checked");
        if (chktests == true) {
            setCookie("divpops", "Y", 1);
        }

        if (chktests2 == true) {
            setCookie("divpops2", "Y", 1);
        }
        if (chktests3 == true) {
            setCookie("divbrdtpops", "Y", 30);
        }
        if (chktests4 == true) {
            setCookie("divpops3", "Y", 1);
        }
    });

    $(".btn_nottoday").on("click", function () {
        setCookie("divpops", "Y", 1);
        $(".beta-mainpop").fadeOut("slow", function () {
            $("body").removeClass("hidden");
        });
    });

    $(".btn_nottoday2").on("click", function () {
        setCookie("divpops2", "Y", 1);
        $(".beta-eventpop").fadeOut("slow", function () {
            $("body").removeClass("hidden");
        });
    });

    $(".btn_notmore").on("click", function () {
        setCookie("divbrdtpops", "Y", 30);
        $(".beta-birthday").fadeOut("slow", function () {
            $("body").removeClass("hidden");
        });
    });

    $(".btn_nottoday3").on("click", function () {
        setCookie("divpops3", "Y", 1);
        $(".beta-eventpop").fadeOut("slow", function () {
            $("body").removeClass("hidden");
        });
    });

    function checkDeviceForQuick() {
        var _wwin = $(window).width();

        if (_wwin < 1025) {
            //console.log("mo");

            $(".q-pop").fadeOut("slow", function () {
                $("body").removeClass("hidden");
            });
        }
    }

    checkDeviceForQuick();

    $(window).on("resize", function () {
        checkDeviceForQuick();
        $(".kv_scrolldown").on("click", kv_movescrollevt);
        mainEventPop();
    });
});

$(window).on("load", function () {
    $(".box_img").focus();
    /*if($(".tab-link").length > 0){
    $(".tab-link").attr("tabindex","0");
}*/
});
