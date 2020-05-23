/**
 * I HAVE ADDED A COMMENT!
 * @OnlyCurrentDoc
 *
 * The above comment directs Apps Script to limit the scope of file
 * access for this add-on. It specifies that this add-on will only
 * attempt to read or modify the files in which the add-on is used,
 * and not all of the user's files. The authorization request message
 * presented to users will reflect this limited scope.
 */

/**
 * Creates a menu entry in the Google Docs UI when the document is opened.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 *
 * @param {object} e The event parameter for a simple onOpen trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode.
 */
function onOpen(e) {
  DocumentApp.getUi().createAddonMenu()
      .addItem('Start', 'showSidebar')
      .addToUi();
}

/**
 * Runs when the add-on is installed.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 *
 * @param {object} e The event parameter for a simple onInstall trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode. (In practice, onInstall triggers always
 *     run in AuthMode.FULL, but onOpen triggers may be AuthMode.LIMITED or
 *     AuthMode.NONE.)
 */
function onInstall(e) {
  onOpen(e);
}

/**
 * Opens a sidebar in the document containing the add-on's user interface.
 * This method is only used by the regular add-on, and is never called by
 * the mobile add-on version.
 */
function showSidebar() {
  var ui = HtmlService.createHtmlOutputFromFile('sidebar')
      .setTitle('ChemSaurus');
  DocumentApp.getUi().showSidebar(ui);
}

/**
 * Gets the text the user has selected. If there is no selection,
 * this function displays an error message.
 *
 * @return {Array.<string>} The selected text.
 */

function getSelectedText() {
  var selection = DocumentApp.getActiveDocument().getSelection();
  var text = [];
  if (selection) {
    var elements = selection.getSelectedElements();
    for (var i = 0; i < elements.length; ++i) {
      if (elements[i].isPartial()) {
        var element = elements[i].getElement().asText();
        var startIndex = elements[i].getStartOffset();
        var endIndex = elements[i].getEndOffsetInclusive();

        text.push(element.getText().substring(startIndex, endIndex + 1));
      } else {
        var element = elements[i].getElement();
        // Only translate elements that can be edited as text; skip images and
        // other non-text elements.
        if (element.editAsText) {
          var elementText = element.asText().getText();
          // This check is necessary to exclude images, which return a blank
          // text element.
          if (elementText) {
            text.push(elementText);
          }
        }
      }
    }
  }
  if (!text.length) throw new Error('Please place cursor on some text.');
  return text.toString();
}

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
  
  
  
  return arr[arrPoint -1];
  
}

function sendToApi(textIn, len){
  
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
  Logger.log("names: %s",names);
  return names;
  
}

function sendToApi2(textIn, len){
  
  var senStr = "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/" + textIn + "/property/MolecularFormula,MolecularWeight,IUPACName,Charge/JSON";
  var out = UrlFetchApp.fetch(senStr);
  var text = out.getContentText();
  text = text.split("[")[1];
  text = text.split("]")[0];
  Logger.log("Data: %s", text);
  return text;
  
}

function subscript(word) {
  var res = "";
  for (var i = 0; i < word.length; i++) {
    //create char vars
    var char = word.charAt(i);
    var prev = " ";
    var next = " ";
    //prevspace true/false 1/0
    var prevspace;
    if (i === 0) {
      prevspace = 1;
    }
    if (i > 0) {
      prev = word.charAt(i-1);
    }
    if (i < word.length) {
      next = word.charAt(i+1)
    }
    //if letter concat
    if ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z')) {
      res += char;
      prevspace = 0;
    }
    // if number
    else if (char >= '0' && char <= '9') {
      // if charge, remove prev space, add super
      if (next === "+" || next === "-") {
        //remove prev space
        res = res.substring(0, res.length - 1);
        //add super
        var uni;
        if (char === "0") {
          uni = 8304;
        }
        else if (char === "1") {
          uni = 185;
        }
        else if (char === "2") {
          uni = 178;
        }
        else if (char === "3") {
          uni = 179;
        }
        else if (char >= '4' && char <= '9') {
          var offset = '9' - char;
          uni = 8313 - offset;
        }
        res += String.fromCharCode(uni);
        prevspace = 0;
      }
      //if prev was space, normal
      else if (prevspace === 1) {
        res += char;
      }
      // else subscript
      else {
        var offset = '9' - char;
        var uni = 8329 - offset;
        res += String.fromCharCode(uni);
      }
      //negate prevspace
      prevspace = 0;
    }
    //if sign
    else if (char === "+" || char === "-") {
      if (prevspace === 1) {
        res += char;
      }
      else {
        if (char === "+") {
          res += String.fromCharCode(8314);
        }
        else {
          res += String.fromCharCode(8315);
        }
      }
      prevspace = 0;
    }
    else if (char === " ") {
      res += char;
      prevspace = 1;
    }
    else {
      res += char;
    }
  }
  Logger.log("Sub: %s", res);
  return res;
}

function getTextAndTranslation() {
  var text = sendToApi(getWord(), 3);
  return {
    text: text
  };
}
function getTextAndTranslation2() {
  var text = sendToApi2(getWord(), 3);
  return {
    text: text
  };
}

function insertText() {
  newText = subscript(getSelectedText());
  var selection = DocumentApp.getActiveDocument().getSelection();
  if (selection) {
    var replaced = false;
    var elements = selection.getSelectedElements();
    if (elements.length === 1 && elements[0].getElement().getType() ===
        DocumentApp.ElementType.INLINE_IMAGE) {
      throw new Error('Can\'t insert text into an image.');
    }
    for (var i = 0; i < elements.length; ++i) {
      if (elements[i].isPartial()) {
        var element = elements[i].getElement().asText();
        var startIndex = elements[i].getStartOffset();
        var endIndex = elements[i].getEndOffsetInclusive();
        element.deleteText(startIndex, endIndex);
        if (!replaced) {
          element.insertText(startIndex, newText);
          replaced = true;
        } else {
          // This block handles a selection that ends with a partial element. We
          // want to copy this partial text to the previous element so we don't
          // have a line-break before the last partial.
          var parent = element.getParent();
          var remainingText = element.getText().substring(endIndex + 1);
          parent.getPreviousSibling().asText().appendText(remainingText);
          // We cannot remove the last paragraph of a doc. If this is the case,
          // just remove the text within the last paragraph instead.
          if (parent.getNextSibling()) {
            parent.removeFromParent();
          } else {
            element.removeFromParent();
          }
        }
      } else {
        var element = elements[i].getElement();
        if (!replaced && element.editAsText) {
          // Only translate elements that can be edited as text, removing other
          // elements.
          element.clear();
          element.asText().setText(newText);
          replaced = true;
        } else {
          // We cannot remove the last paragraph of a doc. If this is the case,
          // just clear the element.
          if (element.getNextSibling()) {
            element.removeFromParent();
          } else {
            element.clear();
          }
        }
      }
    }
  } else {
    var cursor = DocumentApp.getActiveDocument().getCursor();
    var surroundingText = cursor.getSurroundingText().getText();
    var surroundingTextOffset = cursor.getSurroundingTextOffset();

    // If the cursor follows or preceds a non-space character, insert a space
    // between the character and the translation. Otherwise, just insert the
    // translation.
    if (surroundingTextOffset > 0) {
      if (surroundingText.charAt(surroundingTextOffset - 1) != ' ') {
        newText = ' ' + newText;
      }
    }
    if (surroundingTextOffset < surroundingText.length) {
      if (surroundingText.charAt(surroundingTextOffset) != ' ') {
        newText += ' ';
      }
    }
    cursor.insertText(newText);
  }
}