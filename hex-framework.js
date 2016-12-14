
document.addEventListener("deviceready", readyFn, true);
var showAlert = false;
var dataSource;
var dataTarget;
var callBackFunctionPause;
var dataFileName;
var dataFileContent;
var dataOutputType;
var watchID = null;
var watchCompassID=null;
var watchGeoID=null;
var dataFileContentID;
function hex(args){
	var networkState = navigator.network.connection.type;
	var states = {};
	states[Connection.UNKNOWN] = 'Unknown connection';
	states[Connection.NONE] = 'No network connection';
	states[Connection.ETHERNET] = 'Ethernet connection';
	states[Connection.WIFI]     = 'WiFi connection';
	states[Connection.CELL_2G]  = 'Cell 2G connection';
	states[Connection.CELL_3G]  = 'Cell 3G connection';
	states[Connection.CELL_4G]  = 'Cell 4G connection';


	if(states[networkState] == 'No network connection' || states[networkState] == 'Unknown connection'){
		storeLocal(args);
	}
	else{
		invokeAdapter(args);
	}
}

function invokeJavaAdapter(args){
	var name = args.name;
	var param = args.param;
	var method = args.method;
	var format=args.Format;
	var displayFormat=args.DisplayFormat;
	if(displayFormat=="undefined")
	{
		displayFormat=null;
	}
	var data=args.Data;
	if(data=="undefined")
	{
		data=null;
	}
	var event=args.Event;
	if(event=="undefined")
	{
		event=null;
	}
	var javascriptName=args.JavascriptName;
	if(javascriptName=="undefined")
	{
		javascriptName=null;
	}
	var functionParameter=args.FunctionPatameter;
	if(functionParameter=="undefined")
	{
		functionParameter=null;
	}
	var paramKey=args.paramKey;
	if(paramKey=="undefined"){
		paramKey=null;
	}
	AjaxRequest.post(
				  {
					'url':"$serverHost/WorkQuikr-console/JavaInvoker",
					'parameters':{ 'name':name, 'method':method,"param":param,'format':format,'displayFormat':displayFormat, 'paramKey':paramKey, 'data':data,'event':event,'javascriptName':javascriptName,'functionParameter':functionParameter},  
				    'onSuccess':onSuccess,
				    'onError':onFailure
				  }
	);
}




// Webservice Invoker
function webServiceInvoker(args)
{
 alert("framework called");
  var name=args.name;
  var operation=args.operation;
  var param=args.param;
  if(param=="undefined")
  {
   param=null;
  }
  var format=args.Format;
  var displayFormat=args.DisplayFormat;
  if(displayFormat=="undefined")
  {
   displayFormat=null;
  }
  var data=args.Data;
  if(data=="undefined")
  {
   data=null;
  }
  var event=args.Event;
  if(event=="undefined")
  {
   event=null;
  }
  var javascriptName=args.JavascriptName;
  if(javascriptName=="undefined")
  {
   javascriptName=null;
  }
  var functionParameter=args.FunctionPatameter;
  if(functionParameter=="undefined")
  {
   functionParameter=null;
  }
 
 AjaxRequest.post(
     {
    'url':"$serverHost/WorkQuikr-console/WsInvoker",
    'parameters':{'name':name, 'operation':operation,"param":param,'format':format,'displayFormat':displayFormat,'data':data,'event':event,'javascriptName':javascriptName,'functionParameter':functionParameter}, 
       'onSuccess':onWebServiceResult,
       'onError':onWebServiceError
     }
   );
}
 


//SQL Adapter Invoker
function invokeAdapter(args)
{
 var name=args.name;
 var operation=args.operation;
 var param=args.param;
 if(param=="undefined")
 {
  param=null;
 }
 var format=args.Format;
 var displayFormat=args.DisplayFormat;
 if(displayFormat=="undefined")
 {
  displayFormat=null;
 }
 var data=args.Data;
 if(data=="undefined")
 {
  data=null;
 }
 var event=args.Event;
 if(event=="undefined")
 {
  event=null;
 }
 var javascriptName=args.JavascriptName;
 if(javascriptName=="undefined")
 {
  javascriptName=null;
 }
 var functionParameter=args.FunctionPatameter;
 if(functionParameter=="undefined")
 {
  functionParameter=null;
 }
 
 AjaxRequest.post(
      {
     'url':"$serverHost/WorkQuikr-console/SQLInvoker",
     'parameters':{ 'name':name, 'operation':operation,"param":param,'format':format,'displayFormat':displayFormat,'data':data,'event':event,'javascriptName':javascriptName,'functionParameter':functionParameter},  
        'onSuccess':onResult,
        'onError':onError
      }
 );
} 


function setLocalStorage(Key,Value,encEnable,encKey){
	if(encEnable){		
		var encoded = GibberishAES.enc(Value,encKey);
		localStorage.setItem(Key,encoded);
		}
	else{			
	localStorage.setItem(Key,Value);
	}
	
}

function getLocalStorage(Key,encEnable,encKey){
var encryptedtext=localStorage.getItem(Key);
	if(encEnable){
		try {
			var dec = GibberishAES.dec(encryptedtext, encKey);
			return dec;
			}catch (err) {
					alert("Invalid key");
			}
	}
	else{
	return encryptedtext;
	}
}

function storeLocal(args){
	var name=args.name;
	var procedure=args.procedure;
	var param=args.param;
	onInit();
	onCreate(name, "offlineTbl", procedure, param);
	alert("Device Offline: Stored locally");
}

