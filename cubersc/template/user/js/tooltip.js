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

    // 전체 토글 버튼
    var allBtn = document.querySelector(".acc-footer-btn");
    var isAllOpen = true;

    allBtn.addEventListener("click", () => {
        var blocks = document.querySelectorAll(".acc-block");

        blocks.forEach((b) => {
            if (isAllOpen) {
                b.classList.add("acc-open");
            } else {
                b.classList.remove("acc-open");
            }
        });

        allBtn.textContent = isAllOpen ? "접기" : "상세내역 보기";
        isAllOpen = !isAllOpen;
    });
});
