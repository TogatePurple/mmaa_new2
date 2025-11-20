// Java Map 처럼 사용하기 위한 객체
var KDSMap = function () {};

var appChk = "N";

KDSMap.prototype = {
    map: new Object(),

    // 데이터 입력
    put: function (key, value) {
        this.map[key] = value;
    },

    // 데이터 가져오기
    get: function (key) {
        return this.map[key];
    },

    // 데이터 내용에 값이 있는지 찾기
    containsKey: function (key) {
        return key in this.map;
    },

    // value 가 있는지 확인
    containsValue: function (value) {
        for (var prop in this.map) {
            if (this.map[prop] == value) return true;
        }
        return false;
    },

    // 비여 있는지 확인
    isEmpty: function (key) {
        return this.size() == 0;
    },

    // 데이터 지우기
    clear: function () {
        for (var prop in this.map) {
            delete this.map[prop];
        }
    },

    // 해당 키의 데이터 삭제
    remove: function (key) {
        delete this.map[key];
    },

    // 입력된 데이터 키목록 가져오기
    keys: function () {
        var keys = new Array();
        for (var prop in this.map) {
            keys.push(prop);
        }
        return keys;
    },

    // value 전체 가져오기
    values: function () {
        var values = new Array();
        for (var prop in this.map) {
            values.push(this.map[prop]);
        }
        return values;
    },

    // 데이터 사이즈 가져오기
    size: function () {
        var count = 0;
        for (var prop in this.map) {
            count++;
        }
        return count;
    },
};

var KDSAppBridge = function () {};

KDSAppBridge.Const = {
    // 개발모드 여부
    isDevelop: true,

    // Browser OS TYPE
    BROWSER_TYPE_IOS: 0,
    BROWSER_TYPE_AND: 1,
    BROWSER_TYPE_OTHER: 2,

    // 네트워크 관련 키
    KEY_ERROR_CODE: "errorCode",
    KEY_ERROR_MSG: "errorMessage",
    KEY_ERROR_DATA: "receiveData",

    // IOS 연동 스키마
    IOS_SCHEME_PRE: "kdshybrid://",
};

KDSAppBridge.util = {
    JSONtoString: function (object) {
        // 프레임워크가 바뀌면 수정되어야 할 부분
        return JSON.stringify(object);
    },

    stringToJSON: function (jsonStr) {
        if (jsonStr == null || jsonStr == "") {
            return [];
        }

        //        while (jsonStr.indexOf('+') > -1) {
        //            jsonStr = jsonStr.replace('+', ' ');
        //        }

        var decJsonStr = decodeURIComponent(jsonStr);

        // 프레임워크가 바뀌면 수정되어야 할 부분g
        var jsonData = jQuery.parseJSON(decJsonStr);
        return jsonData;
    },

    getDeviceType: function () {
        /*
         * 		// navigator.userAgent.match(/Android/i)
         // || navigator.userAgent.match(/webOS/i)
         // || navigator.userAgent.match(/iPhone/i)
         // || navigator.userAgent.match(/iPad/i)
         // || navigator.userAgent.match(/iPod/i)
         // || navigator.userAgent.match(/BlackBerry/i)
         // || navigator.userAgent.match(/Windows Phone/i)
         */
        if (navigator.userAgent.match(/Android/i)) {
            return KDSAppBridge.Const.BROWSER_TYPE_AND;
        } else if (
            navigator.userAgent.match(/iPhone/i) ||
            navigator.userAgent.match(/iPad/i) ||
            (navigator.userAgent.match(/Mac OS X/i) && navigator.maxTouchPoints > 0) || // iOS 13, iPad User-Agent 변경 이슈로 조건 추가
            navigator.userAgent.match(/iPod/i)
        ) {
            return KDSAppBridge.Const.BROWSER_TYPE_IOS;
        } else {
            return KDSAppBridge.Const.BROWSER_TYPE_OTHER;
        }
    },

    getUnickKey: function () {
        // 년월일밀리초_랜덤값
        var toDay = new Date();
        var key = KDSAppBridge.util.addLeft(toDay.getFullYear(), 4, "0") + KDSAppBridge.util.addLeft(toDay.getMonth() + 1, 2, "0") + KDSAppBridge.util.addLeft(toDay.getDay(), 2, "0") + KDSAppBridge.util.addLeft(toDay.getMilliseconds(), 3, "0");
        // 랜덤정보 생성
        key = key + "_" + String(Math.round(100000 * Math.random()));

        return key;
    },

    addLeft: function (data, size, prefix) {
        if (data == null) {
            data = "";
        }
        data = String(data);
        while (data.length < size) {
            data = prefix + data;
        }
        return data;
    },
};

