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

if (typeof String.prototype.endsWith != 'function') {
  String.prototype.endsWith = function (str){
    return this.slice(-str.length) == str;
  };
}

function determineContent(){
	var countPDF;
	//setTimeout(function() {
		countPDF = 0;

		$('a[href*=".pdf"]').each(function() {
			var url = $(this).attr("href");
			var pdf = $(this).attr("href").split('.').pop().toLowerCase();
			
			if(pdf.startsWith("pdf")) {
				// ingore google stuff
				if (/translate.google/i.test(url) || /webcache.googleusercontent/i.test(url) || url.toLowerCase().startsWith("/search?")) {
				} else {		
					countPDF++;
					var opt = countPDF;
					var str = "pdf" + countPDF;
					var hash = str.hashCode();
					var urlTextLength = $(this).text().length;

					if ($("#"+hash).length <= 0){
						$(this).after("  <img class='check' id='"+ hash +"' class='verifyPDF' title='Klicken Sie hier um die PDF mit VerifyPDF zu prüfen.' src='" + chrome.extension.getURL('images/16x16_grey.png') + " '>");
					}
					var thiz = $(this);
					document.getElementById(hash).addEventListener("click",
						function(e) {
							//var url = $(thiz).attr("href");
							
							var loading = "<img title='Bitte warten Sie einen Augenblick, bis die PDF-Datei geprüft wurde.' id='"+ hash +"' src='" + chrome.extension.getURL('images/loading.gif') + " '>";
							$.ajax({
								type: "GET",
								crossDomain: true,
								async: true,
								dataType: 'json',
								timeout: 40000,
								url: "https://www.verifyPDF.com/api.xhtml?url="+url,
								beforeSend: function() {
									$( "#" + hash).replaceWith( loading );
								}
							}).done(function(data){
								var classifier = data["classifier"];
								var error = data["error"];

								if(error == "filenotfound") {
									$("#" + hash).replaceWith( "  <img id='"+ hash +"' class='verifyPDF' title='Diese URL kann zur Zeit nicht geprüft werden. Bitte verwenden Sie zum Prüfen unsere Webseite. (Fehler: 1e)' src='" + chrome.extension.getURL('images/16x16_grey.png') + " '>");
								} else {
									switch (classifier) {
										case "NO_RISK": 
										case "LOW_RISK":
											$("#" + hash).replaceWith( "<img class='success' id='pdf"+ hash +"' title='Diese PDF ist sicher. Sie können die PDF-Datei ohne Bedenken öffnen - Geprüft von VerifyPDF' src='" + chrome.extension.getURL('images/16x16_green.png') + " '>" );
											break;
										case "MIDDLE_RISK": 
											$("#" + hash).replaceWith( "  <img class='success' id='pdf"+ hash +"' title='Diese PDF kann gefährlich sein - Geprüft von VerifyPDF' src='" + chrome.extension.getURL('images/16x16_orange.png') + " '>");
											break;
										case "HIGH_RISK": 
										case "FATAL_RISK":
											$("#" + hash).replaceWith( "  <img class='success' id='pdf"+ hash +"' title='Diese PDF ist gefährlich. Bitte nicht öffnen - Geprüft von VerifyPDF' src='" + chrome.extension.getURL('images/16x16_red.png') + " '>");
											break;
										default: 
											$("#" + hash).replaceWith( "  <img class='success' id='pdf"+ hash +"' class='verifyPDF' title='Leider gab es einen Fehler. Sie können die Datei auch herunterladen und über unsere Webseite prüfen. (Fehler: 1d)' src='" + chrome.extension.getURL('images/16x16_grey.png') + " '>");
									}
									
									document.getElementById("pdf"+hash).addEventListener("click",
										function(e) {
											var tabUrl = "https://www.verifyPDF.com/?url="+url;
											window.open(tabUrl,'_blank');
										}	
									);	
								}	
							}).fail(function(jqXHR, status) {
								if(status === "timeout") {
									$("#" + hash).replaceWith( "  <img id='"+ hash +"' class='verifyPDF' title='Diese URL kann zur Zeit nicht geprüft werden. Bitte verwenden Sie zum Prüfen unsere Webseite. (Fehler: 1f)' src='" + chrome.extension.getURL('images/16x16_grey.png') + " '>");
								} else {	
									$("#" + hash).replaceWith( "  <img id='"+ hash +"' class='verifyPDF' title='Leider gab es einen Fehler. Sie können die Datei auch herunterladen und über unsere Webseite prüfen. (Fehler: 2f)' src='" + chrome.extension.getURL('images/16x16_grey.png') + " '>");
								}
							});
						}	
					);
					// if the 
					if(urlTextLength >= 60) {
						$("#" + hash).before("<br />");
					}
				}
			}
		});
		chrome.extension.sendMessage({action:countPDF}, function(){});
	//}, 10);
	return true;
}
