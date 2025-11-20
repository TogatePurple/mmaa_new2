/**
 * @파일명 : tssimulation.js
 * @파일정보 : 목돈수탁 예상금액 조회 JS
 * @수정이력
 * @수정자    수정일       수정내용
 * @------- ------------ ----------------
 * @bluej  2023.10.3 최초생성(SHW)
 * @---------------------------------------
 * @author (주)퀴리오스 개발팀
 * @since 2009. 01.14
 * @version 3.0.8 Copyright (C) ITGOOD All right reserved.
 */

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
    $.ajax({
        url: "/api/IsSimulationReady.do",
        type: "post",
        dataType: "json",
        async: true,
        success: function (response) {
            //요청 api 성공시(실패경우있음)
            console.log("------response-------");
            console.log(response);
            if (!("message" in response) && response["status"] == 200) {
                isSimulReady(response["data"]);
            } else {
                alert("status:" + response["status"] + "\n" + response["message"]);
            }
        },
        error: function (request, status, error) {
            //api 중단될때
            if (request.responseText.indexOf("로그인 후 이용") > 0) {
                alert("로그인 후 이용가능합니다.");
                location.href = "/web/contents/webLogin.do";
            } else {
                alert("api오류\ncode:" + request.status + "\n" + "message:" + request.responseText + "\n");
            }
        },
    });

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

//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 조회결과 출력 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//예상조회 결과 출력
function drawResult(data, taxType) {
    if ($.isEmptyObject(data)) {
        return;
    }
    //테이블 영역 그리기
    let tbody = "";
    //테이블 합계 영역
    let tfoot = "";
    //모바일 영역 그리기
    let mbody = "";
    //모바일 영역합계
    let mhead = "";

    if (taxType == "txtn") {
        //과세그리기
        //지급일자 payDt
        let payDt = bankUtil.Date.get("yyyy-MM-DD", data["payDt"]);
        //세전이자 itamt
        let itamt = bankUtil.Format.number(data["itamt"]) + "원";
        //가입원금 pnamt
        let pnamt = bankUtil.Format.number(data["pnamt"]) + "원";
        //소득세 inctx
        let inctx = bankUtil.Format.number(data["inctx"]) + "원";
        //지방소득세 rsdtx
        let rsdtx = bankUtil.Format.number(data["rsdtx"]) + "원";
        //계 tax
        let tax = bankUtil.Format.number(data["tax"]) + "원";
        //지급이자 payAmt
        let payAmt = bankUtil.Format.number(data["payAmt"]) + "원";

        tbody += "<tr>";
        tbody += "<td>" + payDt + "</td>";
        tbody += "<td class='right'>" + pnamt + "</td>";
        tbody += "<td class='right'>" + itamt + "</td>";
        tbody += "<td class='right'>" + inctx + "</td>";
        tbody += "<td class='right'>" + rsdtx + "</td>";
        tbody += "<td class='right'>" + tax + "</td>";
        tbody += "<td class='right'>" + payAmt + "</td>";
        tbody += "</tr>";

        mbody += "<div class='one-app next'>";
        mbody += "<div class='cont-mb'>";
        mbody += "<div><span>지급일자</span> <span>" + payDt + "</span></div>";
        mbody += "<div><span>가입금액</span> <span>" + pnamt + "</span></div>";
        mbody += "<div><span>세전이자</span> <span>" + itamt + "</span></div>";
        mbody += "<div><span>소득세</span> <span>" + inctx + "</span></div>";
        mbody += "<div><span>지방소득세</span> <span>" + rsdtx + "</span></div>";
        mbody += "<div><span>세금계</span> <span>" + tax + "</span></div>";
        mbody += "<div><span>실수령액</span> <span>" + payAmt + "</span></div>";
        mbody += "</div>";
        mbody += "</div>";

        $("#result_txtn #pcbody").html(tbody);
        $("#result_txtn #mobody").html(mbody);
    } else if (taxType == "ntax") {
        //비과세그리기
        //지급일자 payDt
        let payDt = bankUtil.Date.get("yyyy-MM-DD", data["payDt"]);
        //세전이자 itamt
        let itamt = bankUtil.Format.number(data["itamt"]) + "원";
        //가입원금 scbAmt
        let pnamt = bankUtil.Format.number(data["pnamt"]) + "원";
        //지급이자 payAmt
        let payAmt = bankUtil.Format.number(data["payAmt"]) + "원";

        tbody += "<tr>";
        tbody += "<td>" + payDt + "</td>";
        tbody += "<td class='right'>" + pnamt + "</td>";
        tbody += "<td class='right'>" + itamt + "</td>";
        tbody += "<td class='right'>" + payAmt + "</td>";
        tbody += "</tr>";

        mbody += "<div class='one-app next'>";
        mbody += "<div class='cont-mb'>";
        mbody += "<div><span>지급일자</span> <span>" + payDt + "</span></div>";
        mbody += "<div><span>가입금액</span> <span>" + pnamt + "</span></div>";
        mbody += "<div><span>이자</span> <span>" + itamt + "</span></div>";
        mbody += "<div><span>실수령액</span> <span>" + payAmt + "</span></div>";
        mbody += "</div>";
        mbody += "</div>";

        $("#result_ntax #pcbody").html(tbody);
        $("#result_ntax #mobody").html(mbody);
    }
}