function sync(jsonStringData){
MsgDisplay("Inside sync data"+jsonStringData);
	var networkState = navigator.network.connection.type;
	var states = {};
	states[Connection.UNKNOWN] = 'Unknown connection';
	states[Connection.NONE] = 'No network connection';
	states[Connection.ETHERNET] = 'Ethernet connection';
	states[Connection.WIFI]     = 'WiFi connection';
	states[Connection.CELL_2G]  = 'Cell 2G connection';
	states[Connection.CELL_3G]  = 'Cell 3G connection';
	states[Connection.CELL_4G]  = 'Cell 4G connection';

	if(states[networkState] == 'No network connection' || states[networkState] == 'Unknown connection'){
		alert("You are currently Offline");
	}
	else{
		MsgDisplay("Inside sync data else "+jsonStringData);
jsonStringData = jsonStringData.replace(/\n/g, '');
jsonStringData = jsonStringData.replace(/\r/g, '');

		var jsonObjectData = JSON.parse(jsonStringData);
MsgDisplay("WIFI Connection"+jsonObjectData);
		var name = new Array();
		var procedure = new Array();
		var param = new Array();
		var object = jsonObjectData.Table;
MsgDisplay("Got values");
		for(var i=0;i < object.length;i++){
			name=object[i].dbname;
			procedure =object[i].procedure;
			param=object[i].args;
			AjaxRequest.post(
					  {
						'url':"$serverHost/WorkQuikr-console/SQLInvoker",
						'parameters':{ 'name':name, 'procedure':procedure,"param":param},  
					    'onSuccess':onResultSync,
					    'onError':onErrorSync
					  }
			);
		}
		onDelete();
		alert("Synchronised with the server");
	}
}

onResultSync=function reqOnSuccess(req)
{
	//alert("Response "+req.responseText);
};
onErrorSync=function(req){
	//alert('Error!\nStatusText='+req.statusText+'\nContents='+req.responseText);
};

function readyFn() {
	var allInput = document.getElementsByTagName("input");
	
	for ( var i = 0; i < allInput.length; i++) {
		var dataTask = allInput[i].getAttribute('data-task');

		if (dataTask != null) {
			
			/*var dataSource = allInput[i].getAttribute('data-source');*/
			var id = allInput[i].getAttribute('id');
			var dataTimes = allInput[i].getAttribute('data-times');
			var event = allInput[i].getAttribute('data-event');
			
		/*	var dataTarget = allInput[i].getAttribute("data-target");*/
			switch (dataTask) {
			case 'notify-type-alert':
				{
				
				$("#" + id).live(event,function(){notifyAlert(this);});
				break;
				}
			case 'notify-type-confirm':{
				$("#" + id).live(event, function(){notifyConfirm(this);});
				break;
			}

			case 'notify-type-beep':
				$("#" + id).live(event,function(){notifyBeep(this);});
				break;

			case 'notify-type-vibrate':
				$("#" + id).live(event,function(){notifyVibrate(this);});
				break;
			case 'connection-type': {
				$("#" + id).live(event,function(){connectionType(this);});
				
				break;
			}
			case 'device-info': {
				
				$("#"+id).live(event,function(){deviceInfo(this);});
				break;
			}
			case 'current-acceleration': {
				
				//window.any = dataTarget;
				$("#" + id).live(event,function(){getCurrentAcceleration(this);});
				break;
			}
			case 'contact-find':{
				MsgDisplay("inside contact find");
//				var dataTarget = allInput[i].getAttribute('data-target');
//				var dataSource = allInput[i].getAttribute('data-source');
//				window.anyTarget = dataTarget;
//				window.anySource = dataSource;
//				MsgDisplay("source"+dataSource);
//				MsgDisplay("target"+dataTarget);
				MsgDisplay(id);
				MsgDisplay(event);
				$("#"+id).live(event,function(){contactFindFunction(this);});
				
			break;
			}
			
			
			case 'currentLocation': {
				
			//	window.anyTarget = dataTarget;
				
				$("#" + id).live(event,function(){getCurrentLocation(this);});
									
									
				break;
			}
			case 'Image-Gallery': {
				
				$("#"+id).live(event,function(){gallery(this);});
				break;
			}
			
			case 'capture-image': {
				
				$("#"+id).live(event,function(){captureImage(this);});
				break;
			}
			
			case 'capture-multiple-upload-image' : {
				MsgDisplay("inside multiple img");
				$("#"+id).live(event,function(){captureMultipleUploadImage(this);});
			break;
			}
			
			case 'capture-vedio': {
			
				$("#"+id).live(event,function(){captureVedio(this);});
				break;
			}
			
			case 'media-audio-play':{
			
				$("#"+id).live(event,function(){mediaAudioPlay(this);});
			break;
			}
			case 'media-audio-pause':{
				
				$("#"+id).live(event,function(){mediaAudioPause(this);});
			break;
			}
			
			case 'media-audio-stop':{
				
				$("#"+id).live(event,function(){mediaAudioStop(this);});
			break;
			}
			
			case 'compass-current-heading':{
			
				$("#"+id).live(event,function(){compassGetCurrentHeading(this);});
			break;
			}
			case 'contact-create':{
				MsgDisplay('Inside Contact create case');
				$("#"+id).live(event,function(){createContact(this);});
        break;
			}
			case 'watch-acceleration':
			{
				MsgDisplay('Inside Watch Acceleration');
				$("#"+id).live(event,function(){watchAcceleration(this);});
				break;
			}
			case 'stop-acceleration-watch':
			{
				MsgDisplay('Inside Stop Acceleration');
				$("#"+id).live(event,function(){StopAccelerationWatchComponent(this);});
				break;
			}
			case 'capture-audio':
			{
				MsgDisplay('Inside Audio Capture');
				$("#"+id).live(event,function(){CaptureAudioFile(this);});
				break;
			}
			case 'compass-watch-heading':
			{
				MsgDisplay('Inside Watch Current compass heading');
				$("#"+id).live(event,function(){CompassWatchHeading(this);});
				break;
			}
			case 'compass-clear-watch':
			{
				MsgDisplay('Inside stop Watch Current compass heading');
				$("#"+id).live(event,function(){StopCompassWatchHeading(this);});
				break;
			}
			case 'watch-geolocation':
			{
				MsgDisplay('Inside Watch Geolocation');
				$("#"+id).live(event,function(){WatchGeolocation(this);});
				break;
			}
			case 'clear-watch-geolocation':
			{
				MsgDisplay('Clear Watch');
				$("#"+id).live(event,function(){ClearWatchGeolocation(this);});
				break;
			}
			case 'menu':
			{
				MsgDisplay('back');
				$("#"+id).live(event,function(){menuFunction(this);});
				break;
			}
			
			case 'battery-status':
			{
				MsgDisplay('status battery');
				$("#"+id).live(event,function(){batteryStatus(this);});
				break;
			}
			
			case 'online-status':
			{
				MsgDisplay('online-status');
				$("#"+id).live(event,function(){onlineStatus(this);});
				break;
			}
			case 'offline-status':
			{
				MsgDisplay('offline-status');
				$("#"+id).live(event,function(){offlineStatus(this);});
				break;
			}
			case 'request-file-system':
			{
				MsgDisplay('Request file system');
				$("#"+id).live(event,function(){requestFileSystemMain(this);});
				break;
			}
				case 'resolve-file-system':
			{
				MsgDisplay('Request file system');
				$("#"+id).live(event,function(){resolveFileSystemMain(this);});
				break;
			}
			case 'file-writer':
			{
				MsgDisplay('write file system');
				$("#"+id).live(event,function(){writeFileMain(this);});
				break;
			}
			
			case 'file-reader':
			{
				MsgDisplay('read file system');
				$("#"+id).live(event,function(){readFileMain(this);});
				break;
			}
			case 'file-metadata':
			{
				MsgDisplay('File Meta data');
				$("#"+id).live(event,function(){fileMetadata(this);});
				break;
			}
				
			default:
			}
		}

	}

	
}

