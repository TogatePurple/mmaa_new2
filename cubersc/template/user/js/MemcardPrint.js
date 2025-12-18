// ⭐251218 퍼블: common.js 577줄 원본 복사 후 수정
$(document).ready(function () {
    $(window).load(function () {
        var ww = $(window).width();
        var moTabSwiper = undefined;

        function tabOnlyMobileSwiper() {
            // notice-tab
            var tab_idx = $(".m_tabswiper .tab.active").index();

            if ($(".m_tabswiper").length < 1) {
                return;
            }
            // ⭐화면 너비 기준 삭제
            if (moTabSwiper == undefined) {
                moTabSwiper = new Swiper(".swiper-container.m_tabswiper", {
                    slidesPerView: "auto",
                    spaceBetween: 0,
                    simulateTouch: true,
                    loop: false,
                    autoplay: false,
                    observer: true,
                    observerParents: true,
                });

                console.log(tab_idx);
                moTabSwiper.slideTo(tab_idx, 1000, false); //활성화 된 탭이 잘 보이는 위치로 이동시켜줌
            } // ⭐화면 너비 기준 삭제
            else if (moTabSwiper != undefined) {
                moTabSwiper.destroy();
                moTabSwiper = undefined;
            }
        }

        tabOnlyMobileSwiper();
        $(window).on("resize", function () {
            ww = $(window).width();

            tabOnlyMobileSwiper();
        });
    });
});
