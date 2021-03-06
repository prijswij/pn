$(function(){
	window.viewport = {
		width  : $(window).width(),
		height : $(window).height()
	};
	window.pageNavigatorTouch = {
		start		: {},
		end			: {},
		startTimer	: null
	};
	//$("#pagenavigator").on("touchstart", touchDownHandle)
	var pagenavigator = document.getElementById("pagenavigator");
	pagenavigator.addEventListener("touchstart",touchDownHandle,false);
	pagenavigator.addEventListener("click",function(e){
		e.stopPropagation();
		e.preventDefault();
	},true);
	$("body").on("scroll",function(e){
		e.stopPropagation();
		e.preventDefault();
	});
	//document.addEventListener("touchstart",touchDownHandle,false);
	window.transitionEnd = whichTransitionEvent(document.getElementById('pagenavigator'));
	loadCards();
});




function whichTransitionEvent(el){
    var t;
    var transitions = {
      'transition':'transitionend',
      'OTransition':'oTransitionEnd',
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd'
    }

    for(t in transitions){
        if( el.style[t] !== undefined ){
            return transitions[t];
        }
    }
}

function touchDownHandle(event){
	event.stopPropagation();
	event.preventDefault();
	
	//document.removeEventListener("touchstart",touchDownHandle);
	
	//console.log("touch start :" + event.touches[0].pageX);
	pageNavigatorTouch.startTimer = Date.now();
	$("#pagenavigator").removeClass("slide-animation");
	//pageNavigatorTouch.start = event.originalEvent.touches[0];
	//$("#pagenavigator").on("touchmove", touchMoveHandle);
	//$("#pagenavigator").one("touchend", touchUpHandle);
	
	pageNavigatorTouch.start = jQuery.extend({}, event.touches[0]);
	var pagenavigator = document.getElementById("pagenavigator");
	pagenavigator.addEventListener("touchmove",touchMoveHandle,false);
	pagenavigator.addEventListener("touchend",touchUpHandle,false);
};

function touchMoveHandle(event){
	event.stopPropagation();
	event.preventDefault();
	//console.log("touch move");
	//pageNavigatorTouch.end = event.originalEvent.touches[0];
	pageNavigatorTouch.end = event.touches[0];
	movePercent = ((pageNavigatorTouch.end.pageX - pageNavigatorTouch.start.pageX) / viewport.width) * 100;
	//console.log("distance : " +pageNavigatorTouch.start.pageX);
	////console.log("=> movePercent : ", movePercent);
	$("#pagenavigator").css({
		"-webkit-transform": "translate3d("+ (movePercent/3) +"% ,0 ,0)",
		"transform": "translate3d("+ (movePercent/3) +"% ,0 ,0)"
		//left : -100 + movePercent +"%"
	});
};

function touchUpHandle(event){
	event.stopPropagation();
	event.preventDefault();
	//console.log("touch end")
	//$("#pagenavigator").off("touchmove", touchMoveHandle);
	var pagenavigator = document.getElementById("pagenavigator");
	pagenavigator.removeEventListener("touchmove",touchMoveHandle);
	pagenavigator.removeEventListener("touchend",touchUpHandle);
	
	try{
		var distance = (pageNavigatorTouch.end.pageX - pageNavigatorTouch.start.pageX);
		//console.log("distance : " + distance);
		movePercent = (distance / viewport.width) * 100;
		//swipe or slide
		isSwipe = ((Date.now() - pageNavigatorTouch.startTimer) < 250) && (Math.abs(distance) > 75) ? true : false;
		////console.log("=> movePercent : ", movePercent);
		$("#pagenavigator").addClass("slide-animation");
		if (Math.abs(movePercent) < 40){
			if(isSwipe){
				preformPageSlide(movePercent);
			}else{
				pageSlideReset();
			}
		} else {
			preformPageSlide(movePercent);
		};
		pageNavigatorTouch.end = pageNavigatorTouch.start = null;
	} catch(e){
	
	}
};

function preformPageSlide(movePercent){
	//console.log("pageSlide");
	if(movePercent < 0){
		pageSlideLeft();
	} else {
		pageSlideRight();		
	}
};

