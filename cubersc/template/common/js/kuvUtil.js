/* 공통validation 함수모음 */

$(document).ready(function () {
    /* form태그 내 엔터입력 무시*/
    $("form").on("keydown", function (e) {
        //예외 폼 name 추가
        const excludedFroms = ["totSearch", "listForm"];
        const formName = $(this).attr("name");
        if (e.keyCode == 13 && !excludedFroms.includes(formName)) {
            e.preventDefault();
        }
        let target = e.target;
        if ($(target).is("textarea")) {
            return;
        }
    });

    /** input 태그 중 data-nextinput 속성이 있는 요소의 maxlength값만큼 데이터를입력하면 
	다음 data-nextinput 요소로 넘어가집니다. (같은 속성값(숫자,문자)끼리만 이동합니다)
	(참고 jsp: memberjoin.jsp)마지막 data-nextinput은 focus만 
	넘어오고 다음 넘어갈 곳이 없어서 작동하지 않도록 하엿습니다.) _신혜원_0711*/
    $("[data-nextinput]")
        .keyup(function (e) {
            var dataValue = $(this).data("nextinput");
            var inputs = $('[data-nextinput="' + dataValue + '"]');
            if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End" || e.key === "Delete" || e.key === "Backspace" || e.key === "Tab" || e.key === "Shift") {
                return;
            } else if (this.value.length == this.maxLength) {
                for (var i = 0; i < inputs.length - 1; i++) {
                    if (this == inputs[i]) {
                        inputs[i + 1].focus();
                    }
                }
            }
        })
        .on("change", function (e) {
            if ($(this).is("select")) {
                var dataValue = $(this).data("nextinput");
                var inputs = $('[data-nextinput="' + dataValue + '"]');
                for (var i = 0; i < inputs.length - 1; i++) {
                    if (this == inputs[i]) {
                        inputs[i + 1].focus();
                    }
                }
            }
        });

    //숫자만 입력됨(주민등록번호 앞자리 입력시 사용) - JHS
    $(".num_only1")
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
                $(this).val(value);
            }
        });
});

//어떤 단어를 입력=> 마지막글자 한글 받침 유무확인함수_shw 2024 03 04 추가
//마지막글자가 한글이 아니거나, 낱자인 경우 null
//마지막글자가 받침을 가지면 true, 없으면 false
function checkBatchimEnding(word) {
    if (typeof word !== "string") return null;
    var lastLetter = word[word.length - 1];
    var uni = lastLetter.charCodeAt(0);
    if (uni < 44032 || uni > 55203) return null;
    return (uni - 44032) % 28 != 0;
}

// KHC
// 숫자만 입력되도록 하는 함수
// paramId 인자는 getElementById 값, digits 는 숫자의 자리수 용량
function numberMaker(paramId, digits) {
    var inputElement = document.getElementById(paramId);
    if (!inputElement) {
        // console.error("Invalid input element ID:", paramId);
        return;
    }
    inputElement.addEventListener("input", function (event) {
        var inputValue = inputElement.value;
        var filteredValue = filterNumericInput(inputValue);
        inputElement.value = filteredValue;
    });
    inputElement.addEventListener("compositionstart", function (event) {
        inputElement.dataset.composing = true;
    });
    inputElement.addEventListener("compositionend", function (event) {
        inputElement.dataset.composing = false;
        inputElement.dispatchEvent(new Event("input"));
    });
    inputElement.addEventListener("keydown", function (event) {
        if (event.target.dataset.composing) {
            return;
        }
        var key = event.key;
        var isSpecialKey = isNavigationKey(event) || isBackspaceOrDeleteKey(event);
        var isDigit = /^\d$/.test(key);
        var currentInputValue = inputElement.value;
        var maxDigits;
        var isMaxDigitsExceeded = currentInputValue.length >= maxDigits;
        if (!isDigit && !isSpecialKey) {
            event.preventDefault();
        } else if (isDigit && isMaxDigitsExceeded) {
            event.preventDefault();
        }
    });
    function filterNumericInput(inputValue) {
        var filteredValue = inputValue.replace(/[^\d]/g, "");
        maxDigits = digits;
        return filteredValue.slice(0, maxDigits);
    }
    function isNavigationKey(event) {
        var key = event.key;
        return key === "ArrowLeft" || key === "ArrowRight";
    }
    function isBackspaceOrDeleteKey(event) {
        var key = event.key;
        return key === "Backspace" || key === "Delete";
    }
}

