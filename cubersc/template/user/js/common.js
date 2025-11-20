// js/common.js
$(document).ready(function () {
    function userOsCheckParent() {
        var varUA = navigator.userAgent.toLowerCase(); //userAgent 값 얻기

        if (varUA.indexOf("android") > -1) {
            //안드로이드
            $(".beta-helpchat").addClass("chatandroid");
        } else if (varUA.indexOf("iphone") > -1 || varUA.indexOf("ipad") > -1 || varUA.indexOf("ipod") > -1) {
            //IOS
        } else {
            //아이폰, 안드로이드 외 모바일
        }
    }

    userOsCheckParent();

    function setMatchHeightBox() {
        var _winW = $(window).width();

        if ($(".box_listform_wrap").length > 0) {
            $(".box_listform_wrap .box_listform").matchHeight();
        }

        if (_winW <= 720 && $(".type_col2 .mybox").length > 0) {
            $(".type_col2 .mybox").matchHeight();
        }
        if (_winW >= 767 && $(".list_half_cardnoti").length > 0) {
            $(".list_half_cardnoti > li .box_btm .list_redcheck").matchHeight();
        }
    }

    function onlyMobileAccor() {
        var _winW = $(window).width();

        if ($(".list_half_cardnoti").length && $(".list_half_cardnoti .box_btm").hasClass("on") && _winW < 1024) {
            return;
        }

        if ($(".list_half_cardnoti").length && $(".list_half_cardnoti .box_btm").hasClass("on") && _winW > 1024) {
            $(".list_half_cardnoti .box_btm").removeClass("on");
            $(".list_half_cardnoti .mo_accordion_btn").removeClass("on").attr("title", "아코디언 닫힘");
        }

        if ($(".list_half_cardnoti").length && _winW > 1024) {
            $(".list_half_cardnoti .list_redcheck").show();
        } else {
            $(".list_half_cardnoti .list_redcheck").hide();
        }
    }

    setMatchHeightBox();
    onlyMobileAccor();

    function setColorBlueLink() {
        var _menu1 = $("a[href='/web/contents/lifefundloanOpen.do']"); // 은행별 대여금리 비교
        var _menu2 = $("a[href='/web/contents/trustsavingloanOpen.do']"); // 대여금리 안내
        var _menu3 = $("a[href='/web/contents/WagesavingInquiry.do']"); // 복지적립금 > 조회

        _menu1.addClass("bluebold");
        _menu2.addClass("bluebold");
        _menu3.addClass("bluebold");

        $(".dep1:nth-child(3)").find(".bluebold").addClass("reset"); // 인터넷창구쪽 중복링크로 인해 추가함
    }

    setColorBlueLink();

    /* 조회 페이지 : 모바일일때만 나오는 펼쳐보기, 모아보기 버튼 클릭 이벤트*/
    $(".box_calcarea .btn_newtoggle").on("click", function () {
        var toggleTop = $(this).closest(".app-mb-wrap").offset().top;

        if ($(this).hasClass("btn_outspread")) {
            // 펼쳐보기
            $(this).closest(".app-mb-wrap").find(".for_mobile_togglebtns.top").removeClass("hide");
        }

        $(this).closest(".app-mb-wrap").find(".app-mb").toggleClass("h_auto");
        $("html,body").animate({ scrollTop: toggleTop }, 500);
    });

    $(".help-bg .btn_newtoggle").on("click", function () {
        var toggleTop2 = $(this).closest(".app-mb-wrap").offset().top;

        if ($(this).hasClass("btn_outspread")) {
            // 펼쳐보기
            $(this).closest(".app-mb-wrap").find(".for_mobile_togglebtns.top").removeClass("hide");
        }

        $(this).closest(".app-mb-wrap").find(".app-mb").toggleClass("h_auto");
        $(this).closest(".help-bg").animate({ scrollTop: toggleTop2 }, 500);
        console.log(toggleTop2);
    });
    /* //조회 페이지 : 모바일일때만 나오는는 펼쳐보기, 모아보기 버튼 클릭 이벤트*/

    // 승계신청 > 신청 구분 중 지급승계 라디오 버튼 체크시에만 안내문구 노출
    $("input[name=sucsReatSeCd]").on("click", function () {
        var _valnum = $(this).val();

        $(".box_toggleview_txt").addClass("hide");
        $("#sucsInfo" + _valnum).removeClass("hide");
    });

    /* 서브페이지 전체 */
    if ($("div").hasClass("subs") === true) {
        $("#header").css("height", "0");
        $("#header .hp").hide().addClass("close");
        if ($(window).width() >= 1024) {
            $("#header .search-bg").css("top", "135px");
        } else {
            $("#header .search-bg").css("top", "64px");
        }
    }

    function rawLinkScrollMove() {
        var url = new URL(window.location);
        var urlParams = url.searchParams;
        if (urlParams.get("s")) {
            var scrollTop = $("#" + urlParams.get("s")).offset().top;

            $("html,body").animate({ scrollTop: scrollTop }, 500);
        }
    }

    rawLinkScrollMove();

    /* faq accordion */
    function faqaccordion() {
        var acc = document.getElementsByClassName("faq_accordion");
        var i;

        for (i = 0; i < acc.length; i++) {
            acc[i].addEventListener("click", function () {
                this.classList.toggle("active");
                $(this).next().slideToggle(100);
            });
        }
    }

    faqaccordion();
    /* faq accordion */

    /* 회원가입 안내 페이지 : 모바일에서만 아코디언 활성화 */
    $(".mo_accordion_btn").click(function (e) {
        var e = $(this);
        basicToggleAccordionMobileOnly(e);
    });

    function basicToggleAccordionMobileOnly(e) {
        var _this = $(e);
        var _thisparentbox = _this.parents(".box_btm"); // this parent box

        _thisparentbox.toggleClass("on");

        if (_thisparentbox.hasClass("on")) {
            _this.attr("title", "아코디언 열림");
            _this.addClass("on");
            _thisparentbox.find(".list_redcheck").stop().slideDown("fast");
            //alert(2);
        } else {
            _this.attr("title", "아코디언 닫힘");
            _this.removeClass("on");
            _thisparentbox.find(".list_redcheck").stop().slideUp("fast");
            //alert(3);
        }
    }

    /* 채팅상담 팝업 */
    $(".btn-help").on("click", function () {
        chatLoad();
        $("body").addClass("hidden");
        //$(".beta-helpchat").fadeIn();
    });

    //퇴직급여 저축금액 상세내역 보기
    /*$(".btn_btmmoreview").on("click", function(){
		var _dataname = $(this).attr("data-name");	
		var _targetbox = $("." + _dataname); 
		
		_targetbox.slideToggle(100);
	});*/

    //퇴직급여 저축금액 상세내역 보기
    $(".btn_btmmoreview").on("click", function (e) {
        var e = $(this);
        boxSlideMoreView(e);
        boxSlideMoreScroll(e);
    });

    function boxSlideMoreView(e) {
        var _dataname = $(e).attr("data-name");
        var _targetbox = $("." + _dataname);

        _targetbox.slideToggle(100);
    }

    function boxSlideMoreScroll(e) {
        var _targetTop = $(e).offset().top;
        $("html,body").animate({ scrollTop: _targetTop }, 500);
    }

    function setBreadCrumbMyInfoHref() {
        $(".nav-all #bank").find("#myInfo > a").attr("href", "javascript:;");
    }

    setBreadCrumbMyInfoHref();

    /* 개인정보 변경 : 동의하기 버튼 토글 */
    $(".btn_agreetoggle").on("click", function () {
        var _orgtxt = "동의하기";
        var _cancletxt = "동의 철회하기";
        var _this = $(this);

        if (_this.hasClass("checked")) {
            _this.removeClass("checked");
            _this.text(_orgtxt);
        } else {
            _this.addClass("checked");
            _this.text(_cancletxt);
        }
    });

    /* 개인정보 변경 : 동의(선택) 버튼 토글 */
    $(".btn_showothers").on("click", function () {
        var _this = $(this);
        var _orgtxt = "동의하기";
        var _cancletxt = "동의 철회하기";
        var _target = $(".box_stepshowbtn .btn_agreetoggle");
        var _beforetxt = $(".txt_stepshow");

        if (_this.hasClass("checked")) {
            _this.removeClass("checked").text(_orgtxt);
            _target.addClass("hide");
            _beforetxt.removeClass("hide");
        } else {
            _this.addClass("checked").text(_cancletxt);
            _target.removeClass("hide");
            _beforetxt.addClass("hide");
        }
    });

    /* 복지포탈 : 통합예약 | 객실 및 날짜선택 클릭이벤트 */
    $(".has-details").bind("click mouseenter", function (e) {
        //touchstart hover
        e.preventDefault();

        var _old = $(".has-details");
        var _this = $(this);

        _old.removeClass("on");
        _this.addClass("on");
    });

    $(".has-details, .mo_fix_tablewrap td").on("click", function () {
        if ($(".beta-reservation_waiting").length > 1) {
            return;
        }
        $(".beta-reservation_waiting").fadeIn();
        $("body").addClass("hidden");
    });

    /* 모바일 아코디언 */
    $(".box_more").on("click", function (e) {
        e.preventDefault();
        if ($(this).hasClass("active")) {
            $(this).removeClass("active").next().stop().slideUp(300);
        } else {
            $(this).addClass("active").next().stop().slideDown(300);
        }
    });

    /* 체크박스 클릭 토글 임시 : subss nonechkd에 id 추가 필요 */
    $("#foldchk, #foldchk2").on("click", function () {
        $(this).hasClass("nonechkd") ? $(this).removeClass("nonechkd").addClass("chkd") : $(this).removeClass("chkd").addClass("nonechkd");
        $(this).next().toggleClass("active");
    });

    /* 적립형 목돈수탁저축 전환가입 신청 > 비과세 체크박스 클릭 시 */
    $(".btn_chk").on("click", function () {
        var _targetbox = $(this).attr("data-name");
        $("." + _targetbox).toggleClass("active");
    });

    /* 로그인 */
    $(window).load(function () {
        // 회원자격 조회 팝업
        $(".btn_changepop").on("click", function () {
            var _hidetargetpop = $(this).parents(".help_certi_prev");
            var _replacetargetpop = $(this).parents(".help_certi_prev").next();

            console.log(_replacetargetpop);

            //_hidetargetpop.addClass("hide");
            //_replacetargetpop.removeClass("hide");
        });

        // 통합예약 : 객실 및 날짜선택 예약 팝업
        $(".btn_changepop.btn_roomreservation").on("click", function () {
            var _hidetargetpop = $(this).parents(".reservation_confirm");
            var _replacetargetpop = $(this).parents(".reservation_confirm").next();

            console.log(_replacetargetpop);

            _hidetargetpop.addClass("hide");
            _replacetargetpop.removeClass("hide");
        });

        /* 복지포탈 셀렉트 */
        $(".link_filter").on("click", function () {
            $(".link_filter, .sort_layer").removeClass("on");
            $(this).addClass("on");
            $(this).next().addClass("on");
        });

        $(".link_sort").on("click", function () {
            var _thisText = $(this).text();
            $(this).parent().parent().parent().prev().text(_thisText);
            $(".link_filter, .sort_layer").removeClass("on");
        });

        $(".help-bg .check-bt:last-child > button").addClass("last_popbtn");

        $(".help-bg .help-w").append('<div class="w-closeplus"><a href="javascript:;" title="닫기"></a></div>');
        $(".h-win").attr("tabindex", "0");

        $(".help-bg .w-closeplus").on("keydown", function (event) {
            console.log(event.keyCode);
            if (event.keyCode === 9) {
                $(this).parents(".help-bg").find(".h-win").focus();
            }
        });

        $(".w-closeplus").on("click", function () {
            $(this).parents(".help-bg").find(".w-close").trigger("click");
        });

        // 외부영역 클릭 시 팝업 닫기
        $(document).mouseup(function (e) {
            var LayerLink = $(".link_filter");
            var LayerTarget = $(".help-w");
            var LayerTarget2 = $(".help-w2");
            var LayerPopup = $(".sort_layer");
            var betaChatPop = $(".beta-helpchat");
            var betaMainSliderPop = $(".beta-eventpop-slide");
            var qwin = $(".q-win");

            if (betaMainSliderPop.has(e.target).length === 0) {
                return;
            }

            if (LayerLink.has(e.target).length === 0) {
                LayerLink.removeClass("on");
                LayerPopup.removeClass("on");
            }

            if (LayerTarget.has(e.target).length === 0) {
                $("body").removeClass("hidden");
                LayerTarget.parent().fadeOut("slow");
            }

            if (LayerTarget2.has(e.target).length === 0) {
                $("body").removeClass("hidden");
                LayerTarget2.parent().fadeOut("slow");
            }

            if (qwin.has(e.target).length === 0) {
                $("body").removeClass("hidden");
                qwin.parent().fadeOut("slow");
            }

            if (betaChatPop.has(e.target).length === 0) {
                return;
            }
        });

        $(".h-wincont").on("click", function () {
            $("body").addClass("hidden");
        });

        $(".beta-association_financialcaution").on("click", function () {
            $("body").addClass("hidden");
        });

        $(".simul-bg").on("click", function () {
            $(".simul-close").trigger("click");
            $("body").removeClass("hidden");
        });

        $(".simul-close, .simul-close2").on("click", function () {
            $(".simul").removeClass("active");
            $("body").removeClass("hidden");
        });

        $(".simul-close2").on("keydown", function (event) {
            if (event.keyCode === 9) {
                $(".box_simullink_wrap ul").attr("tabindex", "0").focus();
            }
        });

        /* 만족도 조사 */
        $(".satisfaction_chkwrap li").on("click", function () {
            var _li = $(".satisfaction_chkwrap li");
            var _this = $(this);
            _li.removeClass("active");
            _this.addClass("active");
        });

        if ($(".fix_dimmscl").length > 0) {
            if ($(".beta-association_financialcaution").css("display") === "block") {
                $("body").addClass("hidden");
            }

            // 단체 메인 팝업 : 요소의 스크롤이 끝나면 이벤트
            if ($(".fix_dimmscl").length > 0) {
                var elem = $(".fix_dimmscl .h-winnew");

                if (elem[0].scrollHeight == elem.outerHeight()) {
                    // 스크롤 안 생겼을때 (스크롤 하지 않고도 확인 버튼 활성화되게 처리)
                    $(".scl_removegrey").removeClass("grey");
                    return;
                } else {
                    // 스크롤 생겼을때
                    $(".fix_dimmscl .h-winnew").scroll(function () {
                        if (elem[0].scrollHeight - elem.scrollTop() <= elem.outerHeight() + 20) {
                            // 스크롤 끝 - 20보다 더 스크롤 했을때
                            $(".scl_removegrey").removeClass("grey");
                        } else {
                            // 스크롤 끝 - 20보다 적게 스크롤 했을때
                            $(".scl_removegrey").addClass("grey");
                        }
                    });
                }
            }
        }

        /* 회원콘도 종합예약 체크인 체크아웃 */
        /* if($('#from, #to').length){
		    // check if element is available to bind ITS ONLY ON HOMEPAGE
		    var currentDate = moment().format("YYYY-MM-DD");
		
		    $('#from, #to').daterangepicker({
		        locale: {
		              format: 'YYYY-MM-DD'
		        },
		        
		        "alwaysShowCalendars": true,
		        "minDate": currentDate,
		        autoApply: true,
		        autoUpdateInput: false,
		        locale: {
					format: "YYYY-MM-DD",
					daysOfWeek: ["일", "월", "화", "수", "목", "금", "토"],
					monthNames: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
				},
		      
		    }, function(start, end, label) {
		      // console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
		      // Lets update the fields manually this event fires on selection of range
		      var selectedStartDate = start.format('YYYY.MM.DD'); // selected start
		      var selectedEndDate = end.format('YYYY.MM.DD'); // selected end			
			
		      $checkinInput = $('#from');
		      $checkoutInput = $('#to');
		
		      // Updating Fields with selected dates
		      $checkinInput.val(selectedStartDate);
		      $checkoutInput.val(selectedEndDate);
		
		      // Setting the Selection of dates on calender on CHECKOUT FIELD (To get this it must be binded by Ids not Calss)
		      var checkOutPicker = $checkoutInput.data('daterangepicker');
		      checkOutPicker.setStartDate(selectedStartDate);
		      checkOutPicker.setEndDate(selectedEndDate);
		
		      // Setting the Selection of dates on calender on CHECKIN FIELD (To get this it must be binded by Ids not Calss)
		      var checkInPicker = $checkinInput.data('daterangepicker');
		      checkInPicker.setStartDate(selectedStartDate);
		      checkInPicker.setEndDate(selectedEndDate);	  
		
		    });
		
		} // End Daterange Picker	*/

        /** 처음 시작시, 체크인 날짜 오늘 날짜로 설정 **/
        function getTodayLabel() {
            var _today = new Date();
            var _year = _today.getFullYear();
            var _month = ("0" + (_today.getMonth() + 1)).slice(-2);
            var _day = ("0" + _today.getDate()).slice(-2);
            var _dateString = _year + "." + _month + "." + _day;
            //console.log(_dateString);

            var week = new Array("일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일");
            var today = new Date().getDay();
            var todayLabel = week[today];
            var outputString1 = _dateString + "(" + todayLabel.slice(0, 1) + ")";

            return outputString1;
        }

        //console.log(getTodayLabel());

        $("#from").val(getTodayLabel());
        $("#to").val("-");

        /*if($(window).width() >= 1025) {			
		    $(".login_tab li[data-tab='login1']").addClass('active');
		    $(".login_tab li[data-tab='login0']").removeClass('active');
		    $(".logins #login1.logintent").addClass('active');
		    $(".logins #login0.logintent").removeClass('active');
		} else {
		    $(".login_tab li[data-tab='login0']").addClass('active');
		    $(".login_tab li[data-tab='login1']").removeClass('active');
		    $(".logins #login0.logintent").addClass('active');
		    $(".logins #login1.logintent").removeClass('active');

			$(".certifications .login_tab li[data-tab='login1']").addClass("active");
			$(".certifications #login1.logintent").addClass('active');
		}*/

        /*		function resizeLoginTabBox(){
			var _loginTabR0 = $(".resize_logins .login_tab li[data-tab='login0']");	
			var _loginTabR1 = $(".resize_logins .login_tab li[data-tab='login1']");			
			var _loginTabF1 = $(".certifications .login_tab li[data-tab='login1']");
			
			if($(window).width() >= 1025) {	//console.log("pc");								
				_loginTabR1.trigger("click").focus();
								
			}else{ //console.log("mo")				
				_loginTabR0.trigger("click").focus();
			}
			
			_loginTabF1.trigger("click").focus();
			
		}
		
		resizeLoginTabBox();
		
		$(window).on("resize", function(){
			resizeLoginTabBox();
		})		
		*/

        /*function resizeLoginTabBox(){
			var _loginTabR0 = $(".resize_logins .login_tab li[data-tab='login0']");		

			//if($(window).width() >= 1025) {	//console.log("pc");								
				_loginTabR0.trigger("click").focus();
								
			//}
			
		}*/

        //resizeLoginTabBox();

        var ww = $(window).width();
        var moTabSwiper = undefined;
        var moTabSwiper2 = undefined;
        var moTabSwiper3 = undefined;
        var moBasicswiper = undefined;
        var moTabs01swiper = undefined;
        var mmaainfoswiper = undefined;
        var mmaainfoswiper2 = undefined;

        function tabOnlyMobileSwiper() {
            // notice-tab
            var tab_idx = $(".m_tabswiper .tab.active").index();

            if ($(".m_tabswiper").length < 1) {
                return;
            }
            if (ww < 1025 && moTabSwiper == undefined) {
                moTabSwiper = new Swiper(".swiper-container.m_tabswiper", {
                    slidesPerView: "auto",
                    spaceBetween: 0,
                    simulateTouch: true,
                    loop: false,
                    autoplay: false,
                    observer: true,
                    observerParents: true,
                });

                console.log(tab_idx);
                moTabSwiper.slideTo(tab_idx, 1000, false); //활성화 된 탭이 잘 보이는 위치로 이동시켜줌
            } else if (ww >= 1025 && moTabSwiper != undefined) {
                moTabSwiper.destroy();
                moTabSwiper = undefined;
            }
        }

        function tabOnlyMobileSwiper2() {
            // sub-tab
            var tab_idx = $(".m_tabswiper2 .tab.active").index();

            if ($(".m_tabswiper2").length < 1) {
                return;
            }
            if (ww < 721 && moTabSwiper2 == undefined) {
                moTabSwiper2 = new Swiper(".swiper-container.m_tabswiper2", {
                    slidesPerView: "auto",
                    spaceBetween: 0,
                    simulateTouch: true,
                    loop: false,
                    autoplay: false,
                    observer: true,
                    observerParents: true,
                });

                console.log(tab_idx);
                moTabSwiper2.slideTo(tab_idx, 1000, false); //활성화 된 탭이 잘 보이는 위치로 이동시켜줌
            } else if (ww >= 721 && moTabSwiper2 != undefined) {
                moTabSwiper2.destroy();
                moTabSwiper2 = undefined;
            }
        }

        function tabOnlyMobileSwiper3() {
            // notice-tab.tabs01
            var tab_idx = $(".m_tabswiper3 .tab-link.currents").index();

            if ($(".m_tabswiper3").length < 1) {
                return;
            }
            if (ww < 600 && moTabSwiper3 == undefined) {
                moTabSwiper3 = new Swiper(".swiper-container.m_tabswiper3", {
                    slidesPerView: "auto",
                    spaceBetween: 0,
                    simulateTouch: true,
                    loop: false,
                    autoplay: false,
                    observer: true,
                    observerParents: true,
                });
                console.log(tab_idx);
                moTabSwiper3.slideTo(tab_idx, 1000, false); //활성화 된 탭이 잘 보이는 위치로 이동시켜줌
            } else if (ww >= 600 && moTabSwiper3 != undefined) {
                moTabSwiper3.destroy();
                moTabSwiper3 = undefined;
            }

            /*moTabSwiper3.on('transitionEnd', function(){
				console.log("end end");		
			});*/
        }

        function OnlyMobileBasicswiper() {
            // 공제회 소개 메인 KV 아래 아이콘 영역(연혁 ~ 오시는길)

            if ($(".m_basicswiper").length < 1) {
                return;
            }
            if (ww < 1025 && moBasicswiper == undefined) {
                moBasicswiper = new Swiper(".swiper-container.m_basicswiper", {
                    slidesPerView: "auto",
                    spaceBetween: 0,
                    simulateTouch: true,
                    loop: false,
                    autoplay: false,
                    observer: true,
                    observerParents: true,
                    slidesOffsetAfter: 40,
                    /*breakpoints: {
							767: {
								slidesOffsetAfter : 30, 
							},
							540: {
								slidesOffsetAfter : 40, 
							},
						},			*/
                });

                //moBasicswiper.slideTo(tab_idx, 1000, false); //활성화 된 탭이 잘 보이는 위치로 이동시켜줌
            } else if (ww >= 1025 && moBasicswiper != undefined) {
                moBasicswiper.destroy();
                moBasicswiper = undefined;
            }
        }

        function tabFirstTopSwiper() {
            // notice-tab
            var tab_idx = $(".m_firsttabswiper .tab-link.currents").index();

            if ($(".m_firsttabswiper").length < 1) {
                return;
            }
            if (ww < 1025 && moTabs01swiper == undefined) {
                moTabs01swiper = new Swiper(".swiper-container.m_firsttabswiper", {
                    slidesPerView: "auto",
                    spaceBetween: 0,
                    simulateTouch: true,
                    loop: false,
                    autoplay: false,
                    observer: true,
                    observerParents: true,
                });

                //console.log(tab_idx);
                //moTabs01swiper.slideTo(tab_idx, 1000, false); //활성화 된 탭이 잘 보이는 위치로 이동시켜줌
            } else if (ww >= 1025 && moTabs01swiper != undefined) {
                moTabs01swiper.destroy();
                moTabs01swiper = undefined;
            }
        }

        function mmaainfoMobileSwiper() {
            if ($(".m_mmaainfo01").length < 1) {
                return;
            }
            if (ww <= 1200 && mmaainfoswiper == undefined) {
                mmaainfoswiper = new Swiper(".swiper-container.m_mmaainfo01", {
                    slidesPerView: "auto",
                    spaceBetween: 0,
                    simulateTouch: true,
                    loop: false,
                    autoplay: false,
                    observer: true,
                    observerParents: true,
                    slidesOffsetAfter: 40,
                });
            } else if (ww >= 1201 && mmaainfoswiper != undefined) {
                mmaainfoswiper.destroy();
                mmaainfoswiper = undefined;
            }
        }

        function mmaainfoMobileSwiper2() {
            if ($(".m_mmaainfo02").length < 1) {
                return;
            }
            if (ww <= 1200 && mmaainfoswiper2 == undefined) {
                mmaainfoswiper2 = new Swiper(".swiper-container.m_mmaainfo02", {
                    slidesPerView: "auto",
                    spaceBetween: 0,
                    simulateTouch: true,
                    loop: false,
                    autoplay: false,
                    observer: true,
                    observerParents: true,
                    slidesOffsetAfter: 40,
                });
            } else if (ww >= 1201 && mmaainfoswiper2 != undefined) {
                mmaainfoswiper2.destroy();
                mmaainfoswiper2 = undefined;
            }
        }

        tabOnlyMobileSwiper();
        tabOnlyMobileSwiper2();
        tabOnlyMobileSwiper3();
        OnlyMobileBasicswiper();
        tabFirstTopSwiper();
        mmaainfoMobileSwiper();
        mmaainfoMobileSwiper2();

        $(window).on("resize", function () {
            ww = $(window).width();

            //resizeLoginTabBox();
            tabOnlyMobileSwiper();
            tabOnlyMobileSwiper2();
            tabOnlyMobileSwiper3();
            OnlyMobileBasicswiper();
            tabFirstTopSwiper();
            setMatchHeightBox();
            onlyMobileAccor();
            mmaainfoMobileSwiper();
            mmaainfoMobileSwiper2();
        });
    });

    $(".subs .login_tab li").click(function () {
        var tab_id = $(this).attr("data-tab");

        $(".subs .login_tab li").removeClass("active");
        $(".subs .logins .logintent").removeClass("active");

        $(this).addClass("active");
        $("#" + tab_id).addClass("active");
    });

    $(".menu-edit").on("click", function () {
        $(".mobile_editwrap").addClass("on");
    });

    $(".edit-close").on("click", function () {
        $(".mobile_editwrap").removeClass("on");
    });

    /* 복지포털 */
    $(window).load(function () {
        $(".reservebox").css("transform", "scale(1)");

        //로그인 : 첫번째 탭 active
        if ($(".login_tab li.active").length === 0) {
            $(".login_tab li:first-child").trigger("click");
        }

        $(".v-slider .slick-slide:nth-child(1)").find(".kv_btn").attr("title", "회원저축제도 이자율 인상 및 가입한도 증좌");
        $(".v-slider .slick-slide:nth-child(2)").find(".kv_btn").attr("title", "군인공제회법 개정 추진 회원자격 확대");
        $(".v-slider .slick-slide:nth-child(3)").find(".kv_btn").attr("title", "전역한 회원도 이용 가능한 제도, 장점과 혜택");
        $(".v-slider .slick-slide:nth-child(4)").find(".kv_btn").attr("title", "회원 복지를 최우선으로! 회원 곁에 군인공제회");
    });

    /* 예약창 달력 */
    /*$('.picker').daterangepicker({
		locale: {
			format: "YYYY-MM-DD",
			firstDay : 1,
			daysOfWeek: ["일", "월", "화", "수", "목", "금", "토"],
			monthNames: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
			showMonthAfterYear: true, // 년도 먼저 나오고, 뒤에 월 표시 
			yearSuffix: "년", // 년도숫자 뒤에 '년' 표시
		},
	});
	$('#datepicker01').val('');
	$('#datepicker01').attr("placeholder","여행 시작일");
	if( $( window ).width() <= 640) {
		$('#datepicker01').val('');
		$('#datepicker01').attr("placeholder","시작일");
	} else {
		$('#datepicker01').val('');
		$('#datepicker01').attr("placeholder","여행 시작일");
	}
	$(window).resize(function() {
		if( $( window ).width() <= 640) {
			$('#datepicker01').val('');
			$('#datepicker01').attr("placeholder","시작일");
		} else {
			$('#datepicker01').val('');
			$('#datepicker01').attr("placeholder","여행 시작일");
		}
	});
	$('#datepicker01').click(function(){
		$(".daterangepicker").removeClass('ri');
		$(".daterangepicker").addClass('le');
	});
	$('#datepicker02').val('');
	$('#datepicker02').attr("placeholder","여행 종료일");
	if( $( window ).width() <= 640) {
		$('#datepicker02').val('');
		$('#datepicker02').attr("placeholder","종료일");
	} else {
		$('#datepicker02').val('');
		$('#datepicker02').attr("placeholder","여행 종료일");
	}
	$(window).resize(function() {
		if( $( window ).width() <= 640) {
			$('#datepicker02').val('');
			$('#datepicker02').attr("placeholder","종료일");
		} else {
			$('#datepicker02').val('');
			$('#datepicker02').attr("placeholder","여행 종료일");
		}
	});
	$('#datepicker02').click(function(){
		$(".daterangepicker").removeClass('le');
		$(".daterangepicker").addClass('ri');
	});*/

    /** 공제회소개 서브메인 **/
    /* 탭메뉴 (경영공시, 윤리경영) */
    $(".subs .intro-tabs .btn").click(function () {
        var tab_id = $(this).attr("data-tab");

        $(".subs .intro-tabs .btn").removeClass("active");
        $(".subs .intro-tabs .btn > a").attr("title", "");
        $(".subs .intro-tabs .ins").removeClass("active");

        $(this).addClass("active");
        $(this).find("> a").attr("title", "선택됨");
        $("#" + tab_id).addClass("active");
    });

    /* 마이페이지 모바일 박스 슬라이드 */
    $(".subs .mobmy").slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: "30px",
        arrows: false,
        dots: true,
        autoplay: false,
        speed: 700,
    });

    $(".subs .mobmy").on("afterChange", function () {
        setMatchHeightBox();
    });

    /** 마이페이지 금액 표시하기 토글 **/

    /* 저축박스 */
    $(".box_mypagecont .cbox .box-top .box_switcher").click(function () {
        var slideNum = $(this).data("slidecheck");
        var _parentcbox = $('[data-slidecheck="' + slideNum + '"]').parents(".cbox"); //this parent cbox
        var _mycloses = _parentcbox.find(".mycloses");
        var _boxbottom = _parentcbox.find(".box-bottom");
        var _mycontent = _parentcbox.find(".mycontent");
        var _box = _parentcbox.find(".box");
        var _boxtitle = _box.find(".title");
        var _checked = $(this).find(".otgs-switcher-input").is(":checked");

        //if( _parentcbox.hasClass('close') === true ) {
        if (_checked) {
            $('[data-slidecheck="' + slideNum + '"]').removeClass("close");
            _parentcbox.removeClass("close").addClass("open");
            _mycloses.removeClass("on");
            _boxbottom.removeClass("close");
            //_mycontent.removeClass('close');
            $("#switch-simple" + slideNum).prop("checked", true);
            $("#switch-simplem" + slideNum).prop("checked", true);
            //return;
        } else {
            $('[data-slidecheck="' + slideNum + '"]').addClass("close");
            //_parentcbox.removeClass('open').addClass('close');
            _mycloses.addClass("on");
            _boxbottom.addClass("close");
            //_mycontent.addClass('close');
            //_box.removeClass('on');
            //_boxtitle.next().slideUp(500);
            $("#switch-simple" + slideNum).prop("checked", false);
            $("#switch-simplem" + slideNum).prop("checked", false);
            //return;
        }
        var _checked_2 = $("#switch-simple1").is(":checked");
        var _checked_3 = $("#switch-simple2").is(":checked");
        var _checked_4 = $("#switch-simple3").is(":checked");

        // 금액표시 S
        var params = {
            //저축 모아보기
            set2: _checked_2,

            //대여 모아보기
            set3: _checked_3,

            //복지 모아보기
            set4: _checked_4,
        };

        $.ajax({
            type: "POST",
            async: true,
            //url: "https://www.mmaa.or.kr/web/main/index.do/setmy",
            url: "/web/main/index.do/setmy",
            data: params,
        });
        // 금액표시 E
    });

    /* 아코디언 박스 : 공통 */
    /*	$(".cbox .mycontent .box-one .box .title").click(function () {
		var _thisparentbox = $(this).parent(); // this parent box
		
		_thisparentbox.toggleClass('on');
		_thisparentbox.find(".box-content").stop().slideToggle("fast");
	
	});*/

    //복지부조 목록은 아코디언기능 못하도록 수정(요청사항)(PC) _20240223_shw + 복지부조 목록이 비어있으면 기본상태(아코디언 가능)
    $(".cbox .mycontent .box-one .box .title").click(function (e) {
        var e = $(this);
        /*	var except = $(e).closest('#welfarekind').length;
		var except_mo = $(e).closest('#welfarekind_mo').length;*/
        /*if(except > 0 || except_mo > 0){
			console.log("복지부조버튼임");
			var weli = $('#welfareMy').find("li").length;
			if(weli>0){
				return;			
			}else{
				basicToggleAccordion(e);
			}
		}else{*/
        basicToggleAccordion(e);
        /*}*/
    });

    function basicToggleAccordion(e) {
        var _this = $(e);
        var _thisparentbox = _this.parent(); // this parent box

        if (_this.hasClass("only_link")) {
            return;
        } // 마이페이지 저축모아보기쪽 링크연결만 되는 아코디언 케이스 추가

        _thisparentbox.toggleClass("on");
        _thisparentbox.find(".box-content").stop().slideToggle("fast");

        if (_thisparentbox.hasClass("on")) {
            _this.attr("title", "아코디언 열림");
        } else {
            _this.attr("title", "아코디언 닫힘");
        }
    }
    //복지부조 목록은 항상 열려있도록 수정(요청사항)(mobile) _20240223_shw +추가로 복지부조 내용 없으면 닫아야 함.
    $(".mobmy").on("afterChange", function () {
        $(".cbox .mycontent .box").removeClass("on");
        $(".cbox .mycontent .box .box-content").stop().slideUp("fast");
        var wfli = $("#welfareMy_mo").find("li").length;
        if (wfli > 0) {
            //$('#welfareMy_mo').css('display','block');
            $("#welfareMy_mo .box .title").trigger("click");
            console.log("트리거 테스트");
        }
    });

    if ($(window).width() <= 640) {
        $(".type_col2 .box-content .btn1").text("신청하기");
        $(".type_col2 .box-content .btn1").attr("title", "신청하기");
    } else {
        $(".type_col2 .box-content .btn1").text("신청하러 가기");
        $(".type_col2 .box-content .btn1").attr("title", "신청하러 가기");
    }
    $(window).resize(function () {
        if ($(window).width() <= 640) {
            $(".type_col2 .box-content .btn1").text("신청하기");
            $(".type_col2 .box-content .btn1").attr("title", "신청하기");
        } else {
            $(".type_col2 .box-content .btn1").text("신청하러 가기");
            $(".type_col2 .box-content .btn1").attr("title", "신청하러 가기");
        }
    });
    if ($(window).width() <= 640) {
        $(".type_col2 .box-content .btn2").text("가능금액 조회");
        $(".type_col2 .box-content .btn2").attr("title", "가능금액 조회");
    } else {
        $(".type_col2 .box-content .btn2").text("가능금액 조회");
        $(".type_col2 .box-content .btn2").attr("title", "가능금액 조회");
    }
    $(window).resize(function () {
        if ($(window).width() <= 640) {
            $(".type_col2 .box-content .btn2").text("가능금액 조회");
            $(".type_col2 .box-content .btn2").attr("title", "가능금액 조회");
        } else {
            $(".type_col2 .box-content .btn2").text("가능금액 조회");
            $(".type_col2 .box-content .btn2").attr("title", "가능금액 조회");
        }
    });

    /* 콘텐츠 페이지 탭 */
    $(".subs .content-all .tabs li").click(function () {
        var tab_id = $(this).attr("data-tab");

        $(".subs .content-all .tabs li").removeClass("active");
        $(".subs .content-all .tab-content").removeClass("active");

        $(this).addClass("active");
        $("#" + tab_id).addClass("active");
    });

    /* 공지사항 탭메뉴 */
    $(".subs .notice-tab:not(.tab_evtstop) .tab").click(function () {
        //target_blank : 새창이동 인 경우의 탭
        var tab_id = $(this).attr("data-tab");
        var tab_idx = $(this).index();

        if ($(this).hasClass("tab_linkmove")) {
            return;
        }

        $(".subs .notice-tab .tab").removeClass("active");
        $(".subs .notice-tab .tab > a").attr("title", "");
        $(".subs .notices").removeClass("active");

        $(this).addClass("active");
        $(this).find(" > a").attr("title", "선택됨");
        $("#" + tab_id).addClass("active");
    });

    $(window).load(function () {
        $(".subs .notice-tab .tab").eq(0).css("border-bottom-left-radius", "10px");
        $(".subs .notice-tab .tab").eq(0).css("border-top-left-radius", "10px");
        $("#container").attr("tabindex", "0");
        $(".noti_board .one .more").attr("title", "공지사항 더보기");

        if ($(".notice-tab .tab.active").length > 0) {
            $(".notice-tab .tab > a").attr("title", "");
            $(".notice-tab .tab.active > a").attr("title", "선택됨");
        }

        // document title - 활성화 된 depth명 차례로 title에 출력 (breadCrumb 기준)
        function findActiveMenuName() {
            var _title1 = $(".nav1.on > a > span").text();
            var _title2 = " > " + $(".nav2.on > a > span").text();
            var _title3 = "";
            if ($(".nav3.on > a > span").text()) {
                _title3 = " > " + $(".nav3.on > a > span").text();
            }
            var _title4Chk = " > " + $(".nav4.on > a > span").text();
            var _title4 = " > " + $(".last_menulist > a > span").text();
            var _bordertit = $("#contents .box_calcarea > .box_btmborder_tit > h3").text();

            //console.log(_title4Chk.length);

            if (_title4.length === 3) {
                if (window.location.pathname === "/web/main/index.do") {
                    $(document).attr("title", "군인공제회 - " + "메인페이지");
                } else if (window.location.pathname === "/web/contents/welfaremain.do") {
                    $(document).attr("title", "군인공제회 - " + "복지포털 메인페이지");
                } else if (window.location.pathname === "/web/contents/mmaainfo.do") {
                    $(document).attr("title", "군인공제회 - " + "공제회 소개 메인페이지");
                } else if (window.location.pathname === "/web/contents/mypage.do") {
                    $(document).attr("title", "군인공제회 - " + "인터넷 창구 > 마이페이지");
                } else {
                    $(document).attr("title", "군인공제회 - " + _bordertit);
                }
                return;
            } else {
                if (_title4Chk.length === 3) {
                    $(document).attr("title", "군인공제회 - " + _title1 + _title2 + _title3);
                    console.log(_title1 + _title2 + _title3);
                } else {
                    $(document).attr("title", "군인공제회 - " + _title1 + _title2 + _title3 + _title4);
                    console.log(_title1 + _title2 + _title3 + _title4);
                }
            }
        }

        findActiveMenuName();
    });

    /* 공제회 소개 > 홍보마당 > 미디어 > 회보 */
    $(".subs .bull_srch select").change(function () {
        var result = $(".subs .bull_srch select option:selected").val();
        if (result == "bull1") {
            $(".media_boxs").removeClass("active");
            $("#bull1").addClass("active");
        }
        if (result == "bull2") {
            $(".media_boxs").removeClass("active");
            $("#bull2").addClass("active");
        }
        if (result == "bull3") {
            $(".media_boxs").removeClass("active");
            $("#bull3").addClass("active");
        }
        if (result == "bull4") {
            $(".media_boxs").removeClass("active");
            $("#bull4").addClass("active");
        }
        if (result == "bull5") {
            $(".media_boxs").removeClass("active");
            $("#bull5").addClass("active");
        }
        if (result == "bull6") {
            $(".media_boxs").removeClass("active");
            $("#bull6").addClass("active");
        }
        if (result == "bull7") {
            $(".media_boxs").removeClass("active");
            $("#bull7").addClass("active");
        }
        if (result == "bull8") {
            $(".media_boxs").removeClass("active");
            $("#bull8").addClass("active");
        }
    });

    /* 공제회 소개 > 홍보마당 > 미디어 > e-브로셔 */
    $(".subs .media_list .box .isv").click(function () {
        var id = $(this).attr("id");

        $(".subs .media_list .box .isv").removeClass("active");
        $(".subs .e_box .cont").removeClass("active");

        var sid = "#t-ebo" + id;
        $(sid).addClass("active");
    });

    // 팝업 초점이동 접근성
    $(".help-bg").find(".st-table").attr("tabindex", "0");
    $(".help-bg").find(".check-bt button").attr("tabindex", "0");
    $(".nav-list li a").attr("tabindex", "0");

    // 서브탭 키보드 접근성
    $(".tab-link").on("keyup", function (event) {
        var _targetSubTab = $(".tab-link:focus");
        if (event.keyCode === 13) {
            _targetSubTab.trigger("click");
        }
    });

    $(".box_onlym_btns .select_top_category").on("click", function () {
        var targetParent = $(this).closest(".box_onlym_btns");
        targetParent.toggleClass("active");
    });

    $(".list_topcategory li a").on("click", function () {
        var newtxt = $(this).text();
        var newlink = $(this).attr("href");
        $(".box_onlym_btns .select_top_category").text(newtxt);
        $(".box_onlym_btns .select_top_category").attr(newlink);
        $(".box_onlym_btns").removeClass("active");
    });
});
