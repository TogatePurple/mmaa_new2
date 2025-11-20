var bankUtil = {};

/**
 * serverDate 서버의 오늘날짜를 구한다.
 */
var xmlHttpRequest = null;
var serverDate = "";
if (window.XMLHttpRequest) {
    xmlHttpRequest = new XMLHttpRequest();
} else if (window.ActiveXObject) {
    xmlHttpRequest = new ActiveXObject("Microsoft.XMLHTTP");
} else {
}
if (xmlHttpRequest != null) {
    xmlHttpRequest.open("HEAD", window.location.href.toString(), false);
    xmlHttpRequest.setRequestHeader("ContentType", "text/html");
    xmlHttpRequest.send("");

    serverDate = xmlHttpRequest.getResponseHeader("Date");
}

bankUtil.goMain = function () {
    location.href = "/bank/web/index.jsp";
};

/**
 * 파일 다운로드를 수행한다.
 * ex) util.download("/archive/board/form/form8/150924143754360새한컴오피스한글2010문서.hwp","한글.hwp");
 * 웹취약성 문제 때문에 id를 받는 것으로 수정 2022.07.12
 * @param path
 * @param name
 * @return File
 */
bankUtil.download = function (board_id, file_id) {
    var input = {};
    input["board_id"] = board_id;
    input["file_id"] = file_id;

    var $body = $(document.body);
    var $form = $("<form></form>").attr("action", "/mmaa/common/Download.nut").css("display", "none").attr("accept-charset", "UTF-8");

    $("<input type='text' name='nut' value=" + JSON.stringify(input) + " />").appendTo($form);

    if ($form.get(0).canHaveHTML) document.characterSet = "UTF-8";

    $form.appendTo($body);
    $form.submit(); // 응답에서 에러나면 파일 다운로드 안하고 해당페이지로 넘어간다. 에러날일은 잘 없지만;; 혹시나 문제생기면 iframe만들어서 처리하는게 답이긴하다.
    $form.remove();
};
bankUtil.getImgSrc = function (src) {
    return "/mmaa/common/LoadImage.nut?path=" + src;
};
bankUtil.getImgSrcWelfare = function (src) {
    return "/mmaa/common/LoadImageWelfare.nut?path=" + src;
};
bankUtil.openAddress = function (postName, addressName) {
    if (!postName) postName = "offPostNo1";
    if (!addressName) addressName = "offAddr1";

    bankUtil.popup.open("/bank/web/juso/road.jsp?postName=" + postName + "&addressName=" + addressName, "JusoSearch", "780", "640");
};
bankUtil.Progress = {
    init: function () {
        if (!this.$) {
            this.$ = $('<div id="progress-container"><div class="progress-mask"></div><img class="progress-image" src="/bank/web/images/loading_new_1.gif"></div>');
            $("body").append(this.$);
        }
    },
    q: [],
    run: function () {
        this.init();
        this.q.push(1);
        this.$.addClass("run");
    },
    stop: function () {
        this.q.pop();
        if (this.q.length === 0) this.$.removeClass("run");
    },
};