KDSAppBridge.plugin = {
    register: new KDSMap(),
    execute: function (params) {
        try {
            var pluginId = params.pluginId;
            var method = params.method;
            if (pluginId == null) {
                alert("요청 pluginId 값이 존재하지 않습니다.");
                return;
            }

            this.register.put(this.getExecuteId(pluginId, method), params);

            var strParams = KDSAppBridge.util.JSONtoString(params.params);
            var isLoadingBar = params.isLoadingBar;

            if (strParams == null) {
                strParams = "";
            }

            if (isLoadingBar == null) {
                isLoadingBar = true;
            }

            if (KDSAppBridge.util.getDeviceType() == KDSAppBridge.Const.BROWSER_TYPE_AND) {
                window.sinit.execute(pluginId, method, strParams);
                appChk = "Y";
            } else if (KDSAppBridge.util.getDeviceType() == KDSAppBridge.Const.BROWSER_TYPE_IOS) {
                try {
                    var messageToPost = { function: "plugin", pluginId: pluginId, method: method, params: strParams };
                    window.webkit.messageHandlers.sinit.postMessage(messageToPost);
                    appChk = "Y";
                } catch (err) {
                    appChk = "N";
                    //alert(err);
                }
                // window.sinit.executeForPluginIdMethodParams(pluginId, method, strParams);
            } else {
                appChk = "N";
                //alert('PC 브라우저에서는 지원되지 않는 기능입니다.');
            }
        } catch (e) {
            appChk = "N";
            //alert(1);
            //console.log(e);
        }
    },
    callBack: function (isOK, pluginId, method, strData) {
        //		alert('callBack('+ isOK + ' ' + pluginId + ' ' + method + ' ' + strData +')');	// for test
        var jsonData = KDSAppBridge.util.stringToJSON(strData);
        var params = this.register.get(this.getExecuteId(pluginId, method));

        if (params == null) return;

        if (params.callBack != null) {
            setTimeout(function () {
                params.callBack(isOK, jsonData);
            }, 0);
        }

        this.register.remove(pluginId);
    },
    getExecuteId: function (pluginId, method) {
        return pluginId + "-" + method;
    },
    executeQueueForiOS: [],
    executeForiOS: function (url) {
        if (this.executeQueueForiOS.length < 1) {
            this.executeSubForiOS();
        }
        this.executeQueueForiOS.push(url);
    },
    executeSubForiOS: function () {
        var self = this;
        setTimeout(function () {
            var url = self.executeQueueForiOS.shift();
            window.location.href = url;
            if (self.executeQueueForiOS.length > 0) {
                self.executeSubForiOS();
            }
        }, 0);
    },
};

