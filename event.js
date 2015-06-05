chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.action == 'findHref') {
	determineContent();
  }
});

String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length == 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash;
};

function determineContent(){
	var countPDF;
	//setTimeout(function() {
		countPDF = 0;

		$('a[href*=".pdf"]').each(function() {
			var url = $(this).attr("href");
			// ingore google stuff
			if (/translate.google/i.test(url) || /webcache.googleusercontent/i.test(url) || url.toLowerCase().startsWith("/search?")) {
			} else {
				countPDF++;
				var opt = countPDF;
				var str = "pdf" + countPDF;
				var hash = str.hashCode();
				console.log(hash);
				if ($("#"+hash).length <= 0){
					$(this).after("  <img id='"+ hash +"' class='verifyPDF' title='Klicken Sie hier um die PDF mit VerifyPDF zu prüfen.' src='" + chrome.extension.getURL('images/16x16_grau.png') + " '>");
				}
				var thiz = $(this);
				document.getElementById(hash).addEventListener("click",
					function(e) {
						alert($(thiz).attr("href"));
					}
				);

				/*
				var x = Math.floor((Math.random() * 10) + 1);

				if(x <= 3) {
					$(this).after("  <img title='Diese PDF ist sicher - Geprüft von VerifyPDF' src='" + chrome.extension.getURL('images/16x16_gruen.png') + " '>");
				} else if(x <= 6) {
					$(this).after("  <img title='Diese PDF kann gefährlich sein - Geprüft von VerifyPDF' src='" + chrome.extension.getURL('images/16x16_orange.png') + " '>");
				} else if(x <= 8) {
					$(this).after("  <img title='Diese PDF ist gefährlich - Geprüft von VerifyPDF' src='" + chrome.extension.getURL('images/16x16_rot.png') + " '>");
				} else {
					$(this).after("  <img title='Prüfung von VerifyPDF steht aus. Bitte kurz warten oder PDF auf unserer Webseite manuell prüfen.' src='" + chrome.extension.getURL('images/16x16_grau.png') + " '>");
				}	*/
			}
		});
		chrome.extension.sendMessage({action:countPDF}, function(){});
	//}, 10);
	return true;
}
