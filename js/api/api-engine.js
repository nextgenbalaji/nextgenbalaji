```javascript
/* =====================================================
   BALAJI NEXTGEN ERP
   FINAL API ENGINE
   FILE:
   js/api/api-engine.js
===================================================== */

console.log(
"BALAJI NEXTGEN ERP API ENGINE LOADED"
);

/* =====================================================
   MASTER REGISTRY
===================================================== */

const MASTER_SHEET_URL =
"https://docs.google.com/spreadsheets/d/1FuNJ_XejE2ekYTnk71wXVZ79hRJgu7pmIA6fuE-Iu7I/gviz/tq?tqx=out:json&sheet=API_DEPLOYMENT_REGISTRY";

/* =====================================================
   API VARIABLES
===================================================== */

let AUTH_API = "";
let CORE_API = "";
let FRONTEND_API = "";
let WEBSITE_API = "";

/* =====================================================
   LOAD API REGISTRY
===================================================== */

async function loadAPIRegistry(){

try{

console.log(
"LOADING ERP API REGISTRY..."
);

const response =
await fetch(
MASTER_SHEET_URL
);

const text =
await response.text();

const json =
JSON.parse(
text.substring(47).slice(0,-2)
);

const rows =
json.table.rows;

/* =====================================================
   LOOP ROWS
===================================================== */

rows.forEach(row=>{

const appName =
row.c[0]?.v || "";

const webAppUrl =
row.c[1]?.v || "";

const status =
row.c[3]?.v || "";

if(status !== "ACTIVE"){
return;
}

/* =====================================================
   MAP APIS
===================================================== */

if(appName === "V2_AUTH"){

AUTH_API = webAppUrl;

console.log(
"AUTH API:",
AUTH_API
);

}

if(appName === "V2_CORE"){

CORE_API = webAppUrl;

console.log(
"CORE API:",
CORE_API
);

}

if(appName === "V2_FRONTEND"){

FRONTEND_API = webAppUrl;

console.log(
"FRONTEND API:",
FRONTEND_API
);

}

if(appName === "Webside"){

WEBSITE_API = webAppUrl;

console.log(
"WEBSITE API:",
WEBSITE_API
);

}

});

console.log(
"API REGISTRY LOADED SUCCESSFULLY"
);

}
catch(error){

console.error(
"API REGISTRY ERROR:",
error
);

alert(
"API REGISTRY LOAD FAILED"
);

}

}

/* =====================================================
   AUTO LOAD REGISTRY
===================================================== */

loadAPIRegistry();

/* =====================================================
   LOGIN ERP
===================================================== */

async function loginERP(){

try{

/* =====================================================
   INPUT VALUES
===================================================== */

const usernameInput =
document.getElementById("username");

const passwordInput =
document.getElementById("password");

const loginBtn =
document.getElementById("loginBtn");

/* =====================================================
   CHECK INPUTS
===================================================== */

if(!usernameInput){

alert(
"USERNAME INPUT NOT FOUND"
);

return;

}

if(!passwordInput){

alert(
"PASSWORD INPUT NOT FOUND"
);

return;

}

/* =====================================================
   GET VALUES
===================================================== */

const username =
usernameInput.value.trim();

const password =
passwordInput.value.trim();

/* =====================================================
   VALIDATION
===================================================== */

if(username === ""){

alert(
"ENTER USERNAME"
);

return;

}

if(password === ""){

alert(
"ENTER PASSWORD"
);

return;

}

/* =====================================================
   BUTTON LOADING
===================================================== */

if(loginBtn){

loginBtn.disabled = true;

loginBtn.innerHTML =
"CHECKING LOGIN...";

}

/* =====================================================
   API CHECK
===================================================== */

if(!AUTH_API){

alert(
"AUTH API NOT LOADED"
);

if(loginBtn){

loginBtn.disabled = false;

loginBtn.innerHTML =
"🔐 LOGIN TO ERP";

}

return;

}

/* =====================================================
   PAYLOAD
===================================================== */

const payload = {

action : "LOGIN",

username : username,

password : password

};

console.log(
"LOGIN PAYLOAD:",
payload
);

/* =====================================================
   FETCH LOGIN
===================================================== */

const response =
await fetch(AUTH_API,{

method : "POST",

headers : {
"Content-Type" : "text/plain;charset=utf-8"
},

body : JSON.stringify(payload)

});

/* =====================================================
   JSON RESPONSE
===================================================== */

const result =
await response.json();

console.log(
"LOGIN RESPONSE:",
result
);

/* =====================================================
   LOGIN SUCCESS
===================================================== */

if(result.success === true){

/* =====================================================
   SAVE USER
===================================================== */

localStorage.setItem(
"BALAJI_USER",
JSON.stringify(
result.user || {}
)
);

/* =====================================================
   SAVE TOKEN
===================================================== */

localStorage.setItem(
"BALAJI_TOKEN",
result.token || ""
);

/* =====================================================
   SUCCESS MESSAGE
===================================================== */

alert(
"LOGIN SUCCESS"
);

/* =====================================================
   REDIRECT
===================================================== */

window.location.href =
"/dashboard.html";

}

/* =====================================================
   LOGIN FAILED
===================================================== */

else{

alert(
result.message ||
"INVALID USERNAME OR PASSWORD"
);

}

/* =====================================================
   BUTTON RESET
===================================================== */

if(loginBtn){

loginBtn.disabled = false;

loginBtn.innerHTML =
"🔐 LOGIN TO ERP";

}

}
catch(error){

console.error(
"LOGIN ENGINE ERROR:",
error
);

alert(
"SERVER CONNECTION FAILED"
);

const loginBtn =
document.getElementById("loginBtn");

if(loginBtn){

loginBtn.disabled = false;

loginBtn.innerHTML =
"🔐 LOGIN TO ERP";

}

}

}

/* =====================================================
   SEND OTP
===================================================== */

async function sendOTP(mobile){

try{

if(!AUTH_API){

alert(
"AUTH API NOT LOADED"
);

return;

}

const response =
await fetch(AUTH_API,{

method : "POST",

headers : {
"Content-Type" : "text/plain;charset=utf-8"
},

body : JSON.stringify({

action : "SEND_OTP",

mobile : mobile

})

});

const result =
await response.json();

console.log(
"OTP RESPONSE:",
result
);

if(result.success){

alert(
"OTP SENT SUCCESSFULLY"
);

}else{

alert(
result.message ||
"OTP SEND FAILED"
);

}

}
catch(error){

console.error(error);

alert(
"OTP SERVER ERROR"
);

}

}

/* =====================================================
   VERIFY OTP
===================================================== */

async function verifyOTP(mobile,otp){

try{

const response =
await fetch(AUTH_API,{

method : "POST",

headers : {
"Content-Type" : "text/plain;charset=utf-8"
},

body : JSON.stringify({

action : "VERIFY_OTP",

mobile : mobile,

otp : otp

})

});

const result =
await response.json();

console.log(
"VERIFY OTP RESPONSE:",
result
);

if(result.success){

localStorage.setItem(
"BALAJI_USER",
JSON.stringify(
result.user || {}
)
);

localStorage.setItem(
"BALAJI_TOKEN",
result.token || ""
);

window.location.href =
"/dashboard.html";

}else{

alert(
"INVALID OTP"
);

}

}
catch(error){

console.error(error);

alert(
"OTP VERIFY ERROR"
);

}

}

/* =====================================================
   GET CURRENT USER
===================================================== */

function getCurrentUser(){

const user =
localStorage.getItem(
"BALAJI_USER"
);

if(user){

return JSON.parse(user);

}

return null;

}

/* =====================================================
   CHECK LOGIN SESSION
===================================================== */

function checkLoginSession(){

const token =
localStorage.getItem(
"BALAJI_TOKEN"
);

if(!token){

window.location.href =
"/client-login.html";

return false;

}

return true;

}

/* =====================================================
   LOGOUT
===================================================== */

function logoutERP(){

localStorage.removeItem(
"BALAJI_USER"
);

localStorage.removeItem(
"BALAJI_TOKEN"
);

window.location.href =
"/client-login.html";

}
```
