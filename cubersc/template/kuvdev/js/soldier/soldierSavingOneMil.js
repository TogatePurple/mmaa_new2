/** 
 * @파일명 : soldierSavingOneMil.js
 * @파일정보 : 10년간 N억 만들기 JS
 * @수정이력
 * @수정자    수정일       수정내용
 * @------- ------------ ----------------
 * @bluej  2024.05.13 최초생성(YDW)
 * @---------------------------------------
 * @author (주)퀴리오스 개발팀
 * @since 2009. 01.14
 * @version 3.0.8 Copyright (C) ITGOOD All right reserved.
 */

$(document).ready(function() {
	//input에 입력값 허용범위지정 (숫자와 콤마(,) 허용)
	var regex = /^[0-9,]/;
	//input에 입력값 허용범위지정 (숫자 허용)
	var regex2 = /^[0-9]/;
	inputregex('money', regex);
	inputregex('date', regex2);

	//예금형목돈수탁 가입기본정보 가져오기
	$.ajax({
		url: '/api/SoldierSavingSimulationReady.do'
		, type: 'post'
		, dataType: "json"
		, async: true
		, success: function(response) {//요청 api 성공시(실패경우있음)
			console.log("------response-------");
			console.log(response);
			if (!('message' in response) && response['status'] == 200) {
				isSimulReady(response['data']);
			} else {
				alert("status:" + response["status"] + "\n" + response["message"]);
			}
		}
		, error: function(request, status, error) {//api 중단될때
			if (request.responseText.indexOf("로그인 후 이용") > 0) {
				alert("로그인 후 이용가능합니다.");
				location.href="/web/contents/webLogin.do";
			} else {
				alert("api오류\ncode:" + request.status + "\n" + "message:" + request.responseText + "\n");	
			}
		}
	});

	//초기화버튼 클릭 시 
	$('#resetBtn').click(function() {
		viewReset();
	});
	
	//목표년수
	$('#goalYear').on("change keyup paste", function(e){
		if($(this).val() > 10) {
			$(this).val(10);
		}
	});
	
		
	
	//적용버튼 클릭 시
	$('#applyBtn').click(function() {
		//조회 필요입력값 확인
		//viewReset();
		inputValid();
	});
	
	
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ scrollEvent ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■	
	function scrollEventContentsType() {
		$('.scl-anibox').each(function(i) {

					var bottom_of_element = $(this).offset().top + $(this).outerHeight() / 5;
					var bottom_of_window = $(window).scrollTop() + $(window).height();

					if (bottom_of_window > bottom_of_element) {
						$(this).addClass("active");
					}else {
						$(this).removeClass("active");
					}

				});
	}

	function scrollEventContentsType2() {
		$('.scl-anibox2').each(function(i) {

			var bottom_of_element = $(this).offset().top + $(this).outerHeight() / 6;
			var bottom_of_window = $(window).scrollTop() + $(window).height();

			if (bottom_of_window > bottom_of_element) {
				$(this).addClass("active");
			}else {
				$(this).removeClass("active");
			}

		});
	}

	scrollEventContentsType();
	scrollEventContentsType2();

	$(".new_circlepart li").on("click", function() {
		var step_tar = $(this).attr('data-tab'); 	
	
		setTimeout(function(){
			$(".bg_blbox .list_shadowcards").removeClass("active");
			$("#sub-" + step_tar).find(".bg_blbox .list_shadowcards").addClass("active");		
		},100);  
		
		if(step_tar === "step-3"){			
			$('.red-checkbt').hide();
		}else{
			$('.red-checkbt').show();
		}
		 
		console.log(step_tar);

	});

	$(window).on("scroll resize", function() {
		scrollEventContentsType();
		scrollEventContentsType2();

	});
	
});	

