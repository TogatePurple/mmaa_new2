/**
 * @파일명 : memberlogin.js
 * @파일정보 : 로그인 JS
 * @수정이력
 * @수정자    수정일       수정내용
 * @------- ------------ ----------------
 * @bluej  2023.5.16 최초생성(SHW)
 * @---------------------------------------
 * @author (주)퀴리오스 개발팀
 * @since 2009. 01.14
 * @version 3.0.8 Copyright (C) ITGOOD All right reserved.
 *
 */

/* 현재 페이지 form정보 v0720
폼이름 : formLogin /post

[인터페이스 업무 param정보-0719버전]

아이디			id
비밀번호			pass
-----------

*/

// 민정: ML4WebVKey 주석처리
// $(document).ready(function () {
//     // 초기화
//     ML4WebVKey.init();
// });

/////////////////////////////////////////// 기본 존재 스크립트 cms) 시작
// function showKeyboard(elementId) {
//     ML4WebVKey.showKeyboard(elementId);
// }

//<![CDATA[

//전자서명시 호출되는  CallBack 함수
var __result = null;
function TEST_complete(result) {
    __result = result;

    if (result.status == 1) {
        document.delfinoForm.PKCS7.value = result.signData;
        document.delfinoForm.VID_RANDOM.value = result.vidRandom;
        document.delfinoForm.submit();
    } else {
        if (result.status == 0) return; //사용자 취소
        if (result.status == -10301) return; //구동프로그램 설치를 위해 창을 닫을 경우
        //if (Delfino.isPasswordError(result.status)) alert("비밀번호 오류 횟수 초과됨"); //v1.1.6,0 over & DelfinoConfig.passwordError = true
        alert("error:" + result.message + "[" + result.status + "]");
    }
}

//인증서로그인: Delfio.login()
function TEST_certLogin() {
    document.delfinoForm._action.value = "TEST_certLogin";
    Delfino.login("login=certLogin", TEST_complete);
    //Delfino.login("login=certLogin", TEST_complete, {serialNumberDecCertFilter:"448221515", certStoreFilter:"REMOVABLE_DISK"});
    //Delfino.login("login=certLogin", {complete:TEST_complete_context, context:"sample certLogin context"});
}

/////////////////////////////////////////// 기본 존재 스크립트 cms) 끝
