$(document).ready(function () {
    // 툴팁
    var btn = document.querySelector(".info-icon");
    var tip = document.querySelector("#tooltip1");

    function openTip() {
        tip.hidden = false;
        tip.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
    }

    function closeTip() {
        tip.hidden = true;
        tip.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
    }

    btn.addEventListener("mouseenter", openTip);
    btn.addEventListener("mouseleave", closeTip);
    btn.addEventListener("focus", openTip);
    btn.addEventListener("blur", closeTip);

    btn.addEventListener("click", () => {
        tip.hidden ? openTip() : closeTip();
    });

    btn.addEventListener("keydown", (e) => {
        if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            tip.hidden ? openTip() : closeTip();
        }
        if (e.key === "Escape") {
            closeTip();
        }
    });

    // 상세내역 개별 토글
    document.querySelectorAll(".acc-wrap").forEach((wrap) => {
        var allBtn = wrap.querySelector(".acc-footer-btn");
        var isOpen = false;

        allBtn.addEventListener("click", () => {
            var blocks = wrap.querySelectorAll(".acc-block");

            blocks.forEach((b) => {
                if (!isOpen) {
                    b.classList.add("acc-open");
                } else {
                    b.classList.remove("acc-open");
                }
            });

            allBtn.textContent = !isOpen ? "접기" : "상세내역 보기";
            isOpen = !isOpen;
        });
    });

    // 상세내역 전체 토글
    function toggleMoTable(isOpen) {
        $(".mo-table").toggleClass("is-open", isOpen);
        $(".mo-btn.open").toggleClass("hide", isOpen);
        $(".mo-btn.close").toggleClass("hide", !isOpen);
    }

    $(".mo-btn.open").on("click", function () {
        toggleMoTable(true); // 열기
    });

    $(".mo-btn.close").on("click", function () {
        toggleMoTable(false); // 닫기
    });
});
