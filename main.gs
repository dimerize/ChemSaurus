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
  
  
  var senStr = "https://pubchem.ncbi.nlm.nih.gov/rest/autocomplete/compound/" + textIn + "/jsonp?limit=" + len;
  var getWeb = UrlFetchApp.fetch(senStr);
  var outAll = getWeb.getContentText();
  
  var arr = [{}];
  arr = outAll.split("[\n");
  arr = arr[1].split("]");
  arr = arr[0].split(",\n")
  for(var i = 0; i<arr.length; i++){
    arr[i] = arr[i].replace(/\s/g, "");
    arr[i] = arr[i].replace(/\n/g, "");
    arr[i] = arr[i].replace(/\t/g, "");
    arr[i] = arr[i].replace(/\"/g, "");
  }
  Logger.log("Content: %s", arr);
  
  return arr
  
}
