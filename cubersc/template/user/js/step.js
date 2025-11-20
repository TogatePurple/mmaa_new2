// js/step.js
/*let check = [false, false, false];*/

$(document).ready(function () {
    //단체 예금형 목돈수탁저축 가입 : 라디오 체크 이벤트 (주소 영역 토글)
    function association_radiocheck() {
        $(".radio_hidden").hide(); // 초깃값 설정

        $("input[name='receipt']").change(function () {
            // 휴대폰 결제 선택 시.
            if ($("input[name='receipt']:checked").val() == "Y") {
                $(".radio_hidden").removeClass("hide").show();
            } else {
                $(".radio_hidden").addClass("hide").hide();
            }
        });
    }

    function setInputSizeWidth() {
        if ($(".set_inpw").val()) {
            var max_width1 = $(".set_inpw").val().length + 26;

            if ($(".set_inpw").val().length <= 26) {
                $(".set_inpp").css("width", "366px");
            }

            $(".set_inpw").attr("size", max_width1);
        }
    }

    setInputSizeWidth();

    association_radiocheck();

    //장병 내일준비적금 가입여부 라디오 체크 이벤트
    $("input[name=savingjoinchk]").on("change", function () {
        $("input[name=savingjoinchk]:checked").val() == "chkY" ? $(".radio_control_target").removeClass("hide") : $(".radio_control_target").addClass("hide");
    });

    /* 개인정보 수집 및 이용 동의 얼럿 닫기 */
    $(".a-close, .a-che").on("click", function () {
        $(this).parents("#alert, #alert1").fadeOut(100);
    });

    /* 미니 얼럿 : 공통 */
    $(".btn_minpop").on("click", function (e) {
        var e = $(this);
        viewMinAlert(e);
    });

    /*    function viewMinAlert(e){
        var _dataname = $(e).attr("data-name");	
		var _targetbox = $("." + _dataname); 
		
		_targetbox.fadeIn(100);
    }*/

    $(".min_alert .a-che,.min_alert .a-close").on("click", function () {
        $(this).parents(".min_alert").fadeOut(100);
    });

    /* 작성 취소시 첫번째 텝으로 이동 */
    $("#w_can").click(function () {
        var tab_id = $(".tab-step").attr("data-tab");

        $(".tab-step").removeClass("active");
        $(".tab-content").removeClass("active");
        $(".tab-step").first().addClass("active");
        $("#" + tab_id).addClass("active");
    });

    /* 예비역을 위한 군인공제회 제도 박스 6 */
    $(".one-person .mycontent .one05 .box .title").click(function () {
        if ($(".one-person  .one05 .box").hasClass("on") === true) {
            $(".one-person .mycontent .one05 .box").removeClass("on");
            $(".one-person .mycontent .one05 .box .box-content").slideUp(500);
        } else {
            $(".one-person .mycontent .one05 .box").addClass("on");
            $(".one-person .mycontent .one05 .box .box-content").slideDown(500);
        }
    });

    /*서브탭 추가로 인한 수정 step 스크립트(범용)::changeSteps를 호출하여 사용합니다.*/
    $(".tab-step").click(function () {
        changeSteps(this);
    });

    /*tabss*/

    $("ul.tabs00.only_toggleClass .tab-link").click(function () {
        $("ul.tabs00.only_toggleClass .tab-link").removeClass("currents");
        $(this).addClass("currents");
    });

    $("ul.tabs00:not(.only_toggleClass) .tab-link").click(function () {
        let parents = $(this).parents().data("eventstop");
        if (parents != undefined || parents == true) {
            //현재 탭 버튼 상위태그에 data-eventstop 속성을 부여하면 클래스 변화를 주지 않습니다. (나눠놓은 화면 동일탭 사용 해야할때 사용함. 2023-07-30 kuv_shw)
            //+ eventstop값에 true을 부여하면 변화를 주지 않습니다. false 들어가면 동작합니다. (조건부 제어용)_2023-09-13_shw
            //+ parents값이 String이아니고 Boolean인걸 확인하고 수정했습니다. fix_2023-09-20_shw
        } else if (parents == undefined || parents == false) {
            var step_id = $(this).attr("data-tab");

            $("ul.tabs00 .tab-link").removeClass("currents");
            $("ul.tabs00 .tab-link > a").attr("title", "");
            $(".tabs-content").removeClass("currents");

            $(this).addClass("currents");
            $(this).find("> a").attr("title", "선택됨");
            $("#sub-" + step_id).addClass("currents");
        }
    });

    /* 이자비교하기 버튼 클릭 시 나타나는 카드영역 : 공통 */
    $(".btn_resultview").on("click", function () {
        var _datatarget = "." + $(this).attr("data-name"); //

        $(_datatarget).fadeIn(300);
    });

    $(".btn_cardclose").on("click", function () {
        $(this).parents(".box_cardresult").fadeOut(300);
    });

    /* small tabss*/
    $(".tabs01.notice-tab .tab-link.currents > a").attr("title", "선택됨");
    $(".tabs01.notice-tab .tab-link").click(function (e) {
        if ($(this).parents("[data-eventstop]").length > 0) {
            //현재 탭 버튼 상위태그에 data-eventstop 속성을 부여하면 클래스 변화를 주지 않습니다. (나눠놓은 화면 동일탭 사용 해야할때 사용함. 2023-07-30 kuv_shw)
        } else {
            var step_id = $(this).attr("data-tab");

            $("ul.tabs01.notice-tab .tab-link").removeClass("currents");
            $("ul.tabs01.notice-tab .tab-link > a").attr("title", "");
            $(".tabs-content1").removeClass("currents");

            $(this).addClass("currents");
            $(this).find("> a").attr("title", "선택됨");
            $("#sub-" + step_id).addClass("currents");
        }
    });

    $(".tabs01 .tab-link.currents > a").attr("title", "선택됨");
    $(".tabs01 .tab-link").click(function (e) {
        $("ul.tabs01 .tab-link > a").attr("title", "");
        $(this).find("> a").attr("title", "선택됨");
    });

    /*  팝업 공통 : 열기 */
    $(".btn_pop").on("click", function () {
        var e = $(this);
        btnpopup(e);
    });

    /*  팝업 공통 : 닫기 */
    $(".help-bg .w-close").on("click", function () {
        var _target = $(this).closest(".help-bg"); // .help_bg
        $("body").removeClass("hidden");
        _target.removeClass("show");
        _target.fadeOut("slow");
    });

    $(".help-bg .d-close").on("click", function () {
        var _target = $(this).closest(".help-bg"); // .help_bg
        $("body").removeClass("hidden");
        _target.removeClass("show");
        _target.fadeOut("slow");
    });

    /*popub tabs*/
    $(".w-btns div").on("click", function () {
        if ($(this).parents("[data-eventstop]").length > 0) {
            //현재 탭 버튼 상위태그에 data-eventstop 속성을 부여하면 클래스 변화를 주지 않습니다. (나눠놓은 화면 동일탭 사용 해야할때 사용함. 2023-07-30 kuv_shw)
        } else {
            var datatab = $(this).attr("data-tab");
            $(".w-btns div, .w-linkcont").removeClass("active");
            $(".w-btns div a").removeClass("select").attr("title", "");

            $(this).addClass("active");
            $("#sub-" + datatab).addClass("active");
            $(this).find("a").addClass("select");
        }
    });

    /*big-pop*/
    $(".pops").hover(function () {
        $(".big-pops").fadeIn("slow", function () {});
    });

    /*유의사항*/
    $(".warning-w").click(function () {
        $(".det-pop.warn").fadeIn("slow", function () {});
    });

    $(".detclose.warn-close").click(function () {
        $(".det-pop.warn").fadeOut("slow", function () {});
    });

    $(".cancels").click(function () {
        $(".cancel").fadeIn("100", function () {});
    });

    $(".a-close, .a-che").click(function () {
        $(".cancel").fadeOut("100", function () {});
    });

    $(".applys").click(function () {
        $(".apply").fadeIn("100", function () {});
    });

    $(".a-close, .a-che").click(function () {
        $(".apply").fadeOut("100", function () {});
    });

    $(".written").click(function () {
        /* 해당 클래스에 false 가 존재하는 경우 alert 창을 띄우지 않음 */
        if ($(this).hasClass("false") == false) {
            $(".write").fadeIn("100", function () {});
        }
    });

    $(".a-close, .a-che").click(function () {
        $(".write").fadeOut("100", function () {});
    });

    /* 약관 동의 : 체크 박스 토글 | .colorful.checked - 빨간색 : 체크됨 | .colorful - 회색 : 체크해체됨 */
    $(".colorful").click(function () {
        var _disagreeText = "동의하지 않습니다";
        var _agreeText = "동의합니다";

        //버튼 체크 클래스 토글하기
        $(this).toggleClass("checked");

        //동의문구 update, hidden input에 Y/N값부여, 슬라이드 기능제어
        if ($(this).hasClass("checked")) {
            //동의문구 설정
            $(this).find(".blind").text(_agreeText);
            //input값 설정
            $(this).find("input").val("Y");
            //슬라이드 기능실행
            if (!$(this).closest(".mycontent").find(".box").hasClass("on")) {
                $(this).closest(".mycontent").find(".title").trigger("click");
            }
        } else {
            //동의문구 설정
            $(this).find(".blind").text(_disagreeText);
            //input값 설정
            $(this).find("input").val("N");
            //슬라이드 기능실행
            if ($(this).closest(".mycontent").find(".box").hasClass("on")) {
                $(this).closest(".mycontent").find(".title").trigger("click");
            }
        }

        //약관 동의 : data-agreecheck를 모두 Y나 N로 체크됬을때 모두동의 체크박스 토글
        if ($(this).data("agreecheck") !== undefined) {
            //클릭한 항목의 값을 구합니다.(부모tab구할때 사용)
            let agreecheckVal = $(this).data("agreecheck");
            //같은 리스트안의 동의항목만(부모가 다를경우를 위함) elements에 담습니다.
            var elements = document.querySelectorAll('[data-agreecheck="' + agreecheckVal + '"]');
            //모두 Y나 N일 경우를 체크
            var allValuesY = 0;
            var allValuesN = 0;

            for (var i = 0; i < elements.length; i++) {
                var inputElement = elements[i].querySelector("input");
                if (inputElement.value == "Y") {
                    allValuesY += 1;
                } else if (inputElement.value == "N") {
                    allValuesN += 1;
                }
            }
            const haselement = document.querySelector('[data-allagree="' + agreecheckVal + '"]');
            if (haselement !== null && haselement !== undefined) {
                if (allValuesY == elements.length) {
                    // 모든 값이 "Y"일 때의 처리
                    var allagreeElement = document.querySelector('[data-allagree="' + agreecheckVal + '"]');
                    allagreeElement.classList.add("checked");
                    termsFlag[agreecheckVal] = true;
                } else {
                    // 하나라도 "N"일 때의 처리
                    var allagreeElement = document.querySelector('[data-allagree="' + agreecheckVal + '"]');
                    allagreeElement.classList.remove("checked");
                    termsFlag[agreecheckVal] = false;
                }
            }
        } else if ($(this).data("allagree") !== undefined) {
            //약관 동의 : 모두동의 체크박스 토글
            let allagreeVal = $(this).data("allagree");
            if ($(this).hasClass("checked")) {
                termsFlag[allagreeVal] = true;
            } else {
                termsFlag[allagreeVal] = false;
            }
        }
    });

    //약관 동의 : 모두동의 체크박스 토글
    $("[data-allagree]").click(function () {
        let allagreeVal = $(this).data("allagree");
        if ($(this).hasClass("checked")) {
            $('[data-agreecheck="' + allagreeVal + '"]').each(function () {
                $(this).addClass("checked");
                $(this).closest(".mycontent").find(".box").addClass("on");
                $(this).closest(".mycontent").find(".box-content").stop().slideDown("fast");

                var inputElement = $(this).find("input");
                if (inputElement) {
                    inputElement.val("Y");
                }
            });
        } else {
            $('[data-agreecheck="' + allagreeVal + '"]').each(function () {
                $(this).removeClass("checked");
                $(this).closest(".mycontent").find(".box").removeClass("on");
                $(this).closest(".mycontent").find(".box-content").stop().slideUp("fast");

                var inputElement = $(this).find("input");
                if (inputElement) {
                    inputElement.val("N");
                }
                // 체크되지 않았을 때의 처리
            });
        }
    });

    /*부모탭관련 약관동의 전역변수설정을 합니다, 페이지 로드 시 최초한번만 실행됩니다.*/
    hasParentTab();

    /*	// 뒤로가기 버튼을 처리하는 이벤트 리스너 등록 (미완성)
	    window.addEventListener('popstate', function(event) {
		  if (tabHistory.length > 1) {
	        // 배열에서 가장 최근 탭 상태를 제거하고 이전 탭 상태로 이동
	        tabHistory.pop();
	        const prevTab = tabHistory[tabHistory.length - 1];
	        changeSteps(prevTab);
	      } else {
	        // 탭 상태가 1개 남았을 때, 초기 탭으로 이동
	        tabHistory.length = 0;
	        changeSteps($('.tab-step[data-tab="tab-0"]'));
	      }
	    });
	*/
});
function viewMinAlert(e) {
    var _dataname = $(e).attr("data-name");
    var _targetbox = $("." + _dataname);

    _targetbox.fadeIn(100);
}