/*$(function(){
	jnut.ajaxOption({
		onError:function(err){
			var isNext = false;
			switch(err.Exception){
				case "BizException":
					isNext = true;
					break;
				case "SessionException":
					alert(err.MSG);
					bankUtil.goMain();
					break;
				case "BizCommonException":
					alert(err.MSG);
					break;
				default:
					alert("처리중 오류가 발생했습니다.");
					break;
			}
			
			return isNext;
		}
	});
});*/
$(document).ready(function () {
    //2016-12-05 https 자동 리다이렉트
    var sPRTC = window.location["protocol"];
    if (sPRTC.toUpperCase() != "HTTPS:") {
        //window.location.href = window.location.href.toLowerCase().replace('http:', 'https:');
    }

    //추가본
    $(document).on("keyup", "input:text[numberOnly]", function () {
        $(this).val(
            $(this)
                .val()
                .replace(/[^0-9]/gi, "")
        );
    });
    $(document).on("keyup", "input:password[numberOnly]", function () {
        $(this).val(
            $(this)
                .val()
                .replace(/[^0-9]/gi, "")
        );
    });
    $(document).on("keyup", "input:text[datetimeOnly]", function () {
        $(this).val(
            $(this)
                .val()
                .replace(/[^0-9:\-]/gi, "")
        );
    });

    //숫자만 입력됨
    $(".num_only")
        .css("imeMode", "disabled")
        .keypress(function (event) {
            if (event.which && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
        })
        .keyup(function () {
            var value = $(this).val();
            if (value != null && value != "") {
                value = value.replace(/[^0-9]/g, "");
                // 맨 앞의 0을 제거
                while (value.startsWith("0") && value.length > 1) {
                    value = value.slice(1);
                }
                $(this).val(value);
            }
        });

    //숫자만 입력되고 3자리마다 콤마를 찍어줌
    $(".num_only2")
        .css("imeMode", "disabled")
        .keypress(function (event) {
            if (event.which && (event.which < 48 || event.which > 57)) {
                event.preventDefault();
            }
        })
        .keyup(function () {
            if ($(this).val() != null && $(this).val() != "") {
                var tmps = $(this)
                    .val()
                    .replace(/[^0-9]/g, "");
                // 맨 앞의 0을 제거
                while (tmps.startsWith("0") && tmps.length > 1) {
                    tmps = tmps.slice(1);
                }
                var tmps2 = tmps.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                $(this).val(tmps2);
            }
        });

    //페이지네비게이션
    var menuList = [
        { text: "증좌신청", a: "/bank/web/wagesaving/WagesavingOpen.jsp" },
        { text: "탈퇴신청", a: "/bank/web/wagesaving/WagesavingOut.jsp" },
        { text: "퇴직신청", a: "/bank/web/wagesaving/retireSavingsCancel.jsp" },
        { text: "부분해약/대여상환신청", a: "/bank/web/wagesaving/WageSavingsPartCancel.jsp" },
        { text: "퇴직/탈퇴/부분해약조회", a: "/bank/web/wagesaving/WageSavingsApplyList.jsp" },
        { text: "회원퇴직급여조회", a: "/bank/web/wagesaving/wagePaymentAppList.jsp" },
        { text: "기존지급금액", a: "/bank/web/wagesaving/wagePaymentAppList.jsp" },
        { text: "신규/증좌시예상금액", a: "/bank/web/wagesaving/WagePaymentSimulation.jsp" },
        { text: "현재/향후저축금액", a: "/bank/web/wagesaving/WagesavingInquiry.jsp" },
        { text: "저축증명서출력(한글/영문)", a: "/bank/web/wagesaving/WagesavingCertificate.jsp" },
        { text: "회원퇴직급여FAQ", a: "/bank/web/wagesaving/wagesavingFAQ.jsp?menuid=257" },
        { text: "퇴직시가입신청", a: "/bank/web/retiresaving/RetiresavingJoinRetire.jsp" },
        { text: "탈퇴시가입신청", a: "/bank/web/retiresaving/RetiresavingJoinOut.jsp" },
        { text: "신청조회및취소", a: "/bank/web/retiresaving/RetiresavingApplyInquiry.jsp" },
        { text: "중도해약", a: "/bank/web/retiresaving/RetiresavingMiddleClose.jsp" },
        { text: "가입및지급내역", a: "/bank/web/retiresaving/RetiresavingInquiry.jsp" },
        { text: "저축증서출력", a: "/bank/web/retiresaving/RetiresavingReceipt.jsp" },
        { text: "저축증명서출력(한글/영문)", a: "/bank/web/retiresaving/RetiresavingCertificate.jsp" },
        { text: "신규(추가)가입", a: "/bank/web/trustsaving/TrustsavingOpen.jsp" },
        { text: "중도(부분)해약", a: "/bank/web/trustsaving/TrustsavingMiddleClose.jsp" },
        { text: "만기(재가입/지급)", a: "/bank/web/trustsaving/TrustsavingExpire.jsp" },
        { text: "가입및지급내역", a: "/bank/web/trustsaving/TrustsavingInquiry.jsp" },
        { text: "저축증서출력", a: "/bank/web/trustsaving/TrustsavingReceipt.jsp" },
        { text: "저축증명서출력(한글/영문)", a: "/bank/web/trustsaving/TrustsavingCertificate.jsp" },
        { text: "목돈수탁/비과세종합저축FAQ", a: "/bank/web/trustsaving/trustsavingFAQ.jsp?menuid=258" },
        { text: "대여신청", a: "/bank/web/lifefundloan/LifefundloanApply.jsp" },
        { text: "대여신청", a: "/bank/web/lifefundloan/LifefundloanApply.jsp" },
        { text: "대여신청결과조회", a: "/bank/web/lifefundloan/LifefundloanApplyResult.jsp" },
        { text: "대여/상환내역조회", a: "/bank/web/lifefundloan/LifefundloanPreInquiry.jsp" },
        { text: "대여가능금액조회", a: "/bank/web/lifefundloan/LifefundloanPreInquiry.jsp" },
        { text: "완제내역조회", a: "/bank/web/lifefundloan/LifefundloanEndInquiry.jsp" },
        { text: "상환내역조회", a: "/bank/web/lifefundloan/LifefundloanRepaymentInquiry.jsp" },
        { text: "퇴직급여대여FAQ", a: "/bank/web/lifefundloan/lifefundloanFAQ.jsp?menuid=259" },
        { text: "나의활동내역", a: "/bank/web/mypage/MypageInquiry.jsp" },
        { text: "개인정보변경", a: "/bank/web/mypage/MypageModify.jsp" },
        { text: "인터넷회원탈퇴", a: "/bank/web/mypage/MypageOut.jsp" },
        { text: "전체상품조회", a: "/bank/web/mypage/WholeProductInquiryBank.jsp" },
        { text: "회원증출력", a: "/bank/web/mypage/memberCert.jsp" },
        { text: "공제회FAQ", a: "/bank/web/notice/faq1.jsp" },
        { text: "회원정보", a: "/bank/web/notice/faq1.jsp" },
        { text: "회원퇴직급여", a: "/bank/web/notice/faq2.jsp" },
        { text: "분할급여", a: "/bank/web/notice/faq3.jsp" },
        { text: "목돈수탁/비과세종합저축", a: "/bank/web/notice/faq4.jsp" },
        { text: "퇴직급여대여", a: "/bank/web/notice/faq5.jsp" },
        { text: "공제회Q&A", a: "/bank/web/qna/qna.jsp?menuid=369" },
        { text: "서식자료실", a: "/bank/web/formdatacenter/datacenter.jsp?menuid=267" },
        { text: "기업공시", a: "/bank/web/officialNotice/officialNotice1.jsp" },
        { text: "로그인", a: "/bank/web/index.jsp" },
        { text: "공제회회원가입", a: "/bank/web/member/MemberIntro.jsp" },
        { text: "회원가입안내", a: "/bank/web/member/MemberIntro.jsp" },
        { text: "회원가입(재가입)신청", a: "/bank/web/member/MemberJoin.jsp" },
        { text: "회원가입조회", a: "/bank/web/member/MemberJoinSearch.jsp" },
        { text: "인터넷회원가입", a: "/bank/web/member/MemberEJoin.jsp" },
        { text: "아이디/비밀번호찾기", a: "/bank/web/member/MemberSearchId.jsp" },
        { text: "아이디찾기", a: "/bank/web/member/MemberSearchId.jsp" },
        { text: "비밀번호찾기", a: "/bank/web/member/MemberSearchPw.jsp" },
        { text: "인터넷창구", a: "/bank/web/index.jsp" },
    ];
    var locationList = $(".location a");
    var $menu;
    var url;
    for (var i = 0; i < locationList.length; i++) {
        $menu = $(locationList[i]);
        if (i === 0) {
            $menu.attr("href", "/bank/web/index.jsp");
        } else if (i === locationList.length - 1) {
            $menu.click(function (e) {
                e.preventDefault();
            });
        } else {
            url = getUrl($menu.text().replace(/ /g, ""));
            if (url) {
                $menu.attr("href", url);
            } else {
                $menu.click(function (e) {
                    e.preventDefault();
                });
            }
        }
    }
    function getUrl(menu) {
        var href;
        for (var k = 0; k < menuList.length; k++) {
            if (menu === menuList[k].text) {
                href = menuList[k].a;
                break;
            } else if (k === menuList.length - 1) {
                href = "";
            }
        }
        return href;
    }
    //end of 페이지네비게이션
});
/**
 * jnut getServiceManager 를 반환한다.
 * @param isNotProgress true||false 로딩바 미사용여부
 */
/*bankUtil.getServiceManager = function(isNotProgress){
	var r = jnut.getServiceManager("mmaa");
	if(!isNotProgress){
		r.before(function(){
			bankUtil.Progress.run();
			var _inputs_ = this._ins;
			if (_inputs_ && window.KOS && KOS.getSeed()) {
				for(var i in _inputs_){
					_inputs_[i]["_KDF_SEED"] = KOS.getSeed();
				}
			}
		});
		r.after(function(){bankUtil.Progress.stop();});
	}
	
	return r;
};*/
/**
 * 키보드 보안 대상 필드에 대해 ajax 거래 전 입력값 셋팅
 */
bankUtil.setE2eField = function (input, key, value) {
    if (!input) return;
    if (window.KOS && window.KOS.getSeed()) {
        input["_KDF_" + key] = value;
    } else {
        input[key] = value;
    }
};

/**
 * 사용자 입력 엔터값을 줄바꿈 태그로 치환한다.
 */
bankUtil.replaceEnterToTag = function (s) {
    if (!s) return "";
    return s.replace(/\n\r/g, "<br/>").replace(/\n/g, "<br/>");
};
bankUtil.replaceEscapeTags = function (s, js) {
    if (!s) return "";
    if (js) {
        return s.replace(/<script/g, "&lt;script").replace(/<\/script/g, "&lt;/script");
    } else {
        return s.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }
};

/**
 * 콤보 박스에 option 항목을 셋팅한다.
 * @param el : 대상 select 엘리먼트의 "id" || elementObject || jQueryObject
 * @param list : 콤보에 셋팅할 데이터
 * @param valueKeyNameORformatter : option 엘리먼트의 value에 셋팅될 데이터의 "Key Name" || custom function
 * @param textKeyNameORformatter : option 엘리먼트의 text에 셋팅될 데이터의 "Key Name" || custom function
 * @param isNoClear : 대상 select 엘리먼트의 하위를 삭제하지 않고 추가 여부
 * @param isAppendingDoseNotHave : 동일한 value값이 없는 항목만 추가 여부
 * 
 * ex)  bankUtil.makeSelect("selectId", [{"key1":"값1", "key2":"텍스트1"}, {"key1":"값2", "key2":"텍스트2"}], "key1", "key2")
 *      bankUtil.makeSelect("selectId", [{"key1":"값1", "key2":"텍스트1"}, {"key1":"값2", "key2":"텍스트2"}], function(r){
		    return r.key1+"|"+r.key2;
		}, function(r){
		    return r.key2 + "("+r.key1+")";
		})
 */
bankUtil.makeSelect = function (el, list, valueKeyNameORformatter, textKeyNameORformatter, isNoClear, isAppendingDoseNotHave) {
    if (!list) return;

    var $el;
    if (typeof el === "string") $el = $(document.getElementById(el));
    else $el = $(el);

    if ($el.length === 0) return;

    if (!isNoClear) $el.children().remove();

    var val,
        text,
        options = [];
    for (var i = 0; i < list.length; i++) {
        if (typeof valueKeyNameORformatter === "string") {
            val = list[i][valueKeyNameORformatter];
        } else {
            val = valueKeyNameORformatter(list[i]);
        }

        if (typeof textKeyNameORformatter === "string") {
            text = list[i][textKeyNameORformatter];
        } else {
            text = textKeyNameORformatter(list[i]);
        }

        if (isAppendingDoseNotHave) {
            if ($el.find("option[value='" + val + "']").length === 0) {
                options.push($("<option />").attr("value", val).text(text).data("value", val));
            }
        } else {
            options.push($("<option />").attr("value", val).text(text).data("value", val));
        }
    }
    $el.append(options);
};

/**
 * 날짜 유틸
 * 서버 날짜 받기로 수정
 * param xmlHttpRequest , serverDate
 * param 상단에 전연번수로 선언
 */

bankUtil.Date = {
    Format: {
        def: "yyyy-MM-DD",
        f1: "yyyyMMDD",
        f2: "yyyy.MM.DD(E) a/p HH:MI",
        f2: "yyyy-MM-DD(E)",
        f4: "yy/mm/dd(E)",
        f5: "A/P HH:MI:SS",
        weekName: ["일", "월", "화", "수", "목", "금", "토"],
    },
    /**
     * @param f : 포멧
     * @param inputDate : 날짜
     * @param dv : 년월일주 구분
     * @param f : 계산될 값
     * @param bDefaultCurrnet : 두번째 인자인 inputDate가 null일경우 현재 날짜를 반환할지 여부.
     *
     * ex) bankUtil.Date.get("yyyy-MM-DD")// 현재날짜의 "yyyy-mm-dd"
     *     bankUtil.Date.get("yyyy-MM-DD", "20150513")// 현재날짜의 "2015-05-13"
     */
    get: function (f, inputDate, dv, val, bDefaultCurrnet) {
        if (!f) f = this.Format.def;

        var d = null;
        if (typeof inputDate === "object" && inputDate instanceof Date) {
            d = inputDate;
        } else if (inputDate && typeof inputDate === "string") {
            inputDate = inputDate.replace(/[^\d]/g, "");
            if (inputDate.length === 6) {
                d = new Date(inputDate.substr(0, 4), inputDate.substr(4, 2) - 1, "01");
            } else if (inputDate.length === 8) {
                d = new Date(inputDate.substr(0, 4), inputDate.substr(4, 2) - 1, inputDate.substr(6, 2));
            } else if (inputDate.length >= 14) {
                d = new Date(inputDate.substr(0, 4), inputDate.substr(4, 2) - 1, inputDate.substr(6, 2), inputDate.substr(8, 2), inputDate.substr(10, 2), inputDate.substr(12, 2));
            } else {
                //d = new Date();
                if (serverDate == null || serverDate == "") {
                    d = new Date();
                } else {
                    d = new Date(serverDate);
                    const utc = d.getTime() + d.getTimezoneOffset() * 60 * 1000;
                    const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
                    const kr_curr = new Date(utc + KR_TIME_DIFF);
                    d = kr_curr;
                }
            }
        } else {
            if (bDefaultCurrnet === undefined || bDefaultCurrnet === true || bDefaultCurrnet === null) {
                //d = new Date();
                if (serverDate == null || serverDate == "") {
                    d = new Date();
                } else {
                    d = new Date(serverDate);
                    const utc = d.getTime() + d.getTimezoneOffset() * 60 * 1000;
                    const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
                    const kr_curr = new Date(utc + KR_TIME_DIFF);
                    d = kr_curr;
                }
            } else {
                return "";
            }
        }

        switch (dv) {
            case "y":
                d.setFullYear(d.getFullYear() + val);
                break;
            case "m":
                d.setMonth(d.getMonth() + val);
                break;
            case "d":
                d.setDate(d.getDate() + val);
                break;
            case "w":
                d.setDate(d.getDate() + val * 7);
                break;
        }

        return f.replace(/(yyyy|yy|mm|MM|EMM|dd|DD|E|hh24|hh|HH24|HH|mi|MI|ss|SS|a\/p|A\/P)/gi, function ($1) {
            switch ($1) {
                case "yyyy":
                    return d.getFullYear();
                case "yy":
                    return d.getFullYear() - 2000;
                case "mm":
                    return d.getMonth() + 1;
                case "MM":
                    return bankUtil.Date.z(d.getMonth() + 1);
                case "EMM":
                    return eng(bankUtil.Date.z(d.getMonth() + 1));
                case "dd":
                    return d.getDate();
                case "DD":
                    return bankUtil.Date.z(d.getDate());
                case "E":
                    return bankUtil.Date.Format.weekName[d.getDay()];
                case "hh24":
                    return d.getHours();
                case "hh":
                    return (h = d.getHours() % 12) ? h : 12;
                case "HH24":
                    return bankUtil.Date.z(d.getHours());
                case "HH":
                    return bankUtil.Date.z((h = d.getHours() % 12) ? h : 12);
                case "mi":
                    return d.getMinutes();
                case "MI":
                    return bankUtil.Date.z(d.getMinutes());
                case "ss":
                    return d.getSeconds();
                case "SS":
                    return bankUtil.Date.z(d.getSeconds());
                case "a/p":
                    return d.getHours() < 12 ? "오전" : "오후";
                case "A/P":
                    return d.getHours() < 12 ? "am" : "pm";
                default:
                    return $1;
            }
        });
    },
    z: function (a) {
        if (a < 10 || a.length === 1) {
            return "0" + a;
        }
        return a;
    },
    // 인자값이 날짜형태에 맞는지 확인
    chkDateTp: function chkDateTp(ymd) {
        if (bankUtil.Format.isNumeric(ymd)) {
            var Days_in_Month = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
            var yyyy = ymd.substring(0, 4);
            var mm = ymd.substring(4, 6);
            var dd = ymd.substring(6, 8);
            if (mm < "10") {
                mm = mm.substring(1, 2);
            }
            if (dd < "10") {
                dd = dd.substring(1, 2);
            }

            //  2월인 경우 윤년여부 체크
            if (mm == "2") {
                if (yyyy % 400 == 0 || (yyyy % 4 == 0 && yyyy % 100 != 0)) {
                    Days_in_Month[1] = 29;
                } else {
                    Days_in_Month[1] = 28;
                }
            }

            if (eval(mm + " < 1 && " + mm + " > 12")) {
                return false;
            }
            if (eval(dd + " > 0 && " + dd + " <= " + Days_in_Month[eval(mm + "-1")])) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },

    /**
     * 해당 년월의 총 날짜수 반환
     * @param yyyyMM : 년월
     *
     * ex) bankUtil.Date.getLastDay("201502");    // 알고자 하는 년월
     *      ==> result : 28                                 // 결과 값
     */
    getLastDay: function (yyyyMM) {
        var s_yyyyMM = String(yyyyMM);
        if (bankUtil.Format.isNumeric(yyyyMM) && s_yyyyMM.length > 3) {
            var Days_in_Month = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
            var yyyy = parseInt(s_yyyyMM.substring(0, 4), 10);
            var mm = parseInt(s_yyyyMM.substring(4, 6), 10);
            //  2월인 경우 윤년여부 체크
            if (mm === 2) {
                if (yyyy % 400 == 0 || (yyyy % 4 == 0 && yyyy % 100 != 0)) {
                    Days_in_Month[1] = 29;
                } else {
                    Days_in_Month[1] = 28;
                }
            }
            return Days_in_Month[mm - 1];
        } else {
            return 0;
        }
    },
};

bankUtil.Format = {
    //숫자
    //1234567.908의 숫자를 "12,345,67.908"형식으로 포매팅한다.
    number: function (dat) {
        if (dat === undefined || dat === null || dat === "") return "0";
        if (typeof dat == "number") dat = String(dat);

        var reg = /(^[+-]?\d+)(\d{3})/;
        dat += "";
        while (reg.test(dat)) dat = dat.replace(reg, "$1" + "," + "$2");

        return dat;
    },
    rate: function (v) {
        v = parseFloat(v, 10) || 0;
        return Math.floor(v * 100) / 100;
    },
    // 입력받은 문자열이 숫자들인지를 확인
    isNumeric: function (checkStr) {
        var checkOK = "0123456789";
        for (i = 0; i < checkStr.length; i++) {
            ch = checkStr.charAt(i);
            for (j = 0; j < checkOK.length; j++) {
                if (ch == checkOK.charAt(j)) {
                    break;
                }
            }
            if (j == checkOK.length) {
                return false;
                break;
            }
        }

        return true;
    },
    //이동전화번호
    //0100000000 숫자를 "010-0000-0000"형식으로 포매팅한다.
    mobile: function (dat) {
        if (/[^0-9]/g.test(dat)) {
            dat = dat.replace(/[^0-9]/g, "");
        }
        var reg = /(^01[0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/;
        dat += "";
        dat = dat.replace(reg, "$1-$2-$3");

        return dat;
    },
    //우편번호
    zipNo: function (dat) {
        if (isNaN(dat)) return dat;
        if (/[^0-9]/g.test(dat)) {
            dat = dat.replace(/[^0-9]/g, "");
        }
        if (dat.length != 6) return dat;
        else return dat.substring(0, 3) + "-" + dat.substring(3, 6);
    },
};

bankUtil.popup = {
    /**
     * 윈도우 팝업열기(POST)
     * @param url
     * @param name
     * @param w
     * @param h
     * @param formId   : form submit 방식으로 열어야 할경우 대상 form ID
     * @param option 윈도우 오픈 기타 옵션.
     * @param get방식 여부
     */
    open: function (url, name, w, h, formId, opt, isGetType) {
        var x = window.screen.width / 2 - w / 2;
        var y = window.screen.height / 2 - h / 2;
        var defOpt = { scrollbars: "yes", status: "no", resizable: "yes", top: y, left: x };
        $.extend(defOpt, opt);

        var pop = window.open("", name, "width=" + w + ", height=" + h + ", left=" + defOpt.left + ", top=" + defOpt.top + ", scrollbars=" + defOpt.scrollbars + ", status=" + defOpt.status + ", resizable=" + defOpt.resizable + ",location");

        if (!!formId) {
            if (!isGetType) {
                var f = document.getElementById(formId);
                f.action = url;
                f.target = name;
                f.submit();
            } else {
                var params = "?";
                $.each($("#" + formId).find("input,select,textarea"), function (i, v) {
                    if (!v.name || v.type === "button") {
                        return true;
                    }

                    if (v.type === "radio" || v.type === "checkbox") {
                        if (v.checked) {
                            params = bankUtil.popup._makeGetParameter(params, v.name, $(v).val());
                        }
                    } else {
                        params = bankUtil.popup._makeGetParameter(params, v.name, $(v).val());
                    }
                });
                url += params;
                if (pop) pop.location.href = url;
            }
        } else {
            if (pop) pop.location.href = url;
        }
        //		if(!!pop){
        //			pop.blur();
        //			pop.focus();
        //
        //			var activeElement =document.activeElement;
        //			var _interval_ = 0;
        //			_interval_ = window.setInterval(function(){
        //				if(pop.closed){
        //					window.blur();
        //					window.focus();
        //					$(activeElement).focus();
        //					window.clearInterval(_interval_);
        //				}
        //			}, 10);
        //		}
        return pop;
    },
    _makeGetParameter: function (p, k, v) {
        if (p.charAt(p.length - 1) !== "?") {
            p += "&";
        }
        return (p += k + "=" + encodeURIComponent(v));
    },

    /**
     * 윈도우 팝업열기(POST)
     * - 신규작성. open과 기능 동일하나 pop.location.href 대신 pop.location.replace 사용
     * @param url
     * @param name
     * @param w
     * @param h
     * @param formId   : form submit 방식으로 열어야 할경우 대상 form ID
     * @param option 윈도우 오픈 기타 옵션.
     * @param get방식 여부
     */
    openMulti: function (url, name, w, h, formId, opt, isGetType) {
        var x = window.screen.width / 2 - w / 2;
        var y = window.screen.height / 2 - h / 2;
        var defOpt = { scrollbars: "yes", status: "no", resizable: "yes", top: y, left: x };
        $.extend(defOpt, opt);

        var pop = window.open("", name, "width=" + w + ", height=" + h + ", left=" + defOpt.left + ", top=" + defOpt.top + ", scrollbars=" + defOpt.scrollbars + ", status=" + defOpt.status + ", resizable=" + defOpt.resizable + ",location");

        if (!!formId) {
            if (!isGetType) {
                var f = document.getElementById(formId);
                f.action = url;
                f.target = name;
                f.submit();
            } else {
                var params = "?";
                $.each($("#" + formId).find("input,select,textarea"), function (i, v) {
                    if (!v.name || v.type === "button") {
                        return true;
                    }

                    if (v.type === "radio" || v.type === "checkbox") {
                        if (v.checked) {
                            params = bankUtil.popup._makeGetParameter(params, v.name, $(v).val());
                        }
                    } else {
                        params = bankUtil.popup._makeGetParameter(params, v.name, $(v).val());
                    }
                });
                url += params;
                if (pop) pop.location.replace(url);
            }
        } else {
            if (pop) pop.location.replace(url);
        }

        return pop;
    },
};

/**
 * 테이블아이디를 받아 테이블을 JSONString으로 변환한다.
 * TODO : 키가 한글로 되어진다.
 * submit 하기전에 hidden에 담고 호출화면에
 * <%request.setCharacterEncoding("UTF-8");%>
 * <%String jData = request.getParameter("tblStr");%>
 * <script>
 * var jData = <%=jData%>;
 * </script>
 * 넣고 jData를 Json처럼 사용하면 된다.
 */
bankUtil.getTableDataToJsonString = function (tblId) {
    var _tblTbodyRows = $("#" + tblId + ">tbody>tr");
    var _tblHeadRows = $("#" + tblId + ">thead>tr>th");
    var _returnJsonString = "";
    if (_tblTbodyRows && _tblTbodyRows.length > 0) {
        _returnJsonString += '{"' + tblId + '":[';
        for (var i = 0; i < _tblTbodyRows.length; i++) {
            _returnJsonString += "{";
            var endidx = _tblTbodyRows[i].childNodes.length;
            for (var j = 0; j < _tblTbodyRows[i].childNodes.length; j++) {
                _returnJsonString += '"' + _tblHeadRows[j].innerText + '":';
                _returnJsonString += '"' + _tblTbodyRows[i].childNodes[j].innerText + '"';
                if (endidx - 1 > j) {
                    _returnJsonString += ",";
                }
            }
            _returnJsonString += "}";
            if (_tblTbodyRows.length - 1 > i) {
                _returnJsonString += ",";
            }
        }
        _returnJsonString += "]}";
    }
    return _returnJsonString;
};

//추가
//validation data type
var valString = "string";
var valInt = "int";
var valFloat = "float";
var valDate = "date";
var valAlphaNum = "alphaNum";
var valPhone = "phone";
var valEmail = "email";
var valPrice = "price";
var valQuantity = "quantity";
var valAcc = "acc";

// valid data check
function validData(checkStr, dataType, checkNull, checkLen, lessThanLen, moreThanLen, name, errMsg) {
    // null data check
    if (checkNull.length != 0 && (isNull(checkStr) || isAllSpace(checkStr))) {
        if (name == "비밀번호") {
            alert(name + "을(를) 입력하세요.");
            return false;
        } else {
            alert(name + "을(를) 입력하세요.");
            return false;
        }
    }

    // data type별 validation
    if (dataType == valInt) {
        if (!isNumeric(checkStr)) {
            alert(name + "을(를) 숫자로 입력하세요.");
            return false;
        }
    } else if (dataType == valFloat) {
        if (!isFloat(checkStr)) {
            alert(errMsg);
            return false;
        }
    } else if (dataType == valDate) {
        if (!isNumeric(checkStr)) {
            alert(name + "을(를) 숫자로 입력하세요.");
            return false;
        } else if (!isDate(checkStr)) {
            alert(errMsg);
            return false;
        }
    } else if (dataType == valAlphaNum) {
        if (!isAlphaNumeric(checkStr)) {
            alert(name + "을(를) 영문, 숫자, 영문/숫자 조합으로 입력하세요.");
            return false;
        }
    } else if (dataType == valPhone) {
        if (!isPhone(checkStr)) {
            alert(name + "을(를) 숫자와 '-' 조합으로 입력하세요.");
            return false;
        }
    } else if (dataType == valAcc) {
        alert("AA");
        if (!isPhone(checkStr)) {
            alert(name + "는 숫자와 '-'만 입력 가능합니다.");
            return false;
        }
    } else if (dataType == valEmail) {
        if (!isEmail(checkStr)) {
            alert(errMsg);
            return false;
        }
    } else if (dataType == valPrice) {
        if (!isPrice(checkStr)) {
            alert(errMsg);
            return false;
        }
    } else if (dataType == valQuantity) {
        if (!isQuantity(checkStr)) {
            alert(errMsg);
            return false;
        }
    }
    // data length check
    if (checkStr.length > 0) {
        if (checkLen.length != 0 && checkStr.length != eval(checkLen)) {
            alert(name + "을(를) " + checkLen + " 자리로 입력하세요.");
            return false;
        }
    }

    // less than length check
    if (checkStr.length > 0) {
        if (lessThanLen.length != 0 && checkStr.length > eval(lessThanLen)) {
            alert(name + "을(를) " + lessThanLen + " 자리 이내로 입력하세요.");
            return false;
        }
    }

    // more than length check
    if (checkStr.length > 0) {
        if (moreThanLen.length != 0 && checkStr.length < eval(moreThanLen)) {
            alert(name + "을(를) " + moreThanLen + " 자리 이상으로 입력하세요.");
            return false;
        }
    }

    return true;
}

function eng(a) {
    switch (a) {
        case "01":
            return "JAN";
        case "02":
            return "FEB";
        case "03":
            return "MAR";
        case "04":
            return "APR";
        case "05":
            return "MAY";
        case "06":
            return "JUN";
        case "07":
            return "JUL";
        case "08":
            return "AUG";
        case "09":
            return "SEP";
        case "10":
            return "OCT";
        case "11":
            return "NOV";
        case "12":
            return "DEC";
        default:
            return a;
    }
}

//Null check
function isNull(checkStr) {
    if (checkStr != null && checkStr.length != 0) {
        return false;
    }

    return true;
}

// Alphabet & number check
function isAlphaNumeric(checkStr) {
    // var checkOK =
    // "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`~!@#$^*()_\+-=||{}[]:;<>?/\\";
    var checkOK = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (i = 0; i < checkStr.length; i++) {
        ch = checkStr.charAt(i);
        for (j = 0; j < checkOK.length; j++) {
            if (ch == checkOK.charAt(j)) {
                break;
            }
        }
        if (j == checkOK.length) {
            return false;
            break;
        }
    }

    return true;
}

// Numeric number check
function isNumeric(checkStr) {
    var checkOK = "0123456789";

    for (i = 0; i < checkStr.length; i++) {
        ch = checkStr.charAt(i);
        for (j = 0; j < checkOK.length; j++) {
            if (ch == checkOK.charAt(j)) {
                break;
            }
        }
        if (j == checkOK.length) {
            return false;
            break;
        }
    }

    return true;
}

// Floating number check
function isFloat(checkStr) {
    var checkOK = "0123456789.";

    for (i = 0; i < checkStr.length; i++) {
        ch = checkStr.charAt(i);
        for (j = 0; j < checkOK.length; j++) {
            if (ch == checkOK.charAt(j)) {
                break;
            }
        }
        if (j == checkOK.length) {
            return false;
            break;
        }
    }

    if (i == 1 && checkStr.charAt(0) == ".") {
        return false;
    }

    return true;
}

// Alphabet check
function isAlpha(checkStr) {
    var checkOK = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (i = 0; i < checkStr.length; i++) {
        ch = checkStr.charAt(i);
        for (j = 0; j < checkOK.length; j++) {
            if (ch == checkOK.charAt(j)) {
                break;
            }
        }
        if (j == checkOK.length) {
            return false;
            break;
        }
    }

    return true;
}

// Phone number check
function isPhone(checkStr) {
    var checkOK = "0123456789-";

    for (i = 0; i < checkStr.length; i++) {
        ch = checkStr.charAt(i);
        for (j = 0; j < checkOK.length; j++) {
            if (ch == checkOK.charAt(j)) {
                break;
            }
        }
        if (j == checkOK.length) {
            return false;
            break;
        }
    }

    return true;
}

// Email number check
function isEmail(checkStr) {
    if (checkStr != null && checkStr.length != 0) {
        for (i = 0; i < checkStr.length; i++) {
            ch = checkStr.charAt(i);
            if (ch == "@") {
                return true;
            }
        }
        return false;
    } else {
        return true;
    }
}

// positive number check
function isPositive(chekStr) {
    if (parseFloat(chekStr) > 0) {
        return true;
    } else {
        return false;
    }
}

// All Space String Check
function isAllSpace(checkStr) {
    for (i = 0; i < checkStr.length; i++) {
        ch = checkStr.charAt(i);
        if (ch != " ") {
            return false;
        }
    }

    return true;
}

// Price check
function isPrice(checkStr) {
    var checkOK = "0123456789.,";
    var len = checkStr.length;
    var strs = checkStr.split(".");
    var n = 0;

    if (len == 1 && (checkStr.charAt(0) == "." || checkStr.charAt(0) == ",")) {
        return false;
    }

    if (checkStr.charAt(0) == "." || checkStr.charAt(0) == "," || checkStr.charAt(len - 1) == ",") {
        return false;
    }

    for (i = 0; i < checkStr.length; i++) {
        ch = checkStr.charAt(i);
        for (j = 0; j < checkOK.length; j++) {
            if (ch == checkOK.charAt(j)) {
                break;
            }
        }
        if (j == checkOK.length) {
            return false;
            break;
        }
    }

    if (strs.length > 2) {
        return false;
    }

    if (strs.length > 1 && strs[1].length > 2) {
        return false;
    }

    for (k = 0; k < strs[0].length; k++) {
        if (strs[0].charAt(k) != ",") {
            n++;
        }
    }

    return n <= 10 ? true : false;
}

// Quantity check
function isQuantity(checkStr) {
    var checkOK = "0123456789,";
    var len = checkStr.length;
    var n = 0;

    if (checkStr.charAt(0) == "," || checkStr.charAt(len - 1) == ",") {
        return false;
    }

    for (i = 0; i < checkStr.length; i++) {
        ch = checkStr.charAt(i);
        if (ch != ",") {
            n++;
        }

        for (j = 0; j < checkOK.length; j++) {
            if (ch == checkOK.charAt(j)) {
                break;
            }
        }
        if (j == checkOK.length) {
            return false;
            break;
        }
    }

    return n <= 10 ? true : false;
}

// Date setting for fromDate vs toDate comparison check
function isDate(value) {
    var year = value.substring(0, 4);
    var month = value.substring(4, 6);
    var day = value.substring(6, 8);
    return isYYYY(year) && isMM(month) && isDD(year, month, day);
}

// fromDate vs toDate comparison check
function Compare(Fd, Td) {
    if (isDate(Fd) == true && isDate(Td) == true) {
        if (Fd > Td) {
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }
}

// Year check
function isYYYY(value) {
    return value.length == 4 && isNumeric(value) && eval(value) > 1900;
}

// Month check
function isMM(value) {
    return value.length > 0 && isNumeric(value) && 0 < eval(value) && eval(value) < 13;
}

// Day check
function isDD(yyyy, mm, value) {
    var result = false;
    var monthDD = new month_array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    var index = eval(mm) - 1;
    if (value.length != 2) {
        return false;
    }
    if (!isNumeric(value)) {
        return false;
    }
    if ((yyyy % 4 == 0 && yyyy % 100 != 0) || yyyy % 400 == 0) {
        monthDD[1] = 29;
    }

    var dd = eval(value);

    if (0 < dd && dd <= monthDD[index]) {
        result = true;
    }

    return result;
}

// Month array for day check
function month_array(m0, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11) {
    this[0] = m0;
    this[1] = m1;
    this[2] = m2;
    this[3] = m3;
    this[4] = m4;
    this[5] = m5;
    this[6] = m6;
    this[7] = m7;
    this[8] = m8;
    this[9] = m9;
    this[10] = m10;
    this[11] = m11;
}
/**
 * 앞 뒤 공백을 제거해 준다.
 *
 * return 앞뒤 공백이 제거된 문자열
 */
function trim(str) {
    var count = str.length;
    var len = count;
    var st = 0;

    while (st < len && str.charAt(st) <= " ") {
        st++;
    }
    while (st < len && str.charAt(len - 1) <= " ") {
        len--;
    }
    return st > 0 || len < count ? str.substring(st, len) : str;
}

/* ===========================================================================================
maxLengthCheck(maxSize, lineSize, obj, remainObj)

사용법 : maxLengthCheck("256", "3",  this, remain_intro)
parameter : 
maxSize : 최대 사용 글자 길이(필수)
lineSize  : 최대 사용 enter 수 (옵션 : null 사용 시 체크 안 함)
obj   : 글자 제한을 해야 하는 object(필수)
remainObj : 남은 글자 수를 보여줘야 하는 object (옵션 : null 사용 시 사용 안 함)
===========================================================================================*/
function maxLengthCheck(maxSize, lineSize, obj, remainObj) {
    var temp;
    var f = obj.value.length;
    var msglen = parseInt(maxSize);
    var tmpstr = "";
    var enter = 0;
    var strlen;

    if (f == 0) {
        //남은 글자 byte 수 보여 주기
        if (remainObj != null) {
            //null 옵션이 아닐 때 만 보여준다.
            remainObj.value = msglen;
        }
    } else {
        for (k = 0; k < f; k++) {
            temp = obj.value.charAt(k);

            if (temp == "\n") {
                enter++;
            }
            //if(escape(temp).length > 4)
            //	msglen -= 2;
            //else
            msglen--;

            if (msglen < 0) {
                //alert("총 영문 "+(maxSize*2)+"자 한글 "+maxSize+"자 까지 쓰실 수 있습니다.");
                alert(maxSize + "자 이내로 작성해 주십시오.");
                obj.value = tmpstr;
                break;
            } else if ((lineSize != null) & (enter > parseInt(lineSize))) {
                // lineSize 옵션이 nulldl 아닐 때만 사용
                alert("라인수 " + lineSize + "라인을 넘을 수 없습니다.");
                enter = 0;
                strlen = tmpstr.length - 1;
                obj.value = tmpstr.substring(0, strlen);
                break;
            } else {
                if (remainObj != null) {
                    remainObj.value = msglen;
                }
                tmpstr += temp;
            }
        }
    }
}
//주민등록번호 체크 함수-----------------------------------------------------------
function fnChkJumin(obj1, obj2) {
    //var myJuminNum = obj1.value + obj2.value;
    var myJuminNum = obj1 + obj2;
    var calStr = "234567892345",
        numSum = 0,
        chkDigit = 0;
    for (i = 0; i < 12; i++) {
        numSum = numSum + parseInt(myJuminNum.charAt(i)) * parseInt(calStr.charAt(i));
    }
    chkDigit = 11 - (numSum % 11);
    if (chkDigit > 9) chkDigit -= 10;
    if (myJuminNum.substr(myJuminNum.length - 1, 1) != chkDigit) {
        alert("주민등록번호가 올바르지 않습니다.");
        //obj1.focus();
        return false;
    } else return true;
}

function checkString(srcString) {
    var tmpChar;

    for (nIndex = 0; nIndex < srcString.length; nIndex++) {
        tmpChar = srcString.charAt(nIndex);

        if (!((tmpChar < "0" || tmpChar > "9") && (tmpChar < "a" || tmpChar > "z") && (tmpChar < "A" || tmpChar > "Z"))) {
            return false;
        }
    }

    return true;
}

//아이디 비밀번호 첫글자는 영문 소문자
function smallLetter(checkStr) {
    var checkOK = "abcdefghijklmnopqrstuvwxyz";

    for (i = 0; i < checkStr.length; i++) {
        ch = checkStr.charAt(0);
        for (j = 0; j < checkOK.length; j++) {
            if (ch == checkOK.charAt(j)) {
                break;
            }
        }
        if (j == checkOK.length) {
            return false;
            break;
        }
    }

    return true;
}

function numberChk(checkStr) {
    checkOK = /[0-9]/; //숫자
    if (checkOK.test(checkStr)) {
        //숫자테스트
    } else {
        alert("영문과 숫자조합으로 입력하세요.");
        return false;
    }
    return true;
}

//아이디 비밀번호 동일 캐릭터 2개이상 금지
function two_over(element) {
    var checkOK = "abcdefghijklmnopqrstuvwxyz0123456789";
    for (j = 0; j < checkOK.length; j++) {
        montage = element.split(checkOK.charAt(j)).length - 1;
        if (montage > 2) {
            return false;
            break;
        }
        if (j == checkOK.length) {
            return false;
            break;
        }
    }
    return true;
}

//오름차순
function asc_check(param) {
    var val1;
    var val2;
    var val3;
    for (var i = 0; i < param.length; i++) {
        val1 = param.charAt(i).charCodeAt(param.charAt(i).length - 1);
        val2 = param.charAt(i + 1).charCodeAt(param.charAt(i + 1).length - 1);
        val3 = param.charAt(i + 2).charCodeAt(param.charAt(i + 2).length - 1);

        if (val1 + 1 == val2) {
            if (val2 + 1 == val3) {
                return false;
                break;
            }
        }

        if (i == param.length) {
            return false;
            break;
        }
    }
    return true;
}

//내림차순
function desc_check(param) {
    var val1;
    var val2;
    var val3;
    for (var i = 0; i < param.length; i++) {
        val1 = param.charAt(i).charCodeAt(param.charAt(i).length - 1);
        val2 = param.charAt(i + 1).charCodeAt(param.charAt(i + 1).length - 1);
        val3 = param.charAt(i + 2).charCodeAt(param.charAt(i + 2).length - 1);

        if (val1 - 1 == val2) {
            if (val2 - 1 == val3) {
                return false;
                break;
            }
        }

        if (i == param.length) {
            return false;
            break;
        }
    }
    return true;
}

/** 문자열 채우기
 *  pad  채워지길 원하는 문자가 길이만큼 이어지는 문자열
 *  str  대상 문자열
 *  padLeft 왼쪽에 채울지 여부(false 이면 오른쪽에 채운다)
 *
 *  Ex)
 *  pad("00000", "341", true) => 00341
 *  pad("00000", "341", false) => 34100
 */
function pad(pad, str, padLeft) {
    if (typeof str === "undefined") return pad;

    if (padLeft) {
        return (pad + "" + str).slice(-pad.length);
    } else {
        return (str + "" + pad).substring(0, pad.length);
    }
}

/* 두 날짜 사이의 일 수 구하기 */
const getDateDiff = (d1, d2) => {
    const date1 = new Date(d1);
    const date2 = new Date(d2);

    const diffDate = date1.getTime() - date2.getTime();

    return Math.abs(diffDate / (1000 * 60 * 60 * 24));
};

/** 앱 외부 브라우저 호출
 *  군인공제회 애플리케이션에서 애플리케이션 밖으로 URL 페이지를 오픈한다
 *
 *  url  호출할 URL
 */
function openURLToExternalBrowser(url) {
    var params = {
        pluginId: "WebPlugin",
        method: "otherWebView",
        params: { loadUrl: url },
        callBack: function (isOk, jsonObject) {},
    };
    KDSAppBridge.plugin.execute(params);
}

function copyClipboard(wid) {
    var url = "";
    var textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    url = $("#" + wid).html();
    textarea.value = url;
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    alert("쿠폰이 복사되었습니다.");
}
