/**
 * @파일명 : myopenList.js
 * @파일정보 : 나의 신청목록 조회
 * @수정이력
 * @수정자    수정일       수정내용
 * @------- ------------ ----------------
 * @bluej  2023.7.13 최초생성(SHW)
 * @---------------------------------------
 * @author (주)퀴리오스 개발팀
 * @since 2009. 01.14
 * @version 3.0.8 Copyright (C) ITGOOD All right reserved.
 */

$(document).ready(function () {
    ////선택한 업무에 따라 해당 select태그 보이기
    $("#plnCd").on("change", function () {
        var plncdval = $(this).val();
        plnCdSelectSetting(plncdval);
    });

    //select 태그 선택할때마다 풀태그 보기
    $("select").on("change", function () {
        var str = selectFullPlnCd();
    });

    //선택에 따라 하위 묶음 다르게 출력하기
    //data-selecttobble 에 입력할 값은 plnCd+_+'추가코드' 형식임. (myopenList.jsp 퇴직급여 업무 wsdtl, ws_o...출력참조)
    //상위 선택박스의 추가코드는 'listkind'로 사용, 하위 선택박스의 추가코드는 상위 선택박스 값으로 사용.
    $("[data-selecttobble]").on("change", function () {
        console.log("toggle");
        var selecttobbleVal = $(this).data("selecttobble");
        var codeSize = selecttobbleVal.split("_");
        var codeIdx;
        var codeVal;
        var nextCode;
        if (codeSize.length == 2) {
            codeIdx = selecttobbleVal.split("_")[0];
            codeVal = selecttobbleVal.split("_")[1];
        } else {
            return;
        }

        if (codeVal && codeVal == "listkind") {
            console.log("toggle");
            $("[data-wslist]").closest(".slc").addClass("hide");
            $("#" + $(this).val())
                .closest(".slc")
                .removeClass("hide");
        } else {
            return;
        }
    });
});

//■■■■■■■■■■■■■■■■■■■ 초기화 버튼 시작 ■■■■■■■■■■■■■■■■■■■■
//초기화 버튼 클릭 시 실행
function resetResult() {
    $("#resultPrintArea").html("");
}
//입력한 업무코드에 따라 해당 select태그 보이기
function plnCdSelectSetting(plncdval) {
    $("[data-selecttobble]").closest(".slc").addClass("hide");
    $("[data-wslist]").closest(".slc").addClass("hide");
    $("[data-selecttobble=" + plncdval + "]")
        .closest(".slc")
        .removeClass("hide");
    if (plncdval == "ws_listkind") {
        $('[data-wslist="o"]').closest(".slc").removeClass("hide");
    }
}
//〓〓〓〓〓〓〓〓〓〓 초기화 버튼 끝 〓〓〓〓〓〓〓〓〓〓〓
//■■■■■■■■■■■■■■■■■■■ 조회하기 버튼 클릭 시작 ■■■■■■■■■■■■■■■■■■■■

//조회하기 버튼 클릭 시 실행될 함수
function serchValid() {
    //현재 선택된 업무코드 가져오기. return String
    var fullCdStr = selectFullPlnCd();
    //신청내역 화면 가져오기
    MyopenlistLoadPageJs(fullCdStr);
}

//현재 선택된 업무코드 가져오기. return String
function selectFullPlnCd() {
    var plncd = $("#plnCd").val();
    var fullPlncd = plncd;
    if (plncd == "ws_listkind") {
        var listkind = $("#ws_listkind").val();
        var dtlPlncd = $("#" + listkind).val();
        fullPlncd = "ws_" + dtlPlncd;
    } else {
        var list = $("[data-selecttobble=" + plncd + "]");
        for (var i = 0; i < list.length; i++) {
            var one = list[i];
            fullPlncd += "_" + $(one).val();
        }
    }

    return fullPlncd;
}

//신청내역 화면 가져오기
function MyopenlistLoadPageJs(fullCdStr) {
    //영역 초기화
    $("#resultPrintArea").html("");

    let sendObj = {};
    sendObj["fullCd"] = fullCdStr;
    $.ajax({
        url: "/api/MyopenlistLoadPageJs.do",
        data: JSON.stringify(sendObj),
        contentType: "application/json",
        type: "post",
        dataType: "text",
        async: true,
        success: function (response) {
            //요청 api 성공시(실패경우있음)
            if (response == "") {
                alert("empty html");
                return;
            } else {
                //div영역에 출력함. js실행됨.
                // $("#resultPrintArea").html(response);
                //조회 데이터 가져오기
                serchStart(fullCdStr);
            }
        },
        error: function (request, status, error) {
            //api 중단될때
            // alert("api오류\ncode:" + request.status + "\n" + "message:" + request.responseText + "\n");
            $("#resultPrintArea").html(`<ul class="one-line">
			<li class="one-person">
				<div class="subss">
					<h4 class="sub_tit">가입 신청내역</h4>
				</div>
				<div class="st-table fix">
					<table>
						<caption>가입 신청내역</caption>
						<colgroup>
							<col style="width: 20%;">
							<col style="width: 20%;">
							<col style="width: 20%;">
							<col style="width: 20%;">
							<col style="width: 20%;">
						</colgroup>
						<thead>
							<tr>
								<th>신청일자</th>
								<th>(재)가입년월</th>
								<th>신청구좌</th>
								<th>신청구분</th>
								<th>마감여부</th>
							</tr>
						</thead>

						<tbody id="resultTable"><tr><td colspan="5">내역이 없습니다.</td></tr></tbody>
					</table>
				</div>
				<div class="app-mb" id="resultMobile"><div class="one-app next"><div class="cont-mb"><div class="empty">내역이 없습니다</div></div></div></div>

			</li>
		</ul>`);
        },
    });
}

