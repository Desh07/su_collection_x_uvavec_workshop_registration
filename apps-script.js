function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Create headers if the sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp",
      "Name",
      "Phone",
      "Email",
      "Country",
      "District",
      "Current Situation",
      "Primary Goal",
      "Skill Level"
    ]);
    
    // Formatting the header row
    var headerRange = sheet.getRange(1, 1, 1, 9);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#E87A76"); 
    headerRange.setFontColor("#FFFFFF");
    sheet.setFrozenRows(1);
  }

  try {
    var data = JSON.parse(e.postData.contents);
    
    // Prepare the row data
    var rowData = [
      new Date(), // Timestamp
      data.name || "",
      data.phone || "",
      data.email || "",
      data.country || "",
      data.district || "",
      data.currentSituation || "",
      data.primaryGoal || "",
      data.tailoringSkill || ""
    ];
    
    sheet.appendRow(rowData);
    
    return ContentService.createTextOutput(JSON.stringify({"result":"success"}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({"result":"error", "error": error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle preflight CORS requests
function doOptions(e) {
  return ContentService.createTextOutput(JSON.stringify({"result":"success"}))
    .setMimeType(ContentService.MimeType.JSON);
}