//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 적용버튼 클릭시 실행 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

//조회 필요입력값 확인
function inputValid() {
    //과세타입
    let taxType = $('[data-tab="notice1"].active').data("taxtype");
    //가입금액 vaild
    //진입조회시 저장했던 정보를 꺼냄
    var minamt = $("#scbAmt").data("minamt");
    var scbAmt = delAddString($("#scbAmt").val());
    if (scbAmt == "") {
        alertFocus("가입금액을 입력하세요.", "scbAmt");
        return false;
    } else if (scbAmt < minamt) {
        alertFocus("최소 가입 가능금액은 " + bankUtil.Format.number(minamt) + "원 입니다.", "scbAmt");
        return false;
    }

    //비과세 시 가입금액 한도 확인
    if (taxType == "ntax") {
        console.log(taxType);
        let ntaxLimtAmt = $("#totalscbAmt").data("ntaxlimit");
        let pnamt = Number(delAddString($("#totalscbAmt").val()));
        console.log(ntaxLimtAmt);
        console.log(pnamt);
        if (pnamt > ntaxLimtAmt) {
            alert("비과세종합저축 가입한도 금액은 " + bankUtil.Format.number(ntaxLimtAmt) + "원 입니다.");
            return;
        }
    }

    //가입일자 vaild
    var scbDt = $("#scbDt").val().replaceAll("-", "");
    if (scbDt == "") {
        alertFocus("가입일자를 입력해주세요.", "scbDt");
        return false;
    } else if (scbDt.length < 8 || !bankUtil.Date.chkDateTp(scbDt)) {
        alertFocus("가입일자의 형식이 잘못되었습니다.:" + scbDt, "scbDt");
        return false;
    } else if (scbDt < bankUtil.Date.get("yyyyMMDD")) {
        //초기화
        scbDtobj.val(bankUtil.Date.get("yyyyMMDD"));
        alertFocus("가입일자는 오늘 이후일자를 입력해주세요.", "scbDt");
        return false;
    }

    //가입기간
    var scbPdCd = $("#scbPdCd").val();
    if (scbPdCd == 0) {
        alertFocus("가입기간을 입력해주세요.", "scbPdCd");
        return false;
    }
    return true;
}