function searchFirstSimul() {
	viewReset();
	if ($('#sub-step-1.currents').length > 0) { 
		
	} else if($('#sub-step-2.currents').length > 0){
		let today = bankUtil.Date.get("yyyyMMDD");
		$("#savingDate1").val(bankUtil.Date.get("yyyy-MM-DD",today,"m",18));
		$("#depo1Pnamt").val('20,190,000');
		$("#savingDate2").val(bankUtil.Date.get("yyyy-MM-DD",today,"m",78));
		$("#depo2Pnamt").val('50,600,000');
		//let savingDate = $("#savingDate"+el).val();
		calcDate('1');
		calcDate('2');
	} else if($('#sub-step-3.currents').length > 0){
		let today = bankUtil.Date.get("yyyyMMDD");
		$("#savingDate1").val(bankUtil.Date.get("yyyy-MM-DD",today,"m",18));
		$("#depo1Pnamt").val('20,190,000');
		$("#savingDate2").val(bankUtil.Date.get("yyyy-MM-DD",today,"m",78));
		$("#depo2Pnamt").val('50,600,000');
		//let savingDate = $("#savingDate"+el).val();
		calcDate('1');
		calcDate('2');
	}
	
	inputValid();
}

function inputValid() {
	let goalYear = $('#goalYear').val();
	if(goalYear =='' || Number(goalYear) <1) {
		alertFocus('목표년수를 입력해주세요','goalYear')
		return;
	} else if(Number(goalYear) >10) {
		alertFocus('목표년수는 10년 이내로 입력해주세요','goalYear')
		return;
	}
	searchSimul();
}

function searchSimul() {
	var sendObj = {};
	//과세타입
	sendObj['scbInrt'] = $("#scbInrt").val();
	sendObj['goalYear'] = $("#goalYear").val();
	sendObj['goalAmt'] = Number($("#goalAmt").val())*10;
	sendObj['depo1Year'] = $("#depo1Year").val();
	sendObj['depo1Month'] = $("#depo1Month").val();
	sendObj['depo1Pnamt'] = delAddString($("#depo1Pnamt").val());
	sendObj['depo2Year'] = $("#depo2Year").val();
	sendObj['depo2Month'] = $("#depo2Month").val();
	sendObj['depo2Pnamt'] = delAddString($("#depo2Pnamt").val());
	
	$.ajax({
		url:'/api/SoldierSavingOneMil.do'
		, type:'post'
		, data : JSON.stringify(sendObj)
		, contentType: "application/json"
		, dataType: "json"
		, async: true
		, success: function (response) { //요청 api 성공시(실패경우있음)
			console.log("----response----");
			console.log(response);
			if(!('message' in response) && response['status'] == 200){
				drawResult(response['data']['dto']);
			}else{
				alert("status:" + response['status'] + "\n" + "message:" + response['message']+ "\n");
				alert("데이터를 가져오지 못했습니다.");
			}			
        }
		, error: function (request, status, error) {//api 중단될때
            alert("api오류\ncode:" + request.status + "\n" + "message:" + request.responseText + "\n");
        }
	});

}

//■■■■■■■■■■■■■■■■■■■ 진입 시 조회한 정보 세팅: 예금형목돈수탁 상품가입 기본정보 (input) ■■■■■■■■■■■■■■■■
//기본 정보 조회 후 input 세팅
function isSimulReady(isReady) {
	$('#goalYear').val('10');
	$('#goalAmt').val('1');
    $('#scbInrt').val(isReady['inrtMtList'][0]['inrt']);

	$(depo1Pnamt).on('input', function() {
		let value = Number(delAddString($(this).val()));
		$(depo1Pnamt).val(bankUtil.Format.number(value));
	});
	
	$(depo2Pnamt).on('input', function() {
		let value = Number(delAddString($(this).val()));
		$(depo2Pnamt).val(bankUtil.Format.number(value));
	});
	
	$("#savingDate1").on('change', function() {
		calcDate('1');
		
	});
	
	$("#savingDate2").on('change', function() {
		calcDate('2');
		
	});
	
}

