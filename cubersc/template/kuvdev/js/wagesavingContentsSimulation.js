/**
 * @파일명 : wagesavingContentsSimulation.js
 * @파일정보 : 회원퇴직급여 조회 JS
 * @수정이력
 * @수정자    수정일       수정내용
 * @------- ------------ ----------------
 * @bluej  2023.5.08 최초생성(SHW)
 * @---------------------------------------
 * @author (주)퀴리오스 개발팀
 * @since 2009. 01.14
 * @version 3.0.8 Copyright (C) ITGOOD All right reserved.
 *
 */

//숫자 입력값 허용
var regexNumber = /^[0-9-]/;
$(document).ready(function () {
    //점포함 숫자입력시 #.#형으로 변환. input[type=text]태그에 쓸수있음.
    input0_1("#inrt");

    //회원 가입 총구좌수 조회+ 퇴직급여 기본정보 조회
    $.ajax({
        url: "/api/WagesavingMaxAccntReady.do",
        type: "post",
        dataType: "json",
        async: true,
        success: function (response) {
            //요청 api 성공시(실패경우있음)
            console.log("-----response---111---");
            console.log(response);
            if ("result" in response) {
                var result = response["result"];
                if (result["status"] == 200) {
                    //사용할 내용을 담아 이벤트 리스너를 겁니다.
                    var maxAccnt = result["data"]["maxAccnt"];
                    dataSetAccnt("accnt", "setaccnt", maxAccnt);
                    //조회가능 최대구좌이상 숫자 제한.
                    $("#accnt").on("input", function () {
                        inputSummary(this, response);
                    });
                    //이자소득세율안내 (최대가입가능구좌, 금액), 가입년월 세팅
                    inputScbInfo(response);
                } else {
                    alert("status:" + result["status"] + "\n" + result["message"]);
                }
            } else {
                alert("처리 중 오류가 발생하였습니다.");
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

    //숫자입력 인풋
    inputregex("numberinput", regexNumber);
    $("#endDt").on("input", function () {
        //입력값 구하기
        let inputVal = delAddString($(this).val());
        //가입년월 이후 구하기
        let nextyear = bankUtil.Date.get("yyyy", getscbYm() + "10", "m", 1);
        let nextMonth = bankUtil.Date.get("yyyyMM", getscbYm() + "10", "m", 1);
        let nextday = bankUtil.Date.get("yyyyMMDD", getscbYm() + "10", "m", 1);

        if (inputVal.length == 6) {
            //입력한 날짜가 오늘이전인경우 오늘로 바꿈.
            if (inputVal < nextMonth) {
                inputVal = nextMonth;
            }
            //입력한 월이 날짜형식 벗어나면 12월로 바꿈.
            if (parseInt(inputVal.substring(4, 6), 10) > 12) {
                inputVal = parseInt(inputVal.substring(4, 0), 10) + "12";
            }
        } else if (inputVal.length == 8) {
            //입력한 날짜가 오늘 이전인경우 오늘로 바꿈.
            if (inputVal < nextday) {
                inputVal = nextday;
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

    //급여금 추정> 조회 버튼 누르면 실행할 validation
    $("#btnSearch").click(function () {
        //필수 입력값 null,유효성검사
        var checkInput = wsInputValid();
        let inrtVal = $("#inrt").val();
        let inrtPlc = $("#inrt").attr("placeholder");
        if (inrtVal && inrtVal !== inrtPlc) {
            $("input[name='inrt']").val(inrtVal);
        }
        if (checkInput) {
            //조회하기
            $.ajax({
                url: "/api/WagesavingSimulation.do",
                type: "post",
                data: $("#form_wgSimul").serialize(),
                dataType: "json",
                async: true,
                success: function (response) {
                    //요청 api 성공시(실패경우있음)
                    console.log("--------111-----");
                    console.log(response);
                    if ("wsSimulation" in response) {
                        var wsSimulation = response["wsSimulation"];
                        if (wsSimulation["status"] == 200) {
                            //사용할 오브젝트를 담습니다.
                            var wsSimulData = wsSimulation["data"];
                            wsDrawing(wsSimulData);
                            $("#resultArea").css("display", "block");
                        } else {
                            alert("status:" + wsSimulation["status"] + "\n" + wsSimulation["message"]);
                        }
                    }
                },
                error: function (request, status, error) {
                    //api 중단될때
                    alert("api오류\ncode:" + request.status + "\n" + "message:" + request.responseText + "\n");
                },
            });
        }
    });
});

function inputScbInfo(response) {
    var result2 = response["result2"]["data"];
    var mxmmPmntAmt = result2["mxmmPmntAmt"];
    var mxmmScbAccnt = result2["mxmmScbAccnt"];
    var scbYm = result2["scbYm"];
    var printMoney = mxmmPmntAmt / 10000;
    printMoney = Math.round(printMoney);
    $("#maxAccnt").text(mxmmScbAccnt);
    $("#maxAmt").text(printMoney);
    let inrt = result2["inrtMtList"][0]["inrt"];
    $("#inrt").attr("placeholder", inrt);
    $("#inrt").on("blur", function () {
        let v = $(this).val();
        let p = $(this).attr("placeholder");
        if (v === p) {
            $("input[name='inrt']").val("");
        } else {
            $("input[name='inrt']").val(v);
        }
    });
    //조회 종료년월일 (최초세팅)
    $("#endDt").dateRangePicker({
        yearSelect: true,
        yearSelectRange: 30,
        startDate: bankUtil.Date.get("yyyy-MM", scbYm),
        monthSelect: true,
        autoClose: true,
        singleDate: true,
        showShortcuts: false,
        singleMonth: true,
        language: "ko",
        format: "YYYY-MM-DD",
    });
    $("#bgngYm").data("startdt", scbYm);
    //조회 시작년월일 (최초세팅)
    $("#bgngYm")
        .on("input", function () {
            var scbYm = $(this).data("startdt");
            //입력값(시작년월) 구하기
            let inputVal = delAddString($(this).val());
            /*		console.log('시작년월: ');
		console.log(inputVal);*/
            if (inputVal.length == 6) {
                console.log("시작년월-6자리 확인");
                //입력한 월이 날짜형식 벗어나면 12월로 바꿈.
                if (parseInt(inputVal.substring(4, 6), 10) > 12) {
                    inputVal = parseInt(inputVal.substring(4, 0), 10) + "12";
                }
                if (inputVal < scbYm) {
                    inputVal = scbYm;
                }
                //YYYY-MM형식으로 바꿈.
                let changedFormat = bankUtil.Date.get("yyyy-MM", inputVal);

                $(this).val(changedFormat);

                //종료일자 달력 설정
                var endDateNum = "";
                if ($("#endDt").val() != "") {
                    var endDt = $("#endDt").val();
                    endDateNum = bankUtil.Date.get("yyyyMM", endDt);
                    if (inputVal > endDateNum) {
                        changedFormat = inputVal;
                        $("#endDt").val(bankUtil.Date.get("yyyy-MM-DD", changedFormat + "10"));
                    }
                }
                var date = "01";
                /*			console.log('inputVal');
			console.log(inputVal);
			console.log('scbYm');
			console.log(scbYm);
			console.log('endDateNum');
			console.log(endDateNum);	*/
                if (inputVal == scbYm || !endDateNum || inputVal == changedFormat) {
                    date = "10";
                }
                /*			console.log("destroy실행");
			console.log(inputVal);
			console.log(scbYm);
			console.log(date);
			console.log("changedFormat");
			console.log(changedFormat);*/
                $("#endDt").data("dateRangePicker").destroy();
                $("#endDt").dateRangePicker({
                    yearSelect: true,
                    yearSelectRange: 30,
                    startDate: changedFormat + date,
                    monthSelect: true,
                    autoClose: true,
                    singleDate: true,
                    showShortcuts: false,
                    singleMonth: true,
                    language: "ko",
                    format: "YYYY-MM-DD",
                });
            }
        })
        .dateRangePicker({
            yearSelect: true,
            yearSelectRange: 30,
            startDate: bankUtil.Date.get("yyyy-MM", scbYm),
            monthSelect: true,
            autoClose: true,
            singleDate: true,
            showShortcuts: false,
            singleMonth: true,
            language: "ko",
            format: "YYYY-MM",
        })
        .bind("datepicker-first-date-selected", function (event, dateObj) {
            var startDate = getStringFromDate(dateObj, "yyyy-MM-DD");
            startDate = bankUtil.Date.get("yyyy-MM", startDate);
            //console.log('first-date-selected');
            //console.log(startDate);
            $("#bgngYm").val(startDate);
            $("#bgngYm").trigger("input");
        })
        .val(bankUtil.Date.get("yyyy-MM", scbYm));
    $("#bgngYm").val(bankUtil.Date.get("yyyy-MM", scbYm));
    $("#bgngYm").trigger("input");
}

//가입년월 구하기
function getscbYm(paramDate) {
    let inputDate = "";
    if (paramDate == undefined) {
        inputDate = bankUtil.Date.get("YYYYMMDD");
    } else {
        inputDate = paramDate;
    }
    let today = bankUtil.Date.get("DD", inputDate);
    let returnDate = "";
    if (today > 20) {
        returnDate = bankUtil.Date.get("yyyyMM", inputDate, "m", 2);
    } else {
        returnDate = bankUtil.Date.get("yyyyMM", inputDate, "m", 1);
    }
    return returnDate;
}

/*daterangepicker에서 시작날짜 or 종료날짜구하기
return String*/
function getStringFromDate(obj, format) {
    const length = Object.keys(obj).length;
    var strDay = "";
    var bfday;
    if (length == 1) bfday = obj.date1;
    else if (length == 3) bfday = obj.date2;
    else {
        return "실패";
    }
    if (format == "yyyy-MM-DD") {
        var year = bfday.getFullYear();
        var month = ("0" + (bfday.getMonth() + 1)).slice(-2);
        var day = ("0" + bfday.getDate()).slice(-2);
        strDay = year + "-" + month + "-" + day;
    } else if (format == "yyyy-MM") {
        var year = bfday.getFullYear();
        var month = ("0" + (bfday.getMonth() + 1)).slice(-2);
        var day = ("0" + bfday.getDate()).slice(-2);
        strDay = year + "-" + month;
    }
    return strDay;
}

//구좌 수 입력시 서머리 출력
function inputSummary(thisObj, response) {
    var result = response["result"];
    var result2 = response["result2"];

    //입력가능 구좌수 최대값 설정
    var maxAccnt = result["data"]["maxAccnt"];
    if ($(thisObj).val() > maxAccnt) {
        $(thisObj).val(maxAccnt);
    }
    //1구좌 금액 가져오기
    let accoUnitAmt = result2["data"]["accoUnitAmt"];
    //입력한 구좌수로 금액 계산하기
    let calcMoney = $(thisObj).val() * accoUnitAmt;
    $("[data-accntmoney]").text(bankUtil.Format.number(calcMoney) + "원");
}

//alert메세지를 띄우고 forElement에 focus하는함수
function alertFocus(msg, element) {
    alert(msg);
    element.focus();
}

//급여추금정(신규/증좌 예상금액) 필수 입력값들의 null+형식 확인한다.
function wsInputValid() {
    //조회시작년월(yyyymm)인풋요소
    let startYm = $("#bgngYm");
    //조회종료일자(yyyymmdd)인풋요소
    let endYmd = $("#endDt");
    //구좌수 인풋요소
    let accnt = $("#accnt");

    // 조회시작년월을 확인한다.
    var startYmVal = delAddString(startYm.val());
    if (startYmVal == "") {
        alertFocus("시작년월을 입력해주세요.", startYm);
        return false;
    } else if (startYmVal.length < 6 || !bankUtil.Date.chkDateTp(startYmVal + "01")) {
        alertFocus("시작년월의 형식이 잘못되었습니다.:" + startYmVal, startYm);
        return false;
    } /*else if (startYmVal < bankUtil.Date.get("yyyyMM", "", "m", 1)) {
		alertFocus("시작년월은 익월이후의 일자를 입력하세요.", startYm);
		//익월일자 초기화
		startYm.val(bankUtil.Date.get("yyyyMM","","m",1));
		return false;
	}*/

    //조회종료 연도 - 조회시작 연도
    var endYmdVal = delAddString(endYmd.val());
    var diff_year = Number(endYmdVal.substr(0, 4)) - Number(startYmVal.substr(0, 4));
    //조회종료일자를 확인한다
    if (endYmdVal == "") {
        alertFocus("종료일자를 입력해주세요.", endYmd);
        return false;
    } else if (endYmdVal.length < 8 || !bankUtil.Date.chkDateTp(endYmdVal)) {
        alertFocus("종료일자의 형식이 잘못되었습니다.:" + endYmdVal, endYmd);
        return false;
    } else if (diff_year < 0 || diff_year > 83) {
        endYmd.val("");
        alertFocus("종료일자의 범위가 잘못되었습니다.", endYmd);
        return false;
    } /*else if (startYmVal >= endYmdVal.substring(0, 6)) {
		alertFocus("종료일자는 시작년월의 적어도 1개월 후 이어야 합니다.", endYmd);
		return false;
	}*/

    //조회구좌수를 확인한다.
    var accntval = accnt.val();
    if (accntval == null || accntval == "") {
        alertFocus("구좌수를 입력해주세요.", accnt);
        return false;
    } else if (accntval < 4) {
        alertFocus("구좌는 4 이상 이어야 합니다.", accnt);
        return false;
    }

    return true;
}

function wsDrawing(wsSimulData) {
    //출력용 데이터 오브젝트를 생성합니다.
    var printObject = {};

    //오브젝트에 출력용으로 변환된 내용을 동일한 키값으로 저장합니다.
    //-가입구좌		accnt

    printObject["accnt2"] = wsSimulData["accnt"] + " (" + (Number(wsSimulData["accnt"] * 5000) + "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원)";
    //-불입월수		pmntMnths
    printObject["pmntMnths"] = wsSimulData["pmntMnths"];
    //-원금		같은 값 출력할곳 2곳
    printObject["pnamt1"] = bankUtil.Format.number(wsSimulData["pnamt"]) + "원";
    printObject["pnamt2"] = bankUtil.Format.number(wsSimulData["pnamt"]) + "원";
    //-퇴직이자		rtrmAdiAmtBtax
    printObject["rtrmAdiAmtBtax"] = bankUtil.Format.number(wsSimulData["rtrmAdiAmtBtax"]) + "원";
    //-퇴직세금		rtrmTax
    printObject["rtrmTax"] = bankUtil.Format.number(wsSimulData["rtrmTax"]) + "원";
    //-퇴직세율		rtrmTxrt
    printObject["rtrmTxrt"] = "(" + wsSimulData["rtrmTxrt"] + "%)";
    //-퇴직 시 실지급액	rtrmExpctPayAmt
    printObject["rtrmExpctPayAmt"] = bankUtil.Format.number(wsSimulData["rtrmExpctPayAmt"]) + "원";
    //-탈퇴이자		whwlAdiAmtBtax
    printObject["whwlAdiAmtBtax"] = bankUtil.Format.number(wsSimulData["whwlAdiAmtBtax"]) + "원";
    //-탈퇴세금		whwlTax
    printObject["whwlTax"] = bankUtil.Format.number(wsSimulData["whwlTax"]) + "원";
    //-탈퇴세율		whwlTxrt
    printObject["whwlTxrt"] = "(" + wsSimulData["whwlTxrt"] + "%)";
    //-탈퇴 시 실지급액	whwlExpctPayAmt
    printObject["whwlExpctPayAmt"] = bankUtil.Format.number(wsSimulData["whwlExpctPayAmt"]) + "원";

    //오브젝트의 key와 같은 id인 요소를 찾아 값을 출력합니다. (KuvUtil.js)
    allResultadd(printObject);
}

$(document).on("change keyup paste click", "input[name=accnt], [data-setaccnt]", function (e) {
    e.preventDefault();
    $("[data-calc]").html((Number($("input[name=accnt]").val()) * 5000 + "").replace(/\B(?=(\d{3})+(?!\d))/g, ","));
});