//조회시작
function startSerch() {
    console.log("startSerch진입");
    //과세타입
    let taxType = $('[data-tab="notice1"].active').data("taxtype");
    var sendObj = {};
    //과세타입
    sendObj["taxType"] = taxType + "";
    //가입일자
    sendObj["scbDt"] = $("#scbDt").val().replaceAll("-", "") + "";
    //가입금액
    sendObj["scbAmt"] = delAddString($("#scbAmt").val()) + "";
    //가입기간
    sendObj["scbPdCd"] = $("#scbPdCd").val() + "";

    let inrtVal = $("#inrt").val();
    let inrtPlc = $("#inrt").attr("placeholder");
    if (inrtVal && inrtVal !== inrtPlc) {
        sendObj["inrt"] = inrtVal;
    }

    $.ajax({
        url: "/api/IssavingSimulation.do", //EA014
        type: "post",
        data: JSON.stringify(sendObj),
        contentType: "application/json",
        dataType: "json",
        async: true,
        success: function (response) {
            //요청 api 성공시(실패경우있음)
            console.log("----response----");
            console.log(response);
            if (!("message" in response) && response["status"] == 200) {
                drawResult(response["data"], taxType);
            } else {
                alert("status:" + response["status"] + "\n" + "message:" + response["message"] + "\n");
                alert("데이터를 가져오지 못했습니다.");
            }
        },
        error: function (request, status, error) {
            //api 중단될때
            alert("api오류\ncode:" + request.status + "\n" + "message:" + request.responseText + "\n");
        },
    });
}

//■■■■■■■■■■■■■■■■■■■ 초기화 ■■■■■■■■■■■■■■■■
//화면 초기화하기
function viewReset(type) {
    let taxType = "";
    if (type == undefined) {
        //과세타입 구하기
        taxType = $('[data-tab="notice1"].active').data("taxtype");
    } else {
        taxType = type;
    }

    $("#result_txtn #pcbody").html("");
    $("#result_txtn #pcfoot").html("");
    $("#result_txtn #mobody").html("");
    $("#result_txtn #mohead").html("");

    $("#result_ntax #pcbody").html("");
    $("#result_ntax #pcfoot").html("");
    $("#result_ntax #mobody").html("");
    $("#result_ntax #mohead").html("");

    let title = "";
    if (taxType == "txtn") {
        title = "현역/예비역 회원저축(적립형)";
        //조회결과영역 토글
        $("#result_ntax").addClass("hide");
        $("#result_txtn").removeClass("hide");
    } else if (taxType == "ntax") {
        title = "현역/예비역 회원저축(적립형) 비과세종합저축";
        //조회결과영역 토글
        $("#result_txtn").addClass("hide");
        $("#result_ntax").removeClass("hide");
    }
    $("#title1").text(title);
    $("#title2").text(title);
    $("#myTitle").text(title);
    //가입금액 초기화
    $("#scbAmt").val("");
    //가입일자 초기화scbDt
    $("#scbDt").val("");
    //가입기간 초기화scbPdCd
    $("#scbPdCd").val("0");
    //가입금액 초기화scbPdCd
    $("#totalscbAmt").val("");
    //조회 리스트 초기화
    $("#pcbody").html("");
    $("#mobody").html("");
    var printObj = {};
    printObj["totalitamt"] = "";
    printObj["totalpnamt"] = "";
    printObj["totalpayAmt"] = "";
    allResultaddHtml(printObj);
    $("#inrt").val("");
}

