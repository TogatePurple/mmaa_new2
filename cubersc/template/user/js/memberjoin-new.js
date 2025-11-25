$(document).ready(function () {
    // 아코디언 열릴 때
    function openAccordion(item) {
        item.addClass("on")
            .find(".accordion-content")
            .stop()
            .slideDown("fast", function () {
                $("html").animate({ scrollTop: item.offset().top - 20 }, 300);
                $(this).css({
                    height: "",
                    paddingTop: "",
                    paddingBottom: "",
                    marginTop: "",
                    marginBottom: "",
                });
            });
    }

    // 아코디언 닫을 때
    function closeAccordion(item) {
        item.removeClass("on").find(".accordion-content").stop().slideUp("fast");
        item.find(".accordion-header").removeClass("on").attr("aria-expanded", false);
    }

    // 1) 아코디언 기본 toggle
    $(".accordion-group .accordion-item .accordion-header").click(function () {
        var item = $(this).closest(".accordion-item");
        var group = item.closest(".accordion-group");

        if (item.hasClass("on")) {
            closeAccordion(item);
        } else {
            openAccordion(item);
            // 다른 아코디언 닫기
            group
                .find(".accordion-item")
                .not(item)
                .each(function () {
                    closeAccordion($(this));
                });
        }
    });

    // 2) 오토 포커스
    $(".accordion-group .accordion-item").each(function () {
        const item = $(this);
        const fields = item.find("input:not([readonly]), select");

        fields.on("input change", function () {
            let isLastFilledEnough = true;

            const isLastField = $(this).is(fields.last());

            if (!isLastField) {
                return updateSignupButton();
            }

            // -------------------------
            // 단계별 마지막 필드 조건
            // -------------------------
            if (item.hasClass("personal")) {
                if (this.tagName.toLowerCase() === "input") {
                    isLastFilledEnough = $(this).val().length === 4;
                }
            }

            // info 단계
            if (item.hasClass("info")) {
                if (this.tagName.toLowerCase() === "select") {
                    isLastFilledEnough = !!$(this).val();
                }
            }

            // personal → info → id-pw 자동 이동
            if (isLastFilledEnough) {
                const nextItem = item.nextAll(".accordion-item.info, .accordion-item.id-pw").first();
                if (nextItem.length) {
                    closeAccordion(item);
                    openAccordion(nextItem);

                    const firstInput = nextItem.find("input, select").first();
                    if (firstInput.length) {
                        setTimeout(() => firstInput.focus(), 150);
                    }
                }
            }

            updateSignupButton();
        });
    });

    // 팝업
    $(".btn_pop").on("click", function (e) {
        e.preventDefault();
        const id = $(this).data("pop");
        $("#" + id).fadeIn("slow");
    });
});
