/*  $.address.init(function(event) {
        console.log('init');
		determineContent();
    }).internalChange(function(event) {
        console.log('internal');
		determineContent();
    }).externalChange(function(event) {
		determineContent();
        console.log('external');
    }); 
   
  $.address.strict(false);

    $.address.internalChange(function(e) {
       var hashFound = determineContent();
    if(hashFound) return false;
    });

*/
	//chrome.browserAction.setBadgeBackgroundColor({color:[190, 190, 190, 230]});
	//chrome.browserAction.setBadgeText({text:"18"});
//	http://stackoverflow.com/questions/13564277/chrome-extension-change-address-bar-button-background-color-at-runtime


$( document ).ready(function() {
	$(window).bind('hashchange', function(e) {
	   // var hashFound = 
		determineContent();
		//if(hashFound) return false;
		
	}).trigger('hashchange');
});

document.addEventListener('myCustomEvent', function() {
 // determineContent();
  console.log("Empfange Event")
});

chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {

  if (msg.action == 'open_dialog_box') {
    console.log("Empfange Event");
	determineContent();
  }
});

function determineContent(){
	
	setTimeout(function() {
		var countPDF = 0;

		$('a[href*=".pdf"]').each(function() {
		//$('^(.*\.(?!(pdf)$))?[^.]*$').each(function() {
		//$("a:regex(href, ^(.*\.(?!(pdf)$))?[^.]*$)").each(function() {
		var url = $(this).attr("href");	
			// ingore google stuff
			if (/translate.google/i.test(url) || /webcache.googleusercontent/i.test(url) || url.toLowerCase().startsWith("/search?")) {
			} else {	
				var x = Math.floor((Math.random() * 10) + 1);
				console.log($(this).attr("href"));
			
			
				countPDF++;
				//console.log(x);
				if(x <= 3) {
					//console.log(i + " " + $(this).attr("href"));
					$(this).after("  <img title='Diese PDF ist sicher - Geprüft von VerifyPDF' src='" + chrome.extension.getURL('images/16x16_gruen.png') + " '>");
				} else if(x <= 6) {
					$(this).after("  <img title='Diese PDF kann gefährlich sein - Geprüft von VerifyPDF' src='" + chrome.extension.getURL('images/16x16_orange.png') + " '>");
				} else if(x <= 8) {
					$(this).after("  <img title='Diese PDF ist gefährlich - Geprüft von VerifyPDF' src='" + chrome.extension.getURL('images/16x16_rot.png') + " '>");
				} else {
					$(this).after("  <img title='Prüfung von VerifyPDF steht aus. Bitte kurz warten oder PDF auf unserer Webseite manuell prüfen.' src='" + chrome.extension.getURL('images/16x16_grau.png') + " '>");
				}	
			}	
		}); 
		chrome.extension.sendMessage({sumPDF: "" + countPDF + ""}, function(response) {
		   console.log(response);
		});
	}, 1500);

	return true;
}

function strStartsWith(str, prefix) {
    return str.indexOf(prefix) === 0;
}
   // determineContent();

//$( window ).hashchange(function() {
	//$("a").after("  <img src='16x16.png'>");

//});