// KHC // 1900년부터 2099년까지 허용
function dateRanger(inputDate) {
    var ranger = /^(19[0-9][0-9]|20\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/;
    var flag;
    //console.log('inputDate =' + inputDate);
    //console.log('ranger.test = ' + ranger.test(inputDate));
    if (ranger.test(inputDate) == true) {
        flag = true;
        return flag;
    } else {
        alert("날짜에 오류가 있습니다.");
        flag = false;
        return flag;
    }
}

//입력받은 데이터가 정규식에 맞는 형식인지 확인
//return true/false- SHW
function checkRegex(string, regex) {
    return regex.test(string);
}

//윤년인지 확인 윤년:return true, 평년:return false
function checkLeapYearYn(checkdt) {
    //console.log("checkdt");
    //console.log(checkdt);
    let yyyystr = "";
    if (checkdt) {
        yyyystr = checkdt.replace(/[^\d]/g, "");
    } else {
        return;
    }
    if (yyyystr.length == 4 || yyyystr.length == 6 || yyyystr.length == 8) {
        yyyystr = yyyystr.substring(0, 4);
        var yyyy = Number(yyyystr);
        if (yyyy % 400 == 0 || (yyyy % 4 == 0 && yyyy % 100 != 0)) {
            return true;
        } else {
            return false;
        }
    } else {
        return;
    }
}

//인풋태그에 data-inputregex 데이터 속성을 부여한 후 value(적용할 id로 씀)와 원하는 정규식(영문,숫자만 입력 허용정규식 예 ->> /[^a-zA-Z0-9]/g )을 입력하세요.
//불러서 쓸때는 document.ready안에 선언해야 합니다.
function inputregex(datavalue, regex) {
    $("input[data-inputregex=" + datavalue + "]")
        .on("input", function () {
            var value = $(this).val();
            var returnValue = "";
            for (var i = 0; i < value.length; i++) {
                if (regex.test(value.charAt(i))) {
                    returnValue += value.charAt(i);
                }
            }
            $(this).val(returnValue);
        })
        .on("compositionstart", function () {
            $(this).data("composing", true);
        })
        .on("compositionend", function () {
            $(this).data("composing", true);
            $(this).trigger("input");
        })
        .keydown(function (e) {
            if (e.target.dataset.composing) return;
            var keyvalue = e.key;

            if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End" || e.key === "Delete" || e.key === "Backspace" || e.key === "Tab" || (e.ctrlKey && e.key.toLowerCase() === "v") || (e.ctrlKey && e.key.toLowerCase() === "c")) {
            } else if (!regex.test(keyvalue)) {
                e.preventDefault();
            }
        });
}

//객체의 이름(key)과 같은 요소(id)에 값을 넣습니다.(innerText)_20230730_kuv_shw
//모바일은 id뒤에 _mo붙여주세요. (조회시에만 사용합니다.)
function allResultadd(printObj) {
    $.each(printObj, function (key, value) {
        $("#" + key + "").text(value);
        $("#" + key + "_mo").text(value);
    });
}

//객체의 이름(key)과 같은 요소(id)에 값을 넣습니다.(innerHtml)_20230801_kuv_shw
//모바일은 id뒤에 _mo붙여주세요. (조회시에만 사용합니다.)
function allResultaddHtml(printObj, parentsEle) {
    let paEle;
    if (typeof parentsEle == "object") {
        paEle = parentsEle;
        $.each(printObj, function (key, value) {
            $(paEle)
                .find("#" + key + "")
                .html(value);
            $(paEle)
                .find("#" + key + "_mo")
                .val(value);
        });
        return;
    } else {
        if (parentsEle == undefined) {
            paEle = "";
        } else if (typeof parentsEle == "string") {
            paEle = parentsEle + " ";
        }
        $.each(printObj, function (key, value) {
            $(paEle + "#" + key + "").html(value);
            $(paEle + "#" + key + "_mo").html(value);
        });
    }
}