//버튼 팝업 공통 함수
function btnpopup(e) {
    var _dataname = "";
    if (typeof e === "string") {
        _dataname = "." + e;
    } else if (typeof e === "object") {
        _dataname = "." + $(e).attr("data-name"); // .help_bg
    }
    if (_dataname.length < 1) {
        return;
    }

    if ($(this).attr("data-name") === "help_member_inquiries") {
        $(".help_certi_prev").removeClass("hide");
        $(".help_certi_detail").addClass("hide");
    } else if ($(this).attr("data-name") === "help_member_join") {
        $(".help_join_prev").removeClass("hide");
        //$(".help_certi_detail").addClass("hide");
    } else if ($(this).attr("data-name") === "help_payment_apply") {
        $(".help_certi_prev").removeClass("hide");
        $(".help_certi_detail").addClass("hide");
    }

    $(_dataname).fadeIn("slow").addClass("show");
    $("body").addClass("hidden");
    $(_dataname).find(".w-close a").focus();
}

//추가인증 팝업오픈
function addApllyOpen() {
    $(".help_certi_prev").removeClass("hide");
    $(".help_certi_detail").addClass("hide");

    $(".help_payment_apply").fadeIn("slow");
    $("body").addClass("hidden");
    $(".help_payment_apply").find(".w-close a").focus();
    /*$.ajax({		
			url:'/api/PccAfterTemp.do'
			
			, type:'get'
			, async:false
			, success: function (response) {
			  if(response['status'] == 200){
			    printResult('');
				//self.close();
			  }else{
			      alert(response['message']);
			  }
	        }
	        , error: function (request, status, error) {//api 중단될때

					alert("api오류\ncode:" + request.status + "\n" + "message:" + request.responseText + "\n");	
				
	        }
		});*/
}

