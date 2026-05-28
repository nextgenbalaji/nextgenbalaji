/* =====================================================
BALAJI NEXTGEN ERP
api-engine.js
FINAL FIXED VERSION
===================================================== */

/* =====================================================
GLOBAL API VARIABLES
===================================================== */

let AUTH_API = "";
let CORE_API = "";

/* =====================================================
SHOW MESSAGE FUNCTION
===================================================== */

function showMessage(message,type="info"){

if(type === "success"){

alert(message);

}
else if(type === "error"){

alert(message);

}
else{

alert(message);

}

}

/* =====================================================
LOAD API REGISTRY
===================================================== */

async function loadAPIRegistry(){

try{

console.log(
"LOADING ERP API REGISTRY..."
);

const sheetURL =
"https://opensheet.elk.sh/1FuNJ_XejE2ekYTnk71wXVZ79hRJgu7pmIA6fuE-Iu7I/API_DEPLOYMENT_REGISTRY";

const response =
await fetch(sheetURL);

const data =
await response.json();

console.log(
"REGISTRY DATA:",
data
);

/* =====================================================
FIND AUTH API
===================================================== */

const authRow =
data.find(row =>
String(row.APP_NAME).trim() === "V2_AUTH"
);

if(authRow){

AUTH_API =
String(authRow.WEBAPP_URL).trim();

console.log(
"AUTH API FOUND:",
AUTH_API
);

}

/* =====================================================
FIND CORE API
===================================================== */

const coreRow =
data.find(row =>
String(row.APP_NAME).trim() === "V2_CORE"
);

if(coreRow){

CORE_API =
String(coreRow.WEBAPP_URL).trim();

console.log(
"CORE API FOUND:",
CORE_API
);

}

}
catch(error){

console.log(
"API REGISTRY ERROR:",
error
);

showMessage(
"API REGISTRY LOAD FAILED",
"error"
);

}

}

/* =====================================================
LOGIN FUNCTION
===================================================== */

async function loginERP(){

try{

/* =====================================================
INPUT VALUES
===================================================== */

const username =
document
.getElementById("username")
.value
.trim();

const password =
document
.getElementById("password")
.value
.trim();

/* =====================================================
VALIDATION
===================================================== */

if(!username || !password){

showMessage(
"ENTER LOGIN DETAILS",
"error"
);

return;

}

/* =====================================================
CHECK API
===================================================== */

if(!AUTH_API){

showMessage(
"AUTH API NOT FOUND",
"error"
);

return;

}

/* =====================================================
BUTTON LOADING
===================================================== */

const btn =
document.getElementById("loginBtn");

btn.innerHTML =
"CHECKING LOGIN...";

btn.disabled = true;

/* =====================================================
API REQUEST
===================================================== */

const response =
await fetch(
AUTH_API,
{
method:"POST",
headers:{
"Content-Type":"text/plain"
},
body:JSON.stringify({

action:"LOGIN",

username:username,

password:password

})
}
);

/* =====================================================
RESPONSE JSON
===================================================== */

const result =
await response.json();

console.log(
"API RESPONSE:",
result
);

/* =====================================================
LOGIN SUCCESS
===================================================== */

if(result.success === true){

showMessage(
"LOGIN SUCCESS",
"success"
);

/* =====================================================
SAVE SESSION
===================================================== */

localStorage.setItem(
"BALAJI_USER",
JSON.stringify(result.user || {})
);

localStorage.setItem(
"BALAJI_TOKEN",
result.token || ""
);

/* =====================================================
OPEN DASHBOARD
===================================================== */

setTimeout(function(){

window.location.href =
"dashboard.html";

},1000);

}
else{

showMessage(
result.message ||
"INVALID USERNAME OR PASSWORD",
"error"
);

}

/* =====================================================
BUTTON RESET
===================================================== */

btn.innerHTML =
"🔐 LOGIN TO ERP";

btn.disabled = false;

}
catch(error){

console.log(
"LOGIN ENGINE ERROR:",
error
);

showMessage(
"SERVER CONNECTION FAILED",
"error"
);

const btn =
document.getElementById("loginBtn");

btn.innerHTML =
"🔐 LOGIN TO ERP";

btn.disabled = false;

}

}

/* =====================================================
AUTO LOAD APIs
===================================================== */

window.onload = function(){

loadAPIRegistry();

};