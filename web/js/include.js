document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-include]").forEach((el) => {
        const file = el.getAttribute("data-include");
        fetch(file)
            .then((res) => res.text())
            .then((html) => {
                el.innerHTML = html;

                el.querySelectorAll("script").forEach((oldScript) => {
                    const newScript = document.createElement("script");
                    if (oldScript.src) {
                        newScript.src = oldScript.src;
                    } else {
                        newScript.textContent = oldScript.textContent;
                    }
                    document.body.appendChild(newScript);
                    oldScript.remove();
                });
            })
            .catch((err) => console.error("include error:", err));
    });
});
