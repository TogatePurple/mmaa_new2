$(document).ready(function () {
    $(window).scroll(function () {
        // 스크롤탑 버튼
        if ($(window).scrollTop() <= 0) {
            $(".btn-top, .btn-help, .btn-msimulation").removeClass("show");
            $(".btn-top, .btn-help, .btn-msimulation").css("cursor", "auto");
        } else {
            $(".btn-top, .btn-help, .btn-msimulation").addClass("show");
            $(".btn-top, .btn-help, .btn-msimulation").css("cursor", "pointer");
        }
    });
    $(".btn-top").click(function () {
        $("html,body").animate(
            {
                scrollTop: 0,
            },
            500
        );
        return false;
    });

    if ($("div").hasClass("subs") === true) {
        $(".quick").css("top", "107px");
    }

    $(".quick-button").click(function () {
        // 퀵메뉴 버튼
        $(".quick").toggleClass("close");
        if ($(this).text() == "퀵메뉴 닫기") {
            $(this).text("퀵메뉴 열기");
        } else {
            $(this).text("퀵메뉴 닫기");
        }
    });
    $(window).resize(function () {
        if ($(window).width() <= 1600) {
            $(".quick").addClass("close");
            $("quick-button").text("퀵메뉴 열기");
        } else {
            $(".quick").removeClass("close");
            $("quick-button").text("퀵메뉴 닫기");
        }
    });
    if ($(window).width() <= 1600) {
        $(".quick").addClass("close");
        $(".quick-button").text("퀵메뉴 열기");
    }

    $(".quick1, .btn-msimulation").click(function () {
        $(".simul").addClass("active");
        $(".simul-box").find(".simul-close").focus();
        $("#header").css("z-index", "9");
        $("body").addClass("hidden");
    });

    /* $(window).resize(function() {
			if($(window).width() <= 1024) {
				$(".simul").removeClass('active');
			}
		}); */
    $(".simul-box .simul_tabs li").click(function () {
        var tab_id = $(this).attr("data-tab");

        $(".simul-box .simul_tabs li").removeClass("active");
        $(".simul-box .tab-content").removeClass("active");
        $(this).addClass("active");
        $("#" + tab_id).addClass("active");
    });

    $(".simul-box .btn1").click(function () {
        setTimeout(function () {
            $(".simul-box .tab-content.active .box1").css("margin-bottom", "0");
        }, 500);
        $(".simul-box .tab-content.active .box2").slideUp(500);
        $("body").addClass("hidden");
    });

    $(".simul-box .btn2").click(function () {
        $(".simul-box .tab-content.active .box1").css("margin-bottom", "27px");
        $(".simul-box .tab-content.active .box2").slideDown(500);
        $("body").addClass("hidden");
    });

    // 퀵메뉴 미리 체크 -s-
    var quick1 = "#chk_top_e";
    var quick2 = "#chk_top_f";
    var quick3 = "#chk_top_g";
    var quick4 = "#chk_top_h";

    $(quick1).attr("checked", true);
    $(quick2).attr("checked", true);
    $(quick3).attr("checked", true);
    $(quick4).attr("checked", true);

    var disquick1 = "dis_chk_top_e";
    var disquick2 = "dis_chk_top_f";
    var disquick3 = "dis_chk_top_g";
    var disquick4 = "dis_chk_top_h";

    document.getElementById(disquick1).style.display = "";
    document.getElementById(disquick2).style.display = "";
    document.getElementById(disquick3).style.display = "";
    document.getElementById(disquick4).style.display = "";
    // 퀵메뉴 미리 체크 -e-
});

