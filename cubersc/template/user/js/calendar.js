$(document).ready(function () {
    //#.# 입력 이벤트리스너. input[type=text]태그에 쓸수있음.
    input0_1("#inrt");

    //input에 입력값 허용범위지정 (숫자와 콤마(,) 허용)
    var regex = /^[0-9,]/;
    //input에 입력값 허용범위지정 (숫자 허용)
    var regex2 = /^[0-9]/;
    inputregex("money", regex);
    inputregex("date", regex2);

    //예금형목돈수탁 가입기본정보 가져오기
    // $.ajax({
    //     url: "/api/IsSimulationReady.do",
    //     type: "post",
    //     dataType: "json",
    //     async: true,
    //     success: function (response) {
    //         //요청 api 성공시(실패경우있음)
    //         console.log("------response-------");
    //         console.log(response);
    //         if (!("message" in response) && response["status"] == 200) {
    //             isSimulReady(response["data"]);
    //         } else {
    //             alert("status:" + response["status"] + "\n" + response["message"]);
    //         }
    //     },
    //     error: function (request, status, error) {
    //         //api 중단될때
    //         if (request.responseText.indexOf("로그인 후 이용") > 0) {
    //             alert("로그인 후 이용가능합니다.");
    //             location.href = "/web/contents/webLogin.do";
    //         } else {
    //             alert("api오류\ncode:" + request.status + "\n" + "message:" + request.responseText + "\n");
    //         }
    //     },
    // });

    //달력 세팅
    const today = bankUtil.Date.get("yyyy-MM-DD");

    $("#scbDt")
        .dateRangePicker({
            yearSelect: true,
            monthSelect: true,
            format: "YYYY-MM-DD",
            startDate: today,
            autoClose: true,
            singleDate: true,
            showShortcuts: false,
            singleMonth: true,
            language: "ko",
        })
        .on("input", function () {
            //입력값 구하기
            let inputVal = delAddString($(this).val());
            //가입년월 이후 구하기
            let year = bankUtil.Date.get("yyyy");
            let month = bankUtil.Date.get("yyyyMM");
            let day = bankUtil.Date.get("yyyyMMDD");

            if (inputVal.length == 6) {
                //입력한 날짜가 오늘이전인경우 오늘로 바꿈.
                if (inputVal < month) {
                    inputVal = month;
                }
                //입력한 월이 날짜형식 벗어나면 12월로 바꿈.
                if (parseInt(inputVal.substring(4, 6), 10) > 12) {
                    inputVal = parseInt(inputVal.substring(4, 0), 10) + "12";
                }
            } else if (inputVal.length == 8) {
                //입력한 날짜가 오늘 이전인경우 오늘로 바꿈.
                if (inputVal < day) {
                    inputVal = day;
                }
                //입력한 날짜가 형식을 벗어나면 마지막날로바꿈
                if (!bankUtil.Date.chkDateTp(inputVal)) {
                    let ym = parseInt(inputVal.substring(0, 6), 10);
                    inputVal = ym + "" + bankUtil.Date.getLastDay(ym);
                }
            }
            //YYYY-MM-DD형식으로 바꿈.
            let changedFormat = formatDate(inputVal + "");
            $(this).val(changedFormat);
        });

    //초기화버튼 클릭 시
    $("#resetBtn").click(function () {
        viewReset();
    });

    //탭이동시 초기화
    $("[data-taxtype]").click(function () {
        let taxType = $(this).data("taxtype");
        viewReset(taxType);
    });

    //적용버튼 클릭 시
    $("#applyBtn").click(function () {
        //조회 필요입력값 확인
        if (inputValid()) {
            //조회시작
            startSerch();
        }
    });
});
