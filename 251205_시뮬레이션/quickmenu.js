$(document).ready(function () {
    // ⭐ [S] 퍼블 추가
    //**** 시뮬레이션 토글
    // 퀵버튼 & 시뮬레이션 active 싱크맞추기
    function syncQuick1Active() {
        const isActive = $(".simul.longterm").hasClass("active");
        $(".quick1").toggleClass("active", isActive);
        $(".btn-msimulation").attr("aria-expanded", isActive);
    }
    // subs 클래스 있을 때
    if ($("div").hasClass("subs") && $(window).width() > 1024) {
        $(".simul.longterm .simul-box").css("top", "107px");
    }
    // 퀵메뉴 버튼으로 시뮬레이션 닫기
    $(".quick-button").click(function () {
        $(".simul.longterm").removeClass("active");
        syncQuick1Active();
    });
    // 화면 리사이징, 크기에 따라 시뮬레이션 토글
    $(window).resize(function () {
        var w = $(window).width();

        if (w <= 1600 && w > 1024) {
            $(".simul.longterm").removeClass("active");
            $(".simul.longterm .simul-box").css("top", "107px");
            syncQuick1Active();
        }

        if (w <= 1024) {
            $(".simul.longterm .simul-box").css("top", "");
        }
    });
    if ($(window).width() <= 1600 && $(window).width() > 1024) {
        $(".simul.longterm").removeClass("active");
        syncQuick1Active();
    }
    // 시뮬 버튼으로 시뮬레이션 토글
    $(".quick1, .btn-msimulation")
        .off("click")
        .click(function () {
            $(".simul.longterm").toggleClass("active");
            syncQuick1Active();
        });

    //**** 가로스크롤 indicator
    var $wrap = $(".box_simullink_wrap");
    var $left = $(".indicator.left");
    var $right = $(".indicator.right");
    var $maskPrev = $(".mask_prev");
    var $maskNext = $(".mask_next");

    // indicator 클릭시
    $(".indicator").click(function () {
        var wrapWidth = $wrap.width();
        var scrollWidth = $wrap[0].scrollWidth;

        if ($(this).hasClass("left")) {
            $wrap.animate({ scrollLeft: 0 }, 300);
        } else {
            $wrap.animate({ scrollLeft: scrollWidth - wrapWidth }, 300);
        }
    });
    // 스크롤시
    $wrap.on("scroll", function () {
        var wrapWidth = $wrap.width();
        var scrollWidth = $wrap[0].scrollWidth;
        var scrollLeft = $wrap.scrollLeft();

        if (scrollLeft > (scrollWidth - wrapWidth) / 2) {
            $left.removeClass("on");
            $right.addClass("on");
            $maskPrev.addClass("on");
            $maskNext.removeClass("on");
        } else {
            $left.addClass("on");
            $right.removeClass("on");
            $maskPrev.removeClass("on");
            $maskNext.addClass("on");
        }
    });
    // 시뮬레이션 버튼 클릭
    $(document).on("touchstart mousedown", ".simul.longterm .box_simullink_wrap li", function (e) {
        e.preventDefault();

        $(this).closest(".box_simullink_wrap").find("li").removeClass("clicked");
        $(this).addClass("clicked");
    });
    // ⭐ [E] 퍼블 추가
});
