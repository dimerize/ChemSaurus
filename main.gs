function getWord() {
  var pos = DocumentApp.getActiveDocument().getCursor();
  var text = pos.getSurroundingText();
  var textStr = text.getText();
  var offset = pos.getSurroundingTextOffset()
  var arr = [{}];
  arr = textStr.split(" ")
  Logger.log("text: %s \n Pos: %s",arr, offset);
  var tracker = offset;
  var arrPoint = 0;
  while(tracker > 0){
    tracker = tracker - arr[arrPoint].length-1;
    Logger.log("ArrPOs: %s \n Length: %s",tracker, arr[arrPoint].length);
    arrPoint++;
  }
  Logger.log("Word: %s",arr[arrPoint -1]);
  
  sendToApi(arr[arrPoint -1], 3   );
  
}

function sendToApi(textIn, len) {
  
  var senStr = "https://pubchem.ncbi.nlm.nih.gov/rest/autocomplete/compound/" + textIn + "/json?limit=" + len;
  var out = UrlFetchApp.fetch(senStr);
  var text = out.getContentText();
  var data = JSON.parse(text);
  var names = new Array(len);
  if (data.status.code === 0) {
    for(var i = 0; i<len; i++){
      names[i] = data.dictionary_terms.compound[i];
    }
  }
  return names;
  
}

//takes string and returns it with all numbers subscripted
function subscript(word) {
  var res = "";
  for (var i = 0; i < str.length; i++) {
    var char = word.charAt(i);
    if (char >= '0' && char <= '9') {
      var offset = '9' - char;
      //8329 is unicode for subscript 9, and they're all in a line
      var uni = 8329 - offset;
      var sub = String.fromCharCode(uni);
      res += sub;
    }
    else {
      res += char;
    }
  }
  return res;
}
