/**
 * @파일명 : memCertPrint.js
 * @파일정보 : 지급계좌 관리
 * @수정이력
 * @수정자    수정일       수정내용
 * @------- ------------ ----------------
 * @bluej  2023.8.9 최초생성(SHW)
 * @---------------------------------------
 * @author (주)퀴리오스 개발팀
 * @since 2009. 01.14
 * @version 3.0.8 Copyright (C) ITGOOD All right reserved.
 *
 */

/**
(폼이름 : form + 업무구분 (이하 내용 참조))
/예금목돈 TrustsavingCertificate	증명서 조회] 업무구분: tsCertKo/tsCertEn

회원번호	memNo
언어코드	langCd
기준일자	crtrDt		-사용자 입력값 (8자리, 회원퇴직급여 경우 2001년 12월부터 전월까지만 출력이 가능, 월말기준조회)
영문이름	engFlnm		-사용자 입력값
과세타입	taxType (목돈수탁의 경우과세/비과세 구분 추가)

/예금목돈 TrustsavingSoduk1 원천징수명세서 조회] 업무구분: tsSoduk (과세 txtn/ 비과세 ntax)
 */

//조회 범위 조건 2001년 1월 1일~현재까지
const currYear = bankUtil.Date.get("yyyy");
const currMonth = Number(bankUtil.Date.get("MM"));
const currDay = bankUtil.Date.get("DD");

$(document).ready(function () {
    //숫자 입력값 허용
    var regexNumber = /^[0-9]/;
    //숫자입력 인풋
    inputregex("numberinput", regexNumber);

    //오늘 날짜 구해서 달력 생성하기
    let jqtoday = bankUtil.Date.get("yyyy-MM-DD");
    let dateoption = {
        monthSelect: true,
        yearSelect: true,
        endDate: jqtoday,
        autoClose: true,
        singleDate: true,
        showShortcuts: false,
        singleMonth: true,
        language: "ko",
        format: "YYYY-MM-DD",
    };
    //한글 기준일자
    $("#crtrDt_ko")
        .dateRangePicker(dateoption)
        .on("input", function (event) {})
        .val(jqtoday);
    //영문 기준일자
    $("#crtrDt_en")
        .dateRangePicker(dateoption)
        .on("input", function (event) {
            wsCertExchangeRate();
        })
        .val(jqtoday);

    //처음 화면 이동시 높이고정
    $(window).scrollTop($("#pageTop").offset().top);

    //ajax기본폼
    /*	$.ajax({
		url:'/api/Name.do'
		, type:'post'
		, data : JSON.stringify(request)
		, contentType: "application/json"
		, dataType: "json"
		, async: true
		, success: function (response) { //가입요청 api 성공시(가입 실패경우있음)
			console.log("----response----");
			console.log(response);
        }
        , error: function (request, status, error) {//api 중단될때
            alert("api오류\ncode:" + request.status + "\n" + "message:" + request.responseText + "\n");
        }
	});*/

    //년도,월 세팅 시작-------------------------------------
    console.log("currYear:" + currYear + "/currMonth:" + currMonth + "/currDay:" + currDay);

    //두 년도를 포함하여 사이의 년도들을 object로 만들어 list화한다.
    var yearList = makeyearList(currYear - 10, currYear);
    //오브젝트 리스트를 원하는 곳에 출력한다.
    bankUtil.makeSelect("selectYear", yearList, "value", "text");

    //두 월을 포함하여 사이의 월들을 object로 만들어 list화한다.
    var monthList = makeMonthList("1", currMonth);
    //1~12월까지 세팅. 함수 만들어서 세팅(올해로 선탱한 경우 선택할 월수범위 제한해야하기 때문)
    bankUtil.makeSelect("selectMonth", monthList, "value", "text");

    //두 월을 포함하여 사이의 월들을 object로 만들어 list화한다.
    var dayList = makeDayList("1", currDay);
    //1~12월까지 세팅. 함수 만들어서 세팅(올해로 선탱한 경우 선택할 월수범위 제한해야하기 때문)
    bankUtil.makeSelect("selectDay", dayList, "value", "text");

    //년도 선택시 출력 월 조건별로 채우기
    $("#selectYear").on("change", function () {
        var selectYear = $("#selectYear").val();
        console.log(selectYear);
        if (selectYear == currYear) {
            //두 월을 포함하여 사이의 월들을 object로 만들어 list화한다.
            var list = makeMonthList("1", currMonth);
        } else {
            //두 월을 포함하여 사이의 월들을 object로 만들어 list화한다.
            var list = makeMonthList("1", "12");
        }
        bankUtil.makeSelect("selectMonth", list, "value", "text");
        makedayselect();
    });

    //월 선택시 출력 일 조건별로 채우기
    $("#selectMonth").on("change", function () {
        console.log("selectMonth" + $(this).val());
        makedayselect();
    });

    //원천징수 귀속연도 기본세팅
    //두 년도를 포함하여 사이의 년도들을 object로 만들어 list화한다.
    var yearList2 = makeyearList(currYear - 5, currYear - 1);
    //오브젝트 리스트를 원하는 곳에 출력한다.
    bankUtil.makeSelect("taxYear", yearList2, "value", "text");
    //년도,월 세팅 끝-------------------------------------

    //가입내역 출력 ------------------------------------------------------
    subscribingPrint();

    //증명서 출력버튼에 조회및 출력 이벤트 걸기(한글/영문)
    $("[data-certprint]").on("click", function () {
        let langCd = $(this).data("certprint");
        let ntaxYn = $(this).data("ntaxyn");
        console.log("langCd:" + langCd + ",ntaxYn:" + ntaxYn);
        certPrint(langCd, ntaxYn);
    });

    //원천징수 출력버튼에 조회이벤트 걸기
    $("[data-withholding]").on("click", function () {
        withholding();
    });

    //영문이름 입력란, 영문만 입력되도록 함.
    var regexEng = /^[a-zA-Z\s+]/;
    //input data-inputregex='값'에 따라 원하는 정규식을 적용해 입력값을 제한합니다.
    inputregex("engInput", regexEng);
});

