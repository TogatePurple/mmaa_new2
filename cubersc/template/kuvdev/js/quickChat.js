/* 
	@파일명    quickChat.js
	@파일정보  채팅상담 api 
	@수정이력
	@수정자    수정일         수정내용
	@=====================================
	@SSR     2023.11.14    최초 생성
	@=====================================
	@author  (주)퀴리오스 개발팀
	@since   2001.11.15
	@version 1.0.0 Copyright (C) KUVRIOV Ltd. All rights reserved.
*/

function chatLoad() {
    // 채팅이 가능할 경우 iframe 열도록 이동 chatPossibleAjax
    //var iframe = $('<iframe>').attr('src','/chat/views/chat.jsp');
    //$('#viewChat').empty().append(iframe);

    chatPossibleAjax();

    /*
	$.ajax({
		url : '/chat/views/chat.jsp',
		method : 'GET',
		dataType : 'html',
		success : function(response){
			// 채팅가능여부 조회 후 html출력		
			console.log(response);	
			$('#viewChat').html(response);

			chatPossibleAjax();
		},
		error : function(xhr, status, error){
			console.error(error);
		}
	});
	*/
}

function chatPossibleAjax() {
    $.ajax({
        url: "/api/chatPossible.do",
        type: "post",
        dataType: "json",
        async: true,
        success: function (response) {
            var responseJSON = response["AA010"];

            // 테스트 하려면 != 200 으로 하고 테스트 끝나면 == 200 으로 복귀해야 함
            if (responseJSON["status"] == 200) {
                if (responseJSON["data"]["possible"] == "Y") {
                    //alert("상담채팅 가능");
                    var iframe = $("<iframe>").attr("src", "/chat/views/chat.jsp");
                    $("#viewChat").empty().append(iframe);

                    $(".beta-helpchat").fadeIn("slow", function () {
                        $("body").addClass("hidden");
                    });
                } else {
                    alert("상담채팅이 불가능한 시간입니다.");
                }
            } else if (responseJSON["status"] == 500) {
                alert("status:" + responseJSON["status"] + "\n" + responseJSON["message"]);
            } else {
                alert("처리 중 오류가 발생하였습니다.");
            }
        },
        error: function (request, status, error) {
            if (request.responseText.indexOf("로그인") > 0) {
                alert("로그인 후 이용 가능합니다.");
                location.href = "/web/contents/webLogin.do";
            } else {
                alert("api오류\ncode:" + request.status + "\n" + "message:" + request.responseText + "\n");
            }
        },
    });
}