/*_______________________________Main Functions_______________________________*/
function fileMetadata(component)
{
MsgDisplay('Inside main funciton metadata');
dataTarget=component.getAttribute('data-target');
dataFileName=component.getAttribute('data-file-name');
fileMetadataImpl(dataTarget,dataFileName);
}

function readFileMain(component)
{
MsgDisplay('Inside Read file main');
dataTarget=component.getAttribute('data-target');
dataFileName=component.getAttribute('data-file-name');
dataOutputType=component.getAttribute('data-output-type');
readFileImpl(dataFileName,dataTarget,dataOutputType);
}

function writeFileMain(component)
{
MsgDisplay('Main FileWriter');
dataTarget=component.getAttribute('data-target');
dataFileName=component.getAttribute('data-file-name');
dataFileContentID=component.getAttribute('data-file-content');
dataFileContent=document.getElementById(dataFileContentID).value;
writeFileImpl(dataFileName,dataFileContent,dataTarget);
}
function resolveFileSystemMain(component)
{
MsgDisplay('Main resolve System');
dataSource=component.getAttribute('data-source');
dataTarget=component.getAttribute('data-target');
MsgDisplay(dataTarget);
resolveFileSystemImpl(dataSource,dataTarget);
}

function requestFileSystemMain(component)
{
MsgDisplay('Main File System');
dataTarget=component.getAttribute('data-target');
MsgDisplay(dataTarget);
requestFileSystemImpl(dataTarget);
}

function appPause(callBackFunction)
{
MsgDisplay('App Pause');
appPauseImpl(callBackFunction);
}

function offlineStatus(component)
{
MsgDisplay('online status');
	dataTarget=component.getAttribute('data-target');
	MsgDisplay('dataTarget'+dataTarget);
	offlineStatusImpl(dataTarget);
}

function onlineStatus(component)
{
MsgDisplay('online status');
	dataTarget=component.getAttribute('data-target');
	onlineStatusImpl(dataTarget);
}

function batteryStatus(component)
{
	MsgDisplay('battery status');
	dataTarget=component.getAttribute('data-target');
	batteryStatusimpl(component);
	
}

function menuFunction(component)
{
	MsgDisplay('Menu');
	menuImpl();
}
function ClearWatchGeolocation(component)
{
	MsgDisplay('Clear Watch GeoLocation');
	ClearWatchGeolocationImpl(component);
}
function WatchGeolocation(component)
{
	MsgDisplay('Inside Main Function of WatchGeoLocation');
	dataTarget=component.getAttribute('data-target');
	var dataTimeout=component.getAttribute('data-timeout');
	var dataMaximumAge=component.getAttribute('data-maximumage');
	WatchGeolocationImpl(dataTarget,dataTimeout,dataMaximumAge);
	
}

function StopCompassWatchHeading(component)
{
	MsgDisplay('Inside Stop main compass');
	StopCompassWatchHeadingImpl(component);
}
function CompassWatchHeading(component)
{
	MsgDisplay('Inside Compass watch heading');
	dataTarget=component.getAttribute('data-target');
	var dataFrequency=component.getAttribute("data-frequency");
	CompassWatchHeadingImpl(dataTarget,dataFrequency);
}

function CaptureAudioFile(component)
{
	MsgDisplay("inside Main Capture Audio");
	dataTarget=component.getAttribute("data-target");
	var dataLimit=component.getAttribute("data-limit");
	MsgDisplay('data target and data limit'+dataTarget+dataLimit);
	CaptureAudioFileImpl(dataTarget,dataLimit);
}
function StopAccelerationWatchComponent(component)
{
	MsgDisplay('Inside Stop Accepeleration Main method');
	StopAccelerationWatchImpl(component);
}

function watchAcceleration(component)
{
	MsgDisplay('inside Watch Acceleration Main function');
	dataTarget=component.getAttribute("data-target");
	MsgDisplay('dataTarget'+dataTarget);
	var dataFrequency=component.getAttribute("data-frequency");
	MsgDisplay('dataFrequency'+dataFrequency);
	watchAccelerationImpl(dataTarget,dataFrequency);
}


function createContact(component)
{
	MsgDisplay("entered Contact Create main");
	var dataDisplayName=component.getAttribute("data-contact-displayname");
	MsgDisplay("DisplayName"+dataDisplayName);
	var dataGivenName=component.getAttribute("data-contact-givenname");
	var dataFamilyName=component.getAttribute("data-contact-familyname");
	var dataPhoneNumber=component.getAttribute("data-contact-phonenumbers");
	createContactImpl(dataDisplayName,dataGivenName,dataFamilyName,dataPhoneNumber);
}
function captureVedio(component)
{
	var dataTarget=component.getAttribute("data-target");
	var dataLimit=component.getAttribute("data-limit");
	captureVedioImpl(dataTarget,dataLimit);
}