//객체의 이름(key)과 같은 data-printobj = 'key' (데이터 속성의 값)인 곳을 찾아 html을 넣습니다.(innerHtml)_20230907_kuv_shw
//다중 요소에 한번에 같은 값을 넣기위해 사용합니다.(pc/mobile)
//영역별로 추가시 parentsEle(부모요소)추가 (string) ex) '#apple'
function allResultaddHtmlDataAttr(printObj, parentsEle) {
    let paEle;
    if (typeof parentsEle == "object") {
        paEle = parentsEle;
        $.each(printObj, function (key, value) {
            $(paEle)
                .find("[data-printobj=" + key + "]")
                .html(value);
            $(paEle)
                .find("[data-printobj=" + key + "]")
                .val(value);
        });
        return;
    } else {
        if (parentsEle == undefined) {
            paEle = "";
        } else if (typeof parentsEle == "string") {
            paEle = parentsEle + " ";
        }
        $.each(printObj, function (key, value) {
            $(paEle + "[data-printobj=" + key + "]").html(value);
            $(paEle + "[data-printobj=" + key + "]").val(value);
        });
    }
}

//시작년월~종료년월을 입력하면 리스트가 반환됨.
function makeyearList(start, end) {
    var list = [];
    for (var i = 0; i <= end - start; i++) {
        var obj = {};
        obj["value"] = end - i;
        obj["text"] = end - i + "년";
        list.push(obj);
    }
    return list;
}

//시작월~종료월을 입력하면 리스트가 반환됨. value 월은 두자리로 맞춤. (예 1 => 01)
function makeMonthList(start, end) {
    var list = [];
    for (var i = 0; i <= end - start; i++) {
        var obj = {};
        var valMonth = end - i + "";
        if (end - i < 10) valMonth = "0" + valMonth;
        obj["value"] = valMonth;
        obj["text"] = end - i + "월";
        list.push(obj);
    }
    return list;
}
//시작일~종료일을 입력하면 리스트가 반환됨. value 일은 두자리로 맞춤. (예 1 => 01)
function makeDayList(start, end) {
    var list = [];

    for (var i = 0; i <= end - start; i++) {
        var obj = {};
        var valDay = end - i + "";
        if (end - i < 10) valDay = "0" + valDay;
        obj["value"] = valDay;
        obj["text"] = end - i + "일";
        list.push(obj);
    }
    return list;
}
//현재기준 증좌년월 구하기, 매달 기준일 refeDate (예: 20 <-20일) :: return String
//addStr에 값을 추가하면 년과 월 뒤에 문자열로 들어간다. 없으면 그냥 숫자만 나옴.
function getScbYm(refeDate, addStr1, addStr2) {
    let add1 = "";
    let add2 = "";
    if (addStr1 != undefined) add1 = addStr1;
    if (addStr2 != undefined) add2 = addStr2;
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    if (day > refeDate) {
        month += 2;
    } else {
        month += 1;
    }
    if (month > 12) {
        month -= 12;
        year += 1;
    }
    if (month < 10) {
        month = "0" + month;
    }
    return year + add1 + month + add2;
}

//구좌수 추가 버튼 리스너 //증감출력될 인풋아이디, 전체 버튼감싸는 divID(여러군데사용할경우대비), 최대입력가능 구좌수, 월적립액 출력 할 inputID(선택)
function dataSetAccnt(inputElementId, btndivId, maxAccnt) {
    $("#" + btndivId + " [data-setaccnt]").on("click", function () {
        var option = $(this).data("setaccnt");
        var currScbAmtVal = $("#" + inputElementId).val();

        //숫자로 변환한 기존값(계산을 위함)
        var currAccnt = 0;
        //더할 값
        var addAccnt = 0;
        if (currScbAmtVal == "") {
            numScbAmtVal = 0;
        } else {
            currAccnt = Number(currScbAmtVal);
        }
        //data-setAccnt 값에 따라 addAccnt 설정합니다.
        //리셋할땐 최대가입금액을 초기화합니다.
        if (option == "reset") {
            $("#" + inputElementId).val(0);
            $("#" + inputElementId).trigger("input");
            return;
        } else {
            addAccnt = option;
        }

        var replaceVal = currAccnt + addAccnt;

        if (replaceVal > maxAccnt) {
            replaceVal = maxAccnt;
        }
        $("#" + inputElementId).val(replaceVal);
        $("#" + inputElementId).trigger("input");
    });
}

