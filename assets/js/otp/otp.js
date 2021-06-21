// ================================================================
//  otp.js ---- JavaScript User Interface application
//  Copyright 2013 OTPubs <mgreer@otpubs.com>
//  http://www.otpubs.com
// ================================================================

if ( typeof(OTP) == 'undefined' ) OTP = function(){};

OTP.title_data = ""; // Holds the content gleaned from the data_language.xml file
OTP.bg_images_data = ""; // Holds the content from the bg_images.xml file
OTP.colors_ar = [];
OTP.previous_pane_data = "";
OTP.current_pane_data = "";

$.fn.hasScrollBar = function() {
	return this.get(0).scrollHeight > this.height();
}

// ================================================================
OTP.introExit = function(e){
	$( "#language_menu" ).remove();
	$( "#intro_area" ).remove();
	otpMainMenu.create();
	//setTimeout(function() { otpContentPane.create(); }, 1000);
	//setTimeout(function() { otpBackground.create(); }, 1000);
	 otpContentPane.create();
	 otpBackground.create();
	}
// ================================================================
OTP.BackgroundGallery = function(){
	console.log("Instantiating OTP.BgGalleryPane");
	this.pane_state = "closed";
	this.tl_thumb_container = new TimelineLite();
	this.speed = 0;
	this.tcw = 0;
	//
	//
	//
	this.displayPane = function(){
		if(otpBackground.pane_state != "open"){
			var tl = new TimelineLite({onComplete:function(){otpBackground.setPaneState("open");}});
			tl.to($("#bg_gallery_pane"), 1, {css:{"top":"0px"},ease:Power3.easeOut}, 0.1);
		}
		$(".bg_gallery_tab img").attr("src","assets/pics/tab_arrow_up.png");
	}
	//
	//
	//
	this.hidePane = function(){
		if(otpBackground.pane_state != "closed"){
			var tl = new TimelineLite({onComplete:function(){otpBackground.setPaneState("closed");} });
			tl.to($("#bg_gallery_pane"), 1, {css:{"top":"-70px"},ease:Power3.easeOut}, 0);
		}
		$(".bg_gallery_tab img").attr("src","assets/pics/tab_arrow_down.png");
	}
	//
	//
	//
	this.setPaneState = function(state){
		this.pane_state = state;
		otpBackground.activateTab();
	}
	//
	//
	//
	this.getPaneState = function(state){
		return this.pane_state;
	}
	//
	//
	//
	this.togglePane = function(){
		console.log("togglePane ");
		if(otpBackground.getPaneState() == "open"){
			this.hidePane();
		}else{
			this.displayPane();
		}
	}
	//
	//
	//
	this.activateTab = function(){
		$(".bg_gallery_tab").on("click",function(event){
			$(this).unbind("click");
			otpBackground.togglePane();
		});
	}
	//
	//
	//
	this.create = function(){
		console.log("Creating BackgroundGallery");
		// Create the gallery thumbnail pane for selecting background display images
		// 7 - 10 - 340 - 10 - 143
		$("#interface_area").prepend('\
			<div id="bg_gallery_pane">\
				<div class="bg_gallery_bg"></div>\
					<div class="bg_gallery_tab"><div class="bg_gallery_tab_bg"></div><img src="assets/pics/tab_arrow_down.png"/></div>\
					<div class="bg_gallery_btn_panright"><img src="assets/pics/arrow_left.png"/></div>\
					<div class="bg_gallery_mask"><div class="bg_gallery_thumb_container"></div></div>\
					<div class="bg_gallery_btn_panleft"><img src="assets/pics/arrow_right.png"/></div>\
					<div class="bg_gallery_title"><strong>'+ OTP.title_data["BrandInterface"]["gallery"]["title"] +'</strong><div class="note">'+ OTP.title_data["BrandInterface"]["gallery"]["note"] +'</div></div>\
			</div>\
		<div id="bg_gallery"><div class="bg_top"><img src="assets/pics/bg_1.jpg "/></div></div>');
		// Add color styles

$(".bg_gallery_pane_bg").css({'background-color':OTP.colors_ar['galleryPaneColorValue'],"width":$("#content_pane").width()+"px","height":$("#content_pane").height()+"px"});
		$(".bg_gallery_bg").css({'background-color':OTP.colors_ar['galleryPaneColorValue']});
		$(".bg_gallery_tab_bg").css({'background-color':OTP.colors_ar['galleryPaneColorValue']});
		$(".bg_gallery_btn_panleft").bind('touchstart mousedown', function(){
			console.log("Panning left" );
			otpBackground.tl_thumb_container.play();
		}).bind('touchend mouseup', function(){
			console.log("Stopped Panning left");
			otpBackground.tl_thumb_container.pause();
		});

		$(".bg_gallery_btn_panright").bind('touchstart mousedown', function(){
			console.log("Panning right" );
			otpBackground.tl_thumb_container.reverse();
		}).bind('touchend mouseup', function(){
			console.log("Stopped Panning right");
			otpBackground.tl_thumb_container.pause();
		});
    
    	$(".bg_gallery_tab").on("click",function(event){
			$(this).unbind("click");
			otpBackground.togglePane();
		});
		otpBackground.loadBackgroundImagesFile();
	}
	this.completeBackgroundUpdate = function(){
		$("#bg_gallery .bg_top").remove();
		$("#bg_gallery .bg_bottom").removeClass("bg_bottom").addClass("bg_top");
		$(".bg_gallery_thumb").on("click",otpBackground.addBgGalleryThumbClickEvent );
	}
	this.updateBackgroundImage = function(img){
		// Insert the new image w/in a div then fade out and remove the bg_top.
		console.log("Updating background image: "+img);
		// $("#bg_gallery").prepend("<div class='bg_bottom'><img src='"+img+"'/></div>" );
		$("#bg_gallery").prepend("<div class='bg_bottom'><img src=''/></div>" );
		
		// Wait for image to load completely before attempting to fade out the image above it.
		var newimg = $(".bg_bottom img").attr('src', img ).load(function() {
			if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
				alert('image not available');
			} else {
				console.log(".gallery_bottom img loaded");
				var tl = new TimelineLite({onComplete:otpBackground.completeBackgroundUpdate});
				tl.to($("#bg_gallery .bg_top"), 1, {css:{"opacity":"0"},ease:Power3.easeOut}, 0);
			}
		});
		
		/*
		var tl = new TimelineLite({onComplete:otpBackground.completeBackgroundUpdate});
		tl.to($("#bg_gallery .bg_top"), 0.8, {css:{"opacity":"0"},ease:Power3.easeOut}, 0);
		*/
	}
	this.addThumbs = function(){
		console.log("Adding le Thumbs");
		// Add the thumbnail images
		// for each in gallery, add thumbnail
		var timer = OTP.bg_images_data["gallery"]["timer"];
		var fadetime = OTP.bg_images_data["gallery"]["fadetime"];
		// console.log( OTP.bg_images_data["gallery"]["image"].length );
		for(var i in OTP.bg_images_data["gallery"]["image"]){
			// console.log("assets/pics/"+ OTP.bg_images_data["gallery"]["image"][i]["img"] +"_thumb.jpg");
			var thumb_width = i * 64 + 64;
			$(".bg_gallery_thumb_container").width(thumb_width);
			$(".bg_gallery_thumb_container").append( '<img class="bg_gallery_thumb" src="assets/pics/'+OTP.bg_images_data["gallery"]["image"][i]["img"]+'_thumb.jpg">' );
		}
		this.addBgGalleryThumbClickEvent = function(event){
			$(".bg_gallery_thumb").unbind("click");
			console.log("Background Gallery Image: "+event.target);
			var img = $(this).attr("src");
			var s_ar = img.split("_thumb");
			img = s_ar[0]+".jpg";
			console.log( img );
			otpBackground.updateBackgroundImage(img);
		}
		$(".bg_gallery_thumb").on("click",otpBackground.addBgGalleryThumbClickEvent );
	}
	this.setThumbContainerScroll = function(){
		otpBackground.speed = $(".bg_gallery_thumb").length /4;
		otpBackground.tcw = -$(".bg_gallery_thumb_container").width()+(5*64)+"px";
		console.log("otpBackground.tcw: " + otpBackground.tcw);
		otpBackground.tl_thumb_container.to( $(".bg_gallery_thumb_container"), otpBackground.speed, {css:{"left":otpBackground.tcw},ease:Power0.easeInOut}, 0);
		otpBackground.tl_thumb_container.pause();
	}
	//
	//
	//
	this.loadBackgroundImagesFile = function(){
		var url = "assets/xml/bg_images.xml";
		var xml = new JKL.ParseXML( url );
		OTP.bg_images_data = xml.parse();	
		otpBackground.addThumbs();
		otpBackground.setThumbContainerScroll();
		// Show the first big background image
		var first_bg_img = "assets/pics/"+OTP.bg_images_data["gallery"]["image"][1]["img"]+".jpg";
		$("#bg_gallery").css({"opacity":"0"});
		$("#bg_gallery").css('background-image','url('+first_bg_img+')')
		  .waitForImages(function() {
			// alert('Background image done loading');
			// This *does* work
			var tl = new TimelineLite();
			tl.to($("#bg_gallery"), 1.2, {css:{"opacity":"1"},ease:Power3.easeOut}, 0);
	  	}, $.noop, true);
	}
}
// ================================================================
OTP.ContentPane = function(){
	console.log("Instantiating OTP.ContentPane");
	this.current_pane = "";
	this.previous_pane = "";
	this.pane_state = "closed";
	this.pane_history = [];
	//
	//
	//
	this.isRootPane = function(){
		return (otpContentPane.pane_history.length == 1)? true : false;
	}
	//
	//
	//
	this.displayFirstPane = function(){
		console.log("displayFirstPane()");
		OTP.current_pane_data = OTP.title_data["BrandInterface"]["section_group"]["section"][0];
		var pane_type = OTP.current_pane_data["contentPaneType"];
		otpContentPane.pane_history.push(OTP.current_pane_data);
		otpContentPane.routeToPaneType(pane_type);
	}
	//
	// For routing a mainmenu btn
	//
	this.showTopLevelPane = function(event){
		console.log("showTopLevelPane()");
		var menu_number = event.target  + '';
		var t_ar = menu_number.split("/");
		menu_number = t_ar[t_ar.length-1];
		
		$(".mainNavBtn_"+otpMainMenu.main_nav_selected+" img.leftNav_arrow_left").css("visibility","hidden");
		$(".mainNavBtn_"+menu_number+" .leftNav_arrow_left").css("visibility","visible");
		otpMainMenu.main_nav_selected = menu_number;
		
		OTP.current_pane_data = OTP.title_data["BrandInterface"]["section_group"]["section"][menu_number];
		otpContentPane.pane_history.length = 0;
		otpContentPane.pane_history.push(OTP.current_pane_data);

		var pane_type = OTP.current_pane_data["contentPaneType"];
		otpContentPane.routeToPaneType(pane_type);
	}
	//
	// Called by a section_btn click event
	//
	this.preparePaneShow = function(pane_num,pane_count){
		console.log("preparePaneShow pane_num:"+pane_num+", pane_count:  "+pane_count);	
		console.log("preparePaneShow current_pane_data:");
		console.log(OTP.current_pane_data);
		
		otpContentPane.pane_history.push(OTP.current_pane_data);
		if( pane_count > 1){
			OTP.current_pane_data = OTP.current_pane_data["section_group"]["section"][pane_num];
		}else{			
			OTP.current_pane_data = OTP.current_pane_data["section_group"]["section"];
		}
		//var pane_type = OTP.current_pane_data["contentPaneType"];
		var is_root_pane = false;
		otpContentPane.routeToPaneType(OTP.current_pane_data["contentPaneType"], is_root_pane);
	}
	//
	// Called by the a Return btn click event
	//
	this.prepareParentPaneShow = function(){
		// Extract pane type from history obj
		
		OTP.current_pane_data = otpContentPane.pane_history.pop();
		console.dir(OTP.current_pane_data);
		// Determine if this is a root pane or not (is history now 1)
		if( otpContentPane.pane_history.length == 1){
			console.log("This is a top-level main-menu pane");
			var is_root_pane = true;
		}else{		
			var is_root_pane = false;
		}
		//
		console.log(OTP.current_pane_data["name"]);
		otpContentPane.routeToPaneType(OTP.current_pane_data["contentPaneType"]);
	}
	//
	//
	//
	this.routeToPaneType = function(pane_type){
		console.log("routeToPaneType()");
		switch (pane_type) {
		  case "A":
		  	// Original layout includes Title, Copy, Subsections, Links, each in their own row, btns taking up two columns.
			otpContentPane.showPaneA();
			break;
		  case "B":
			// Optional sectionImage. Copy on right. Two columns. Section btns on left, Link btns on right.
			otpContentPane.showPaneB();
			break;
		  case "C":
		  	// Options sectionImage. Section btns & Link btns are on the left. Copy is on the right.
			otpContentPane.showPaneC();
			// Look at "Land Rover" section in http://localhost/otpubs/The_Interface/Flash%20Interface/WEB.09.01.21/deploy/index.htm
			break;
		  case "D":
		  	// Optional sectionImage.
			otpContentPane.showPaneD();
			// Look at "Land Rover" section in http://localhost/otpubs/The_Interface/Flash%20Interface/WEB.09.01.21/deploy/index.htm
			break;
		  case "E":
		  	// Photo Gallery - was SlideShowPro in Flash
			otpContentPane.showPaneE();
			break;
		  case "W":
		  	// Wallpapers or Downloads
			otpContentPane.showPaneW();
			break;
		  case "Q":
		  	// Quit or Exit app
			otpContentPane.showPaneQ();
			break;
		}
		return false;
	}
	//
	//
	//
	this.displayPane = function(){
		console.log("••• displayPane •••");
		if(otpContentPane.pane_state != "open"){
			var tl = new TimelineLite({onComplete:function(){otpContentPane.setPaneState("open");}});
			tl.to($("#content_pane"), 0.5, {css:{"bottom":"340px"},ease:Power3.easeOut}, 0.0);
		}
		$(".content_tab img").attr("src","assets/pics/tab_arrow_down.png");
	}
	//
	//
	//
	this.hidePane = function(){
		if(otpContentPane.pane_state != "closed"){
			var tlh = new TimelineLite({onComplete:function(){otpContentPane.setPaneState("closed");} });
			tlh.to($("#content_pane"), 0.5, {css:{"bottom":"0px"},ease:Power3.easeOut}, 0);
		}
		$(".content_tab img").attr("src","assets/pics/tab_arrow_up.png");
	}
	//
	//
	//
	this.setPaneState = function(state){
		this.pane_state = state;
		otpContentPane.activateTab();
	}
	//
	//
	//
	this.getPaneState = function(state){
		return this.pane_state;
	}
	//
	//
	//
	this.togglePane = function(){
		if(otpContentPane.getPaneState() == "open"){
			this.hidePane();
		}else{
			this.displayPane();
		}
	}
	//
	//
	//
	this.activateTab = function(){
		$(".content_tab").on("click",function(event){
			$(this).unbind("click");
			otpContentPane.togglePane();
		});
	}
	
	this.createLink = function(kind){
		console.log("createLink: "+kind);
		if(kind == "webpage"){
			return '<img src="assets/pics/globe.png" width="19" height="19"/>';
		}
		if(kind == 'file'){
			return '<img src="assets/pics/PDF.png" width="19" height="19"/>';
		}
		if(kind == 'email'){
			return '<img src="assets/pics/email.png" width="19" height="19"/>';
		}
	}
	this.showHeights = function(){
		var total_content_h = 0;
		console.log("••• showHeights •••");
		
		if(typeof $(".content")[0] != "undefined"){
			rect =  $(".content")[0].getBoundingClientRect();
			var h = Number(rect.bottom - rect.top);
			var w = Number(rect.right - rect.left);
			console.log("content: "+h+", w: "+w);
			console.log("content.height: "+ $(".content").height() );
		}

		var rect = $(".content h1")[0].getBoundingClientRect();
		var h = Number(rect.bottom - rect.top);
		var w = Number(rect.right - rect.left);				
		console.log("content h1: "+h+", w: "+w);
		total_content_h = total_content_h + h;

		if(typeof $(".content .back_btn")[0] != "undefined"){		
			rect =  $(".content .back_btn")[0].getBoundingClientRect();
			var h = Number(rect.bottom - rect.top);
			var w = Number(rect.right - rect.left);
			console.log("content back_btn: "+h+", w: "+w);
			total_content_h = total_content_h + h;
		}

		if(typeof $(".content p")[0] != "undefined"){		
			rect =  $(".content p")[0].getBoundingClientRect();
			var h = Number(rect.bottom - rect.top);
			var w = Number(rect.right - rect.left);				
			console.log("content p h: "+h+", w: "+w);
			total_content_h = total_content_h + h;
		}
		
		if(typeof $(".content .section_btn_group")[0] != "undefined"){
			rect =  $(".content .section_btn_group")[0].getBoundingClientRect();
			var h = Number(rect.bottom - rect.top);
			var w = Number(rect.right - rect.left);		
			console.log("content section_btn_group h: "+h+", w: "+w);
			total_content_h = total_content_h + h;
		}
		
		if(typeof $(".content .section_link_group")[0] != "undefined"){
			rect =  $(".content .section_link_group")[0].getBoundingClientRect();
			var h = Number(rect.bottom - rect.top);
			var w = Number(rect.right - rect.left);
			console.log("content section_link_group h: "+h+", w: "+w);
			total_content_h = total_content_h + h;
		}
		
		if(typeof $(".content .btn_group")[0] != "undefined"){
			rect =  $(".content .btn_group")[0].getBoundingClientRect();
			var h = Number(rect.bottom - rect.top);
			var w = Number(rect.right - rect.left);		
			console.log("content btn_group h: "+h+", w: "+w);
			total_content_h = total_content_h + h;
			$(".btn_group .pane_btn").width("228px");
		}
		
		console.log("••• ••• total_content_h: "+total_content_h)
		if(total_content_h > $(".content").height()){
			console.log("Scroll bar is visible");
			// now narrow each pane_btn by ???
			$(".section_btn_group .pane_btn").width("228px");
			$(".section_link_group .pane_btn").width("228px");
			$(".btn_group .pane_btn").width("228px");
			$(".column1 .pane_btn").width("228px");
			$(".column2 .pane_btn").width("228px");
		}
	}
	
	//
	//	showPaneA
	//
	this.showPaneA = function(){
		console.log("******************\nentering showPaneA"); 
		console.log("history length: "+otpContentPane.pane_history.length);
		
		var section_name = "";
		var section_copy = "";
		
		var section_btns_obj = OTP.current_pane_data["section_group"];
		var section_links_obj = OTP.current_pane_data["links"];

		var section_btns = "";
		var section_links = "";
		
		if(typeof OTP.current_pane_data["name"] != "undefined"){section_name = OTP.current_pane_data["name"];}
		if(typeof OTP.current_pane_data["copy"] != "undefined"){
			section_copy = OTP.current_pane_data["copy"]+"<br/>";
		}else{
			section_copy = "";
		}

		// Convert the newline chars in the copy to html breaks
		if(typeof section_copy !== "undefined"){
			section_copy = section_copy.replace(/\r\n/g, '<br />').replace(/[\r\n]/g, '<br />');
		}
		
		// Hide the content already in the pane
		$(".content").fadeOut( "fast", function() {
   			// fadeout complete, build the new content
   			
   			$(".content").empty();
   			console.log("### content outerheight after empty: "+$(".content").outerHeight(true));
   			
   			var root_pane = (otpContentPane.pane_history.length !== 1)? false : true;
   			if(root_pane){
   				$(".content").prepend('<h1>'+section_name+'</h1><p>'+section_copy+'</p>');
 			}else{
   				$(".content").prepend('<h1>'+section_name+'</h1>\
   				<div class="back_btn_container"><div id="back_btn" class="pane_btn"><a href="">'+OTP.title_data["BrandInterface"]["back_button"]["label"]+'</a></div></div>\
   				<p>'+section_copy+'</p>');
 			}
			/***********************************************/
			// SECTION BTN GROUP
			// Check for section_group and display section btns if group exists
			if(typeof section_btns_obj !== 'undefined'){
				$(".content").append('<div class="section_btn_group"></div>');
				
				//console.log("section-btns_obj length: "+typeof section_btns_obj["section"].length);
				
				if( typeof section_btns_obj["section"].length === 'undefined' ){
					// One sub-section, so one section button
					console.log("We have ONE section_btn: ");
					console.dir(section_btns_obj["section"]);
					if(typeof section_btns_obj["section"]["name"] != "undefined"){
						section_btns += '<div class="pane_btn" data-pane_num="0" data-pane_count="1">'+section_btns_obj["section"]["name"]+'</div>';
					}
					$(".section_btn_group").append("<div class='column1'>"+section_btns+"</div>");
				}else{
					// Many sub-sections, many section buttons
					console.log("We DO have SEVERAL("+ section_btns_obj["section"].length +") section_btns! first one is:");

					$(".section_btn_group").append('<div class="column1"></div> <div class="column2"></div> ');

					var count = section_btns_obj["section"].length;

					for(i=0; i < section_btns_obj["section"].length; i++){
						if(section_btns_obj["section"][i]["name"] != "undefined"){
							if(i%2 === 0){
								$(".section_btn_group .column1").append('<div class="pane_btn" data-pane_num="'+i+'" data-pane_count="'+count+'"> '+ section_btns_obj["section"][i]["name"]+'</div>');							
							}else{
								$(".section_btn_group .column2").append('<div class="pane_btn" data-pane_num="'+i+'" data-pane_count="'+count+'"> '+ section_btns_obj["section"][i]["name"]+'</div>');							
							}
						}
					}
				}
			}else{
				console.log("We DO NOT have section_btns!");
			}
			/************************************************/
			//
			// Activate the back button
			//
			$("#back_btn").on("click", function(event){
				// return to load the pane with: otpContentPane.pane_history.pop();
				otpContentPane.prepareParentPaneShow();
				return false;
			});
			//
			// Activate all the section buttons to the click event
			//
			$(".section_btn_group .pane_btn").on("click", function(event){
				var pane_num = $(event.target).attr("data-pane_num");
				var pane_count = $(event.target).attr("data-pane_count");
				console.log("onClick clicked: .pane_btn data-pane_count:"+pane_count+", data-pane_num:"+pane_num);
				otpContentPane.preparePaneShow(pane_num,pane_count);
				event.preventDefault();
				return false;
			});
			//
			// Pass click through the button labels
			//
			/*
			$(".section_btn_group .pane_btn a").on("click", function(event){
				console.log("triggering click on section_btn_group pane_btn");
				event.preventDefault();
				$(this).parent().trigger("click");
			});
			*/

			/***********************************************/
			//
			// LINKS
			// 
			if(section_links_obj){
				
				var link = "";
				
				$(".content").append('<div class="section_link_group"><div class="column1"></div> <div class="column2"></div></div>');
				
				if( typeof section_links_obj["link"].length === 'undefined' ){
					// there is only one link
					
					var kind = section_links_obj["link"]["kind"];
					link = '<div class="pane_btn">';
					
					console.log("We have ONE section_link: "+ kind);

					if(kind == "webpage"){
						link += '<img src="assets/pics/globe.png" width="19" height="19"/>';
					}
					if(kind == 'file'){
						link += '<img src="assets/pics/PDF.png" width="19" height="19"/>';
					}
					if(kind == 'email'){
						link += '<img src="assets/pics/email.png" width="19" height="19"/>';
					}
					link += '<a href="'+section_links_obj["link"]["location"]+'" target="_blank"><div>'+section_links_obj["link"]["name"]+'</div></a></div>';

					$(".section_link_group").append(link);
				}else{

					// there is more than one link

					for(var i=0; i < section_links_obj["link"].length; i++){
						var kind = section_links_obj["link"][i]["kind"];

						link = '<div class="pane_btn wordwrap">';
						
						if(kind == "webpage"){
							link += '<img src="assets/pics/globe.png" width="19" height="19"/>';
						}
						if(kind == 'file'){
							link += '<img src="assets/pics/PDF.png" width="19" height="19"/>';
						}
						if(kind == 'email'){
							link += '<img src="assets/pics/email.png" width="19" height="19"/>';
						}
						// Perhaps determine width of label text so as to chop it
						// console.log("link text length: "+section_links_obj["link"][i]["name"].length);
						
						if(i%2 === 0){
							link += '<a class="wordwrap" href="'+ section_links_obj["link"][i]["location"] +'" target="_blank">' + section_links_obj["link"][i]["name"] + '</a></div>';
							$(".section_link_group .column1").append(link);
						}else{
							link += '<a class="wordwrap" href="'+ section_links_obj["link"][i]["location"] +'" target="_blank">' + section_links_obj["link"][i]["name"] + '</a></div>';
							$(".section_link_group .column2").append(link);
						}
					}
				}
				$(".section_link_group .pane_btn").bind("click", function(event){
					window.open( $(this).children('a').attr('href') );
					event.preventDefault();
				});
			}else{
				console.log("We DO NOT have section_links!");
			}
		}).fadeIn("fast", this.showHeights );
		
		this.displayPane();
	}
	//
	// Show Pane B
	//
	this.showPaneB = function(){
		console.log("******************\nentering showPaneB"); 
		console.log("history length: "+otpContentPane.pane_history.length);

		var section_name = "";
		var section_copy = "";
		var section_img_path = OTP.current_pane_data['sectionImage'];
		console.log("sectionImage: "+ section_img_path);
		console.log("paneType = " +   OTP.current_pane_data['contentPaneType']);
		var section_btns_obj = OTP.current_pane_data["section_group"];
		var section_links_obj = OTP.current_pane_data["links"];

		if(typeof OTP.current_pane_data["name"] != "undefined"){
			section_name = OTP.current_pane_data["name"];
		}
		if(typeof OTP.current_pane_data["copy"] != "undefined"){
			section_copy = OTP.current_pane_data["copy"]+"<br/>";
		}else{
			section_copy = "";
		}

		// Convert the newline chars in the copy to html breaks
		if(typeof section_copy !== "undefined"){
			section_copy = section_copy.replace(/\r\n/g, '<br />').replace(/[\r\n]/g, '<br />');
		}
		// Hide the content already in the pane
		$(".content").fadeOut( "fast", function() {
   			// fadeout complete, build the new content
			$(".content").empty();
			console.log(otpContentPane.pane_history.length);
   			// Test to show the back button
   			var root_pane = (otpContentPane.pane_history.length !== 1)? false : true;
   			if(!root_pane){ // then include the back button
   				if(section_img_path !== "underfined"){
					$(".content").prepend('<div class="" style="clear:both;display:block;overflow:auto;margin-bottom:6px;"><h1>'+section_name+'</h1>\
					<img src="./'+section_img_path+'" style="display:block;float:left;" />\
					<div class="back_btn_container"><div id="back_btn" class="pane_btn"><a href="">'+OTP.title_data["BrandInterface"]["back_button"]["label"]+'</a></div></div>\
   				<p>'+section_copy+'</p></div>');
				}else{
					$(".content").prepend('<div class="" style="clear:both;display:block;overflow:auto;margin-bottom:6px;"><h1>'+section_name+'</h1>\
					<div class="back_btn_container"><div id="back_btn" class="pane_btn"><a href="">'+OTP.title_data["BrandInterface"]["back_button"]["label"]+'</a></div></div>\
					<p>'+section_copy+'</p></div>');
 				}
 			}else{
				if(section_img_path !== "underfined"){
					$(".content").prepend('<div style="clear:both;display:block;overflow:auto;margin-bottom:6px;"><h1>'+section_name+'</h1>\
					<img src="./'+section_img_path+'" style="display:block;float:left;" />\
					<p>'+section_copy+'</p></div>');
				}else{
					$(".content").prepend('<div style="clear:both;display:block;overflow:auto;margin-bottom:6px;"><h1>'+section_name+'</h1>\
					<p>'+section_copy+'</p></div>');
				}
 			}
			$(".content").append();

			// For Pane type B, all section buttons are on the left and the links are on the right

			$(".content").append('<div class="btn_group">\
				<div class="column1"></div> <div class="column2"></div>\
			</div>');

			/***********************************************/
			// SECTION BTNS - left column
			// Check for section_group and display section btns if group exists
			if(typeof section_btns_obj !== 'undefined'){
				
				var section_btns = "";
				
				if( typeof section_btns_obj["section"].length === 'undefined' ){
					// One sub-section, so one section button
					console.log("We have ONE section_btn: ");
					console.dir(section_btns_obj["section"]);
					if(typeof section_btns_obj["section"]["name"] != "undefined"){
						section_btns += '<div class="pane_btn" data-pane_num="0" data-pane_count="1">'+section_btns_obj["section"]["name"]+'</div>';
					}
				}else{
					// Many sub-sections, many section buttons
					console.log("We DO have SEVERAL("+ section_btns_obj["section"].length +") section_btns! first one is:");

					var count = section_btns_obj["section"].length;

					for(i=0; i < count; i++){
						if(section_btns_obj["section"][i]["name"] != "undefined") {
							section_btns += '<div class="pane_btn" data-pane_num="'+i+'" data-pane_count="'+count+'">' + section_btns_obj["section"][i]["name"]+ '</div>';
						}
					}
				}
				$(".btn_group .column1").append(section_btns);

			}else{
				console.log("We DO NOT have section_btns!");
			}

			/***********************************************/
			//
			// LINKS - add them to the right column of the .btn_group div
			// 
			if(typeof section_links_obj !== 'undefined'){

				var links = "";

				if( typeof section_links_obj["link"].length === 'undefined'){
					// there is only one link
					
					var kind = section_links_obj["link"]["kind"];
					links = '<div class="pane_btn">';

					if(kind == "webpage"){
						links += '<img src="assets/pics/globe.png" width="19" height="19"/>';
					}
					if(kind == 'file'){
						links += '<img src="assets/pics/PDF.png" width="19" height="19"/>';
					}
					if(kind == 'email'){
						links += '<img src="assets/pics/email.png" width="19" height="19"/>';
					}
					links += '<a href="'+section_links_obj["link"]["location"]+'" target="_blank">'+section_links_obj["link"]["name"]+'</a></div>';

				}else{

					// there is more than one link
					// $(".link_group").append('<div class="column1" style="float:left;width:49%;"></div> <div class="column2" style="float:left; margin-left:4px; width:49%"></div> ');					
					for(var i=0; i < section_links_obj["link"].length; i++){
					
						var kind = section_links_obj["link"][i]["kind"];

						links += '<div class="pane_btn">';
						
						if(kind == "webpage"){
							links += '<img src="assets/pics/globe.png" width="19" height="19"/>';
						}
						if(kind == 'file'){
							links += '<img src="assets/pics/PDF.png" width="19" height="19"/>';
						}
						if(kind == 'email'){
							links += '<img src="assets/pics/email.png" width="19" height="19"/>';
						}
						links += '<a href="' + section_links_obj["link"][i]["location"] + '" target="_blank">' + section_links_obj["link"][i]["name"] + '</a></div>';						
					}
					$(".btn_group .column2").append(links);
					
				}
				
			}else{
				console.log("We DO NOT have section_links!");
			}
			/************************************************/
			// Activate the back button
			$("#back_btn").on("click", function(event){
				// return to load the pane with: otpContentPane.pane_history.pop();
				otpContentPane.prepareParentPaneShow();
				return false;
			});
			// Activate all the section buttons
			$(".btn_group .column1 .pane_btn").on("click", function(event){
				var pane_num = $(event.target).attr("data-pane_num");
				var pane_count = $(event.target).attr("data-pane_count");
				console.log("onClick clicked: .pane_btn data-pane_count:"+pane_count+", data-pane_num:"+pane_num);
				otpContentPane.preparePaneShow(pane_num,pane_count);
				event.preventDefault();
				return false;
			});
			// Activate the link_btns
			$(".btn_group .column2 .pane_btn").bind("click", function(event){
				window.open( $(this).children('a').attr('href') );
				event.preventDefault();
			});
		
		}).fadeIn("fast", this.showHeights);
		this.displayPane();
	}	
	//
	// showPaneC = With Image on left column, text on right. Secions and links in first column under image.
	//
	this.showPaneC = function(){
		console.log("******************\nentering showPaneC"); 
		console.log("history length: "+otpContentPane.pane_history.length);

		var section_name = "";
		var section_copy = "";
		var section_img_path = OTP.current_pane_data['sectionImage'];
		console.log("sectionImage: "+ section_img_path);
		console.log("paneType = " +   OTP.current_pane_data['contentPaneType']);
		var section_btns_obj = OTP.current_pane_data["section_group"];
		var section_links_obj = OTP.current_pane_data["links"];

		if(typeof OTP.current_pane_data["name"] != "undefined"){section_name = OTP.current_pane_data["name"];}
		if(typeof OTP.current_pane_data["copy"] != "undefined"){
			section_copy = OTP.current_pane_data["copy"]+"<br/>";
		}else{
			section_copy = "";
		}
		// Convert the newline chars in the copy to html breaks
		if(typeof section_copy !== "undefined"){
			section_copy = section_copy.replace(/\r\n/g, '<br />').replace(/[\r\n]/g, '<br />');
		}
		// Hide the content already in the pane
		$(".content").fadeOut( "fast", function() {
   			// fadeout complete, build the new content
			$(".content").empty();
			console.log(otpContentPane.pane_history.length);
   			
   			// Test to show the back button
   			var root_pane = (otpContentPane.pane_history.length !== 1)? false : true;
   			if(root_pane){
   				$(".content").prepend('<div class="" style="clear:both;display:block;overflow:auto;margin-bottom:4px;"><h1>'+section_name+'</h1>');
 			}else{
   				$(".content").prepend('<div class="" style="clear:both;display:block;overflow:auto;margin-bottom:4px;"><h1>'+section_name+'</h1>\
   				<div class="back_btn_container"><div id="back_btn" class="pane_btn"><a href="">'+OTP.title_data["BrandInterface"]["back_button"]["label"]+'</a></div></div>');
 			}
			$(".content").append("</div>");

			// For Pane type C, the section image, section buttons and links are on the left. The copy is on the right.

			$(".content").append('<div class="column1"></div> <div class="column2"></div>');
			
			if(section_img_path !== "undefined"){
	   			$(".column1").append('<img src="./'+section_img_path+'" style="display:block;float:left;" />');
			}
			$(".column2").append('<p>'+section_copy+'</p>');

			
			/***********************************************/
			// SECTION BTNS - left column
			// Check for section_group and display section btns if group exists
			if(typeof section_btns_obj !== 'undefined'){
				
				var section_btns = "";
				
				if( typeof section_btns_obj["section"].length === 'undefined' ){
					// One sub-section, so one section button
					console.log("We have ONE section_btn: ");
					console.dir(section_btns_obj["section"]);
					if(typeof section_btns_obj["section"]["name"] != "undefined"){
						section_btns += '<div class="pane_btn" data-pane_num="0" data-pane_count="1">'+section_btns_obj["section"]["name"]+'</div>';
					}
				}else{
					// Many sub-sections, many section buttons
					console.log("We DO have SEVERAL("+ section_btns_obj["section"].length +") section_btns! first one is:");

					var count = section_btns_obj["section"].length;

					for(i=0; i < count; i++){
						if(section_btns_obj["section"][i]["name"] != "undefined") {
							section_btns += '<div class="pane_btn" data-pane_num="'+i+'" data-pane_count="'+count+'">' + section_btns_obj["section"][i]["name"]+ '</div> ';
						}
					}
				}
				$(".column1").append(section_btns);

			}else{
				console.log("We DO NOT have section_btns!");
			}

			/***********************************************/
			//
			// LINKS - add them to the left column
			// 
			if(typeof section_links_obj !== 'undefined'){

				var links = "";

				if( typeof section_links_obj["link"].length === 'undefined' ){
					// there is only one link
					
					var kind = section_links_obj["link"]["kind"];
					links = '<div class="pane_btn">';

					if(kind == "webpage"){
						links += '<img src="assets/pics/globe.png" width="19" height="19"/>';
					}
					if(kind == 'file'){
						links += '<img src="assets/pics/PDF.png" width="19" height="19"/>';
					}
					if(kind == 'email'){
						links += '<img src="assets/pics/email.png" width="19" height="19"/>';
					}
					links += '<a href="'+section_links_obj["link"]["location"]+'" target="_blank">'+section_links_obj["link"]["name"]+'</a></div>';

				}else{

					// there is more than one link
					// $(".link_group").append('<div class="column1" style="float:left;width:49%;"></div> <div class="column2" style="float:left; margin-left:4px; width:49%"></div> ');					
					for(var i=0; i < section_links_obj["link"].length; i++){
					
						var kind = section_links_obj["link"][i]["kind"];

						links += '<div class="pane_btn">';
						
						if(kind == "webpage"){
							links += '<img src="assets/pics/globe.png" width="19" height="19"/>';
						}
						if(kind == 'file'){
							links += '<img src="assets/pics/PDF.png" width="19" height="19"/>';
						}
						if(kind == 'email'){
							links += '<img src="assets/pics/email.png" width="19" height="19"/>';
						}
						links += '<a href="' + section_links_obj["link"][i]["location"] + '" target="_blank">' + section_links_obj["link"][i]["name"] + '</a></div>';						
					}
					$(".column1").append(links);
					
				}
				
			}else{
				console.log("We DO NOT have section_links!");
			}
			/************************************************/
			// Activate the back button
			$("#back_btn").on("click", function(event){
				// return to load the pane with: otpContentPane.pane_history.pop();
				otpContentPane.prepareParentPaneShow();
				return false;
			});
			// Activate all the section buttons
			$(".column1 .pane_btn").on("click", function(event){
				var pane_num = $(event.target).attr("data-pane_num");
				var pane_count = $(event.target).attr("data-pane_count");
				console.log("onClick clicked: .pane_btn data-pane_count:"+pane_count+", data-pane_num:"+pane_num);
				otpContentPane.preparePaneShow(pane_num,pane_count);
				event.preventDefault();
				return false;
			});
			// Activate the link_btns
			$(".column2 .pane_btn").bind("click", function(event){
				window.open( $(this).children('a').attr('href') );
				event.preventDefault();
			});
		
		}).fadeIn("fast", this.showHeights);
		this.displayPane();
	}
	//
	// PaneType D 
	//
	this.showPaneD = function(root_pane){
		console.log("******************\nentering showPaneD"); 
		console.log("history length: "+otpContentPane.pane_history.length);

		var section_name = "";
		var section_copy = "";
		var section_img_path = OTP.current_pane_data['sectionImage'];
		console.log("sectionImage: "+ section_img_path);
		console.log("paneType = " +   OTP.current_pane_data['contentPaneType']);
		var section_btns_obj = OTP.current_pane_data["section_group"];
		var section_links_obj = OTP.current_pane_data["links"];

		if(typeof OTP.current_pane_data["name"] != "undefined"){section_name = OTP.current_pane_data["name"];}
		if(typeof OTP.current_pane_data["copy"] != "undefined"){
			section_copy = OTP.current_pane_data["copy"]+"<br/>";
		}else{
			section_copy = "";
		}
		// Convert the newline chars in the copy to html breaks
		if(typeof section_copy !== "undefined"){
			section_copy = section_copy.replace(/\r\n/g, '<br />').replace(/[\r\n]/g, '<br />');
		}
		// Hide the content already in the pane
		$(".content").fadeOut( "fast", function() {
   			// fadeout complete, build the new content
			$(".content").empty();
			console.log(otpContentPane.pane_history.length);
   			
   			// Test to show the back button
   			var root_pane = (otpContentPane.pane_history.length !== 1)? false : true;
   			if(root_pane){
   				$(".content").prepend('<div class="" style="clear:both;display:block;overflow:auto;margin-bottom:4px;"><h1>'+section_name+'</h1>');
 			}else{
   				$(".content").prepend('<div class="" style="clear:both;display:block;overflow:auto;margin-bottom:4px;"><h1>'+section_name+'</h1>\
   				<div class="back_btn_container"><div id="back_btn" class="pane_btn"><a href="">'+OTP.title_data["BrandInterface"]["back_button"]["label"]+'</a></div></div>');
 			}
			$(".content").append("</div>");

			// For Pane type C, the section image, section buttons and links are on the left. The copy is on the right.

			$(".content").append('<div class="column1"></div> <div class="column2"></div>');
			
			if(section_img_path !== "undefined"){
	   			$(".column1").append('<img src="./'+section_img_path+'" style="display:block;float:left;" />');
			}
			$(".column2").append('<p>'+section_copy+'</p>');

			
			/***********************************************/
			// SECTION BTNS - left column
			// Check for section_group and display section btns if group exists
			if(typeof section_btns_obj !== 'undefined'){
				
				var section_btns = "";
				
				if( typeof section_btns_obj["section"].length === 'undefined' ){
					// One sub-section, so one section button
					console.log("We have ONE section_btn: ");
					console.dir(section_btns_obj["section"]);
					if(typeof section_btns_obj["section"]["name"] != "undefined"){
						section_btns += '<div class="pane_btn" data-pane_num="0" data-pane_count="1">'+section_btns_obj["section"]["name"]+'</div>';
					}
				}else{
					// Many sub-sections, many section buttons
					console.log("We DO have SEVERAL("+ section_btns_obj["section"].length +") section_btns! first one is:");

					var count = section_btns_obj["section"].length;

					for(i=0; i < count; i++){
						if(section_btns_obj["section"][i]["name"] != "undefined") {
							section_btns += '<div class="pane_btn" data-pane_num="'+i+'" data-pane_count="'+count+'">' + section_btns_obj["section"][i]["name"]+ '</div> ';
						}
					}
				}
				$(".column1").append(section_btns);

			}else{
				console.log("We DO NOT have section_btns!");
			}

			/***********************************************/
			//
			// LINKS - add them to the left column
			// 
			if(typeof section_links_obj !== 'undefined'){

				var links = "";

				if( typeof section_links_obj["link"].length === 'undefined' ){
					// there is only one link
					
					var kind = section_links_obj["link"]["kind"];
					links = '<div class="pane_btn">';

					if(kind == "webpage"){
						links += '<img src="assets/pics/globe.png" width="19" height="19"/>';
					}
					if(kind == 'file'){
						links += '<img src="assets/pics/PDF.png" width="19" height="19"/>';
					}
					if(kind == 'email'){
						links += '<img src="assets/pics/email.png" width="19" height="19"/>';
					}
					links += '<a href="'+section_links_obj["link"]["location"]+'" target="_blank">'+section_links_obj["link"]["name"]+'</a></div>';

				}else{

					// there is more than one link
					for(var i=0; i < section_links_obj["link"].length; i++){
					
						var kind = section_links_obj["link"][i]["kind"];

						links += '<div class="pane_btn">';
						
						if(kind == "webpage"){
							links += '<img src="assets/pics/globe.png" width="19" height="19"/>';
						}
						if(kind == 'file'){
							links += '<img src="assets/pics/PDF.png" width="19" height="19"/>';
						}
						if(kind == 'email'){
							links += '<img src="assets/pics/email.png" width="19" height="19"/>';
						}
						links += '<a href="' + section_links_obj["link"][i]["location"] + '" target="_blank">' + section_links_obj["link"][i]["name"] + '</a></div>';						
					}
					$(".column1").append(links);
					
				}
				
			}else{
				console.log("We DO NOT have section_links!");
			}
			/************************************************/
			// Activate the back button
			$("#back_btn").on("click", function(event){
				// return to load the pane with: otpContentPane.pane_history.pop();
				otpContentPane.prepareParentPaneShow();
				return false;
			});
			// Activate all the section buttons
			$(".column1 .pane_btn").on("click", function(event){
				var pane_num = $(event.target).attr("data-pane_num");
				var pane_count = $(event.target).attr("data-pane_count");
				console.log("onClick clicked: .pane_btn data-pane_count:"+pane_count+", data-pane_num:"+pane_num);
				otpContentPane.preparePaneShow(pane_num,pane_count);
				event.preventDefault();
				return false;
			});
			// Activate the link_btns
			$(".column2 .pane_btn").bind("click", function(event){
				window.open( $(this).children('a').attr('href') );
				event.preventDefault();
			});
		
		}).fadeIn("fast", this.showHeights);
		this.displayPane();
	}
	//
	// PaneType E = Gallery mimmicking SlideShowPro
	//
	this.showPaneE = function(root_pane){
		console.log("******************\nentering showPaneE");
		// Photo Gallery Pane
		console.log("history length: "+otpContentPane.pane_history.length);
		// Initial static size 475px x 325px
		if(typeof OTP.current_pane_data["name"] != "undefined"){
			section_name = OTP.current_pane_data["name"];
		}
	/*	
		OTP GALLERY PANE WITHIN showPaneE
	*/
	OTP.Gallery = function(){
		console.log("Instantiating OTP.Gallery");
		this.loadGalleryFile = function(){
			// Load selected language file and parse
			var url = "assets/apps/gallery/gallery.xml";
			var xml = new JKL.ParseXML( url );
			var gallery_xml_parsed = xml.parse();
			return gallery_xml_parsed;
		}

		var pics = this.loadGalleryFile();
		var lgPath = pics["gallery"]["album"]["lgPath"];
		var tnPath = pics["gallery"]["album"]["tnPath"];
		var gallery_thumb_group_start_position = 0;
		var gallery_thumb_group_end_position = 0;
		var total_pics = 0;
		var current_pic_index = 0;
		var gallery_timer = "";
		var playing = false;
		
		this.galleryThumbClicked = function(event){
			event.stopPropagation();
			$(".gallery_thumb").unbind("click");
			console.log("Showing Gallery Image: "+ event.target);
			var image = $(this).attr("src");
			var selected_index = $(this).attr("name");

			// Hide/show the prev & next btns if we're on the first and the last btns
			if(selected_index == 0){
				$(".btn_gallery_prev").attr("src","assets/apps/gallery/btn_prev_off.gif").unbind("click");
				$(".btn_gallery_prev").css("cursor","default");
			}else{
				$(".btn_gallery_prev").unbind("click");
				$(".btn_gallery_prev").attr("src","assets/apps/gallery/btn_prev.gif").unbind("click").on("click",otpGallery.btnPrevThumbClicked );
				$(".btn_gallery_prev").css("cursor","pointer");
			}
			if(selected_index == total_pics-1){
				$(".btn_gallery_next").attr("src","assets/apps/gallery/btn_next_off.gif").unbind("click");
				$(".btn_gallery_next").css("cursor","default");
			}else{
				$(".btn_gallery_next").unbind("click");			
				$(".btn_gallery_next").attr("src","assets/apps/gallery/btn_next.gif").unbind("click").on("click",otpGallery.btnNextThumbClicked );
				$(".btn_gallery_prev").css("cursor","pointer");
			}
			// console.log("selected_index: "+selected_index);
			current_pic_index = selected_index;
			var i_ar = image.split("/");
			image = i_ar[5];
			// console.log("image = "+ image );
			otpGallery.updateGalleryImage(image);
		}
		this.completeGalleryUpdate = function(){
			console.log("completeGalleryUpdate");
			$(".gallery_top").remove();
			$(".gallery_bottom").removeClass("gallery_bottom").addClass("gallery_top");
			$(".gallery_thumb").unbind("click").on("click",otpGallery.galleryThumbClicked );
		}
		this.updateGalleryImage = function(img){
			img = "./assets/apps/gallery/lg/"+img;
			// Insert the new image w/in a div then fade out and remove the gallery_top.
			console.log("Updating photo gallery image: "+img);
			// create the dom element of the div-img under the existing displayed image
			$(".gallery_image").prepend('<div class="gallery_bottom"><img width="474" height="273" src=""/></div>');
			// wait for it to load completely before attempting to fade out the image above it.
			var newimg = $(".gallery_bottom img").attr('src', img ).load(function() {
				if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
					alert('image not available');
				} else {
					console.log(".gallery_bottom img loaded");
					var tl = new TimelineLite({onComplete:otpGallery.completeGalleryUpdate});
					tl.to($(".gallery_top"), 0.7, {css:{"opacity":"0"},ease:Power3.easeOut}, 0);
				}
			});
		}
		this.prevGroupClicked = function(event){
			event.stopPropagation();
			$(".btn_gallery_prev_group").unbind("click");
			console.log("Gallery Prev Group"+event.target);
			// if not at the far end, slide to show the last group (all / No. displayable)
			// .gallery_thumb(27px) + right_margin(10px) * 10 = 370
			var group_pos = Number( $(".gallery_thumb_group").css("left").slice(0,-2) );
			console.log("prev group_pos "+ group_pos);
			if(group_pos < 0){ // if thumb group is not in first position (not showing first group of 10)
				// Calculate new position
				group_pos = Number(group_pos) + 370;
				if(group_pos >=0){
					// if destination is at the beginning, show the off version of the prev group btn
					$(".btn_gallery_prev_group").attr("src","./assets/apps/gallery/btn_prev_group_off.gif").unbind("click").css({"cursor":"default"});
				}
				group_pos = group_pos + "px";
				// Slide thumb group to new position
				var tl = new TimelineLite({onComplete:function(){ $(".btn_gallery_prev_group").unbind("click").on("click", otpGallery.prevGroupClicked ).css({"cursor":"pointer"});}});
				tl.to($(".gallery_thumb_group"), 1.0, {css:{"left":group_pos},ease:Power3.easeOut}, 0);
				$(".btn_gallery_next_group").attr("src","./assets/apps/gallery/btn_next_group.gif").unbind("click").on("click",otpGallery.nextGroupClicked).css({"cursor":"pointer"});
			}else{
				console.log("gallery_thumb_group is at beginning");
				$(".btn_gallery_prev_group").unbind("click").on("click", otpGallery.prevGroupClicked ).css({"cursor":"pointer"});
			}
		}
		this.nextGroupClicked = function(event){
			event.stopPropagation();
			var tg_width = Number($(".gallery_thumb_group").css("width").slice(0,-2));
			var group_pos = Number( $(".gallery_thumb_group").css("left").slice(0,-2) );
			var end_pos = 370-tg_width;
			var new_pos = group_pos - 370;
			
			console.log("tg_width: "+tg_width);
			console.log("end_pos: "+ end_pos);
			console.log("group_pos: "+ group_pos);
			console.log("new_pos: "+ new_pos);

			if( new_pos -370 <= end_pos ){
				$(".btn_gallery_next_group").attr("src","./assets/apps/gallery/btn_next_group_off.gif").unbind("click").css({"cursor":"default"});
			}else{
				$(".btn_gallery_next_group").attr("src","./assets/apps/gallery/btn_next_group.gif").unbind("click").on("click",otpGallery.nextGroupClicked ).css({"cursor":"pointer"});
			}
			group_pos = new_pos + "px";
			var tl = new TimelineLite();
			tl.to($(".gallery_thumb_group"), 1.0, {css:{"left":group_pos},ease:Power3.easeOut}, 0);
			$(".btn_gallery_prev_group").attr("src","./assets/apps/gallery/btn_prev_group.gif").unbind("click").on("click",otpGallery.prevGroupClicked).css({"cursor":"pointer"});
		}
		this.btnPrevThumbClicked = function(event){
			event.stopPropagation();
			if(current_pic_index === 'undefined'){
				current_pic_index = 0;
			}
			var prev_pic_index = Number(current_pic_index)-1;
			if(prev_pic_index >= 0){
				var src = pics["gallery"]["album"]["img"][prev_pic_index]["src"];
				$('[data-pic="'+src+'"]').trigger("click");
			}
		}
		this.btnNextThumbClicked = function(event){
			event.stopPropagation();
			if(current_pic_index === 'undefined'){
				current_pic_index = 0;
			}
			console.log("btnNextThumbClicked. current_pic_index = "+ current_pic_index);
			var next_pic_index = Number(current_pic_index)+1;
			if(next_pic_index <= total_pics-1){
				var src = pics["gallery"]["album"]["img"][next_pic_index]["src"];
				$('[data-pic="'+src+'"]').trigger("click");
			}
		}

		this.galleryAutoAdvance = function(){
			console.log("galleryAutoAdvance: current_pic_index = "+ current_pic_index);
			if(current_pic_index == total_pics-1){
				console.log("LAST PIC");
				var src = pics["gallery"]["album"]["img"][0]["src"];
				$('[data-pic="'+src+'"]').trigger("click");
			}else{
				$(".btn_gallery_next").trigger("click");
			}
		}
		this.btnGalleryPlayPauseClicked = function(event){
			//console.log("btnGalleryPlayPauseClicked: playing = "+ playing);
			//
			if(playing){
				console.log("begin pausing");
				// hide the play btn & show the pause btn
				$(".btn_gallery_play_pause").attr("src","./assets/apps/gallery/btn_play.gif");
				// pause the autoAdvance
				clearInterval(gallery_timer);
				playing = false;
			}else{
				console.log("begin playing");
				// hide the pause btn & show the play btn
				$(".btn_gallery_play_pause").attr("src","./assets/apps/gallery/btn_pause.gif");
				// start the autoAdvance to call galleryAutoAdvance
				gallery_timer = setInterval(otpGallery.galleryAutoAdvance, 4000);
				//gallery_timer = setInterval(function(){ console.log('advance gallery img');},2000 );
				//console.log("gallery_timer: "+gallery_timer);
				playing = true;
			}
			console.log("end btnGalleryPlayPauseClicked: playing = "+ playing);
		}

		// Hide the content already in the pane
		$(".content").fadeOut( "fast", function() {
			// fadeout complete, build the new content
			$(".content").empty();
			$(".content").prepend('<div class="gallery"></div>');
			if( typeof pics["gallery"]["album"]["img"].length === 'undefined' ){
				console.log("ONE GALLERY PIC");
			}else{
				console.log("MANY GALLERY PICS");
				total_pics = pics["gallery"]["album"]["img"].length;
				console.log("how many? "+ total_pics);
				var p = pics["gallery"]["album"]["img"];
				$(".gallery").append('<div class="gallery_image"><div class="gallery_top"><img width="474" height="273" src="./'+lgPath+p[0]["src"]+'"/></div></div>');
				$(".gallery").append('<div class="gallery_nav">\
					<div class="gallery_thumb_container">\
						<div class="gallery_thumb_mask">\
							<div class="gallery_thumb_group"></div>\
				</div></div></div>');

				$(".gallery_nav").prepend('<div class="btn_prev">\
				<img class="btn_gallery_prev_group" src="assets/apps/gallery/btn_prev_group_off.gif" width="13" height="10"/>\
				<img class="btn_gallery_prev" src="assets/apps/gallery/btn_prev_off.gif" width="13" height="10"/></div>');

				$(".gallery_nav").append('<div class="btn_next">\
				<img class="btn_gallery_next" src="assets/apps/gallery/btn_next.gif" width="13" height="10"/>\
				<img class="btn_gallery_next_group" src="assets/apps/gallery/btn_next_group_off.gif" width="13" height="10" style="margin-left:0px;"/>\
				<img class="btn_gallery_play_pause" src="assets/apps/gallery/btn_play.gif" width="13" height="10" style="margin-left:0px;"/></div>');
				
				var real_gallery_thumb_width = 0;
				
				for(var i in p){
					// console.log("i:"+i+", "+p[i]["src"]);
					real_gallery_thumb_width += 37;
					$(".gallery_thumb_group").append(' <img class="gallery_thumb" data-pic="'+p[i]["src"]+'" name="'+i+'" width="25" height="25" src="./'+tnPath+p[i]["src"]+'"/>');
				}
				$(".gallery_thumb_group").css({"width":real_gallery_thumb_width});
				
				console.log("orig tg_width: "+ Number($(".gallery_thumb_group").css("width").slice(0,-2) ) );
			}

			// Activate gallery navigation click events
			$(".gallery_thumb").on("click", otpGallery.galleryThumbClicked);

			// view previous group of 10 thumbnails in thumbnail mask
			$(".btn_gallery_prev_group").on("click", otpGallery.prevGroupClicked );

			// select the previous thumbnail img as if it were clicked
			$(".btn_gallery_prev").on("click",otpGallery.btnPrevThumbClicked );


			//  
			if(total_pics > 10){
				// view next group of 10 thumbnails in thumbnail mask
				$(".btn_gallery_next_group").attr("src","./assets/apps/gallery/btn_next_group.gif").on("click",otpGallery.nextGroupClicked ).css({"cursor":"default"});
			}

			// select the next thumbnail img as if it were clicked
			$(".btn_gallery_next").on("click",otpGallery.btnNextThumbClicked);

			// Play / Pause
			$(".btn_gallery_play_pause").on("click",otpGallery.btnGalleryPlayPauseClicked );
			

		}).fadeIn("fast", this.showHeights);
		otpContentPane.displayPane();
	}
	var otpGallery = new OTP.Gallery();
		console.log("new OTP.Gallery() instantiated.");
		return false;
	}
	// END showPaneE (GALLERY)
	//
	// showPaneW = Wallpaper/Downloads display
	//
	this.showPaneW = function(root_pane){
		// Wallpapers Pane
		console.log("******************\nentering showPaneW"); 
		
		var section_name = "";
		var section_copy = "";
		var wallpaper_list_obj = OTP.current_pane_data["wallpaper_list"];
		var wallpaper = "";

		if(typeof OTP.current_pane_data["name"] != "undefined"){section_name = OTP.current_pane_data["name"];}
		if(typeof OTP.current_pane_data["copy"] != "undefined"){
			section_copy = OTP.current_pane_data["copy"]+"<br/>";
		}else{
			section_copy = "";
		}

		// Convert the newline chars in the copy to html breaks
		if(typeof section_copy !== "undefined"){
			section_copy = section_copy.replace(/\r\n/g, '<br />').replace(/[\r\n]/g, '<br />');
		}
		
		// Hide the content already in the pane
		$(".content").fadeOut( "fast", function() {
   			// fadeout complete, build the new content
   			$(".content").empty();

   			console.log(otpContentPane.pane_history.length);
   			
   			var root_pane = (otpContentPane.pane_history.length !== 1)? false : true;
   			if(!root_pane){
   				$(".content").prepend('<h1>'+section_name+'</h1><div id="back_btn" class="pane_btn"><a href="">'+OTP.title_data["BrandInterface"]["back_button"]["label"]+'</a></div><p>'+section_copy+'</p>');
 			}else{
   				$(".content").prepend('<h1>'+section_name+'</h1><p>'+section_copy+'</p>');
 			}
			/***********************************************/
			// wallpaper_list 
			// Check for wallpaper_list and display the wallpaper thumb along with its' links
			if(typeof wallpaper_list_obj !== 'undefined'){
				$(".content").append('<div class="wallpaper_list"></div>');
				$(".wallpaper_list").append('<div class="column1" style="float:left; margin:0; width:49%;"></div>');
				$(".wallpaper_list").append('<div class="column2" style="float:left; margin:0; width:50%;"></div>');

				console.log("wallpaper_list_obj length: "+typeof wallpaper_list_obj["wallpaper"].length);
				
				if( typeof wallpaper_list_obj["wallpaper"].length === 'undefined' ){
					// One sub-section, so one section button
					console.log("We have ONE wallpaper: ");
					console.dir(wallpaper_list_obj["wallpaper"]);
					
					// One wallpaper download
					/*
					if(typeof wallpaper_list_obj["wallpaper"]["thumb"] != "undefined"){
						wallpaper_group += '<div class="" data-pane_num="0" data-pane_count="1">'+wallpaper_list_obj["wallpaper"]["thumb"]+'</div>';
					}
					*/
					$(".wallpaper_list").append(wallpaper_group);
				}else{
					// Many sub-sections, many section buttons
					console.log("We DO have SEVERAL("+ wallpaper_list_obj["wallpaper"].length +") wallpaper first one is:");
					var wp_group = "";
					for(i=0; i < wallpaper_list_obj["wallpaper"].length; i++){
						wp_group = "";
						if(wallpaper_list_obj["wallpaper"][i]["thumb"] != "undefined"){
							wp_group = ' <div class="wallpaper_group"><img style="display:block;float:left;" src="'+wallpaper_list_obj["wallpaper"][i]["thumb"]+'"/> ';
								wp_group +=' <div class="wallpaper_links">';

								// Collect download links associated with each thumbnail image
								for(m=0; m < wallpaper_list_obj["wallpaper"][i]["screensize_btn"].length; m++){
									var file = wallpaper_list_obj["wallpaper"][i]["screensize_btn"][m]["file"];
									var label = wallpaper_list_obj["wallpaper"][i]["screensize_btn"][m]["#cdata-section"];
									wp_group += ' <div class="pane_btn"><a href="./'+file+'"  target="_blank">'+label+'</a></div> ';
								}
								wp_group += ' </div></div> <br/>';
							if(i%2===0){
								$(".wallpaper_list .column1").append(wp_group);
							}else{
								$(".wallpaper_list .column2").append(wp_group);
							}
						}
					}
				}
			}else{
				console.log("We DO NOT have wallpaper_list!");
			}
			$(".wallpaper_links .pane_btn").bind("click", function(event){
				window.open( $(this).children('a').attr('href') );
				event.preventDefault();
			});

			/************************************************/

			}).fadeIn("fast", this.showHeights);
			this.displayPane();
	
		return false;
	}
	//
	//
	//
	this.showPaneQ = function(root_pane){
		// Quit Application Pane
		if(typeof OTP.current_pane_data["name"] != "undefined"){
			section_name = OTP.current_pane_data["name"];
		}
		alert(section_name);
		return false;
	}
	//
	//
	//
	this.create = function(){
		// Create the content pane for all pane types
		$("#main_menu").before('<div id="content_pane"></div>');
		$("#content_pane").css({"margin-bottom":"-330px","width":"510px","height":"340px"});
		$("#content_pane").prepend('<div class="content_tab"><div class="content_tab_bg"></div><img src="assets/pics/tab_arrow_up.png"/></div>\
		<div class="content_bg"></div>');
		$(".content_bg").css({'background-color': OTP.colors_ar['leftPaneColorValue'],"width":$("#content_pane").width()+"px","height":$("#content_pane").height()+"px"});
		$(".content_tab_bg").css({'background-color':OTP.colors_ar['leftPaneColorValue']});
		$("#content_pane").append('<div class="content"></div>');

		$(".content_tab").on("click",function(event){
			console.log("deactivating Tab");
			$(this).unbind("click");
			otpContentPane.togglePane();
		});
	}
}
// ================================================================
OTP.MainMenu = function(){
	console.log("Instantiating OTP.MainMenu");
	this.main_nav_selected = 0;	
	//
	//
	//
	this.create = function(){
		console.log("Creating MainMenu");
		// Create DOM element for UI placement
		$("#interface_area").prepend('\
			<div id="main_menu"><ul></ul></div>\
		');
		// Set menu position
		$("#main_menu").css({"margin-left":"-250px","width":"240px","height":"700px"});

		// Add menu title header
		var menu_header = '<div class="h1">'+OTP.title_data["BrandInterface"]["title"]["row1"]+'<br/>';
		menu_header += OTP.title_data["BrandInterface"]["title"]["row2"]+'</div>';
		menu_header += '<div class="h2">'+ OTP.title_data["BrandInterface"]["title"]["row3"]+'</div>';
		menu_header += '<div class="h2">'+ OTP.title_data["BrandInterface"]["title"]["row4"]+'</div>';
		$("#main_menu").prepend(menu_header);
		// $("#main_menu h1").css({"color":OTP.colors_ar[""]});

		// Populate with top and bottom images
		$("#main_menu").prepend('<img class="nav-top-img" src="assets/pics/leftNav_top.png" width="240" height="70"/><br/>');
		$("#main_menu").append('<img class="nav-bottom-img" src="assets/pics/leftNav_bottom.png" width="240" height="70"/><br/>');

		// Bg color placed after placement of other elements
		$("#main_menu").prepend('<div class="menu_bg"></div>');
		$(".menu_bg").css({'background-color':OTP.colors_ar['leftPaneColorValue'],"width":$("#main_menu").width()+"px","height":$("#main_menu").height()+"px"});
		
		// Add menu items
		for(i=0;i < OTP.title_data["BrandInterface"]["main_nav"]["nav"].length; i++){
			var menu_item = OTP.title_data["BrandInterface"]["main_nav"]["nav"][i];
			$("#main_menu ul").append( '<li><a class="mainNavBtn_'+i+'" href="'+i+'"><img class="leftNav_arrow_left" src="assets/pics/leftNav_arrow_left.png" width="7" height="7"/>' + menu_item +' <img  class="leftNav_arrow_right" src="assets/pics/leftNav_arrow_right.png" width="5" height="8"/></a></li>' );
			if(i == 0){
				$(".mainNavBtn_0 img.leftNav_arrow_left").css("visibility","visible");
				this.main_nav_selected = 0;
			}
			// Add click event
			$(".mainNavBtn_"+i).on("click", function(event){
				otpContentPane.showTopLevelPane(event);
				return false;
			})
			/*
			$(".mainNavBtn_"+i).on("mouseenter",function(event){
				var n = event.target  + '';
				var t_ar = n.split("/");
				n = t_ar[t_ar.length-1];
				$(".mainNavBtn_"+n+" img.leftNav_arrow_left").css("visibility","visible");
			});
			$(".mainNavBtn_"+i).on("mouseleave",function(event){
				var n = event.target  + '';
				var t_ar = n.split("/");
				n = t_ar[t_ar.length-1];
				// console.log("otpMainMenu.main_nav_selected: "+otpMainMenu.main_nav_selected);
				if( n != otpMainMenu.main_nav_selected ){
					$(".mainNavBtn_"+n+" img.leftNav_arrow_left").css("visibility","hidden");
				}
			});
			*/
		}		
		// Show/Hide graphic left arrow on button depending on:
		// Rollover or active, show the left arrow
		//$("#").css();
		
		// Slide constructed menu into view
		var tl = new TimelineLite({onComplete:function(){otpContentPane.displayFirstPane();otpBackground.togglePane();} });
		tl.to($("#main_menu"), 0.6, {css:{marginLeft:"0px"},ease:Power3.easeOut}, 1);
	}
	// 	
}

	
// ================================================================
OTP.Intro = function () {
	/*
		private functions
	*/
	//
	//
	//
	this.loadLanguageFile = function(){
		// Load selected language file and parse
		var url = "assets/xml/languages.xml";
		var xml = new JKL.ParseXML( url );
		var languages_xml_parsed = xml.parse();
		return languages_xml_parsed;
	}
	/*
		loadSelectedLanguage(id)
		Called by: onLanguageSelect()
	*/
	//
	//
	//
	this.loadSelectedLanguage = function(id){
		console.log("in loadSelectedLanguage. languages[id]['file'] = "+languages[id]['file']);
		// Load selected language file and parse
		var url = "./assets/xml/"+languages[id]['file'];
		console.log("file url: "+url);
		var xml = new JKL.ParseXML( url );
		OTP.title_data = xml.parse();
		//console.log("OTP.title_data:"+OTP.title_data);
		otpContentPane.current_pane = OTP.title_data["BrandInterface"]["section_group"]["section"][0];
		otpContentPane.previous_pane = OTP.title_data["BrandInterface"]["section_group"]["section"][0];
		//event.preventDefault();
	}
	//
	//
	//
	this.onLanguageSelect = function(id){
		console.log("onLanguageSelect: id="+id);
		// Animate introButtonBar up (to hide it from the user while buttons are replaced)
		// Remove language buttons, saving language selection
		// Create and place language-specific terms and continue buttons, replacing language buttons
		// Animate introButtonBar to be visible to the user
		var tl = new TimelineLite();
		/* UNDO
		tl.to($('#language_menu'), 0, {css:{top:"300px"},ease:Strong.easeOut}, 0)
			.to($('.language_btn_li'), 0, {css:{display:"none"},ease:Strong.easeOut}, 0)
			.to($(".terms_li[data-id='"+id+"']"), 0, {css:{display:"block"},ease:Strong.easeOut}, 0)
			.to($('#language_menu'), 0, {css:{top:"350px"},ease:Strong.easeOut}, 0);
		*/
		tl.to($('#language_menu'), 0.5, {css:{top:"300px"},ease:Strong.easeOut}, 0)
			.to($('.language_btn_li'), 0.1, {css:{display:"none"},ease:Strong.easeOut}, 0)
			.to($(".terms_li[data-id='"+id+"']"), 0.1, {css:{display:"block"},ease:Strong.easeOut}, 0)
			.to($('#language_menu'), 0.5, {css:{top:"350px"},ease:Strong.easeOut}, 0);
			// Begin loading the chosen language xml file
		this.loadSelectedLanguage(id);
	}
	//
	//
	//
	this.onTermsSelect = function(id){
		// Display terms div in a popup
		//alert(languages[id]["#cdata-section"]);
		
		var terms_copy = languages[item]['#cdata-section'];
		terms_copy = terms_copy.replace(/\r\n/g, '<br />').replace(/[\r\n]/g, '<br />');

		$("body").prepend('<div id="terms_copy_popup"><span class="close_btn"><span>X</span></span>'+ terms_copy +'</div>');
		$("#terms_copy_popup").bPopup({
			closeClass: "close_btn"
		});
		return true;
	}
	//
	//
	//
	this.onContinueSelect = function(){
		// Animate the Intro elements away
		var tl = new TimelineLite({onComplete:OTP.introExit});
		/* 	UNDO
		tl.to($('#language_menu'), 0, {css:{top:"250px"},ease:Strong.easeInOut}, 0)
			.to($('#language_menu'), 0, {css:{opacity:"0"},ease:Strong.easeOut}, 0)
			.to($('#intro_area'), 0, {css:{height:"3px",marginTop:'-1px'},ease:Strong.easeInOut}, 0)
			.to($('#intro_content'), 0, {css:{opacity:"0"},ease:Strong.easeIn}, 0)
			.to($('#intro_area'), 0, {css:{marginLeft:"750px"},ease:Power2.easeInOut}, 0)
			.to($("#interface_area"), 0, {css:{opacity:"1"},ease:Strong.easeInOut}, 0.2);
		*/
		tl.to($('#language_menu'), 0.9, {css:{top:"250px"},ease:Strong.easeInOut}, 0)
			.to($('#language_menu'), 0.1, {css:{opacity:"0"},ease:Strong.easeOut}, 0)
			.to($('#intro_area'), 1, {css:{height:"3px",marginTop:'-1px'},ease:Strong.easeInOut}, 0)
			.to($('#intro_content'), 0.1, {css:{opacity:"0"},ease:Strong.easeIn}, 0)
			.to($('#intro_area'), 1, {css:{marginLeft:"750px"},ease:Power2.easeInOut}, 0)
			.to($("#interface_area"), 0.8, {css:{opacity:"1"},ease:Strong.easeInOut}, 0.2);
		return true;
	}
	this.autoSelectLanguage = function(){
		console.log("in autoSelectLangauge");
		//$(".lang_btn").trigger("click");
		//this.loadSelectedLanguage('language');
	}
	//
	//
	//
	this.introAnimation = function(){
		if ($.browser.webkit) {
			$("body").css('font', 'normal 71%/1.2 sans-serif');
			$("h1").css('font', 'normal 97%/1.2 sans-serif');
			$("h2").css('font', 'normal 68%/1.1 sans-serif');
		}
		$("#interface_area").css({'background-color':OTP.colors_ar['bgColorValue'],"opacity":"0"});
		
		// $('#intro_content').html("<img src='assets/pics/intro.png'/>").css("opacity","0");
		$('#intro_content').html("<img src=''/>").css("opacity","0");

		var newimg = $("#intro_content img").attr('src', './assets/pics/intro.png' ).load(function() {
			if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0) {
				alert('image not available');
			} else {
				var tl = new TimelineLite();
				tl.to($("#intro_content img"), 0, {css:{"opacity":"1"},ease:Power3.easeOut}, 0);
					// Show animation with smoothiness by adjusting the timespans above to match the following:
					/* 	UNDO
					tl.to($("#interface_area"), 0, {css:{opacity:"1"},ease:Strong.easeInOut}, 0.2)
					.to($('#intro_area'), 0, {css:{marginLeft:"0"},ease:Power2.easeInOut}, 0)
					.to($('#intro_content'), 0, {css:{opacity:"1"},ease:Strong.easeOut}, 0)
					.to($('#intro_area'), 0, {css:{height:"200px",marginTop:'-100px'},ease:Strong.easeOut}, 0)
					.to($('#language_menu'), 0, {css:{top:"350px",opacity:"1"},ease:Strong.easeOut}, 0);
					*/
					tl.to($("#interface_area"), 0.8, {css:{opacity:"1"},ease:Strong.easeInOut}, 0.2)
						.to($('#intro_area'), 1.0, {css:{marginLeft:"0"},ease:Power2.easeInOut}, 0)
						.to($('#intro_content'), 0.1, {css:{opacity:"1"},ease:Strong.easeOut}, 0)
						.to($('#intro_area'), 1, {css:{height:"200px",marginTop:'-100px'},ease:Strong.easeOut}, 0)
						.to($('#language_menu'), 0.5, {css:{top:"350px",opacity:"1"},ease:Strong.easeOut}, 0);
					
			}
		});
		
		$('#intro_area').css({"marginLeft":"-750px","marginTop":"-1px","height":"3px"});

		console.log("one_language: "+one_language);
		if(one_language){
			// hide language btn and show terms/cont btns
			$('.language_btn_li').css({"display":"none"});
			$(".terms_li").css({"display":"block"});
			var tl = new TimelineLite({onComplete:function(){otpIntro.loadSelectedLanguage('language');}});
		}else{
			var tl = new TimelineLite();
		}
// old animation block here
	}
	//
	//
	//
	this.escapeHTML = function(msg) {
		var replacements = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;'
		};
		return html.replace(/[&<>]/g, function ($0) {return replacements[$0];});
	}
	/*
	
	*/
	var dump = "";
	/*
		Import the colors.txt file into an associative array
	*/
	var request = new XMLHttpRequest();
	var urlColors = "../colors.txt";
	request.open("GET", urlColors, false);
	request.send(null);
	//
	var o = parseUri.options;
	var items = parseUri(request.responseText);
	var query = items[o.q.query];
	var languages_ar = [];
	
	var colorsUri_str = items[o.key[0]];
	var colorsUri_ar = colorsUri_str.split("&");
	var tmp_ar = [];
	for(var i=0; i < colorsUri_ar.length; i++){
		//$('#myDiv').append("<div>arr["+i+"] =>"+myArray[i]+"</div>");
		tmp_ar = colorsUri_ar[i].split("=");
		tmp_ar[1] = tmp_ar[1].replace("0x","#");
		OTP.colors_ar[tmp_ar[0]] = tmp_ar[1];
		dump += tmp_ar[0]+"="+tmp_ar[1]+"<br/>";
	}
	/*
		Import the languages.xml file
	*/
	var language_btns_htm = "";
	var languages = this.loadLanguageFile();
	var terms_btns_htm = "";
	var terms_copy_htm = "";
	var one_language = false;
	if(typeof languages["languages"]['language'][0] !== 'undefined'){
		console.log("MANY LANGUAGES DETECTED");
		// present language option btns
		languages = languages["languages"]["language"]; // for multiple languages in language.xml file
		one_language = false;
	}else{
		console.log("SINGLE LANGUAGE DETECTED");
		// proceed to load the single language
		languages = languages["languages"]; // for only ONE language in language.xml file
		one_language = true;
	}
	for(var item in languages){
		console.log("languages[item]: "+ languages[item]['name']);
		
		terms_btns_htm += "<div id='terms_copy"+item+"' class='terms_copy'>"+ "" +"</div>";
		terms_btns_htm += "<li class='terms_li' data-id='"+item+"'><a class='terms_btn' href='"+languages[item]['terms']+"'>"+languages[item]['terms']+"</a></li>";
		terms_btns_htm += "<li class='terms_li' data-id='"+item+"'><a class='cont_btn' href='"+languages[item]['cont']+"'>"+languages[item]['cont']+"</a></li>";
		language_btns_htm += "<li class='language_btn_li' data-id='"+item+"'><a class='lang_btn' href='"+languages[item]['name']+"'>"+languages[item]['name']+"</a></li>";
	}
	
	this.activateIntroBtns = function(){
		// set the click response to stop the event and to retrieve the index for selecting the terms & continue btns and content
		$(".lang_btn").on("click", function(event){
			var id = $(this).parent().attr("data-id");
			console.log(id);
			event.preventDefault();
			otpIntro.onLanguageSelect(id);
			//return false;
		});
		$(".terms_btn").on("click", function(event){
			var id = $(this).parent().attr("data-id");
			otpIntro.onTermsSelect(id);
			event.preventDefault();
			//return false;
		});
		$(".cont_btn").on("click", function(event){
			otpIntro.onContinueSelect();
			event.preventDefault();
			//return false;
		});
	}

	$("#interface_area").prepend('\
		<div id="language_menu">\
			<div id="language_btns">\
				<ul>\
				'+ terms_btns_htm +'\
				'+ language_btns_htm +'\
				</ul>\
			</div>\
		</div>\
		<div id="intro_area">\
			<div id="intro_content"></div>\
		</div>\
	');

	var languagePanecolor = OTP.colors_ar['langPaneBgColorValue'];
	console.log("languagePanecolor "+languagePanecolor);
	$("#language_menu").css({"background-color":languagePanecolor});
	this.activateIntroBtns();
	this.introAnimation();
} // End OTP.Intro 
////////////////////
/*
In Jquery, set custom events and listeners. Events will bubble up to the 
higher DOM element.

$('document').bind('custom-event', function(e){
  var $element = e.target;
});

$('#anyElement').trigger('custom-event');

(However, the jquery event handling is outdone by a greensock timeline callback function)
*/

////////////////////
var otpIntro = new OTP.Intro();
var otpMainMenu = new OTP.MainMenu();
var otpContentPane = new OTP.ContentPane();
var otpBackground = new OTP.BackgroundGallery();