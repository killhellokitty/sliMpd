var playerMode = $.cookie("playerMode");

$(document).ready(function(){
	
	$('body').on('click', '.ajax-link', function(){
		var localObj = $(this).attr('data-localplayer');
		if(typeof localObj == 'undefined' || playerMode !== 'local') {
			$.ajax({
				url: $(this).attr('href')
			}).done(function(response){
				// TODO: notify or replace content
				refreshInterval();
			});
		} else {
			try{
		        var a = JSON.parse(localObj);
		        localPlayer(a);
		    }catch(e){
		    	console.log(e + ' in data-localplayer attribute');
		    }
		}
		return false;
	});
	
	
	/* toggle between mpd-control and local player (jPlayer) */
	  $('.playerModeToggle a').on('click', function(e) {
	  	e.preventDefault();
	  	if($(this).hasClass('active-mpd') === true) {
	  		$(this).addClass('active-local').removeClass('active-mpd').html($(this).attr('data-label-local'));
	  		playerMode = "local";
	  	} else {
	  		$(this).addClass('active-mpd').removeClass('active-local').html($(this).attr('data-label-mpd'));
	  		playerMode = "mpd";
	  		// pause local player when switching to mpd
	  		setPlayPauseState('pause');
	  	}
	  	$.cookie("playerMode", playerMode, { expires : 365, path: '/' });
	  	$('.player-local,.player-mpd').toggle();
	  	drawFavicon(false, false);
	  });
	  
	  $('#global-modal').on('click', '.playerModeToggleTrigger', function(e) {
	  	e.preventDefault();
	  	$('.playerModeToggle a').trigger('click');
	  });
	  

	$('.trigger-modal').click(function (e) {
        e.preventDefault();
        $.ajax({
			url: $(this).attr('href')
		}).done(function(response){
			$('#global-modal .modal-content').html(response);
			$('#global-modal').modal('show');
		});
    });
    
    
	/* route /maintainance/albumdebug */
    $('.inline-tab-nav a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });
    $(".grid").sortable({
        tolerance: 'pointer',
        revert: 'invalid',
        placeholder: 'span2 well placeholder tile',
        forceHelperSize: true
    });
    
	
	$(".dropdown-toggle").dropdown();
	
	$('[data-toggle="popover"]').popover(); 
});

/* TODO: fix non-working popover inside modalbox ... */
$(document).ajaxComplete(function() {
  $("a[data-toggle=\"popover\"]").popover();
});


function drawFavicon(percent, state) {
	
	var doghnutColor = '#278DBA';
	var overlay;
	var titleText;
	if(playerMode === 'mpd') {
		overlay = (state == 'play')? 'play' : 'pause';
		titleText = $('.player-mpd .now-playing-string').text();
	} else {
		var localPlayerStatus = $('#jquery_jplayer_1').data('jPlayer').status;
		//console.log(localPlayerStatus);
		percent = localPlayerStatus.currentPercentAbsolute;
		overlay = (localPlayerStatus.paused == false)? 'play' : 'pause';
		doghnutColor = 'rgb(45,146,56)';
		titleText = $('.player-local .now-playing-string').text();
	}
	
	FavIconX.config({
		updateTitle: false,
		shape: 'doughnut',
		doughnutRadius: 7.5,
		overlay: overlay,
		overlayColor: '#777',
		borderColor: doghnutColor,
		fillColor: doghnutColor,
		titleRenderer: function(v, t){
			return titleText;
		}
	}).setValue(percent);
}

//  +------------------------------------------------------------------------+
//  | Formatted time                                                         |
//  +------------------------------------------------------------------------+
function formatTime(seconds) {
	var seconds 	= Math.round(seconds);
	var hour 		= Math.floor(seconds / 3600);
	var minutes 	= Math.floor(seconds / 60) % 60;
	seconds 		= seconds % 60;
		
	if (hour > 0)	return hour + ':' + zeroPad(minutes, 2) + ':' + zeroPad(seconds, 2);
	else			return minutes + ':' + zeroPad(seconds, 2);
}




//  +------------------------------------------------------------------------+
//  | Zero pad                                                               |
//  +------------------------------------------------------------------------+
function zeroPad(number, n) { 
	var zeroPad = '' + number;
	
	while(zeroPad.length < n)
		zeroPad = '0' + zeroPad; 
	
	return zeroPad;
}