//구좌수 추가 버튼 리스너 //증감출력될 인풋아이디, 전체 버튼감싸는 divID(여러군데사용할경우대비), 최대입력가능 구좌수, 월적립액 출력 할 inputID(선택), 증감에 기본으로 더해야하는 아이디,1구좌수당 원
function dataSetAccnt(inputElementId, btndivId, maxAccnt, beforeInputElementId, accoUnitAmt) {
    $("#" + btndivId + " [data-setaccnt]").on("click", function () {
        var option = $(this).data("setaccnt");
        var currScbAmtVal = $("#" + inputElementId).val();
        var beforeCurrScbAmtVal = $("#" + beforeInputElementId).val();
        //숫자로 변환한 기존값(계산을 위함)
        var currAccnt = 0;
        //더할 값
        var addAccnt = 0;
        var BeforeAccnt = 0;
        if (currScbAmtVal == "") {
            numScbAmtVal = 0;
        } else {
            currAccnt = Number(currScbAmtVal);
        }
        if (beforeCurrScbAmtVal == "") {
            BeforeAccnt = 0;
        } else {
            BeforeAccnt = Number(beforeCurrScbAmtVal);
        }
        //data-setAccnt 값에 따라 addAccnt 설정합니다.
        //리셋할땐 최대가입금액을 초기화합니다.
        if (option == "reset") {
            $("#" + inputElementId).val(0);
            $("#" + inputElementId).trigger("input");
            $("#" + inputElementId + "Money").val(bankUtil.Format.number(BeforeAccnt * Number(accoUnitAmt)) + " 원");
            return;
        } else {
            addAccnt = option;
        }

        var replaceVal = currAccnt + addAccnt;
        if (replaceVal > maxAccnt - BeforeAccnt) {
            replaceVal = maxAccnt - BeforeAccnt;
        }
        $("#" + inputElementId).val(replaceVal);
        $("#" + inputElementId).trigger("input");
        //accntMoney
        $("#" + inputElementId + "Money").val(bankUtil.Format.number((replaceVal + BeforeAccnt) * Number(accoUnitAmt)) + " 원");
    });
}

//숫자만 리턴함. 콤마,대쉬,월,년,일,원,공백문자 지우는 함수. 맨앞 0 출력되니 주의, 이벤트리스너에 사용. return String_20230827_shw
function delAddString(numorStr) {
    if (numorStr == undefined) return null;
    if (numorStr == "") return "";
    let numString = numorStr + "";

    numString = numString.replaceAll("년", "").replaceAll("월", "").replaceAll("일", "").replaceAll("원", "");
    numString = numString.replaceAll("-", "").replaceAll(",", "").replaceAll(" ", "");

    return numString;
}

//숫자 입력할때마다 YYYY-MM-DD형식으로 바꿔줌. param String, return String
function formatDate(inputVal) {
    let resultVal = inputVal.replace(/[^0-9-]g/, "");
    if (resultVal.length > 4) {
        resultVal = resultVal.substr(0, 4) + "-" + resultVal.substr(4);
    }
    if (resultVal.length > 7) {
        resultVal = resultVal.substr(0, 7) + "-" + resultVal.substr(7);
    }
    return resultVal;
}

//data-numberformat인 요소의 text(숫자)를 금액표시 양식으로 변환하여 재출력한다.
//서버에서 가져와 el태그로 이미 출력완료된 데이터를 변환시킴.
function findDataAttrChangeFormat(parent) {
    let findList = [];
    if (parent != undefined && parent != "" && parent != null) {
        if (typeof parent == "string") {
            findList = $(parent + " [data-numberformat]");
        } else if (typeof parent == "object") {
            findList = $(parent).find("[data-numberformat]");
        } else {
            findList = $("[data-numberformat]");
        }
    } else {
        findList = $("[data-numberformat]");
    }

    for (var i = 0; i < findList.length; i++) {
        //변환할 값 가져오기
        let oneEle = findList[i];
        let value = Number(delAddString($(oneEle).text()));
        if (parent === "#trustSummary") {
            value = Number($(oneEle).text());
        }

        //data속성을 잘못 부여해서 문자데이터를 가져올 경우 다음 반복으로 건너뛰기.
        if (Number.isNaN(value)) {
            continue;
        }
        //값 변환하기
        let resVal = bankUtil.Format.number(value);

        //값 적용하기
        $(oneEle).text(resVal);
    }
}