window.onload = function () {
    let crtrDt = delAddString($("#crtrDt_en").val());
    let sendObj = {};
    sendObj["crtrDt"] = crtrDt;

    console.log(crtrDt);
    console.log("crtrDt");

    //기준환율 조회 시작-----------------I.AI.AA.001-------------------
    $.ajax({
        url: "/api/WsCertExchangeRate.do",
        data: JSON.stringify(sendObj),
        contentType: "application/json",
        type: "post",
        dataType: "json",
        async: true,
        success: function (response) {
            //가입요청 api 성공시(가입 실패경우있음)
            console.log("----response----");
            console.log(response);
            var result = response["result"];
            if (result["status"] == 200) {
                var ehgt = result["data"]["ehgt"];
                $("#ehgt").text(ehgt + "원 (" + bankUtil.Date.get("yyyy년 MM월 DD일", result["data"]["rlvtDt"]) + " 기준)");
            } else if (result["status"] == 0) {
                alert(result["message"]);
                $("#ehgt").text("- - - - - - - -");
            }
        },
        error: function (request, status, error) {
            //api 중단될때
            alert("api오류\ncode:" + request.status + "\n" + "message:" + request.responseText + "\n");
        },
    });
    //기준환율 조회 끝------------------------------------
};

//예금목돈 금융소득 원천징수 명세서 정보 조회
function withholding() {
    console.log("withholding");
    //보낼 객체 만들기
    var sendObj = {};
    //한컨트롤러 내에서 비슷한 업무를 처리하기위한 업무구분값입니다.
    //ws퇴직급여rs분할급여is적립ts예금
    sendObj["listKind"] = "ts";
    //원천징수 명세서 정보 조회

    //귀속년도 추가 필요
    sendObj["taxYear"] = $("#taxYear").val();
    //과세 비과세 추가 필요
    sendObj["taxType"] = $("#taxType").val();

    $.ajax({
        url: "/api/Withholding.do",
        type: "post",
        data: JSON.stringify(sendObj),
        contentType: "application/json",
        dataType: "json",
        async: true,
        success: function (response) {
            //가입요청 api 성공시(가입 실패경우있음)
            console.log("----response----");
            console.log(response);
            if (response["status"] != 200) {
                alert(response["message"]);
            } else {
                //가입내역 그리기

                console.log("----drawWithholding----");

                drawWithholding(response);
            }
        },
        error: function (request, status, error) {
            //api 중단될때
            alert("api오류\ncode:" + request.status + "\n" + "message:" + request.responseText + "\n");
        },
    });
}

