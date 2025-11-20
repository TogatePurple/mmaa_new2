// js/content.js
$(document).ready(function () {
    $(".subs .notice-tab2 .tab2").click(function () {
        var tab_id = $(this).attr("data-tab");

        $(".subs .notice-tab2 .tab2").removeClass("active");
        $(".subs .notice-tab2 .tab2 > a").attr("title", "");
        $(".subs .notices2").removeClass("active");

        $(this).addClass("active");
        $(this).find("> a").attr("title", "선택됨");
        $("#" + tab_id).addClass("active");

        if ($(".boxs_ann .box_ann").length > 0) {
            $(".boxs_ann .box_ann span").matchHeight();
        }

        if ($(".list_pointthumb_wrap").length > 0) {
            $(".list_pointthumb_wrap .box_txt").matchHeight();
        }
    });

    setMatchHeight();

    $(".d-close").click(function () {
        setTimeout(function () {
            $("body").removeClass("hidden");
        }, 500);
    });

    $(".cont_picwrap > a.btn_imgdetailpop").on("click", function () {
        var _viewimg = $(this).find("img.hide").attr("src");
        var img = new Image();
        img.src = _viewimg;
        img.onload = function () {
            $(".beta-img_detail .h-win").scrollTop(0);
            $(".box_pop_imgdetailarea > img").attr("src", _viewimg);
            btnpopup("beta-img_detail");
        };
    });
});

function setMatchHeight() {
    if ($(".boxs_ann .box_ann").length > 0) {
        $(".boxs_ann .box_ann span").matchHeight();
    }

    if ($(".list_pointthumb_wrap").length > 0) {
        $(".list_pointthumb_wrap .box_txt").matchHeight();
    }

    if ($(".box_step_threefigure").length > 0) {
        $(".box_step_threefigure ul.wide li .box_btmtxt strong").matchHeight();
        $(".box_step_threefigure ul").matchHeight();
    }

    if ($(".list_fourimgtxt_box").length > 0) {
        $(".list_fourimgtxt_box li").matchHeight();
    }

    if ($(".list_step_icofigure").length > 0) {
        $(".list_step_icofigure li").matchHeight();
    }

    if ($(".ethics_txt").length > 0) {
        $(".ethics_title strong").matchHeight();
        $(".ethics_content").matchHeight();
    }

    if ($(".box_grt").length > 0) {
        //$(".box_thf .box_g").matchHeight();
        $(".box_thf").matchHeight();
    }

    if ($(".txt_img_flex li strong").length > 0) {
        $(".txt_img_flex li strong").matchHeight();
        $(".txt_img_flex li p").matchHeight();
        $(".txt_img_flex li span").matchHeight();
    }

    if ($(".item_bottom .txt.mh").length > 0) {
        $(".item_bottom .txt.mh").matchHeight();
    }

    if ($(".item_bottom .txt.mh2").length > 0) {
        $(".item_bottom .txt.mh2").matchHeight();
    }

    if ($(".type_bigimg li em").length > 0) {
        $(".type_bigimg li em").matchHeight();
    }

    if ($(".type_bigimg li .box_topimg").length > 0) {
        $(".type_bigimg li .box_topimg").matchHeight();
    }

    if ($(".type_bigimg li .box_btmtxt").length > 0) {
        $(".type_bigimg li .box_btmtxt").matchHeight();
    }

    $(".boxs_ann .box_ann span").matchHeight();
}

setMatchHeight();

$(window).load(function () {
    $(".subs .notice-tab2 .tab2").eq(0).css("border-bottom-left-radius", "10px");
    $(".subs .notice-tab2 .tab2").eq(0).css("border-top-left-radius", "10px");
});

$(window).on("resize", function () {
    setMatchHeight();
});

/*$(window).on('resize', function() {
	
});*/

// tab
function testClick(el) {
    let clickTest = $(el).attr("id");
    const subTabList = ["new_visit", "new_pc", "new_mobile"].toString();
    const loanTabList = ["loan_offline", "loan_pc"].toString();
    let subIsFound = subTabList.includes(clickTest);
    let loanIsFound = loanTabList.includes(clickTest);

    if (subIsFound) {
        $(".sub_tab_title, .sub_tab_content").removeClass("active");
        console.log("asd");
        $("." + clickTest).addClass("active");
    } else if (loanIsFound) {
        tabsLoanRemove();
        $("." + clickTest).addClass("active");
    }
}

function tabsRemove() {
    $(".sub_tab_title, .sub_tab_content").removeClass("active");
}

function tabsLoanRemove() {
    $(".loan_tab_title, .loan_tab_content").removeClass("active");
}

// content

// tab
function tabChange(el) {
    let clickTest = $(el).prop("id");
    const subTabList = ["tab_01", "tab_02", "tab_03", "tab_04", "tab_05"].toString();

    let subIsFound = subTabList.includes(clickTest);

    if (subIsFound) {
        tabsRemove();
        $(".history_header li").removeClass("active");
        $("." + clickTest).addClass("active");
    }
}

function tabsRemove() {
    $(".histoty_container li").removeClass("active");
}
