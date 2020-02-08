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
  
  sendToApi(arr[arrPoint -1]);
  
}

function sendToApi(inString){
  
  
  return out; //this should be a string of the information that the api returns
}