//증명서 출력
function certPrint(langCd, ntaxYn) {
    console.log("----langCd---");
    console.log(langCd);
    console.log("----ntaxYn---"); //txtn과세, ntax비과세
    console.log(ntaxYn);
    //보낼 객체 만들기
    var sendObj = {};
    sendObj["langCd"] = langCd;
    sendObj["ntaxYn"] = ntaxYn;

    if (langCd == "en") {
        //조회유형이 영문일 경우,
        var engFlnm = "";
        //영문이름 입력확인
        if ($("#engFlnm").val() == "") {
            alert("영문이름을 입력해주세요.");
            $("#engFlnm").focus();
            return;
        } else {
            engFlnm = $("#engFlnm").val();
        }
        //보낼 객체에 담기
        sendObj["crtrDt"] = $("#crtrDt_en").val().replaceAll("-", "");
        sendObj["engFlnm"] = engFlnm;
    } else if (langCd == "ko") {
        //조회유형이 한글일 경우,
        //보낼 객체에 담기
        sendObj["crtrDt"] = $("#crtrDt_ko").val().replaceAll("-", "");
    }
    //한컨트롤러 내에서 비슷한 업무를 처리하기위한 업무구분값입니다.
    //ws퇴직급여rs분할급여is적립ts예금
    sendObj["listKind"] = "ts";
    //보낼 객체 콘솔확인
    console.log("------sendObj------");
    console.log(sendObj);

    $("[data-preview]").html("");
    var mobileConfirm = false;
    //증명서 조회	//I.AI.FA.010
    $.ajax({
        url: "/api/certPrint.do",
        type: "post",
        data: JSON.stringify(sendObj),
        contentType: "application/json",
        dataType: "json",
        async: true,
        success: function (response) {
            console.log(">>> response : " + response["result"]["status"]);
            if (response["result"]["status"] == 0) {
                alert(response["result"]["message"]);
                $(".beta-pdfpop").hide();
            } else {
                if (response["pdfdata"] == "파일을 찾을 수 없습니다.") {
                    alert("증명서 파일을 찾을 수 없습니다");
                    $(".beta-pdfpop").hide();
                    return false;
                }

                if ($(window).width() < 1024) {
                    if (confirm("모바일에서는 미리보기가 불가능합니다. 다운로드 하시겠습니까?")) {
                        mobileConfirm = true;
                    } else {
                        $(".beta-pdfpop").hide();
                        return false;
                    }
                }

                //var bin = atob(response["pdfdata"]);
                //console.log('File Size:', Math.round(bin.length / 1024), 'KB');
                //console.log('PDF Version:', bin.match(/^.PDF-([0-9.]+)/)[1]);

                // Embed the PDF into the HTML page and show it to the user
                var obj = document.createElement("embed");
                obj.style.width = "100%";
                obj.style.height = "842pt";
                obj.type = "application/pdf";
                obj.src = "data:application/pdf;base64," + response["pdfdata"];
                $("[data-preview]").append(obj);

                // Insert a link that allows the user to download the PDF file
                var link = document.createElement("a");
                link.innerHTML = "다운로드";
                link.download = "예금형목돈수탁증명서.pdf";
                link.href = "data:application/pdf;base64," + response["pdfdata"];
                $(".d-print").html(link);

                $(".beta-pdfpop").show();

                if (mobileConfirm) {
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    //다운로드 후 팝업 닫기
                    $(".beta-pdfpop").hide();
                    return false;
                }
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
}

//예금형 목돈수탁 가입내역 출력(과세/비과세 모두)
function subscribingPrint() {
    console.log("subscribingPrint");
    //보낼 객체 만들기
    var sendObj = {};
    //한컨트롤러 내에서 비슷한 업무를 처리하기위한 업무구분값입니다.
    //ws퇴직급여rs분할급여is적립ts예금
    sendObj["listKind"] = "ts";
    //가입내역 조회	//I.AI.GA.020
    $.ajax({
        url: "/api/SubscribingPrint.do",
        type: "post",
        data: JSON.stringify(sendObj),
        contentType: "application/json",
        dataType: "json",
        async: true,
        success: function (response) {
            //가입요청 api 성공시(가입 실패경우있음)
            console.log("----response----");
            console.log(response);
            if (response["status"] == 200) {
                //가입내역 그리기
                drawSubscribing(response);
            } else {
                alert(response["message"]);
            }
        },
        error: function (request, status, error) {
            //api 중단될때
            alert("api오류\ncode:" + request.status + "\n" + "message:" + request.responseText + "\n");
        },
    });
}

//가입내역그리기
function drawSubscribing(response) {
    //>result>data>txtnCtrtMtDtoList 과세리스트
    let txtnList = [];
    //>result>data>ntaxCtrtMtDtoList 비과세리스트
    let ntaxList = [];
    if (response["data"].hasOwnProperty("txtnCtrtMtDtoList")) {
        txtnList = response["data"]["txtnCtrtMtDtoList"];
    }
    if (response["data"].hasOwnProperty("ntaxCtrtMtDtoList")) {
        ntaxList = response["data"]["ntaxCtrtMtDtoList"];
    }

    //계약번호		ctrtNo
    //가입일자		scbDt <<
    //만기일자		mtryDt <<
    //가입금액		scbAmt <<
    //금리		scbInrt <<
    //예정 세전이자	itamt <<
    //+가입구분 payCyleSeCd << MA일경우(만기) 앞에 '매' x
    //+가입구분명 payCyleSeCdNm <<
    //세금구분(출력 위치 구분용) txtnTySeCd 9비과세, 1과세

    //리스트로 html그린 내용 객체로 받아오기
    var bodyObj = {};
    //과세
    bodyObj = drawSubscribingBody(txtnList);
    //객체 내 pc, mobile 각각 html내용 뿌리기
    $("#txtnList").html(bodyObj["pcBody"]);
    $("#txtnList_mo").html(bodyObj["moBody"]);
    $("#txtnListTotal").html(bodyObj["pcFoot"]);
    $("#txtnListTotal_mo").html(bodyObj["moTop"]);
    //비과세
    bodyObj = drawSubscribingBody(ntaxList);
    //객체 내 pc, mobile 각각 html내용 뿌리기
    $("#ntaxList").html(bodyObj["pcBody"]);
    $("#ntaxList_mo").html(bodyObj["moBody"]);
    $("#ntaxListTotal").html(bodyObj["pcFoot"]);
    $("#ntaxListTotal_mo").html(bodyObj["moTop"]);
}

//리스트를 디자인에 맞춰 html을 그리고 반환합니다. Pc와 mobile의 내용을 오브젝트에 담아 (총4개) 리턴합니다. return Obj
//내용이 없으면 내역이 없다는 표시로 반환됩니다.
function drawSubscribingBody(list) {
    let resultObj = {};
    var pcBody = "";
    var moBody = "";
    var pcFoot = "";
    var moTop = "";

    //가입금액 합계
    var totalscbAmt = 0;
    //세전이자 합계
    var totalitamt = 0;
    if ($.isEmptyObject(list) || list.length == 0) {
        pcBody += "<tr>";
        pcBody += "<td colspan='7'>내역이 없습니다.</td>";
        pcBody += "</tr>";

        moBody += '<div class="one-app next">';
        moBody += "<div class='cont-mb'>";
        moBody += "<div class='empty'>내역이 없습니다.</div>";
        moBody += "</div>";
        moBody += "</div>";
    } else {
        for (var i = 0; i < list.length; i++) {
            let obj = list[i];
            //계약번호		ctrtNo (증명서 출력용)
            let ctrtNo = obj["ctrtNo"];
            //가입일자		scbDt <<
            let scbDt = bankUtil.Date.get("yyyy-MM-DD", obj["scbDt"]);
            //만기일자		mtryDt <<
            let mtryDt = bankUtil.Date.get("yyyy-MM-DD", obj["mtryDt"]);
            //가입금액		scbAmt <<
            let scbAmt = bankUtil.Format.number(obj["scbAmt"]);
            if (obj["scbAmt"] == undefined) obj["scbAmt"] = 0;
            totalscbAmt += obj["scbAmt"];
            //금리		scbInrt <<
            let scbInrt = obj["scbInrt"];
            //예정 세전이자	itamt << itamt
            let itamt;
            if (obj["itamt"] == undefined) {
                itamt = "----";
                totalitamt += 0;
            } else {
                itamt = bankUtil.Format.number(obj["itamt"]) + "원";
                totalitamt += Number(obj["itamt"]);
            }
            console.log("itamt:" + itamt + "|totalitamt:" + totalitamt);
            //+가입구분 payCyleSeCd
            let payCyleSeCd = obj["payCyleSeCd"];
            //+가입구분명 payCyleSeCdNm <<
            let payCyleSeCdNm = obj["payCyleSeCdNm"];
            //bankUtil.Date.get('yyyy-MM-DD',
            // bankUtil.Format.number(
            pcBody += "<tr>";
            pcBody += "<td>" + scbDt + "</td>";
            pcBody += "<td>" + mtryDt + "</td>";
            pcBody += "<td class='right'>" + scbAmt + "원</td>";
            pcBody += "<td>" + scbInrt + "%</td>";
            pcBody += "<td class='right'>" + itamt + "</td>";
            pcBody += "<td>" + payCyleSeCdNm + "</td>";
            pcBody += "<td><a href='#this' class='bl-btn btn-line' onclick='openSubOne(\"" + ctrtNo + "\")'>가입증서 출력</a></td>";
            pcBody += "</tr>";

            moBody += "<div class='one-app next'>";
            moBody += "<div class='cont-mb'>";
            moBody += "<div class='bold'>";
            moBody += "<span>가입일자</span> <span>" + scbDt + "</span>";
            moBody += "</div>";
            moBody += "<div>";
            moBody += "<span>만기일자</span> <span>" + mtryDt + "</span>";
            moBody += "</div>";
            moBody += "<div>";
            moBody += "<span>가입금액</span> <span>" + scbAmt + "원</span>";
            moBody += "</div>";
            moBody += "<div>";
            moBody += "<span>금리</span> <span>" + scbInrt + "%</span>";
            moBody += "</div>";
            moBody += "<div>";
            moBody += "<span>예정 세전일자</span> <span>" + itamt + "</span>";
            moBody += "</div>";
            moBody += "<div>";
            moBody += "<span>가입구분</span> <span>" + payCyleSeCdNm + "</span>";
            moBody += "</div>";
            moBody += "</div>";
            moBody += "<div class='btns'>";
            moBody += "<div class='check-bt check-linebt'>";
            moBody += "<button type='button' class='button btn-line btn-joinpaymentinterest btn_pop' data-name='beta-joinpaymentinterest' onclick='openSubOne(\"" + ctrtNo + "\")'>가입증서 출력</button>";
            moBody += "</div>";
            moBody += "</div>";
            moBody += "</div>";
        }

        pcFoot += "<tr>";
        pcFoot += "<td colspan='2'>합계</td>";
        pcFoot += "<td class='right'>" + bankUtil.Format.number(totalscbAmt) + "원</td>";
        pcFoot += "<td></td>";
        pcFoot += "<td class='right'>" + bankUtil.Format.number(totalitamt) + "원</td>";
        pcFoot += "<td></td>";
        pcFoot += "<td></td>";
        pcFoot += "</tr>";
        console.log("-----totalitamt-----");
        console.log(totalitamt);
        moTop = "<div class='one-app next total-next'>";
        moTop = "<div class='cont-mb'>";
        moTop = "<div>";
        moTop = "<span>가입금액 합계</span> <span>" + bankUtil.Format.number(totalscbAmt) + "원</span>";
        moTop = "</div>";
        moTop = "<div>";
        moTop = "<span>예정 세전이자 합계</span> <span>" + bankUtil.Format.number(totalitamt) + "원</span>";
        moTop = "</div>";
        moTop = "</div>";
        moTop = "</div>";
    }

    resultObj["pcBody"] = pcBody;
    resultObj["moBody"] = moBody;
    resultObj["pcFoot"] = pcFoot;
    resultObj["moTop"] = moTop;

    return resultObj;
}

//원천징수 명세서 출력
function drawWithholding(response) {
    let data = response["data"];
    console.log("data");
    console.log(data);
    $("#listResult").html("");

    if (Object.keys(data).length == 0) {
        var newRow = $("<tr>");
        newRow.append("<td colspan='6'> 내역이 없습니다. </td>");
        $("#listResult").append(newRow);
    } else {
        //회원정보 담기
        //회원이름 flnm
        var flnm = data["flnm"];
        //주민번호 rrno
        var rrno = data["rrno"];
        //주소 homeAddr
        var homeAddr = data["homeAddr"];

        var printObj = {};
        printObj["flnm"] = flnm;
        printObj["rrno"] = rrno;
        printObj["homeAddr"] = homeAddr;
        //출력에 필요한 기타 값 담기
        printObj["cuYmd"] = currYear + "년 " + currMonth + "월 " + currDay + "일";
        $("#taxYearP").html("(귀속연도 : " + $("#taxYear").val() + "년)");
        allResultaddHtml(printObj);

        //원천징수 명세서 조회 값 뿌리기
        let list = [];
        list = data["list"];
        //합계 파라미터 선언
        let TpayItamt = 0;
        let Tinctx = 0;
        let Trsdtx = 0;
        let Ttotal = 0;

        list.forEach(function (item) {
            var total = bankUtil.Format.number(item["inctx"] + item["rsdtx"]) + "원";
            var newRow = $("<tr>");
            newRow.append("<td>" + item["payDt"] + "</td>");
            newRow.append("<td>" + item["payItamt"] + "</td>");
            newRow.append("<td>" + item["txrt"] + "</td>");
            newRow.append("<td>" + bankUtil.Format.number(item["inctx"]) + "원</td>");
            newRow.append("<td>" + bankUtil.Format.number(item["rsdtx"]) + "원</td>");
            newRow.append("<td colspan='2'>" + total + "</td>");
            $("#listResult").append(newRow);

            //합계구하기
            Tinctx += item["inctx"];
            Ttotal += item["inctx"];
            Trsdtx += item["rsdtx"];
            Ttotal += item["rsdtx"];
            TpayItamt += Number(item["payItamt"].replaceAll(",", "").replaceAll(" ", "").replaceAll("원", ""));
        });
        var newRow = $("<tr>");
        newRow.append("<th>합계</th>");
        newRow.append("<td>" + bankUtil.Format.number(TpayItamt) + "원</td>");
        newRow.append("<td>-</td>");
        newRow.append("<td>" + bankUtil.Format.number(Tinctx) + "원</td>");
        newRow.append("<td>" + bankUtil.Format.number(Trsdtx) + "원</td>");
        newRow.append("<td colspan='2'>" + bankUtil.Format.number(Ttotal) + "원</td>");
        $("#listResult").append(newRow);
        //$(".beta-orgcertlist").show();
        $(".beta-income_specification").show();
    }
}

//선택되어있는 월에 따라 일자 만들기
function makedayselect() {
    var selectYear = $("#selectYear").val();
    var selectMonth = $("#selectMonth").val();
    console.log(selectMonth);
    var monthList31 = ["01", "03", "05", "07", "08", "10", "12"];
    var monthList30 = ["04", "06", "09", "11"];
    if (selectYear == currYear && selectMonth == currMonth) {
        //두 월을 포함하여 사이의 월들을 object로 만들어 list화한다.
        let list = makeDayList("1", currDay);
        //1~12월까지 세팅. 함수 만들어서 세팅(올해로 선탱한 경우 선택할 월수범위 제한해야하기 때문)
        bankUtil.makeSelect("selectDay", list, "value", "text");
    } else if ($.inArray(selectMonth, monthList31) != -1) {
        //두 월을 포함하여 사이의 월들을 object로 만들어 list화한다.
        let list = makeDayList("1", "31");
        //1~12월까지 세팅. 함수 만들어서 세팅(올해로 선탱한 경우 선택할 월수범위 제한해야하기 때문)
        bankUtil.makeSelect("selectDay", list, "value", "text");
    } else if ($.inArray(selectMonth, monthList30) != -1) {
        //두 월을 포함하여 사이의 월들을 object로 만들어 list화한다.
        let list = makeDayList("1", "30");
        //1~12월까지 세팅. 함수 만들어서 세팅(올해로 선탱한 경우 선택할 월수범위 제한해야하기 때문)
        bankUtil.makeSelect("selectDay", list, "value", "text");
    } else {
        //두 월을 포함하여 사이의 월들을 object로 만들어 list화한다.
        let list = makeDayList("1", "29");
        //1~12월까지 세팅. 함수 만들어서 세팅(올해로 선탱한 경우 선택할 월수범위 제한해야하기 때문)
        bankUtil.makeSelect("selectDay", list, "value", "text");
    }
}

//예금형 목돈수탁 가입증서 출력
function openSubOne(ctrtNo) {
    //보낼 객체 만들기
    var sendObj = {};
    sendObj["ctrtNo"] = ctrtNo;
    sendObj["listkind"] = "ts";

    $("[data-preview]").html("");
    var mobileConfirm = false;

    $.ajax({
        url: "/api/subOnePrint.do",
        type: "post",
        data: JSON.stringify(sendObj),
        contentType: "application/json",
        dataType: "json",
        async: true,
        success: function (response) {
            //가입요청 api 성공시(가입 실패경우있음)

            console.log(response);

            if (response["result"]["status"] == 0) {
                alert(response["result"]["message"]);
                $(".beta-pdfpop").hide();
            } else {
                if (response["pdfdata"] == "파일을 찾을 수 없습니다.") {
                    alert("증명서 파일을 찾을 수 없습니다");
                    $(".beta-pdfpop").hide();
                    return false;
                }
                if ($(window).width() < 1024) {
                    if (confirm("모바일에서는 미리보기가 불가능합니다. 다운로드 하시겠습니까?")) {
                        mobileConfirm = true;
                    } else {
                        $(".beta-pdfpop").hide();
                        return false;
                    }
                }

                // Embed the PDF into the HTML page and show it to the user
                var obj = document.createElement("embed");
                obj.style.width = "100%";
                obj.style.height = "842pt";
                obj.type = "application/pdf";
                obj.src = "data:application/pdf;base64," + response["pdfdata"];
                $("[data-preview]").append(obj);

                // Insert a link that allows the user to download the PDF file
                var link = document.createElement("a");
                link.innerHTML = "다운로드";
                link.download = "예금형목돈수탁가입증서.pdf";
                link.href = "data:application/pdf;base64," + response["pdfdata"];
                $(".d-print").html(link);

                $(".beta-pdfpop").show();

                if (mobileConfirm) {
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    //다운로드 후 팝업 닫기
                    $(".beta-pdfpop").hide();
                    return false;
                }
            }
        },
        error: function (request, status, error) {
            //api 중단될때
            alert("api오류\ncode:" + request.status + "\n" + "message:" + request.responseText + "\n");
        },
    });
}
