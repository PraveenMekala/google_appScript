//This function will call after you opened the spreadsheet
function onOpen() {
  
  var ui = SpreadsheetApp.getUi(); 
  // Adds 'Custom Menu' to the spreadsheet.
  var menu =  ui.createMenu('Custom Menu');
  
  // Adds 'Menu Item1' to the spreadsheet.
  var menuItem1  =  menu.addItem('Menu Item1', 'menuItem1'); 
  // Adds 'Menu Item2' to the spreadsheet.
  var menuItem2  =  menu.addItem('Menu Item2', 'menuItem2');
  // Adds 'Menu Item3' to the spreadsheet.
  var menuItem3  =  menu.addItem('Menu Item3', 'menuItem3');

  menuItem1.addToUi();
  menuItem2.addToUi();
  menuItem3.addToUi();
}

function menuItem1(){
 var ui = SpreadsheetApp.getUi();
 var response = ui.alert('You have clicked Menu Item1!!!', ui.ButtonSet.OK);
}

function menuItem2(){
 var ui = SpreadsheetApp.getUi();
 var response = ui.alert('You have clicked Menu Item2!!!', ui.ButtonSet.OK);
}

function menuItem3(){
 var ui = SpreadsheetApp.getUi();
 var response = ui.alert('You have clicked Menu Item3!!!', ui.ButtonSet.OK);
}