//4개만 체크되게 하기
function count_ck(obj) {
    var chkbox = document.getElementsByName("chk_top");
    var chkCnt = 0;

    for (var i = 0; i < chkbox.length; i++) {
        if (chkbox[i].checked) {
            chkCnt++;
        }
    }

    // 좌측 목록 변경
    var leftchk = obj.checked;
    var chktest = "dis_" + $(obj).attr("id");

    if (leftchk == true) {
        document.getElementById(chktest).style.display = "";

        switch (chkCnt) {
            case 0:
                document.getElementById("empty1").style.display = "";
                document.getElementById("empty2").style.display = "";
                document.getElementById("empty3").style.display = "";
                document.getElementById("empty4").style.display = "";
                break;
            case 1:
                document.getElementById("empty1").style.display = "none";
                document.getElementById("empty2").style.display = "";
                document.getElementById("empty3").style.display = "";
                document.getElementById("empty4").style.display = "";
                break;
            case 2:
                document.getElementById("empty1").style.display = "none";
                document.getElementById("empty2").style.display = "none";
                document.getElementById("empty3").style.display = "";
                document.getElementById("empty4").style.display = "";
                break;
            case 3:
                document.getElementById("empty1").style.display = "none";
                document.getElementById("empty2").style.display = "none";
                document.getElementById("empty3").style.display = "none";
                document.getElementById("empty4").style.display = "";
                break;
            case 4:
                document.getElementById("empty1").style.display = "none";
                document.getElementById("empty2").style.display = "none";
                document.getElementById("empty3").style.display = "none";
                document.getElementById("empty4").style.display = "none";
                break;
        }
    } else {
        document.getElementById(chktest).style.display = "none";

        switch (chkCnt) {
            case 0:
                document.getElementById("empty1").style.display = "";
                document.getElementById("empty2").style.display = "";
                document.getElementById("empty3").style.display = "";
                document.getElementById("empty4").style.display = "";
                break;
            case 1:
                document.getElementById("empty1").style.display = "none";
                document.getElementById("empty2").style.display = "";
                document.getElementById("empty3").style.display = "";
                document.getElementById("empty4").style.display = "";
                break;
            case 2:
                document.getElementById("empty1").style.display = "none";
                document.getElementById("empty2").style.display = "none";
                document.getElementById("empty3").style.display = "";
                document.getElementById("empty4").style.display = "";
                break;
            case 3:
                document.getElementById("empty1").style.display = "none";
                document.getElementById("empty2").style.display = "none";
                document.getElementById("empty3").style.display = "none";
                document.getElementById("empty4").style.display = "";
                break;
            case 4:
                document.getElementById("empty1").style.display = "none";
                document.getElementById("empty2").style.display = "none";
                document.getElementById("empty3").style.display = "none";
                document.getElementById("empty4").style.display = "none";
                break;
        }
    }

    if (chkCnt > 4) {
        alert("최대 4개까지만 체크 가능합니다.");

        obj.checked = false;
        document.getElementById(chktest).style.display = "none";
        return false;
    }
}

// 퀵메뉴 초기화 버튼
function quickdf() {
    // 기본값 제외 전부 체크 헤제
    let qdf = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v"];
    //let qdf1 = ['a','b','c','d'];
    let qdf1 = ["e", "f", "g", "h"];

    for (var i = 0; i < qdf.length; i++) {
        var def = "#chk_top_" + qdf[i];
        $(def).attr("checked", false);

        var disdef = "dis_chk_top_" + qdf[i];
        document.getElementById(disdef).style.display = "none";
    }

    // 기본값 체크 진행
    for (var i = 0; i < qdf1.length; i++) {
        var def1 = "#chk_top_" + qdf1[i];
        $(def1).prop("checked", true);

        var disdef1 = "dis_chk_top_" + qdf1[i];
        document.getElementById(disdef1).style.display = "";

        var empty = "empty" + (i + 1);
        document.getElementById(empty).style.display = "none";
    }
}

// 퀵메뉴 선택 4개 체크 알림
function formChk() {
    var chkbox = document.getElementsByName("chk_top");
    var chkCnt = 0;

    for (var i = 0; i < chkbox.length; i++) {
        if (chkbox[i].checked) {
            chkCnt++;
        }
    }

    if (chkCnt >= 4) {
        document.sandquick.submit();
        return true;
    } else {
        alert("4가지를 전부 선택해주세요.");
        return false;
    }
}

// iframe 동작감지 호출 함수
function motionDetection() {
    console.log("세션갱신 ::::::::::::::::::::");

    $.ajax({
        url: "/api/chatPossible.do",
        type: "post",
        dataType: "json",
        async: true,
        success: function (response) {
            var responseJSON = response["AA010"];

            // 테스트 하려면 != 200 으로 하고 테스트 끝나면 == 200 으로 복귀해야 함
            if (responseJSON["status"] == 200) {
                if (responseJSON["data"]["possible"] == "Y") {
                    //alert("상담채팅 가능");

                    console.log("세션갱신 완료<<<<<<<<<<<<<");
                } else {
                    console.log("상담채팅이 불가능한 시간입니다.");
                }
            } else if (responseJSON["status"] == 500) {
                console.log("status:" + responseJSON["status"] + "\n" + responseJSON["message"]);
            } else {
                console.log("처리 중 오류가 발생하였습니다.");
            }
        },
        error: function (request, status, error) {
            if (request.responseText.indexOf("로그인") > 0) {
                console.log("로그인 후 이용 가능합니다.");
                location.href = "/web/contents/webLogin.do";
            } else {
                console.log("api오류\ncode:" + request.status + "\n" + "message:" + request.responseText + "\n");
            }
        },
    });
}