function compassGetCurrentHeading(component)
{
	var dataTarget = component.getAttribute("data-target");
	compassGetCurrentHeadingImpl(dataTarget);
}
function connectionType(component)
{
	var dataTarget = component.getAttribute("data-target");
	connectionTypeImpl(dataTarget);
	
	
}


function contactFindFunction (component) {
	MsgDisplay("contactFindFunction Called");
	dataSource=component.getAttribute("data-source");
	dataTarget=component.getAttribute("data-target");
	MsgDisplay("source and target"+dataSource+dataTarget);
		soure=document.getElementById(dataSource).value;
	MsgDisplay("source-y-val"+soure);
	var options = new ContactFindOptions();
	options.filter = soure;
	var fields = [ "displayName", "name",
			"phoneNumbers" ];
	contactFindImpl(options,fields,dataSource,dataTarget);
	
 
};




function getCurrentLocation(component) {
dataTarget = component.getAttribute("data-target");
	MsgDisplay(dataTarget);
	getCurrentLocationImpl(dataTarget);
	  };
	  

	  
	  
	 
	  
	  function getCurrentAcceleration(component)
	  {
		dataTarget = component.getAttribute("data-target");
		 getCurrentAccelerationImpl(dataTarget);
		  
	  }
	  
	  
	 
	  
	  function notifyVibrate(component)
	  {
		  var dataTimes=component.getAttribute("data-times");
			notifyVibrateImpl(dataTimes);
			}
	  
	 
	  
	  function notifyBeep(component)
	  {
		  var dataTimes=component.getAttribute("data-times");
		  notifyBeepImpl(dataTimes);
		  
	  }
	  
	 
	  function notifyAlert(component)
	  {
		  dataSource=component.getAttribute("data-source");
		  var dataCaption = component.getAttribute('data-caption');
			var dataTitle = component.getAttribute('data-title');
			var source = document.getElementById(dataSource).value;
		 notifyAlertimpl(source,dataTitle, dataCaption);
			
	  }
	  
	  function notifyConfirm(component)
	  {
		  dataSource=component.getAttribute("data-source");
		  var source = document.getElementById(dataSource).value;
			
			var dataTitle = component.getAttribute('data-title');
			
			var dataButtonCaption=component.getAttribute('data-button-captions');
			notifyConfirmimpl(source, dataTitle,dataButtonCaption);
			
		}

	  function gallery(component)
	  {
		  function PictureType(){};
		  PictureType.PHOTO_LIBRARY = 1;
			PictureType.CAMERA = 0;
	  	MsgDisplay("inside gallery image");
	  	dataTarget=component.getAttribute("data-target");
	  	MsgDisplay("target"+dataTarget);
	  	sourceType=PictureType.PHOTOLIBRARY;
	  	     var options = { quality: 50 };
	       
	  	   options["sourceType"] = navigator.camera.PictureSourceType.PHOTOLIBRARY;
	  	     if (sourceType != undefined) {
	      	 MsgDisplay('sourcer');
	      	 MsgDisplay('inside if');
	           
	       }
	       
	       MsgDisplay('options used');
	       // if no sourceType specified, the default is CAMERA 
	       GalleryImpl(options,dataTarget);
	  }
	  
function captureImage(component)
{
	function PictureSourceType(){};
	PictureSourceType.PHOTO_LIBRARY = 0;
	PictureSourceType.CAMERA = 1;
	MsgDisplay("inside capture image");
	dataTarget=component.getAttribute("data-target");
	MsgDisplay("target"+dataTarget);
	sourceType=PictureSourceType.CAMERA;
	     var options = { quality: 50 };
     if (sourceType != undefined) {
    	 MsgDisplay('sourcer');
    	 MsgDisplay('inside if');
          options["sourceType"] = sourceType;
     }
     
     MsgDisplay('options used');
     // if no sourceType specified, the default is CAMERA 
     captureImageImpl(options,dataTarget);
}
function captureMultipleUploadImage(component)
{
	MsgDisplay("inside capture image");
	dataURL=component.getAttribute("data-url");
	MsgDisplay("data url>>"+dataURL);
	dataLimit=component.getAttribute("data-limit");
	captureMultipleUploadImageImpl(dataURL,dataLimit);
}

function deviceInfo(component)
{
	var dataTarget=component.getAttribute("data-target");
	deviceInfoImpl(dataTarget);
	
}
function mediaAudioPlay(component){
	
	dataSource=component.getAttribute("data-source");
	var dataSourceValue=$("#"+dataSource).val();
	var dataAudioPosition=component.getAttribute("data-audio-position");
	mediaAudioPlayImpl(dataSourceValue,dataAudioPosition);
}

function mediaAudioStop(component){
	mediaAudioStopImpl(component);
}

function mediaAudioPause(component)
{
	mediaAudioPauseImpl();
}

	/*___________________________Implementation Layer___________________________*/
function fileMetadataImpl(dataTarget,dataFileName)
{
MsgDisplay('Inside filemetadataImpl file Impl');
  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileMetadataFunction, onErrorfileMetadata);

}
function onErrorfileMetadata()
{
alert('Error in file manifest 1');
}

function readFileImpl(dataFileName,dataTarget,dataOutputType)
{
MsgDisplay('Inside read file Impl');
  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, readFileFunction, onErrorReadFileFunction);
}


function writeFileImpl(dataFileName,dataFileContent,dataTarget)
{
MsgDisplay('Inside Impl file Writer');
window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, WriteFileSystem, OnErrorLocalFileSystemFailure);
}

