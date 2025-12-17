$(document).ready(function () {
    $(".step2").hide();

    $(function () {
        $(".btn-next").on("click", function () {
            $(".btns .btn-next").hide();
            $(".step2").show();

            $(".h-win.check-popup").animate(
                {
                    scrollTop: $(".h-win.check-popup").scrollTop() + $(".step2").position().top,
                },
                300
            );
        });
    });
});
