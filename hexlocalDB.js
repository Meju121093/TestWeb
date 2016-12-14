
var localDB = null;
function initializeDatabase(shortName, displayName, version, maxSize){
	
	//shortName="demoDatabase";
      try {
            localDB = window.openDatabase(shortName, version, displayName, maxSize);            
            
      }
      catch(e) {
            updateStatus("Error: Unable to initialize the database. Reason: " + e + ".");
            
      }
      	  
}

function createTable(query,database,createTableSuccessHandler,createTableErrorHandler){
    //var query = 'CREATE TABLE IF NOT EXISTS mgenie(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,userid VARCHAR NOT NULL,ticketid VARCHAR NOT NULL, status VARCHAR NOT NULL, comments VARCHAR NOT NULL, action VARCHAR NOT NULL);';
      //windowLog.info('createTable --> ' + query);
	updateStatus("create table called");        
	initializeDatabase(database, "1.0", "Demo", 200000);
	updateStatus("create after  init");     
	if(createTableSuccessHandler==null)
	  {		  
	  createTableSuccessHandler=success;
	  }
	  if(createTableErrorHandler==null)
	  {
	  createTableErrorHandler=error;
	  }
      try {
		updateStatus("localDB"+localDB);       
        localDB.transaction(function(transaction){
			updateStatus("inside transaction");     
            transaction.executeSql(query, [], createTableSuccessHandler, createTableErrorHandler);
            
            //updateStatus("Info: Table is created succesfully.");            
        });        
    } 
    catch (e) {
        updateStatus("Error: Unable to create a Table. Reason: " + e + ".");        
    }
}


function insertRecord(query,args,database,insertSuccess,insertError){
    //var query = "insert into mgenie (userid, ticketid, status, comments, action) VALUES (?,?,?,?,?);";
	 initializeDatabase(database, "1.0", "Demo", 200000);
      var result = false;
	    if(insertSuccess==null)
	  {
		  
	  insertSuccess=success;
	  }
	  if(insertError==null)
	  {
	  insertError=error;
	  }
      try {
      localDB.transaction(function(transaction){
            transaction.executeSql(query, args, insertSuccess, insertError);
        });
    } 
    catch (e) {
        updateStatus("Error: Unable to execute Insert Query. Reason : " + e + ".");
    }
    
}
function execute(query,args,database,executeSuccess,executeError) {
      
      var result;
	 initializeDatabase(database, "1.0", "Demo", 200000);
	  if(executeSuccess==null)
	  {
		   
	  executeSuccess=success;
	  }
	  if(executeError==null)
	  {
	  executeSuccess=error;
	  }
    try {
      result = localDB.transaction(function(transaction){
            transaction.executeSql(query, args, executeSuccess, executeError);
        });
    } 
    catch (e) {        
        updateStatus("Error: Unable to execute Query. Reason : " + e + ".");
    }
    
}

function executeSelect(query, args,database,selectTableSuccess,selectTableError){ 
	 initializeDatabase(database, "1.0", "Demo", 200000);
      var resultSet=new Array();
	  if(selectTableSuccess==null)
	  {		
		  
	  selectTableSuccess=selectSuccess;
	  }
	  if(selectTableError==null)
	  {
	  selectTableError=error;
	  }
      try { 
            localDB.transaction(function(transaction){
            transaction.executeSql(query, args, selectTableSuccess, selectTableError);            
        });
                   
    } 
      catch (e) {
             
        updateStatus("Error: Unable to execute Select Query. Reason : " + e + ".");
      
    }     
}


function dropTable(tableName,database,dropTableSucces,dropTableError){
	 initializeDatabase(database, "1.0", "Demo", 200000);
    var query = 'drop table ' + tableName + ';';
    //alert("QUERY "+query);
	 if(dropTableSucces==null)
	  {
		   
	  dropTableSucces=success;
	  }
	  if(dropTableError==null)
	  {
	  dropTableError=error;
	  }
    try {
        localDB.transaction(function(transaction){
            transaction.executeSql(query, [], dropTableSucces, dropTableError);
            //alert("Info: Table " + tableName + " is droped");
            
        });
        return true;
    } 
    catch (e) {
        updateStatus("Error: Unable to drop table. Reason: " + e + ".");
        return false;
    }
}



success=function(transaction, results){
          
                    updateStatus(results.rowsAffected+" rows affected.");                    
                       
            }
selectSuccess=function(transaction, results){
          
                    updateStatus(results.rows.length +" Records Found. ");           
                       
            }

error=function(transaction, error){
                 
                    updateStatus("Error:  "+error.message);
                     
            }
function updateStatus(message){
      /*window.status = message;
      if( document.getElementById('status') ) {
            document.getElementById('status').innerHTML = message;
      }*/
		  alert(message);
}