function WriteFileSystem(fileSystem)
{
MsgDisplay('inside write filesystem');
 fileSystem.root.getFile(dataFileName, {create: true, exclusive: false}, FileEntryFunction, onFailWriteSystem);
}
function FileEntryFunction(fileEntry)
{
MsgDisplay('Inside File Entry fxn');
  fileEntry.createWriter(onSuccessFileWriter, onErrorFileWriter);
  var uri=fileEntry.toURI();
  document.getElementById(dataTarget).value=uri;
  MsgDisplay('URI'+uri);
}
function resolveFileSystemImpl(dataSource,dataTarget)
{

MsgDisplay('Inside impl resolve file system');
window.resolveLocalFileSystemURI(dataSource, onresolveFileSystemSuccess, onresolveFileSystemError);

}
function requestFileSystemImpl(dataTarget)
{
MsgDisplay('Inside impl request file system');
 window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, onFileSystemError);

}
function appPauseImpl(callBackFunctionPause)
{
MsgDisplay('Impl Offline Status');
document.addEventListener("offline",callBackFunction, false);
}
function offlineStatusImpl(dataTarget)
{
MsgDisplay('Impl Offline Status');
document.addEventListener("offline", offlineStatusSuccess, false);
}
function onlineStatusImpl(dataTarget)
{
MsgDisplay('Impl Online Status');
document.addEventListener("online", onlineStatusSuccess, false);

}

function menuImpl(component)
{
document.addEventListener("menubutton", MenuSuccess, false);

}
function batteryStatusimpl(component)
{
 window.addEventListener("batterystatus", onBatteryStatus, false);

}	
	


function ClearWatchGeolocationImpl(component)
{
	MsgDisplay('inside Impl');
	if (watchGeoID != null) {
        navigator.geolocation.clearWatch(watchGeoID);
        watchGeoID = null;
    }
	else
	{
		alert('No Geolocation Watch to clear');
	}

}
function WatchGeolocationImpl(dataTarget,dataTimeout,dataMaximumAge)
{
	MsgDisplay('Inside Impl');
	var options={maximumAge:dataMaximumAge,timeout : dataTimeout, enableHighAccuracy: true,};
	watchGeoID=navigator.geolocation.watchPosition(onGeoWatchSuccess, onGeoWatchError, options);
	
}
function CompassWatchHeadingImpl(dataTarget,dataFrequency)
{
	MsgDisplay('Inside Impl');
	var options = { frequency: dataFrequency };  // Update every 3 seconds

	watchCompassID = navigator.compass.watchHeading(onCompassWatchheadingSuccess, onCompassWatchheadingError, options);
}

function StopCompassWatchHeadingImpl(component)
{
	if(watchCompassID)
	{
        navigator.compass.clearWatch(watchCompassID);
        watchCompassID = null;
	}
	else
	{
		alert("No compass watch to clear");
	}
	
}
function CaptureAudioFileImpl(dataTarget,dataLimit)
{
	MsgDisplay('inside impl of audio capture'+dataTarget+dataLimit);
	navigator.device.capture.captureAudio(captureAudioSuccess, captureAudioError, {limit: dataLimit});
}

function StopAccelerationWatchImpl(component)
{
	if(watchID){
	navigator.accelerometer.clearWatch(watchID);
	watchID=null;
	}
	else
	{
		alert('You are not watching the acceleration to clear it..');
	}
	
}
function watchAccelerationImpl(dataTarget,dataFrequency)
{
	MsgDisplay('Inside Watch Acceleration Implementation'+'  '+dataTarget+' '+dataFrequency);
	var options = { frequency: dataFrequency };
	   watchID = navigator.accelerometer.watchAcceleration(onSuccessWatchAcceleration, onErrorWatchAcceleration, options);
MsgDisplay('watchID'+watchID);

	

}
function createContactImpl(DisplayNameValue,dataGivenNameValue,dataFamilyNameValue,dataPhoneNumberValue)
{
	MsgDisplay("DisplayName Implementation"+DisplayNameValue);
	var contact = navigator.contacts.create();
	MsgDisplay("0");
	contact.displayName = DisplayNameValue;
	MsgDisplay("1"+contact.displayName);
	contact.nickname = DisplayNameValue;
	MsgDisplay("2"+contact.displayName);
	var name = new ContactName();
	MsgDisplay("3");
	name.givenName = dataGivenNameValue;
	MsgDisplay("4"+name.givenName);
	name.familyName = dataFamilyNameValue;
	MsgDisplay("5"+name.familyName);
	 var phoneNumbersForThisContact = [];
	 phoneNumbersForThisContact[0] = new ContactField('work', dataPhoneNumberValue, false);
	 contact.phoneNumbers=phoneNumbersForThisContact;
	MsgDisplay('Phone Number '+contact.phoneNumbers);
	contact.name = name;
MsgDisplay("Contactr to create"+contact);
	contact.save(ContactCreateonSuccess,ContactCreateonFailure);
}

function captureVedioImpl(dataTarget,dataLimit)
{
	MsgDisplay("dataLimit"+dataLimit);
	MsgDisplay('dataTarget'+dataTarget);
	  navigator.device.capture.captureVideo(captureVedioSuccess, captureVedioError, {limit: dataLimit});
}

function compassGetCurrentHeadingImpl(dataTarget)
{
	window.ra=dataTarget;
    navigator.compass.getCurrentHeading(oncompassGetCurrentHeadingSuccess, oncompassGetCurrentHeadingError);
}

function deviceInfoImpl(dataTarget)
{
	
        var target = document.getElementById(dataTarget);

        target.innerHTML = 'Device Name: '     + device.name     + '<br />' + 
                            'Device Platform: ' + device.platform + '<br />' + 
                            'Device UUID: '     + device.uuid     + '<br />' + 
                            'Device Version: '  + device.version  + '<br />';
    }





function mediaAudioStopImpl(component)
{
	if (my_media) {
        my_media.stop();
    }
    clearInterval(mediaTimer);
    mediaTimer = null;
}




function mediaAudioPauseImpl()
{
	 if (my_media) {
         my_media.pause();
     }
}