KDSAppBridge.secureKeyPad = {
    // 표출방식
    KEY_SHOW_FULL: "fullScreen",
    KEY_SHOW_HALF: "halfScreen",
    // 키패드 종료
    KEY_PAD_TYPE_CHAR: "char",
    KEY_PAD_TYPE_NUMBER: "number",

    // 입력 키패드 키코드
    KEY_CODE_NEXT: "NEXT", // 다음
    KEY_CODE_PRE: "PRE", // 이전
    KEY_CODE_DONE: "DONE", // 완료
    KEY_CODE_INPUT: "INPUT", // 입력

    callBack: null,

    /**
     * 전체화면 보안키패드 표출
     * reqCode : 요청구분코드
     * callBack : 입력 후 리턴 받을 컬백 메소드
     * payType : 숫자, 문자
     * keyPadTitle : 보안키패드 타이틀
     */
    showFullScreen: function (padType, keypadTitle, callBack, maxLength) {
        var showType = this.KEY_SHOW_FULL;

        this.callBack = callBack;

        var params = {
            pluginId: "secureKeyPad",
            method: "onExecute",
            params: {
                showType: showType,
                padType: padType,
                keyPadTitle: keypadTitle,
                maxLength: maxLength,
            },
            callBack: function (isOK, json) {
                // 아무짓도 하지않는다.

                if (isOK == false) {
                    alert("보안키패드 요청중에 오류가 발생하였습니다. 잠시 후에 다시 시도해 주십시오.");
                } else {
                    if (KDSAppBridge.util.getDeviceType() == KDSAppBridge.Const.BROWSER_TYPE_IOS) {
                        if (callBack != null) {
                            callBack(json);
                        }
                    }
                }
            },
        };

        KDSAppBridge.plugin.execute(params);
    },

    /**
     * 전체화면 보안키패드 표출
     * reqCode : 요청구분코드
     * callBack : 입력 후 리턴 받을 컬백 메소드
     * payType : 숫자, 문자
     */
    showHalfScreen: function (padType, callBack, isPre, isNext, maxLength) {
        var showType = this.KEY_SHOW_HALF;

        this.callBack = callBack;

        var params = {
            pluginId: "secureKeyPad",
            method: "onExecute",
            params: {
                showType: showType,
                padType: padType,
                isNext: isNext,
                isPre: isPre,
                maxLength: maxLength,
            },
            callBack: function (isOK, json) {
                if (isOK == false) {
                    alert("보안키패드 요청중에 오류가 발생하였습니다. 잠시 후에 다시 시도해 주십시오.");
                } else {
                    if (KDSAppBridge.util.getDeviceType() == KDSAppBridge.Const.BROWSER_TYPE_IOS) {
                        if (callBack != null) {
                            callBack(json);
                        }
                    } else {
                        if (this.callBack != null) {
                            callBack(isOK, json);
                        }
                    }
                }
            },
        };

        KDSAppBridge.plugin.execute(params);
    },

    /**
     * 보안키패드 중 반키패드를 닫는다.
     */
    closeHalfScreen: function (_callBack) {
        var params = {
            pluginId: "secureKeyPad",
            method: "closeKeyPad",
            params: {},
            callBack: function (isOK, json) {
                if (_callBack != null) {
                    _callBack();
                }
            },
        };

        KDSAppBridge.plugin.execute(params);
    },

    inputData: function (json) {
        console.log(json);
        if (this.callBack != null) {
            var jsonObj = KDSAppBridge.util.stringToJSON(json);
            this.callBack(jsonObj);
        }
    },
};

// WebView History 관련 플러그인 (back, forward, clear)
KDSAppBridge.history = {
    KEY_BACK: "back",
    KEY_FORWARD: "forward",
    KEY_CLEAR: "clear",
    KEY_HOME: "home",

    clear: function () {
        this.execute(this.KEY_CLEAR);
    },

    goBack: function () {
        this.execute(this.KEY_BACK);
    },

    goForward: function () {
        this.execute(this.KEY_FORWARD);
    },

    goHome: function () {
        this.execute(this.KEY_HOME);
    },

    execute: function (command) {
        var params = {
            pluginId: "history",
            method: "onExecute",
            params: { command: command },
        };
        KDSAppBridge.plugin.execute(params);
    },
};

//function smsClick(){
////아래 params에서 direct 값을 true로 하면 sms앱으로 연결 되는것이 아닌 바로 전송이 됩니다.( AndroidManifest.xml 에 주석처리 되어 있는 SEND_SMS 권한 해지 필요)
//
//    var params = {
//            pluginId : 'SmsPlugin',
//            method : 'send',
//            params : {'phoneNum': '01048725710','msg': '테스트 SMS 메세지 입니다.', 'direct':false},
//            callBack : function (isOk, jsonObject) {
//            }
//        };
//    KDSAppBridge.plugin.execute(params);
//}

function callClick() {
    //아래 params에서 direct 값을 true로 할 경우, 바로 전화가 걸립니다.
    //                        false일 경우, 전화 앱으로 연결 합니다.
    var params = {
        pluginId: "CallPlugin",
        method: "call",
        params: { phoneNum: "01011110000", direct: false },
        callBack: function (isOk, jsonObject) {},
    };
    KDSAppBridge.plugin.execute(params);
}

