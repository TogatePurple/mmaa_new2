// 민정 추가
$(document).on("click", "label[for='nottoday2']", function () {
    setCookie("divpops2", "Y", 1);
    $(".beta-eventpop").fadeOut("slow", function () {
        $("body").removeClass("hidden");
    });
    localStorage.setItem("divpops2", "Y");
});
// 쿠키 세팅 및 쿠키에 따라 팝업 보여지기
function getCookie(name) {
    const match = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
    return match ? match[2] : null;
}

window.onload = function () {
    if (getCookie("divpops2") || localStorage.getItem("divpops2") === "Y") {
        $(".help-bg.beta-eventpop").hide();
    } else {
        $(".help-bg.beta-eventpop").show();
    }
};