function mediaAudioPlayImpl(dataSourceValue,dataAudioPosition)
{
	  my_media = new Media(dataSourceValue, onMediaAudioPlaySuccess, onMediaAudioPlayError);

      // Play audio
      my_media.play();

      // Update my_media position every second
      if (mediaTimer == null) {
          mediaTimer = setInterval(function() {
              // get my_media position
              my_media.getCurrentPosition(
                  // success callback
                  function(position) {
                      if (position > -1) {
                          setMediaAudioPosition(dataAudioPosition,(position) + " sec");
                      }
                  },
                  // error callback
                  function(e) {
                      console.log("Error getting pos=" + e);
                      setAudioPosition("Error: " + e);
                  }
              );
          }, 1000);
      }
}

function captureMultipleUploadImageImpl(dataURL,dataLimit)
{
	MsgDisplay('dataURL'+dataURL);
	MsgDisplay('dataURL'+dataLimit);
	navigator.device.capture.captureImage(captureMultipleUploadImageSuccess, 

			captureMultipleUploadImageError, {limit: dataLimit});	
}

function captureImageImpl(options,dataTarget)
{
	MsgDisplay("inside impl");
	navigator.camera.getPicture(captureImage_Success,captureImage_Fail, options);
}

function GalleryImpl(options,dataTarget)
{
	MsgDisplay("inside impl");
	navigator.camera.getPicture(Gallery_Success,Gallery_Fail, options);
}

function contactFindImpl(options,fields,dataSource,dataTarget)
{
	  MsgDisplay("in impl"+dataSource+dataTarget);
	  navigator.contacts.find(fields,onSuccessContactFind,onError, options);
}

function getCurrentLocationImpl(dataTarget)
{
	  MsgDisplay("data target in impl");
	  navigator.geolocation.getCurrentPosition(onSuccessCurrentLocation, onErrorCurrentLocation);
}

function getCurrentAccelerationImpl(dataTarget)
{
	  navigator.accelerometer.getCurrentAcceleration(onSuccessCurrentAcceleration,onErrorCurrentAcceleration);

}

function notifyVibrateImpl(dataTimes)
{
		navigator.notification.vibrate(dataTimes);
}

function notifyBeepImpl(dataTimes)
{
	  navigator.notification.beep(dataTimes);
}

function notifyAlertimpl(source,dataTitle,dataCaption)
{
	  navigator.notification.alert(source,dataTitle, dataCaption);
}

function notifyConfirmimpl(source,dataTitle,dataButtonCaption)
{
	
	
		navigator.notification.confirm(source,ConfirmCallBack,dataTitle,dataButtonCaption);
		  
}

function connectionTypeImpl(dataTarget)
{
	var networkState =  navigator.network.connection.type;
		var states = {};
		states[Connection.UNKNOWN] = 'Unknown connection';
		states[Connection.ETHERNET] = 'Ethernet connection';
		states[Connection.WIFI] = 'WiFi connection';
		states[Connection.CELL_2G] = 'Cell 2G connection';
		states[Connection.CELL_3G] = 'Cell 3G connection';
		states[Connection.CELL_4G] = 'Cell 4G connection';
		states[Connection.NONE] = 'No network connection';
		document.getElementById(dataTarget).value = states[networkState];
		
	 
}

/*_______________________________Support Functions__________________________*/
function fileMetadataFunction(fileSystem)
{
MsgDisplay('Inside Meta data  function');
fileSystem.root.getFile(dataFileName, null, fileMetadataSuccess, onErrorfileMetadata);
}

function readFileFunction(fileSystem)
{
MsgDisplay('Inside read file function');
fileSystem.root.getFile(dataFileName, null, readFileEntry, onErrorReadFileEntry);
}
function fileMetadataSuccess(metadata)
{
MsgDisplay("iNSIDE FILE META SUCCES");
console.log("Last Modified: " + metadata.modificationTime);
document.getElementById(dataTarget).value="Last Modified: " + metadata.modificationTime;
}
function onErrorfileMetadata()
{
alert('Error in getting metadata');
}
function readFileEntry(fileEntry)
{
MsgDisplay('Inside read file Entry');
 fileEntry.file(getFileData, getFileDatafail);
}
function getFileData(file)
{
MsgDisplay('Inside condition verifier');
if(dataOutputType=="uri")
{
	MsgDisplay('URi');
 		readDataUrl(file);
 }
 else
 {
 MsgDisplay('text');
         readAsText(file);
}
}
function readDataUrl(file)
{
MsgDisplay('Inside Read data URi');
var reader = new FileReader();
        reader.onloadend = function(evt) {
            console.log("Read as data URL");
            console.log(evt.target.result);
            document.getElementById(dataTarget).value=evt.target.result;
        };
        reader.readAsDataURL(file);
}
function readAsText(file)
{
MsgDisplay('Inside Text read ');
var reader = new FileReader();
        reader.onloadend = function(evt) {
            console.log("Read as text");
           document.getElementById(dataTarget).value=evt.target.result;
        };
        reader.readAsText(file);
}
function getFileDatafail()
{
alert("GetFile Data Failed");
}
function onErrorReadFileEntry()
{
alert('File read failed');
}
function onErrorReadFileFunction()
{
alert('read file error ');
}
function onSuccessFileWriter(writer)
{
MsgDisplay('Inside On Success');
 writer.onwriteend = function(evt) {
            console.log("contents of file");
            writer.truncate(11);  
            writer.onwriteend = function(evt) {
                console.log("contents of file 1");
                writer.seek(4);
                writer.write(dataFileContent);
                writer.onwriteend = function(evt){
                    console.log("contents of file 2");
                }
            };
        };
        writer.write("");
}

function onErrorFileWriter()
{
alert('Error Creating File');
}

function OnErrorLocalFileSystemFailure()
{
alert('could not find persistant file system');
}
function onresolveFileSystemSuccess(fileEntry)
{
document.getElementById(dataTarget).value="Name:"+fileEntry.name;
}
function onresolveFileSystemError()
{
alert('Cannot Resolve the File System');
}
function onFileSystemSuccess(fileSystem)
{
MsgDisplay('Inside Success');
document.getElementById(dataTarget).value=fileSystem.name;
}
function onFailWriteSystem()
{
alert('cannot initialize file system');
}
function onFileSystemError(evt)
{
        console.log(evt.target.error.code);
   alert('Error in file system');
}
function offlineStatusSuccess()
{
MsgDisplay('Success offline');
document.getElementById(dataTarget).value="Online";
alert('you are online!');
}
function onlineStatusSuccess()
{
MsgDisplay('Success Online');
document.getElementById(dataTarget).value="Online";
alert('you are online!');
}


