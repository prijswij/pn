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
	$("pagenavigator").on("touchstart", touchDownHandle);

	loadCards();
	
});

function touchDownHandle(event){
	event.preventDefault();
	console.log("touch start");
	pageNavigatorTouch.startTimer = Date.now();
	$("pagenavigator").removeClass("slide-animation");
	pageNavigatorTouch.start = event.originalEvent.touches[0];
	$("pagenavigator").on("touchmove", touchMoveHandle);
	$("pagenavigator").one("touchend", touchUpHandle);
};

function touchMoveHandle(event){
	//console.log("touch move");
	pageNavigatorTouch.end = event.originalEvent.touches[0];
	movePercent = ((pageNavigatorTouch.end.pageX - pageNavigatorTouch.start.pageX) / viewport.width) * 100;
	//console.log("=> movePercent : ", movePercent);
	$("pagenavigator").css({
		"-webkit-transform": "translate3d("+ (movePercent/3) +"% ,0,0)"
		//left : -100 + movePercent +"%"
	});
};

function touchUpHandle(event){
	console.log("touch end")
	movePercent = ((pageNavigatorTouch.end.pageX - pageNavigatorTouch.start.pageX) / viewport.width) * 100;
	//swipe or slide
	isSwipe = (Date.now() - pageNavigatorTouch.startTimer) < 250 ? true : false;
	//console.log("=> movePercent : ", movePercent);
	$("pagenavigator").addClass("slide-animation");
	if (Math.abs(movePercent) < 50){
		if(isSwipe){
			preformPageSlide(movePercent);
		}else{
			pageSlideReset();
		}
	} else {
		preformPageSlide(movePercent);
	};
	
	$("pagenavigator").off("touchmove", touchMoveHandle);
};

function preformPageSlide(movePercent){
	if(movePercent < 0){
		pageSlideLeft();
	} else {
		pageSlideRight();		
	}
};

function pageSlideReset(){
	$("pagenavigator").css({
		"-webkit-transform": "translate3d(0%,0,0)"
	});
}
function pageSlideLeft(){
	console.log('slideLeft');
	$("pagenavigator").one("transitionend webkitTransitionEnd MSTransitionEnd oTransitionEnd", function(event){
		var nextCard = $("#nextCardHolder div").data("cardInfo");
		console.log(nextCard);
		
		showCard(nextCard);
	}).css({
		"-webkit-transform": "translate3d(-33.3%,0,0)"
	});
}
function pageSlideRight(){
	console.log('slideRight');
	$("pagenavigator").one("transitionend webkitTransitionnEnd MSTransitionEnd oTransitionEnd", function(event){
		var previousCard = $("#previousCardHolder div").data("cardInfo");
		console.log(previousCard);
		
		showCard(previousCard);
	}).css({
		"-webkit-transform": "translate3d(33.3%,0,0)"
	});
}
function loadCards(){
	$.getJSON("data/data.json",function(data){
		console.log("success loading data")
		try{
			console.log(data.kaarten.length + "cards loaded");
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
	console.log("showCard");
	var mainCardIndex		= cards.indexOf(cardInfo),
		nextCardIndex 		= mainCardIndex+1 > cards.length ? -1 : mainCardIndex+1,
		previousCardIndex 	= mainCardIndex-1;
	
	$("pagenavigator").removeClass("slide-animation"); //disable animation
	console.log("showCards : ", previousIndex, mainIndex, nextIndex);
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
	console.log('processCardData')
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
	console.log('addCardlinkToNavigation')

	$( "<li><a href='#"+card.id+"'>"+card.id+"</a></li>" ).appendTo( "#cardsnavigation ul" );
	$("<div id='"+card.id+"' class='block' style='background-image:url("+card.image+")'>").appendTo("#preloader");
	$("#"+card.id).data("cardInfo",card);

};