//■■■■■■■■■■■■■■■■■■■ 진입 시 조회한 정보 세팅: 예금형목돈수탁 상품가입 기본정보 (input) ■■■■■■■■■■■■■■■■
//기본 정보 조회 후 input 세팅
function isSimulReady(isReady) {
    //가입금액 입력값 제한걸기-------------
    //1. 가입금액 출력할 요소 선택하기
    let scbAmt = $("#scbAmt");
    //2. 조회한 최소 가입금액 구하기 mummPmntAmt
    var mummPmntAmt = isReady["mummPmntAmt"];
    //3. 조회한 최대 가입금액 구하기 mxmmPmntAmt
    var mxmmPmntAmt = isReady["mxmmPmntAmt"];
    //비과세 한도는 인터페이스 요청중. 하드코딩처리함. 인터페이스 나오면 바꿔야 함◀◀◀◀◀◀◀◀◀◀◀◀20231003_shw
    //4. 비과세 한도
    let ntaxLimtAmt = isReady["ntaxLimtAmt"];
    //비과세 한도 저장
    $("#totalscbAmt").data("ntaxlimit", ntaxLimtAmt);
    //적용 시 validation용으로 data속성으로 저장시킴.
    $(scbAmt).data("minamt", mummPmntAmt);

    //4. 버튼에 리스너 걸기
    setmoneyOn(mxmmPmntAmt, ntaxLimtAmt);

    //가입금액 input에 제한값 설정하기
    $(scbAmt).on("input", function () {
        let value = Number(delAddString($(this).val()));
        if (value > mxmmPmntAmt) {
            value = mxmmPmntAmt;
        }
        $(scbAmt).val(bankUtil.Format.number(value));
    });
    //가입기간 설정하기-------------
    //가입기간 scbPdCdList[] //리스트 coCva 코드 coCvaNm 명
    var scbPdCdList = isReady["scbPdCdList"];
    //select에 담을 값 정제하기 selectid
    let newscbPdCdList = $.map(scbPdCdList, function (scbPdCd) {
        return {
            value: scbPdCd.coCva,
            text: scbPdCd.coCvaNm,
        };
    });

    //가입기간 출력하기
    bankUtil.makeSelect("scbPdCd", newscbPdCdList, "value", "text", true);

    //가입금액 input시 가입금액 update 이벤트 리스너 걸기-작업중
    //만원단위 입력, 값 입력시 가입금액 update
    $("#scbAmt").on("input", function () {
        //입력한 값 가져오기
        let currmoney = Number(delAddString($(this).val()));
        if (currmoney == 0) {
            $(this).val("");
        } else {
            //출력하기
            $(this).val(bankUtil.Format.number(currmoney));
        }

        //출력 후 가입금액 update실행
        scbAmtupdate();
    });

    $("#scbPdCd").on("change", function () {
        //가입금액 update실행
        scbAmtupdate();
    });

    //적립형 목돈수탁 기준이율
    let inrt = isReady["inrtMtList"][0]["inrt"];
    $("#inrt").attr("placeholder", inrt);
}

//가입금액 update
function scbAmtupdate() {
    //월납부금 가져오기
    let monthMoney = Number(delAddString($("#scbAmt").val()));
    //가입기간 가져오기
    let scbPdCd = Number($("#scbPdCd").val().replace("Y", ""));
    //가입금액 계산하기
    let resultMoney;
    if (monthMoney * scbPdCd * 12 == 0) {
        resultMoney = "";
    } else {
        resultMoney = bankUtil.Format.number(monthMoney * scbPdCd * 12);
    }
    let taxType = $('[data-tab="notice1"].active').data("taxtype");
    console.log(monthMoney);
    console.log(scbPdCd);
    console.log(resultMoney);
    //가입금액 출력하기
    $("#totalscbAmt").val(resultMoney);

    if (taxType == "ntax") {
        let ntaxLimtAmt = $("#totalscbAmt").data("ntaxlimit");
        let pnamt = Number(delAddString($("#totalscbAmt").val()));
        if (pnamt > ntaxLimtAmt) {
            $("#totalscbAmt").css("color", "red");
        } else {
            $("#totalscbAmt").css("color", "");
        }
    } else {
        $("#totalscbAmt").css("color", "");
    }
}

//돈버튼 클릭시 값 더해짐
function setmoneyOn(maxMoney, ntaxLimtAmt) {
    $("[data-setmoney]").on("click", function () {
        let taxType = $('[data-tab="notice1"].active').data("taxtype");

        var currScbAmtVal = delAddString($("#scbAmt").val());
        if (currScbAmtVal == "") currScbAmtVal = 0;
        var btnSetMoney = $(this).data("setmoney");
        //숫자로 변환한 기존값(계산을 위함)
        //더할 값
        var addMoney = 0;
        //data-setmoney 값에 따라 addMoney 설정합니다.
        //리셋할땐 최대가입금액을 초기화합니다.
        if (btnSetMoney == "reset") {
            $("#scbAmt").val("");
            $("#scbAmt").trigger("input");
            return;
        } else {
            addMoney = btnSetMoney;
        }
        var resultMoney = 0;
        resultMoney = Number(currScbAmtVal) + Number(addMoney);
        if (resultMoney > maxMoney) {
            resultMoney = maxMoney;
        }
        $("#scbAmt").val(bankUtil.Format.number(resultMoney));
        $("#scbAmt").trigger("input");
    });
}

//alert메세지를 띄우고 forElement에 focus하는함수
function alertFocus(msg, elementID) {
    alert(msg);
    $("#" + elementID).focus();
}
