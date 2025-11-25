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

    // 이전 단계 인풋 확인
    function isPrevStepFilled(item) {
        const prev = item.prev(".accordion-item");
        if (prev.length === 0) return true;

        const fields = prev.find("input:not([readonly]), select");
        let filled = true;

        fields.each(function () {
            const tag = this.tagName.toLowerCase();

            if (tag === "input" && $(this).val().trim() === "") filled = false;
            if (tag === "select" && (!$(this).val() || $(this).val() === "")) filled = false;
        });

        return filled;
    }

    // 1) 아코디언 기본 toggle
    $(".accordion-group .accordion-item .accordion-header").click(function () {
        var item = $(this).closest(".accordion-item");
        var group = item.closest(".accordion-group");

        if (item.hasClass("on")) {
            closeAccordion(item);
        } else if (isPrevStepFilled(item)) {
            openAccordion(item);
            // 다른 아코디언 닫기
            group
                .find(".accordion-item")
                .not(item)
                .each(function () {
                    closeAccordion($(this));
                });
        } else {
            alert("입력되지 않은 정보가 있습니다.");
        }
    });

    // 2) 모든 인풋 채워질 때
    $(".accordion-group .accordion-item").each(function () {
        const item = $(this);
        const fields = item.find("input:not([readonly]), select");

        // 현 단계 인풋 확인
        function checkAllFilled() {
            let filled = true;

            fields.each(function () {
                const tag = this.tagName.toLowerCase();

                if (tag === "input" && $(this).val().trim() === "") filled = false;
                if (tag === "select" && (!$(this).val() || $(this).val() === "")) filled = false;
            });

            return filled;
        }

        // comp 클래스 업데이트
        function updateComp() {
            if (checkAllFilled()) {
                item.find(".accordion-header").addClass("comp");
            } else {
                item.find(".accordion-header").removeClass("comp");
            }
        }

        // 입력/선택 변경 감지
        fields.on("input change", function () {
            updateComp();

            const allFilled = checkAllFilled();
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
            if (allFilled && isLastFilledEnough) {
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

        // 전체 단계(personal/info/id-pw) 모두 채워졌는지
        function checkAllStepsFilled() {
            let filled = true;

            $(".accordion-item.personal, .accordion-item.info, .accordion-item.id-pw").each(function () {
                const itemFields = $(this).find("input:not([readonly]), select");

                itemFields.each(function () {
                    const tag = this.tagName.toLowerCase();
                    if (tag === "input" && $(this).val().trim() === "") filled = false;
                    if (tag === "select" && (!$(this).val() || $(this).val() === "")) filled = false;
                });
            });

            return filled;
        }

        // 버튼 disable
        function updateSignupButton() {
            $(".btns .signup-bt button").prop("disabled", !checkAllStepsFilled());
        }

        updateComp();
        updateSignupButton();
    });

    // 팝업
    $(".btn_pop").on("click", function (e) {
        e.preventDefault();
        const id = $(this).data("pop");
        $("#" + id).fadeIn("slow");
    });
});