//data-dateformat인 요소의 text(숫자)를 달력 양식으로 변환하여 재출력한다.
//서버에서 가져와 el태그로 이미 출력완료된 데이터를 변환시킴.
function findDataAttrChangeDateFormat(parent) {
    let findList = [];
    if (parent != undefined && parent != "") {
        if (typeof parent == "string") {
            findList = $(parent + " [data-dateformat]");
        } else if (typeof parent == "object") {
            findList = $(parent).find("[data-dateformat]");
        }
    } else {
        findList = $("[data-dateformat]");
    }

    for (var i = 0; i < findList.length; i++) {
        //변환할 값 가져오기
        let oneEle = findList[i];
        let value = delAddString($(oneEle).text());
        let resVal = "";
        if (value.length == 6) {
            resVal = bankUtil.Date.get("yyyy-MM", value);
        } else if (value.length == 8) {
            //값 변환하기
            resVal = bankUtil.Date.get("yyyy-MM-DD", value);
        }
        //값 적용하기
        $(oneEle).text(resVal);
    }
}

//data-phoneformat인 요소의 text(숫자)를 핸드폰 양식으로 변환하여 재출력한다.
//서버에서 가져와 el태그로 이미 출력완료된 데이터를 변환시킴.
function findDataAttrChangePhoneFormat(parent) {
    let findList = [];
    if (parent != undefined && parent != "") {
        if (typeof parent == "string") {
            findList = $(parent + " [data-phoneformat]");
        } else if (typeof parent == "object") {
            findList = $(parent).find("[data-phoneformat]");
        }
    } else {
        findList = $("[data-phoneformat]");
    }

    for (var i = 0; i < findList.length; i++) {
        //변환할 값 가져오기
        let oneEle = findList[i];
        let value = delAddString($(oneEle).text());
        let resVal = "";
        resVal = bankUtil.Format.mobile(value);

        //값 적용하기
        $(oneEle).text(resVal);
    }
}

//아이디 생성조건 검사 + bankUtil.js
function ableCheckId(memId) {
    const idRegex = /^[a-z0-9]+$/;
    const idRegex2 = /^[a-z]+$/;
    const egnoreList = ["admin", "master", "mmaa", "imnd", "help"];
    if (memId.length > 12) {
        alert("12자 이내로 입력하세요.");
        return false;
    } else if (memId.length < 6) {
        alert("6자 이상 입력하세요.");
        return false;
    } else if (!idRegex2.test(memId.charAt(0))) {
        alert("아이디 첫글자는 영문(소문자)로 입력하세요.");
        return false;
    } else if (!checkRegex(memId, idRegex)) {
        alert("영문(소문자)과 숫자를 모두 포함하여야 합니다.");
        return false;
    } /*else if (!two_over(memId)) {
		alert("동일한 문자를 2개이상 사용할수 없습니다.");
		return false;
	}*/ else if (!asc_check(memId)) {
        alert("오름차순 2개까지만 사용가능합니다.");
        return false;
    } else if (!desc_check(memId)) {
        alert("내림차순 2개까지만 사용가능합니다.");
        return false;
    }
    for (var i = 0; i < egnoreList.length; i++) {
        let one = egnoreList[i];
        if (memId.indexOf(one) != -1) {
            alert("아이디에 사용할 수 없는 단어가 포함되어 있습니다. : '" + one + "'");
            return false;
        }
    }
    return true;
}

