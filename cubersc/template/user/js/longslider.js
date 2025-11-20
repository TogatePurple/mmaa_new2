$(document).ready(function () {
    $("#switch-simple").click(function () {
        var _view = $(".box_slidecont .box_view");
        var _hide = $(".box_slidecont .box_hide");
        var _checked = $("#switch-simple").is(":checked");

        if (_checked) {
            _view.removeClass("hide");
            _hide.addClass("hide");
        } else {
            _hide.removeClass("hide");
            _view.addClass("hide");
        }

        // 금액표시 S
        var params = {
            // 메인페이지 금액표시
            set1: _checked,
        };

        $.ajax({
            type: "POST",
            async: true,
            url: "/web/main/index.do/setmy",
            data: params,
        });
        // 금액표시 E
    });

    // $(".login_single_slider").slick({
    //     infinite: true,
    //     slidesToShow: 1,
    //     slidesToScroll: 1,
    //     arrows: true,
    //     prevArrow: $(".btn_lprev"),
    //     nextArrow: $(".btn_lnext"),
    //     dots: true,
    //     speed: 300,
    //     autoplay: true,
    //     pauseOnFocus: false,
    //     pauseOnHover: false,
    // });

    $(".login_single_slider .slick-dots").wrap('<div class="login_controlarea"></div>');
    $(".login_controlarea").append('<button type="button" class="btn_lcontrol l-Pause"><span class="blind">슬라이드 정지</span></button>');

    $(".box_btmwrap.box-bottom .btn_lcontrol").click(function () {
        // 로그인 슬라이드 정지
        var _setPlayText = "슬라이드 시작";
        var _setPauseText = "슬라이드 정지";

        $(this).toggleClass("clicked");

        if ($(this).hasClass("clicked")) {
            $(".login_single_slider").slick("slickPause");
            $(this).removeClass("l-Pause").addClass("l-Play");
            $(this).find(".blind").text(_setPlayText);
        } else {
            $(".login_single_slider").slick("slickPlay");
            $(this).removeClass("l-Play").addClass("l-Pause");
            $(this).find(".blind").text(_setPauseText);
        }
    });

    $(".quick-tit").click(function () {
        var logints = "";
        if (logints != "") {
            $(".q-pop").fadeIn("slow", function () {
                $("body").addClass("hidden");
                $(".q-win .w-close a").focus();
            });
        } else {
            window.alert("로그인을 해주세요");
        }
    });

    // 임시 쿠키 : 다시보지않기 선택하지 않았을 경우 보여줌
    if (getCookie("divpops2") != "Y") {
        $(".help-bg.beta-eventpop").css("display", "block");
    }

    // 로그인 영역 추가 S
    var logint = "";
    var eventCheck = "";
    if (logint != "") {
        console.log("logint!=null");

        $(".before_login").addClass("hide");
        $(".after_login").removeClass("hide");

        // 메인팝업 쿠키 세팅
        if (getCookie("divpops") == "Y") {
            $(".help-bg.beta-mainpop").css("display", "none");
        } else {
            if (eventCheck == "[]") {
                // 이벤트 유무 빈값체크
                $(".help-bg.beta-mainpop").css("display", "none");
            } else {
                $(".help-bg.beta-mainpop").css("display", "block");
            }
        }
    } else if (logint == "") {
        $(".after_login").addClass("hide");
        $(".before_login").removeClass("hide");
    }
    // 로그인 영역 추가 E

    // 금액표시 S
    var _view = $(".box_slidecont .box_view");
    var _hide = $(".box_slidecont .box_hide");
    var getSet1 = ""; // 메인페이지 금액표시
    var getSet2 = ""; // 마이페이지 저축
    var getSet3 = ""; // 마이페이지 대여
    var getSet4 = ""; // 마이페이지 복지

    if (getSet1 == "true") {
        _view.removeClass("hide");
        _hide.addClass("hide");
        $("#switch-simple").prop("checked", true);
    } else if (getSet1 == "false") {
        _hide.removeClass("hide");
        _view.addClass("hide");
        $("#switch-simple").prop("checked", false);
    }
    // 금액표시 E

    $(".box_linkslide_btmarea a").on("click", function () {
        setTimeout(function () {
            $("body").removeClass("hidden");
        }, 500);
    });
});