function pageSlideReset(){
	$("#pagenavigator").css({
		"transform": "translate3d(0,0,0)",
		"-webkit-transform": "translate3d(0,0,0)"
	});
}
function pageSlideLeft(){	
	$("#pagenavigator").css({
		"transform": "translate3d(-33.3%,0,0)",
		"-webkit-transform": "translate3d(-33.3%,0,0)"
	}).one(window.transitionEnd, function(event){
		event.stopPropagation();
		event.preventDefault();
		//console.log("transition ended");
		var nextCard = $("#nextCardHolder div").data("cardInfo");
		showCard(nextCard);
	});
	//console.log('slideLeft: end');
}
function pageSlideRight(){
	//console.log('slideRight');
	$("#pagenavigator").one(window.transitionEnd, function(event){
		event.stopPropagation();
		event.preventDefault();
		//console.log("transition ended");
		var previousCard = $("#previousCardHolder div").data("cardInfo");
		showCard(previousCard);
	}).css({
		"transform": "translate3d(33.3%,0,0)",
		"-webkit-transform": "translate3d(33.3%,0,0)"
	});
}
function loadCards(){
	$.getJSON("data/data.json",function(data){
		//console.log("success loading data")
		try{
			//console.log(data.kaarten.length + "cards loaded");
			cards = data.kaarten;
			//setupNavigation();
			processCardData();
		} catch(err){
			//console.error(err);
		}
		//app.setupNavigation();
	})
	.fail(function() {
		console.error( "error loading data" );
	})
}

function showCard(cardInfo){
	//console.log("showCard");
	var mainCardIndex		= cards.indexOf(cardInfo),
		nextCardIndex 		= mainCardIndex+1 > cards.length ? -1 : mainCardIndex+1,
		previousCardIndex 	= mainCardIndex-1;
	
	$("#pagenavigator").removeClass("slide-animation"); //disable animation
	////console.log("showCards : ", previousIndex, mainIndex, nextIndex);
	$("#menu .pure-menu-selected").removeClass("pure-menu-selected");
	
	$('[href="#'+cardInfo.id+'"]').parent().addClass("pure-menu-selected");	
	
	switch (cardInfo){
		case $("#nextCardHolder").data("cardInfo"):		//next card is selected
				$("#preloader").append($("#previous div"));	//store in carddeck
				$("#previousCardHolder").append($("#mainCardHolder div"));
				$("#mainCardHolder").append($("#nextCardHolder div"));
				pageSlideReset();
				$("#nextCardHolder").append($("#"+cards[nextCardIndex].id));
			break;
		case $("#previousCardHolder").data("cardInfo"):	// previous card is selected
				$("#preloader").append($("#nextCardHolder div"));	//store in carddeck
				$("#nextCardHolder").append($("#mainCardHolder div"));
				$("#mainCardHolder").append($("#previousCardHolder div"));
				pageSlideReset();
				$("#previousCardHolder").append($("#"+cards[nextCardIndex].id));	
			break;
		default:							// no card selected
				$("#preloader").append($("#nextCardHolder div, #mainCardHolder div, #previousCardHolder div"));	//store in carddeck
				$("#mainCardHolder").append($("#"+cards[mainCardIndex].id));
				pageSlideReset();
				try{
					$("#previousCardHolder").append($("#"+cards[previousCardIndex].id));
				} catch(err) {
				}
				try{
					$("#nextCardHolder").append($("#"+cards[nextCardIndex].id));	
				} catch(err) {
				}
					
			break;
	}
	
}

function processCardData(){
	//console.log('processCardData')
	var prevCardId = "", nextCardId = "";
	$.each(cards, function(index, value){
		if(index != cards.length-1){
			nextCardId = cards[index+1].naam;
		} else {
			nextCardId = "";
		}
		//addCardPage(value, {prev : prevCardId, next : nextCardId});
		addCardlinkToNavigation(value);
		prevCardId = value.naam;
	});
	//setTimeout( function(){$.mobile.changePage( "#"+cards[0].naam );}, 2500);
	showCard(cards[0]);
};
function addCardlinkToNavigation(card){
	//console.log('addCardlinkToNavigation')

	$( "<li><a href='#"+card.id+"'>"+card.titel+"</a></li>" ).appendTo( "#cardsnavigation ul" ).on("click", loadCard);
	$("<div id='"+card.id+"' class='block' style='background-image:url("+card.image+")'>").appendTo("#preloader");
	$("#"+card.id).data("cardInfo",card);

};

function loadCard(event){
	event.preventDefault();
	event.stopPropagation();
	//console.log('click', event);
	if($('#layout').hasClass('active')){
		showCard($($(event.target).attr('href')).data("cardInfo"));
		$('#layout, #menu, #menulink').toggleClass('active');
	}
}




