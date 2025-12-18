$(document).ready(function () {
    $(".step2").hide();

    $(function () {
        $(".btn-next").on("click", function () {
            $(".btns .btn-next").hide();
            $(".step2").show();

            $(".h-win.pre-popup .box_calcwrap").animate(
                {
                    scrollTop: $(".h-win.pre-popup .box_calcwrap").scrollTop() + $(".step2 .main-txt").position().top,
                },
                300
            );
        });
    });
});