//비밀번호 생성조건 검사 + bankUtil.js
function ableCheckPswd(memPswd, memId) {
    const psRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/;

    if (!checkRegex(memPswd, psRegex)) {
        alert("영문과 숫자,특수기호를 모두포함하여야 합니다.");
        return false;
    } else if (!validData(memPswd, "alphaNum2", "checkNull", "", "12", "8", "비밀번호", "비밀번호는 8~12 길이로 입력하세요.")) {
        return false;
    } else if (!two_over(memPswd)) {
        alert("동일한 문자를 2개이상 사용할수 없습니다.");
        return false;
    } else if (!asc_check(memPswd)) {
        alert("오름차순 2개까지만 사용가능합니다.");
        return false;
    } else if (!desc_check(memPswd)) {
        alert("내림차순 2개까지만 사용가능합니다.");
        return false;
    } else if (memPswd == memId) {
        alert("아이디와 같을 수 없습니다.");
        return false;
    } else if (memPswd.indexOf(memId) > -1) {
        alert("비밀번호에 아이디를 포함할 수 없습니다.");
        return false;
    }
    return true;
}

//연락처 양식 검사 -전화번호, 휴대전화번호 양식 아니면 false 됨. (하이픈 째로 넣어야 함) 20231102_shw
function ableCheckTelNo(phone) {
    if (!phone) return false;
    const regex1 = /^(02|0[1-9]{2})-(\d{3,4})-(\d{4})$/;
    const regex2 = /^(010|016|017|018|019)-(\d{3,4})-(\d{4})$/;
    return regex1.test(phone) || regex2.test(phone);
}

//연락처 양식 검사. 하이픈 상관없이 검사하도록 함.20250825_shw
function ableCheckTelNo2(phone) {
    if (!phone) return false;
    // 휴대폰: 010, 016, 017, 018, 019 | 유선전화: 02,031,032,033,041,042,043,044,051,052,053,054,055,061,062,063,064
    const regex = /^(?:01[016789]|0(?:2|3[1-3]|4[1-4]|5[1-5]|6[1-4]))-?\d{3,4}-?\d{4}$/;
    return regex.test(phone);
}

//테이블의 td컨텐츠 너비에 따라 자동으로 열 너비를 정하여 설정.
function adjustColumWidths() {
    let table = $("[data-dynamictable]");
    console.log("table");
    console.log(table);

    let rows = $(table).find("tr");
    console.log("tr");
    console.log(rows);
    rows.each(function () {
        let cells = $(this).find("th");
        let totalWidth = table.width();
        console.log("totalWidth");
        console.log(totalWidth);
        cells.each(function () {
            let contentWidth = this.scrollWidth;
            let ratio = (contentWidth / totalWidth) * 100;
            $(this).css("width", ratio + "%");
        });
    });
}

//이메일 형식 올바르면 true
function emailcheck(value) {
    var strExp = /^[_A-Za-z0-9-]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/;
    if (!strExp.test(value)) {
        return false;
    }
    return true;
}

//입력한 문자열이 json변환 가능한 문자열인지 확인
function isValidJSON(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}

/* 가입경로,전문강사 selecbox박스 채우기 20240612_ydw 
가입경로	SELECTBOXID	scbRsnCdId='scbRsnCd' 필수
전문강사	SELECTBOXID exptInstrId = 'exptInstr' 필수  
전문강사표출여부	이벤트 targetClass='.select_control_target' 선택
ex    scbRsnCdMakeSelectBox('scbRsnCd', 'exptInstr', '.select_control_target');
*/
function scbRsnCdMakeSelectBox(scbRsnCdId, exptInstrId, targetClass) {
    if (scbRsnCdId == null || scbRsnCdId == "") {
        scbRsnCdId = "scbRsnCd";
    }

    if (exptInstrId == null || exptInstrId == "") {
        exptInstrId = "exptInstr";
    }

    $.ajax({
        url: "/api/scbRsnCdCodeList.do",
        type: "post",
        dataType: "json",
        async: true,
        success: function (response) {
            //요청 api 성공시(실패경우있음)
            console.log("------response-------");
            console.log(response);
            if (response["status"] == 200) {
                let codeList = response.M0309;
                let newTfList = $.map(codeList, function (codeInfo) {
                    return {
                        value: codeInfo.coCva,
                        text: codeInfo.coCvaNm,
                    };
                });

                $("#" + scbRsnCdId + " option")
                    .not("[value='0']")
                    .remove();
                bankUtil.makeSelect(scbRsnCdId, newTfList, "value", "text", true);

                let eduInstrList = response.data.eduInstrList;
                let newTfList2 = $.map(eduInstrList, function (eduInstrInfo) {
                    return {
                        value: eduInstrInfo.instrId,
                        text: eduInstrInfo.instrFlnm,
                    };
                });

                $("#" + exptInstrId + " option")
                    .not("[value='']")
                    .remove();
                bankUtil.makeSelect(exptInstrId, newTfList2, "value", "text", true);

                //가입경로 교육지원단 이벤트
                if (targetClass != null && targetClass != "") {
                    $("#" + scbRsnCdId).on("change", function () {
                        if ($("#" + scbRsnCdId).val() == "05") {
                            $(targetClass).removeClass("hide");
                        } else {
                            $(targetClass).addClass("hide");
                            $("#" + exptInstrId).val("");
                        }
                    });
                }
            } else {
                alert("message:" + response["message"]);
            }
        },
        error: function (request, status, error) {
            //api 중단될때

            alert("api오류\ncode:" + request.status + "\n" + "message:" + request.responseText + "\n");
        },
    });
}

