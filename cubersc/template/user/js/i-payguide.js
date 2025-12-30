// ⭐251230 퍼블: common.js > .m_tabswiper3 로직 복사해서 수정
$(document).ready(function () {
    $(window).load(function () {
        var ww = $(window).width();
        var moTabSwiperLT = undefined;

        function tabOnlyMobileSwiperLongterm() {
            var tab_idx = $(".m_tabswiper3.longterm .tab-link.currents").index();

            if ($(".m_tabswiper3.longterm").length < 1) {
                return;
            }
            if (ww < 600 && moTabSwiperLT == undefined) {
                moTabSwiperLT = new Swiper(".swiper-container.m_tabswiper3.longterm", {
                    slidesPerView: "auto",
                    spaceBetween: 0,
                    simulateTouch: true,
                    loop: false,
                    autoplay: false,
                    observer: true,
                    observerParents: true,
                    // ⭐[S] 251230 퍼블: 옵션 추가
                    centeredSlides: true,
                    centeredSlidesBounds: true,
                    slideToClickedSlide: true,
                    touchStartPreventDefault: false,
                    on: {
                        setTranslate: function () {
                            const swiper = this;
                            const wrapper = swiper.wrapperEl;

                            // 시작
                            if (swiper.isBeginning) {
                                wrapper.style.transform = "translateX(0px)";
                                return;
                            }

                            // 끝
                            if (swiper.isEnd) {
                                // 1️⃣ wrapper 전체 실제 길이
                                var wrapperWidth = wrapper.offsetWidth;

                                // 2️⃣ 모든 slide 실제 길이 합
                                var slidesTotalWidth = 0;

                                for (var i = 0; i < swiper.slides.length; i++) {
                                    var slide = swiper.slides[i];
                                    var inner = slide.querySelector("a");
                                    var rect = inner.getBoundingClientRect();

                                    slidesTotalWidth += rect.width + 40;
                                }
                                var diff = wrapperWidth - slidesTotalWidth - 10;
                                wrapper.style.transform = `translateX(${diff}px)`;
                            }
                        },
                    },
                    // ⭐[E] 251230 퍼블: 옵션 추가
                });
                moTabSwiperLT.slideTo(tab_idx, 1000, false);
            } else if (ww >= 600 && moTabSwiperLT != undefined) {
                moTabSwiperLT.destroy();
                moTabSwiperLT = undefined;
            }
        }
        tabOnlyMobileSwiperLongterm();
        $(window).on("resize", function () {
            ww = $(window).width();
            tabOnlyMobileSwiperLongterm();
        });
    });
});
