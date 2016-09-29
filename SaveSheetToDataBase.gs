
//Give your database URL
var address = 'http://127.0.0.1:8080';
//Give your database username
var user = 'root';
//Give your database password
var userPwd = 'root';
//Give your database name
var db = 'testdb';
//Complete mysql JDBC URL
var dbUrl = 'jdbc:mysql://' + address + '/' + db;  
  

function onOpen() {
  // Add a custom menu to the spreadsheet.
  var ui = SpreadsheetApp.getUi(); 
  var menu =  ui.createMenu('Trigger Menu');
  var save  =  menu.addItem('SAVE', 'saveConfirmation'); 
  save.addToUi();
}


function saveConfirmation(){
 Logger.log('In saveConfirmation');
 
 if(isSheetEmpty() == true){
   sheetEmptyAlert();
 }
 else{
   var ui = SpreadsheetApp.getUi();
   var response = ui.alert('Are you sure you want to save?', ui.ButtonSet.YES_NO);
    
   if (response == ui.Button.YES) {
       Logger.log('The user clicked "Yes."');
       saveToDB();
   } else {
       Logger.log('The user clicked "No" or the dialog\'s close button.');
   }
 }
}

function saveToDB() {
  Logger.log('In saveToDB function');
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheetData = sheet.getDataRange().getValues();
  var conn = Jdbc.getConnection(dbUrl, user, userPwd);
  conn.setAutoCommit(false);
  var stmt = conn.createStatement();
  var stmt2 = conn.prepareStatement('INSERT INTO celebrityInfo '+ '(id, displayName, twitterId, facebookId, instagramId ) values (?, ?, ?, ?, ?)');
  
  for(var i=0; i<sheetData.length; i++){
    var celebIdFromSheet = sheetData[i][0].toString();
    var count=0;
    var results = stmt.executeQuery('SELECT * FROM celebrityInfo WHERE id ='+celebIdFromSheet);
    
    while(results.next())
         count++;
    
    if(count==0){
      stmt2.setString(1, sheetData[i][0].toString());
      stmt2.setString(2, sheetData[i][1].toString());
      stmt2.setString(3, sheetData[i][2].toString());
      stmt2.setString(4, sheetData[i][3].toString());
      stmt2.setString(5, sheetData[i][4].toString());
      stmt2.addBatch();
      Logger.log('CelebrityId: '+sheetData[i][0].toString()+' added to a save batchcall');
    }
  }

    //var batch = stmt2.executeBatch();
    Logger.log('batch '+stmt2.executeBatch());
    Logger.log('Save batchcall executed successfully');
    results.close();
    stmt.close();
    conn.commit();
    conn.close();
}


function sheetEmptyAlert(){
 var ui = SpreadsheetApp.getUi();
 var response = ui.alert('Your sheet is empty!!!', ui.ButtonSet.OK);
}

function isSheetEmpty(){
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheetData = sheet.getDataRange();
    
  return sheetData.isBlank()
}