//입력값(숫자와 .)을 #.# 형태로 변환되는 이벤트를 input[type=text] 태그에 적용시킴. ele 예 : "#id", ".classname"
function input0_0(ele) {
    //태그타입이 일치하지 않으면 종료
    if (!$(ele).is("input[type=text]")) {
        return;
    }
    //소수점을 포함한 숫자로 이뤄진 값 입력시 #.# 형식의 소수형 문자열로 바꿔주는 내부 함수.
    //3자리 수 이상일 경우 제일 뒤의 2자리를 잘라 만든다.
    function inputEvtShbIntrt(v) {
        if (!v) return;
        let value = "";
        if (v[0] == ".") v = "0" + v;
        // 숫자 이외는 제거
        value = v.replace(/[^0-9]/g, "");
        if (value.length == 1) {
            value += ".0";
        } else if (value.length == 2) {
            value = value.slice(-2, -1) + "." + value.slice(-1);
        } else if (value.length > 2) {
            if (value[1] == "0") {
                if (value[2] == "0") {
                    value = "0.0";
                } else {
                    value = value.slice(-3, -2) + "." + value.slice(-1);
                }
            } else {
                value = value.slice(-2, -1) + "." + value.slice(-1);
            }
        }
        return value;
    }
    //입력커서위치이동 t는 이벤트타겟 n은 위치
    function setCursorPos(n, t) {
        setTimeout(function () {
            t.setSelectionRange(n, n);
        }, 10);
    }
    //입력란(ele)에 #.# 형태로 입력되도록 하는 이벤트 리스너
    $(ele)
        .on("input", function (e) {
            //복붙을 해도 #.# 형태로 입력되도록 함
            let value = $(this).val();
            value = inputEvtShbIntrt(value);
            $(this).val(value);
        })
        .on("compositionstart", function () {
            $(this).data("composing", true);
        })
        .on("compositionend", function () {
            $(this).data("composing", true);
            $(this).trigger("input");
        })
        .keydown(function (e) {
            const cursorPos = e.target.selectionStart;
            if (e.target.dataset.composing) return;
            var keyvalue = e.key;
            let value = e.target.value;
            if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End" || e.key === "Delete" || e.key === "Backspace" || e.key === "Tab" || (e.ctrlKey && e.key.toLowerCase() === "v") || (e.ctrlKey && e.key.toLowerCase() === "c")) {
                value = value.replace(/[^0-9]/g, "");
                if (value.length > 1) {
                    if (e.key === "Backspace") {
                        //1의자리 위치에서 입력 시
                        if (0 <= cursorPos && cursorPos <= 1) {
                            //setCursorPos(0,e.target);
                            //소수점 첫째자리위치에서 입력 시
                        } else if (2 <= cursorPos && cursorPos <= 3) {
                            setCursorPos(1, e.target);
                        }
                    } else if (e.key === "Delete") {
                        //1의자리 위치에서 입력 시
                        if (0 <= cursorPos && cursorPos <= 1) {
                            setCursorPos(3, e.target);
                            value = "0" + value[1];
                            //소수점 첫째자리위치에서 입력 시
                        } else if (2 <= cursorPos && cursorPos <= 3) {
                            setCursorPos(1, e.target);
                            value = value[0] + "0";
                        }
                    }
                    value = inputEvtShbIntrt(value);
                    $(this).val(value);
                }
            } else if (!/^[0-9-]/.test(keyvalue)) {
                e.preventDefault();
            } else {
                //커서입력위치에 해당하는 숫자만 바꿔줌
                value = value.replace(/[^0-9]/g, "");
                if (value.length > 1) {
                    e.preventDefault();
                    //1의자리 위치에서 입력 시
                    if (0 <= cursorPos && cursorPos <= 1) {
                        setCursorPos(3, e.target);
                        value = keyvalue + "" + value[1];
                        //소수점 첫째자리위치에서 입력 시
                    } else if (2 <= cursorPos && cursorPos <= 3) {
                        setCursorPos(1, e.target);
                        value = value[0] + "" + keyvalue;
                    }
                }
                value = inputEvtShbIntrt(value);
                $(this).val(value);
            }
        });
}