function changePosition() {
    var actPosition = $(".tab-step.active").position();
    var actWidth = $(".tab-step.active").width();
    $("#red").css({ left: +actPosition.left, width: actWidth });
}

//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 약관동의(옛날거, 다 교체하면 삭제예정 2023-10-03) ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
/* 약관동의 확인여부 전역변수, checkAgree()에 사용됨*/
//■수정예정, 수정이유: -매개변수 설정이 번거로움, 요소에 아이디나 data속성을 부여해서 알아서 찾도록 설정할예정.
//		   		   -한 화면에 약관동의가 하나밖에 없기때문에 간소화해서 사용해도 됨. _shw
var termsFlag = [];
/* 부모탭 있는지 확인하여 개수만큼 약관동의 전역변수로 설정하는 함수 1개- 부모탭없음, 2개이상- 부모탭 존재*/
//부모탭에는 data-tabParent 데이터태그 붙여야합니다.
function hasParentTab() {
    // 중복되지 않는 값을 저장할 배열
    var uniqueValues = [];

    // data-agreecheck 속성을 가진 모든 요소 선택
    var elements = document.querySelectorAll("[data-agreecheck]");

    // 각 요소의 값을 가져와서 중복 여부 확인 후 배열에 저장
    elements.forEach(function (element) {
        var value = element.getAttribute("data-agreecheck");

        // 배열에 값이 없을 경우에만 저장
        if (!uniqueValues.includes(value)) {
            uniqueValues.push(value);
        }
    });
    var parentNum = uniqueValues.length;
    if (parentNum > 0) {
        for (var i = 0; i < parentNum; i++) {
            termsFlag[i] = false;
        }
    } else {
        termsFlag[0] = false;
    }
}