function onBatteryStatus(info)
{
document.getElementById(dataTarget).value="Level: " + info.level + " isPlugged: " + info.isPlugged;
}
function MenuSuccess()
{
alert('Menu button Pressed');
}

/*watch Geoloaction*/
function onGeoWatchSuccess(position)
{
	MsgDisplay('Inside Success Geo');
	document.getElementById(dataTarget).value='Latitude: '  + position.coords.latitude      + '<br />' +
    'Longitude: ' + position.coords.longitude     + '<br />';

}
function onGeoWatchError()
{
	alert('Could not watch geolocation');
}


/*watch Compass Heading*/
function onCompassWatchheadingSuccess(heading)
{
	MsgDisplay('inside success'+dataTarget);
	document.getElementById(dataTarget).value=heading.magneticHeading;
	
}
function onCompassWatchheadingError()
{
	alert('Some Problem in Watching compass heading');
}

/* Audio Capture*/

function captureAudioSuccess(mediaFile)
{
	var  path = mediaFile[0].fullPath;
    var name = mediaFile[0].name;
    MsgDisplay('Name and Path'+name+path);
    MsgDisplay('Length'+mediaFile.length);
    var i,len;
    var OutPutText="";
    for (i = 0, len = mediaFile.length; i < len; i++) {
        MsgDisplay(mediaFile[i].name);
        OutPutText="Name Of the file: "+mediaFile[i].name+"\n"+"Path of the file is: "+mediaFile[i].fullPath+"\n";
    }
    document.getElementById(dataTarget).value=OutPutText;
}
function captureAudioError()
{
	alert("Could not capture Audio");
}
/*Watch Acceleration*/

function onSuccessWatchAcceleration(acceleration)
{
	MsgDisplay('On Success Watch Acceleration'+dataTarget);
	document.getElementById(dataTarget).value='Acceleration X: ' + acceleration.x + '<br />' +
    'Acceleration Y: ' + acceleration.y + '<br />' +
    'Acceleration Z: ' + acceleration.z + '<br />' +
    'Timestamp: '      + acceleration.timestamp + '<br />';

}

function onErrorWatchAcceleration()
{
	alert("Could Not Watch Acceleration");
}

/*Create Contact*/
function ContactCreateonSuccess()
{
	alert("Success Saving new Contact");
}
function ContactCreateonFailure(contactError)
{
	alert("Couldn't save new contact"+contactError.code);
}
						
						/*Capute Vedio*/

function captureVedioSuccess(mediaFiles)
{
	MsgDisplay("target"+dataTarget);
	 var i, len;
     for (i = 0, len = mediaFiles.length; i < len; i += 1) {
    	 alert("The Vedio has been captured - details :"+"Name of the file"+mediaFiles[i].name+"Please Check in the Path: "+mediaFiles[i].fullPath);
    	 /* var dynamicHTML="";
          dynamicHTML+="<video width="+'"'+320+'"'+" height="+'"'+240+'"'+" controls="+'"'+"controls"+'"'+">";
          dynamicHTML+="<source src=";
          dynamicHTML+='"'+mediaFiles[i].fullPath+'"';
          dynamicHTML+=" type="+'"'+'"'+"video/3gp"+'"'+"/>";
          dynamicHTML+="no Support";
          dynamicHTML+="</vedio>";
          MsgDisplay('dynamic'+dynamicHTML);document.getElementById("getstar").innerHTML=dynamicHTML;*/
       
     }       
     
}


function captureVedioError()
{
	alert("Video was not captured");
}
						/*Compass Heading*/
function oncompassGetCurrentHeadingSuccess(heading)
{
	MsgDisplay('Inside On Success Compass');
	document.getElementById(window.ra).value=heading.magneticHeading;
}
function oncompassGetCurrentHeadingError()
{
	alert('Compass is not Supported in your device!');
}

							/*Media Audio*/
function setMediaAudioPosition(dataAudioPosition,position) {
    document.getElementById(dataAudioPosition).innerHTML = position;
}
function onMediaAudioPlaySuccess()
{
	alert("Media Audio success");
}
function onMediaAudioPlayError()
{
	alert("failed to play audio");
}

							/*Capture Multiple Image and Upload*/
function captureMultipleUploadImageSuccess(mediaFiles)
{
	MsgDisplay("Inside impl camera");
	var connection = navigator.network.connection.type;
	var state = {};
	state[Connection.UNKNOWN] = 'Unknown connection';
	state[Connection.NONE] = 'No network connection';
	state[Connection.ETHERNET] = 'Ethernet connection';
	state[Connection.WIFI]     = 'WiFi connection';
	state[Connection.CELL_2G]  = 'Cell 2G connection';
	state[Connection.CELL_3G]  = 'Cell 3G connection';
	state[Connection.CELL_4G]  = 'Cell 4G connection';
	
	if(state[connection] == 'No network connection' || state[connection] == 'Unknown connection'){
		MsgDisplay("Navigator - - "+state[connection]);
		for (i = 0, len = mediaFiles.length; i < len; i += 1) {
			MsgDisplay("Media "+mediaFiles[i].name+mediaFiles[i].fullPath+dataURL);
			storeImageLocal(mediaFiles[i].name,mediaFiles[i].fullPath,dataURL);
		}
	}
	else{
		MsgDisplay("Navigator - - "+state[connection]);
		var i, len;
		for (i = 0, len = mediaFiles.length; i < len; i += 1) {
			uploadFile(mediaFiles[i],dataURL);
		}
	}
}


function storeImageLocal(name, file, url){
	MsgDisplay("Inside storeImageLocal");
	onInit();
window.imageName = name;
	onCreateImage("offlineTbl", name, file, url);
}

