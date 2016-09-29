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
  var save  =  menu.addItem('Update', 'updateConfirmation'); 
  save.addToUi();
}

function updateConfirmation(){
 Logger.log('In updateConfirmation')
 
  if(isSheetEmpty() == true){
   sheetEmptyAlert();
 }
 else{
  
    var ui = SpreadsheetApp.getUi();
    var response = ui.alert('Are you sure you want to update?', ui.ButtonSet.YES_NO);
    
    if (response == ui.Button.YES) {
       Logger.log('The user clicked "Yes."');
       updateToDB();
     } else {
       Logger.log('The user clicked "No" or the dialog\'s close button.');
     }
  }
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

function updateToDB() {
  Logger.log('In updateToDB function');
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheetData = sheet.getDataRange().getValues();
  var conn = Jdbc.getConnection(dbUrl, user, userPwd);
  conn.setAutoCommit(false);
  var stmt = conn.createStatement(1004,1007);
  var updateBatchStmt = conn.prepareStatement('UPDATE celebrityInfo SET displayName = ?, twitterId = ?, facebookId = ?, instagramId = ? WHERE id = ?',1004,1007);
  var insertBatchStmt = conn.prepareStatement('INSERT INTO celebrityInfo '+ '(id, displayName, twitterId, facebookId, instagramId ) values (?, ?, ?, ?, ?)',1004,1007);
  var rowsCount = 0;
  
  for(var i=0; i<sheetData.length; i++){

    var id  = sheetData[i][0].toString();
    var displayName = sheetData[i][1].toString();
    var twitterId   = sheetData[i][2].toString();
    var facebookId  = sheetData[i][3].toString();
    var instagramId = sheetData[i][4].toString();
    var results = stmt.executeQuery('SELECT * FROM celebrityInfo WHERE id ='+id);
    
    if(results.next()){
    
      var triggerFlag = 0;
      if(displayName != results.getString('displayName')){
          Logger.log('Changing CelebrityId '+id+' displayName from '+displayName+' to '+results.getString('displayName'));
          triggerFlag = 1;
       }
       
      if(twitterId != results.getString('twitterId')){
          Logger.log('Changing CelebrityId '+id+' twitterId from '+twitterId+' to '+results.getString('twitterId'));
          triggerFlag = 1;
        }
         
      if(facebookId != results.getString('facebookId')){
          Logger.log('Changing CelebrityId '+id+' facebookId from '+facebookId+' to '+results.getString('facebookId'));
          triggerFlag = 1;
       }
       
      if(instagramId != results.getString('instagramId')){
          Logger.log('Changing CelebrityId '+id+' instagramId from '+instagramId+' to '+results.getString('instagramId'));
          triggerFlag = 1;
       }
          
      if(triggerFlag == '1'){      
        updateBatchStmt.setString(5, id);
        updateBatchStmt.setString(1, displayName);
        updateBatchStmt.setString(2, twitterId);
        updateBatchStmt.setString(3, facebookId);
        updateBatchStmt.setString(4, instagramId);
        updateBatchStmt.addBatch();  
      }
      
    }else{
        Logger.log('Adding new CelebrityId '+id+' to db.')
        insertBatchStmt.setString(1, id);
        insertBatchStmt.setString(2, displayName);
        insertBatchStmt.setString(3, twitterId);
        insertBatchStmt.setString(4, facebookId);
        insertBatchStmt.setString(5, instagramId);
        insertBatchStmt.addBatch();
    }
  }
  
    updateBatchStmt.executeBatch();
    insertBatchStmt.executeBatch();
    Logger.log('Update batchcall executed successfully');
    updateBatchStmt.close();
    insertBatchStmt.close();
    results.close();
    stmt.close();
    conn.commit();
    conn.close();
}