//////////////////////////////////////////////////////////////////////////////////////

/*약관동의 조건확인(true/false) 함수, 
현재 열려있는(active) 탭의 페이지의 약관동의 리스트를 확인하여 모두 동의시 true를 반환합니다.*/
//약관동의 항목엔 data-agreecheck 데이터 태그 붙여야 합니다.
function checkAgreeList(num) {
    let listAll;
    var parentNum = "";
    //부모tab 존재 시 현재 활성화된 부모tab번호를 구합니다.
    if (termsFlag.length > 1 && num !== undefined) {
        parentNum = num;
        if (parentNum == 0) parentNum = "";
        listAll = $('[data-agreecheck="' + parentNum + '"]');
        //단일페이지 시 동의 항목을 리스트에 담습니다.
    } else if (termsFlag.length > 1 && num == undefined) {
        //console.log("checkAgreeList 조건미충족");
        return false;
    } else {
        listAll = $("[data-agreecheck]");
    }

    for (let i = 0; i < listAll.length; i++) {
        //필수/선택여부확인
        let agreeOptional = $(listAll[i]).find("input[data-agreeOptional]").length > 0;
        //선택 약관일 경우 체크하지 않고 다음으로 넘김.
        if (!agreeOptional) {
            if ($(listAll[i]).find("input").val() == "N") {
                $("#alert" + parentNum).fadeIn("100", function () {});
                $(".a-close, .a-che").click(function () {
                    $("#alert" + parentNum).fadeOut("100", function () {});
                });
                return false;
            }
        }
    }
    return true;
}
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■약관동의(옛날거)■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 약관동의(현재거, 교체중 2023-10-03 시작) ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
//param: 약관동의 여러개일경우(여러화면일경우)고유번호부여 => data-agreearea='num', 없이 사용가능(페이지 내 단일요소일 경우).
//return : true/false
//예시: checkAgree(1)로 실행하면 data-agreearea='1'의 하위 약관동의들 체크함.
//상위요소(class가 tab-content인 div)에 data-agreearea가 필요하고,
//하위에 동의요소(약관동의 체크버튼 a)마다 data-agreecheck 가 필요하고,
//필수여부 약관일 경우 data-agreecheck를 Y로, 선택약관은 N으로 한다.
//모두동의 항목일 경우(약관동의 체크버튼 a) data-allagree를 추가한다.
function checkAgree(num) {
    //data-agreearea 고유번호, 매개변수 없으면 빈값으로 설정하여 값이 없는 data-agreearea를 찾는다.
    if (num == undefined) num = "";
    //약관동의 구역 찾기(단일요소)
    let checkArea = $('[data-agreearea="' + num + '"]');
    //구역 내 모든 필수동의항목 찾아 리스트에 담기
    let checkList = [];
    checkList = $(checkArea).find('[data-agreecheck="Y"]');
    //작업중 2023-10-03_shw
}