function drawResult(data) {
	//$('#expctItamt').val(data['expctItamt']); //예상 이자
	$('#expctMnPmnt').html(addCommaWonSpace(data['expctMnPmnt'])); //예상 월납입액
	//$('#expctPnamt').val(data['expctPnamt']); // 예상 원금
	//$('#expctPnntAmt').html(addCommaWonSpace(data['expctPnntAmt'])); //예상 달성금액
	$('#totalItamt').html(addCommaWonSpace(data['totalItamt'])); //전체 이자금액
	$('#totalPnamt').html(addCommaWonSpace(data['totalPnamt'])); //전체 원금액
	$('#totalPnntAmt').html(addCommaWonSpace(data['totalPnntAmt'])); //전체금액
	
	$('#depo1Itamt').val(bankUtil.Format.number(data['depo1Itamt']));
	$('#depo1PnntAmt').val(bankUtil.Format.number(data['depo1PnntAmt']));
	$('#depo2Itamt').val(bankUtil.Format.number(data['depo2Itamt']));
	$('#depo2PnntAmt').val(bankUtil.Format.number(data['depo2PnntAmt']));
	
}

function calcDate(el) {
	let goalYear = $('#goalYear').val();
	if(goalYear =='' || Number(goalYear) <1) {
		alertFocus('목표년수를 입력해주세요','goalYear')
		return;
	} else if(Number(goalYear) >10) {
		alertFocus('목표년수는 10년 이내로 입력해주세요','goalYear')
		return;
	}
	let today = bankUtil.Date.get("yyyyMMDD");
	let goalDay = bankUtil.Date.get("yyyy-MM-DD",today,"y",Number(goalYear));
	let savingDate = $("#savingDate"+el).val();
	
	let monthsDiff = monthsgetDateDiff(savingDate, goalDay);
	//alert(savingDate);
	if(savingDate == null || savingDate == '') {
		$('#savingDate'+el).val('');
		$("#depo"+el+"Year").val(0);
		$("#depo"+el+"Month").val(0);
	} else if(monthsDiff > Number(goalYear) * 12) {
		alert("이번달 이전의 날짜는 선택할수 없습니다.");
		$('#savingDate'+el).val('');
		$("#depo"+el+"Year").val(0);
		$("#depo"+el+"Month").val(0);
	} else  {
		$("#depo"+el+"Year").val(parseInt(monthsDiff / 12));
		$("#depo"+el+"Month").val(monthsDiff % 12);
	}
	
}

/* 두 날짜 사이의 일 수 구하기 */
function monthsgetDateDiff(d1, d2) {
	const date1 = new Date(d1);
	const date2 = new Date(d2);
	console.log(d1);
	console.log(d2);
	console.log(date1);
	console.log(date2);
	var months;
	months = (date2.getFullYear() - date1.getFullYear())* 12;
	months -= date1.getMonth()+1;
	months += date2.getMonth();
	months ++;
	console.log(months);
	return months;
	
}

function viewReset() {
	$('#goalYear').val('10');
	$('#goalAmt').val('1');
	$('#expctMnPmnt').html(" 원"); //예상 월납입액
	$('#totalPnamt').html(" 원"); //전체 원금액
	$('#totalPnntAmt').html(" 원"); //전체금액
	$('#totalItamt').html(" 원"); //전체이자금액
	
	$("#savingDate1").val('');
	$('#depo1Pnamt').val(0);
	$('#depo1Itamt').val(0);
	$('#depo1PnntAmt').val(0);
	$('#depo1Year').val(0);
	$('#depo1Month').val(0);
	
	$("#savingDate2").val('');
	$('#depo2Pnamt').val(0);
	$('#depo2Itamt').val(0);
	$('#depo2PnntAmt').val(0);
	$('#depo2Year').val(0);
	$('#depo2Month').val(0);
}

//입력받은 콤마와 띄워쓰기와 원 추가하여 문자열로 반환됨. return String
function addCommaWonSpace(number) {
	var str = "0 원";
	if (number > 0) {
		str = bankUtil.Format.number(number) + " 원"
	}
	return str; 
}

//alert메세지를 띄우고 forElement에 focus하는함수
function alertFocus(msg,elementID){
	alert(msg);
	$('#'+elementID).focus();
}

