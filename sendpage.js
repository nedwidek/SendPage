console.log("Creating SendPage context menu entry...");
var title = "Send this page..."
var id = chrome.contextMenus.create({"type": "normal", "title": title, "contexts":["all"], "onclick": sendMail});
console.log("SendPage context menu entry created.");

function sendMail(info, tab) {
  console.log("Sending Page: " + info.pageUrl);
  var email = "";
  var subject = mimeWordEncode(tab.title);
  var body_message = escape(info.pageUrl);
  var mailto_uri = "mailto:"+email+"?subject="+subject+"&body="+body_message;
  console.log("The MailTo URI=\n'" + mailto_uri +"'")
  
  win = window.open(mailto_uri, '_blank');
  
  if (!getWebmailOption() && win && win.open && !win.closed) {
    console.log("Closing opened window");
    setTimeout(function() {win.close();},getCloseTimeoutOption());
    console.log("done!");
  }
  console.log("Page sent!");
}

function mimeWordEncode(string) {

  if (getEncodingOption()) {
    // Uses MIME encoded-word syntax as described here https://en.wikipedia.org/wiki/MIME#Encoded-Word
    // E.g. UTF-8 or iso-8859-1
    var charset = document.defaultCharset;
    // Q for quoted printable encoding and B for base64 encoding
    var encoding = "Q";
    var encodedText = escape(string);
    // =? charset ? Q or B ? string ?=
    return "=?"+ charset +"?"+encoding+"?" + encodedText + "?=";
  } else {
    return escape(string);
  }

}

function getEncodingOption() {
  return getCheckboxOption("encoding");

}

function getWebmailOption() {
  return getCheckboxOption("webmail");
}

function getCheckboxOption(name) {
  var option = localStorage[name];
  if (typeof(option) == 'undefined' || option == 'false') {
    console.log(name + " disabled.");
    return false;
  } else {
    console.log(name + " enabled.");
    return true;
  }
}

function getCloseTimeoutOption() {
  var ms_until_close = localStorage["ms_until_close"];
  if (typeof(ms_until_close) == 'undefined' || !ms_until_close) {
    ms_until_close = 1000;
  }
  console.log("Closing timeout: " + ms_until_close);
  return ms_until_close;
}