function syncImg(jsonString){
	MsgDisplay(" syncImg "+jsonString);
	var networkState1 = navigator.network.connection.type;
	var states1 = {};
	states1[Connection.UNKNOWN] = 'Unknown connection';
	states1[Connection.NONE] = 'No network connection';
	states1[Connection.ETHERNET] = 'Ethernet connection';
	states1[Connection.WIFI]     = 'WiFi connection';
	states1[Connection.CELL_2G]  = 'Cell 2G connection';
	states1[Connection.CELL_3G]  = 'Cell 3G connection';
	states1[Connection.CELL_4G]  = 'Cell 4G connection';
	
	if(states1[networkState1] == 'No network connection' || states1[networkState1] == 'Unknown connection'){
		alert("You are currently Offline");
	}
	else{
		var val = JSON.parse(jsonString);
		var image = new Array();
		var url = new Array();
		var name = new Array();
		var obj = val.Table;
		MsgDisplay("Object "+obj);
		for(var i=0;i < obj.length;i++){
			name = obj[i].name;
			image =obj[i].image;
			url=obj[i].url;
		
			uploadFileOffline(name, image, url);
	}

	onDelete();
	}
}

function captureMultipleUploadImageError()
{
	alert("Images weren't captured! ");
}

function uploadFileOffline(name, path,dataURL) {
	MsgDisplay('inside offline upload - data url is '+dataURL);
	window.imageName = name;
	var ft = new FileTransfer(), path, name;
	MsgDisplay('Path and name>>'+path+'>> '+name);
	    ft.upload(path,dataURL,function(result) {
	            MsgDisplay('Upload success: ' + result.responseCode);
	            MsgDisplay(result.bytesSent + ' bytes sent');
	        },
	        function(error) {
	            MsgDisplay('Error uploading file ' + path + ': ' + error.code);
	        },
	        { fileName: name },true);   
}

function uploadFile(mediaFile,dataURL) {
MsgDisplay('inside Upload File');
MsgDisplay('insied upload - data url is '+dataURL);

var ft = new FileTransfer(),
        path = mediaFile.fullPath,
        name = mediaFile.name;
	window.imageName = name;
MsgDisplay('Path and name>>'+path+'>>>>'+name);
    ft.upload(path,dataURL,function(result) {
              if(result.responseCode!=null);
            MsgDisplay('Upload success: ' + result.responseCode);
            MsgDisplay(result.bytesSent + ' bytes sent');
        },
        function(error) {
            MsgDisplay('Error uploading file ' + path + ': ' + error.code);
        },
        { fileName: name },true);   
}

							/*Capture Image*/

function Gallery_Success(imageData)
{
	MsgDisplay('inside success');
	MsgDisplay('data Target>>'+dataTarget);
               
         var dynamicHTML="";
         dynamicHTML+="<img src=";
         dynamicHTML+='"'+imageData+'"';
         dynamicHTML+=" "+"style="+'"'+"width:200px;height:290px"+'"';
         dynamicHTML+="/>";
         
         document.getElementById(dataTarget).innerHTML=dynamicHTML;
   
}
function Gallery_Fail(message) {
	alert('No Image is selected from the Gallery');
}
function captureImage_Success(imageData)
{
	MsgDisplay('inside success');
	MsgDisplay('data Target>>'+dataTarget);
               
         var dynamicHTML="";
         dynamicHTML+="<img src=";
         dynamicHTML+='"'+imageData+'"';
         dynamicHTML+=" "+"style="+'"'+"width:200px;height:290px"+'"';
         dynamicHTML+="/>";
         
         document.getElementById(dataTarget).innerHTML=dynamicHTML;
   
}

function captureImage_Fail(message) {
	alert('No Image Captured');
}


							/*Contact Find*/
	 
function onSuccessContactFind(contacts) {
			MsgDisplay("inside on success");
			MsgDisplay(dataTarget);
			document.getElementById(dataTarget).value = "";
			if(contacts.length>0){
			for ( var i = 0; i < contacts.length; i++) {
				MsgDisplay("inside success for loop");
				MsgDisplay('name of the contact is '+contacts[i].displayName);
				MsgDisplay("tength of phone number is "
						+ contacts[i].phoneNumbers.length);
				for ( var j = 0; j <= contacts[i].phoneNumbers.length; j++) {
					MsgDisplay("inside success phone number for loop");
					document.getElementById(dataTarget).value += contacts[i].phoneNumbers[j].value + '\n';
				}
				}
			}
				else
				{
				alert("No such contact in the directory");
				}
		} ;

		function onError() {
		alert("No Such Contact in your Directory");
		};
	  
								/*Message Display fr development purpose*/
	  function MsgDisplay(message)
	  {
		  if(showAlert) {
			  alert(message);
		  }
	  }
	  
	  							/*Get Current Geo Location*/
	  
	  function onSuccessCurrentLocation(position) {
		  
		  var valueOfLocation='Latitude: '+ position.coords.latitude+ '\n'+
		     'Longitude: '          + position.coords.longitude             + '\n' +
		     'Altitude: '           + position.coords.altitude              + '\n' +
		     'Accuracy: '           + position.coords.accuracy              + '\n' +
		     'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '\n' +
		     'Heading: '            + position.coords.heading               + '\n' +
		     'Speed: '              + position.coords.speed                 + '\n' +
		     'Timestamp: '          + new Date(position.timestamp)          + '\n';
		  
		  document.getElementById(dataTarget).value=valueOfLocation;
	  }
	  
	  
	  function onErrorCurrentLocation()
	  {
		  alert("Geolocation Feature is Not Supported In your Device");
	  }
	  
	  							/*Get Current Acceleration*/
	
	  
	  function onSuccessCurrentAcceleration(acceleration)
	  {		var tmp = "X :["
						+ acceleration.x
						+ "] Y: ["
						+ acceleration.y
						+ "]"+
          "z :[ " + acceleration.z +"]"+
          " Timestamp: "      + acceleration.timestamp + "<br />";
				document.getElementById(dataTarget).value = tmp;
			
	  }
	  
	  function onErrorCurrentAcceleration()
	  {
		  
				alert('There is no Accelerometer is no in your device');
	  }