function fcmClick() {
    //alert("isMobile : "+isMobile());

    var params = {
        pluginId: "FcmPlugin",
        method: "getToken",
        params: {},
        callBack: function (isOk, jsonObject) {
            if (isOk) {
                $("#fcmToken").val("Y");
            } else {
                $("#fcmToken").val("N");
            }
        },
    };
    try {
        KDSAppBridge.plugin.execute(params);
    } catch (e) {
        console.log(">>>>> " + e);
    }
}

function webClick() {
    var loadUrl = "https://www.daum.net"; //이 변수에 이동할 URL을 채워주시면 됩니다.

    var postParams = "{param:'12345',param2:'blablabla',param3:'whatever'}";

    var params = {
        pluginId: "WebPlugin",
        method: "otherWebView",
        params: { loadUrl: loadUrl, postParams: postParams },
        callBack: function (isOk, jsonObject) {},
    };
    KDSAppBridge.plugin.execute(params);
}

function sosoCondo() {
    var isMobile = window.matchMedia("only screen and (max-width: 767px)").matches;
    fcmClick();
    //setTimeout(function(){console.log("3000")},3000);
    if (appChk == "Y") {
        openLinkSono("app");
    } else {
        openLinkSono("");
    }
}

function cameraClick() {
    var params = {
        pluginId: "CameraPlugin",
        method: "capture",
        params: {},
        callBack: function (isOk, jsonObject) {
            var imagePath = jsonObject.imagePath;

            if (isOk) {
                document.getElementById("testImg").src = "data:image/png;base64, " + imagePath; //imagePath;
            } else {
                alert("fail");
            }
        },
    };
    KDSAppBridge.plugin.execute(params);
}

function isMobile() {
    var UserAgent = navigator.userAgent;

    // iOS 13, iPad User-Agent 변경 이슈로 조건 추가
    if (UserAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || UserAgent.match(/LG|SAMSUNG|Samsung/) != null || (navigator.userAgent.match(/Mac OS X/i) && navigator.maxTouchPoints > 0)) {
        return true;
    } else {
        return false;
    }
}

function keypadClick(fieldName, viewMode, keypadType) {
    var params = {
        pluginId: "KeypadPlugin",
        method: "showKeypad",
        params: { inputFieldName: fieldName, viewMode: viewMode, keypadType: keypadType },
        callBack: function (isOk, jsonObject) {
            if (isOk) {
                if (jsonObject.maskingData == null || jsonObject.maskingData.length == 0) {
                    document.getElementById(fieldName).value = "";
                } else {
                    document.getElementById(fieldName).value = jsonObject.maskingData;
                }

                if (jsonObject.endEditing == "true") {
                    alert("success\n\n" + "암호화 : " + jsonObject.encryptData);
                }
            } else {
                alert("fail");
            }
        },
    };
    KDSAppBridge.plugin.execute(params);
}

//////////////////////////////// FIDO /////////////////////////////////

function fidoRegClick() {
    var params = {
        pluginId: "FidoPlugin",
        method: "registration",
        params: { userId: document.getElementById("input_user_id").value },
        callBack: function (isOk, jsonObject) {
            if (isOk) {
                alert("success");
            } else {
                alert("fail");
            }
        },
    };
    KDSAppBridge.plugin.execute(params);
}

function fidoAuthClick() {
    var params = {
        pluginId: "FidoPlugin",
        method: "authentication",
        params: { userId: document.getElementById("input_user_id").value },
        callBack: function (isOk, jsonObject) {
            if (isOk) {
                alert("success");
            } else {
                alert("fail");
            }
        },
    };
    KDSAppBridge.plugin.execute(params);
}

function fidoDeRegClick() {
    var params = {
        pluginId: "FidoPlugin",
        method: "deregistration",
        params: { userId: document.getElementById("input_user_id").value },
        callBack: function (isOk, jsonObject) {
            if (isOk) {
                alert("success");
            } else {
                alert("fail");
            }
        },
    };
    KDSAppBridge.plugin.execute(params);
}

function passCodeChangeClick() {
    var params = {
        pluginId: "FidoPlugin",
        method: "passCodeChange",
        params: {},
        callBack: function (isOk, jsonObject) {
            if (isOk) {
                alert("success");
            } else {
                alert("fail");
            }
        },
    };
    KDSAppBridge.plugin.execute(params);
}
