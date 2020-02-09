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

function sendToApi(textIn, len){
  
  var n = 4;
  var senStr = "https://pubchem.ncbi.nlm.nih.gov/rest/autocomplete/compound/" + textIn + "/json?limit=4" + len;
  var out = UrlFetchApp.fetch(senStr);
  var text = out.getContentText();
  var data = JSON.parse(text);
  var names = new Array(n);
  if (data.status.code === 0) {
    for(var i = 0; i<n; i++){
      names[i] = data.dictionary_terms.compound[i];
    }
  }
  return names;
  
}
