$(document).ready(function () {
    const btn = document.querySelector(".info-icon");
    const tip = document.querySelector("#tooltip1");

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

    // 클릭으로 토글
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
});