//입력값(숫자와 .)을 #.# 형태로 변환되는 이벤트를 input[type=text] 태그에 적용시킴. ele 예 : "#id", ".classname"
function input0_1(ele) {
    //태그타입이 일치하지 않으면 종료
    if (!$(ele).is("input[type=text]")) {
        return;
    }
    //소수점을 포함한 숫자로 이뤄진 값 입력시 #.# 형식의 소수형 문자열로 바꿔주는 내부 함수.
    //3자리 수 이상일 경우 제일 뒤의 2자리를 잘라 만든다.
    function inputEvtShbIntrt(v) {
        if (!v) return;
        v = v.replace(/[^0-9.]/g, "");
        let firstDotIdx = v.indexOf(".");
        if (firstDotIdx !== -1) {
            v = v.substring(0, firstDotIdx + 1) + v.substring(firstDotIdx + 1).replace(/\./g, "");
        } else {
            if (v.length == 2) {
                v = v[0] + "." + v[1];
            }
        }
        return v;
    }
    //입력커서위치이동 t는 이벤트타겟 n은 위치
    function setCursorPos(n, t) {
        setTimeout(function () {
            t.setSelectionRange(n, n);
        }, 10);
    }
    //입력란(ele)에 #.# 형태로 입력되도록 하는 이벤트 리스너
    $(ele)
        .on("input", function (e) {
            //복붙을 해도 #.# 형태로 입력되도록 함
            let value = $(this).val();
            value = inputEvtShbIntrt(value);
            $(this).val(value);
        })
        .on("compositionstart", function () {
            $(this).data("composing", true);
        })
        .on("compositionend", function () {
            $(this).data("composing", true);
            $(this).trigger("input");
        })
        .keydown(function (e) {
            const cursorPos = e.target.selectionStart;
            if (e.target.dataset.composing) return;
            var keyvalue = e.key;
            let value = e.target.value;
            if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End" || e.key === "Delete" || e.key === "Backspace" || e.key === "Tab" || (e.ctrlKey && e.key.toLowerCase() === "v") || (e.ctrlKey && e.key.toLowerCase() === "c")) {
            } else if (!/^[0-9.]/.test(keyvalue)) {
                e.preventDefault();
            }
        })
        .on("blur", function (e) {
            let v = $(this).val();
            if (!v) {
                return;
            } else {
                let value = "";
                if (v[0] === ".") v = "0" + v;
                // 숫자 이외는 제거
                value = v.replace(/[^0-9]/g, "");
                if (value.length == 1) {
                    value += ".0";
                } else if (value.length == 2) {
                    value = value.slice(-2, -1) + "." + value.slice(-1);
                } else if (value.length > 2) {
                    if (value[1] == "0") {
                        if (value[2] == "0") {
                            value = "0.0";
                        } else {
                            value = value.slice(-3, -2) + "." + value.slice(-1);
                        }
                    } else {
                        value = value.slice(-2, -1) + "." + value.slice(-1);
                    }
                }
                $(this).val(value);
            }
        });
}