//조회 데이터 가져오기
function serchStart(fullCdStr) {
    let fullCd = {};
    fullCd["fullCd"] = fullCdStr;
    //fullCd대로 조회하고 출력하기.
    console.log("fullCdStr");
    console.log(fullCdStr);
    //if(fullCdStr != 'se') {
    $.ajax({
        url: "/api/MyopenlistSerchResult.do",
        type: "post",
        data: JSON.stringify(fullCd),
        contentType: "application/json",
        dataType: "json",
        async: true,
        success: function (response) {
            //요청 api 성공시(실패경우있음)
            console.log("MyopenlistSerchResult");
            console.log(response);
            if (response["status"] == "200") {
                //데이터가 온전히 오지 못한 경우 내역 표를 보임.
                $("#resultPrintArea").css("display", "");
                //그려놓은 html안 스크립트에 존재하는 함수입니다.2023-09-17_shw
                drawResult(response["data"], fullCdStr);

                //그려지고 난 후처리 (퇴직급여관련 모든 처리대기중상태일때 취소 불가능 20250410_shw)
                let code0 = fullCdStr.split("_")[0];
                let code1 = fullCdStr.split("_")[1];
                //퇴직급여신청서중 처리대기중일때 취소 가능한 일부 업무추가 (20250515_shw)
                let ignorelist = ["o"];
                if (code0 == "ws") {
                    //처리대기중 상태일때 취소 가능한 일부 업무 처리.(20250515_shw)
                    if (ignorelist.indexOf(code1) !== -1) {
                        //나머지는 처리대기중 상태일때 취소 불가능 (20250515_shw)
                    } else {
                        $("span, td").each(function () {
                            let $el = $(this);
                            let text = $(this).text().trim();
                            if (text.includes("처리대기중")) {
                                $el.find("a").remove();
                            }
                        });
                    }
                }
            } else {
                //데이터가 온전히 오지 못한 경우 내역 표를 숨김. 20321025_shw
                $("#resultPrintArea").css("display", "none");
                alert("status:" + response["status"] + "\n" + response["message"]);

                return;
            }
        },
        error: function (request, status, error) {
            //api 중단될때
            alert("api오류\ncode:" + request.status + "\n" + "message:" + request.responseText + "\n");
        },
    });
    //}
}
//〓〓〓〓〓〓〓〓〓〓 조회하기 버튼 클릭 끝 〓〓〓〓〓〓〓〓〓〓〓
//■■■■■■■■■■■■■■■■■■■ 신청취소 버튼 클릭 시작 ■■■■■■■■■■■■■■■■■■■■
//신청내역을 취소함
function openCancle(reqdRcptNo, fullCd) {
    //신청관리번호를 취소함. (업무코드는 컨트롤러에서 씁니다.)
    let sendObj = {};
    sendObj["reqdRcptNo"] = reqdRcptNo;
    sendObj["fullCd"] = fullCd; //업무코드 (meopenList.jsp에 있음.)
    let redrawingCd = {};
    redrawingCd["fullCd"] = fullCd;
    $.ajax({
        url: "/api/MyopenlistSerchResultCancle.do",
        type: "post",
        data: JSON.stringify(sendObj),
        contentType: "application/json",
        dataType: "json",
        async: true,
        success: function (response) {
            //요청 api 성공시(실패경우있음)
            console.log("--받은정보--");
            console.log(response);
            if (!("message" in response) && response["status"] == "200") {
                console.log("--신청 취소 성공확인--");
                alert("신청이 취소되었습니다.");
                //신청결과 재조회하기
                var fullCdStr = selectFullPlnCd();
                MyopenlistLoadPageJs(fullCdStr);
                serchStart(fullCdStr);
            } else {
                alert("status:" + response["status"] + "\n" + response["message"]);
                return;
            }
        },
        error: function (request, status, error) {
            //api 중단될때
            alert("api오류\ncode:" + request.status + "\n" + "message:" + request.responseText + "\n");
        },
    });
}
//〓〓〓〓〓〓〓〓〓〓 신청취소 버튼 클릭 끝 〓〓〓〓〓〓〓〓〓〓〓