//■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■약관동의(현재거)■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

/*step 이동 핸들러, tab버튼 클릭 이벤트 걸려있어 따로 설정 필요없고, 
tabStatus() 함수에 from tab-n에서 to tab-n 으로 갈때 필요한 조건식을 각자 페이지에 맞게 넣어서 사용해주시면 됩니다.
버튼을 이용해 탭 이동시 param에 이동할 탭 id(=>'tab-1~n')를 쓰면 됩니다. 
버튼 이동, 탭이동시 조건함수는 다를 수 있으므로 버튼 함수 btnStatus()에 tabStatus()함수와 마찬가지로 개별 조건 추가해서 사용합니다.
*/
function changeSteps(obj) {
    //부모tab 개수확인 (1개이상 true 없으면 false반환)
    var hasParentTab = $(".tab-link").length > 1;
    var tabObj;
    var tobtn;
    //obj가 string이면 버튼눌렀을 때 입니다.
    if (typeof obj === "string") {
        tobtn = obj;
        tabObj = document.querySelector('[data-tab="' + obj + '"]');
        //obj가 object면 탭버튼 눌렀을때 입니다.
    } else if (typeof obj === "object") {
        tobtn = $(obj).attr("data-tab");
        tabObj = obj;
    }

    var btnlist;
    var frombtn;
    var contentlist;

    if (hasParentTab) {
        //부모가 있을때 보이는 부모탬의 모든 탭버튼을 리스트로 저장함
        btnlist = $(tabObj).parent().find(".tab-step");
        //부모가 있을때 현재 화면의 탭버튼을 저장(from으로쓰임)
        frombtn = btnlist.filter(".active").attr("data-tab");
        //부모가 있을때 해당부모의 화면영역(div) 모두를 저장
        contentlist = $("#" + tobtn).siblings("div");
    } else {
        btnlist = $(".tab-step");
        frombtn = btnlist.filter(".active").attr("data-tab");
        contentlist = $(".tab-content");
    }
    //출발하고 도착할 tab화면마다 조건을 달 수 있도록 조건 함수 (step이동조건 or 버튼이동 조건 함수)를 지정합니다.
    //각 페이지마다의 btnStataus, tabStatus 조건함수를 해당 페이지에 각각 작성하여 사용합니다.
    let selectedCondition = true;
    if (typeof obj === "string") {
        selectedCondition = btnStatus(tobtn, frombtn);
    } else if (typeof obj === "object") {
        selectedCondition = tabStatus(tobtn, frombtn);
    }
    if (selectedCondition) {
        moveScrollTop();
        btnlist.removeClass("active");
        contentlist.removeClass("active");
        $(tabObj).addClass("active");
        $("#" + tobtn).addClass("active");
    }
}

function moveScrollTop() {
    $("html,body").animate({ scrollTop: 0 }, 500);
}

/* 
텝 활용할 페이지에서 이동 가능한 조건 추가할 경우
아래의 스크립트 활용하여 추가합니다.

탭 이동시 조건을 추가할때 사용합니다. return true/false
아래 예시는 탭버튼 tab-0을 눌러 tab-1로 이동할때 무조건 이동하지 못하도록 하고, tab-2로 이동은 무조건 허용하게 하는 조건입니다. 
function tabStatus(to,from){
	if (from =='tab-0' && to =='tab-1'){
		return false;
	}
	if (from =='tab-0' && to =='tab-2'){
		return true;
	}
	return false; //기본조건 false로 위 두개의 조건이 아닌경우엔 무조건 이동 못하도록 false 반환합니다. 
					//return true로 하면 위 두개의 조건이 아닌경우엔 무조건 이동 가능하도록 true 반환합니다. 
}

버튼 이동시 조건을 추가할때 사용합니다. return true/false
function btnStatus(to,from){
	return true;
}

*/
