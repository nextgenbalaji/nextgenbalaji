```javascript id="r9vk0t"
/********************************************************
 BALAJI NEXTGEN ERP
 CENTRAL API ENGINE
 FILE:
 js/api/api-engine.js
 FINAL FIXED VERSION
********************************************************/

/* =====================================================
GLOBAL ERP API OBJECT
===================================================== */

const ERP_API = {

AUTH : null,
CORE : null,
FRONTEND : null,
WEBSITE : null,
LOADED : false

};

/* =====================================================
MASTER CONTROL SHEET
===================================================== */

const ERP_REGISTRY_URL =
'https://docs.google.com/spreadsheets/d/1FuNJ_XejE2ekYTnk71wXVZ79hRJgu7pmIA6fuE-Iu7I/gviz/tq?tqx=out:json&sheet=API_DEPLOYMENT_REGISTRY';

/* =====================================================
LOAD ERP APIs
===================================================== */

async function loadERPAPI(){

try{

console.log(
'LOADING ERP API REGISTRY...'
);

/* =====================================================
FETCH REGISTRY
===================================================== */

const response =
await fetch(
ERP_REGISTRY_URL
);

const text =
await response.text();

/* =====================================================
PARSE GOOGLE JSON
===================================================== */

const json =
JSON.parse(
text.substring(
47,
text.length - 2
)
);

/* =====================================================
ROWS
===================================================== */

const rows =
json.table.rows;

/* =====================================================
LOOP ROWS
===================================================== */

rows.forEach(row => {

const APP_NAME =
row.c[0]
?
row.c[0].v
:
'';

const WEBAPP_URL =
row.c[1]
?
row.c[1].v
:
'';

const STATUS =
row.c[3]
?
row.c[3].v
:
'';

/* =====================================================
ACTIVE ONLY
===================================================== */

if(STATUS !== 'ACTIVE'){

return;

}

/* =====================================================
MAP APIS
===================================================== */

if(APP_NAME === 'V2_AUTH'){

ERP_API.AUTH =
WEBAPP_URL;

}

if(APP_NAME === 'V2_CORE'){

ERP_API.CORE =
WEBAPP_URL;

}

if(APP_NAME === 'V2_FRONTEND'){

ERP_API.FRONTEND =
WEBAPP_URL;

}

if(APP_NAME === 'Webside'){

ERP_API.WEBSITE =
WEBAPP_URL;

}

});

/* =====================================================
CHECK LOADED
===================================================== */

if(
ERP_API.AUTH
&&
ERP_API.CORE
){

ERP_API.LOADED = true;

console.log(
'AUTH API FOUND:',
ERP_API.AUTH
);

console.log(
'CORE API FOUND:',
ERP_API.CORE
);

}else{

console.log(
'API NOT CONNECTED'
);

}

/* =====================================================
RETURN
===================================================== */

return ERP_API;

}catch(error){

console.log(
'API ENGINE ERROR:',
error
);

return {

success : false,

message : 'API ENGINE FAILED'

};

}

}

/* =====================================================
SAFE API CALL
===================================================== */

async function callERPAPI(
url,
payload = {}
){

try{

/* =====================================================
CHECK URL
===================================================== */

if(!url){

return {

success : false,

message : 'API URL MISSING'

};

}

/* =====================================================
FETCH API
===================================================== */

const response =
await fetch(url,{

method : 'POST',

mode : 'cors',

headers : {
'Content-Type':'text/plain'
},

body : JSON.stringify(
payload
)

});

/* =====================================================
TEXT RESPONSE
===================================================== */

const text =
await response.text();

console.log(
'API RESPONSE:',
text
);

/* =====================================================
PARSE JSON
===================================================== */

const json =
JSON.parse(text);

return json;

}catch(error){

console.log(
'API CALL ERROR:',
error
);

return {

success : false,

message : 'SERVER CONNECTION FAILED',

error : String(error)

};

}

}

/* =====================================================
LOGIN ERP
===================================================== */

async function loginERP(){

try{

/* =====================================================
INPUT VALUES
===================================================== */

const loginId =
document
.getElementById('loginId')
.value
.trim();

const password =
document
.getElementById('password')
.value
.trim();

/* =====================================================
VALIDATION
===================================================== */

if(
loginId == '' ||
password == ''
){

alert(
'ENTER LOGIN DETAILS'
);

return;

}

/* =====================================================
LOAD APIS
===================================================== */

if(!ERP_API.LOADED){

await loadERPAPI();

}

/* =====================================================
LOGIN CALL
===================================================== */

const result =
await callERPAPI(

ERP_API.AUTH,

{

action : 'LOGIN',

loginId : loginId,

password : password

}

);

console.log(
'LOGIN RESULT:',
result
);

/* =====================================================
SUCCESS
===================================================== */

if(result.success === true){

/* =====================================================
SAVE USER
===================================================== */

localStorage.setItem(

'ERP_USER',

JSON.stringify(
result.user
)

);

/* =====================================================
SAVE SESSION
===================================================== */

localStorage.setItem(

'ERP_SESSION',

result.token
);

/* =====================================================
SAVE ROLE
===================================================== */

localStorage.setItem(

'ERP_ROLE',

result.user.role
);

/* =====================================================
SUCCESS MESSAGE
===================================================== */

alert(
'LOGIN SUCCESS'
);

/* =====================================================
OPEN DASHBOARD
===================================================== */

if(result.dashboard){

window.location.href =
result.dashboard;

}else{

window.location.href =
'dashboard.html';

}

return;

}

/* =====================================================
FAILED LOGIN
===================================================== */

alert(

result.message
?
result.message
:
'LOGIN FAILED'

);

}catch(error){

console.log(
'LOGIN ENGINE ERROR:',
error
);

alert(
'SERVER CONNECTION FAILED'
);

}

}

/* =====================================================
SEND OTP
===================================================== */

async function sendOTP(
mobile
){

try{

if(!ERP_API.LOADED){

await loadERPAPI();

}

const result =
await callERPAPI(

ERP_API.AUTH,

{

action : 'SEND_OTP',

loginId : mobile

}

);

console.log(
'OTP RESULT:',
result
);

if(result.success){

alert(
'OTP SENT SUCCESSFULLY'
);

}else{

alert(
'OTP SEND FAILED'
);

}

}catch(error){

console.log(error);

alert(
'SERVER ERROR'
);

}

}

/* =====================================================
VERIFY OTP
===================================================== */

async function verifyOTP(
mobile,
otp
){

try{

if(!ERP_API.LOADED){

await loadERPAPI();

}

const result =
await callERPAPI(

ERP_API.AUTH,

{

action : 'VERIFY_OTP',

loginId : mobile,

otp : otp

}

);

console.log(
'VERIFY OTP:',
result
);

if(result.success){

localStorage.setItem(
'ERP_USER',
JSON.stringify(
result.user
)
);

window.location.href =
'dashboard.html';

}else{

alert(
'INVALID OTP'
);

}

}catch(error){

console.log(error);

alert(
'SERVER ERROR'
);

}

}

/* =====================================================
GET USER
===================================================== */

function getERPUser(){

const user =
localStorage.getItem(
'ERP_USER'
);

if(user){

return JSON.parse(user);

}

return null;

}

/* =====================================================
CHECK SESSION
===================================================== */

function checkERPSession(){

const session =
localStorage.getItem(
'ERP_SESSION'
);

if(!session){

window.location.href =
'client-login.html';

}

}

/* =====================================================
LOGOUT
===================================================== */

function logoutERP(){

localStorage.clear();

window.location.href =
'client-login.html';

}

/* =====================================================
AUTO LOAD API
===================================================== */

window.addEventListener(

'load',

async function(){

await loadERPAPI();

}

);
```
