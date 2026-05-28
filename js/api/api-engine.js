/* =========================================================
BALAJI NEXTGEN ERP
api-engine.js
FINAL LOGIN API ENGINE
========================================================= */

/* =========================================================
LIVE API URL
========================================================= */

const ERP_API =

'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';

/* =========================================================
SHOW MESSAGE
========================================================= */

function showMessage(message,type='info'){

if(type === 'success'){

alert(message);

}
else if(type === 'error'){

alert(message);

}
else{

alert(message);

}

}

/* =========================================================
LOADING BUTTON
========================================================= */

function setButtonLoading(button,text){

button.disabled = true;

button.innerHTML = text;

}

/* =========================================================
RESET BUTTON
========================================================= */

function resetButton(button,text){

button.disabled = false;

button.innerHTML = text;

}

/* =========================================================
LOGIN ERP
========================================================= */

async function loginERP(){

try{

/* =====================================================
GET INPUTS
===================================================== */

const username =
document
.getElementById('username')
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

if(!username || !password){

showMessage(
'ENTER LOGIN DETAILS',
'error'
);

return;

}

/* =====================================================
BUTTON
===================================================== */

const loginBtn =
document.querySelector('.login-btn');

setButtonLoading(
loginBtn,
'CHECKING LOGIN...'
);

/* =====================================================
API REQUEST
===================================================== */

const response =

await fetch(

ERP_API,

{

method:'POST',

body:JSON.stringify({

action:'LOGIN',

username:username,

password:password

})

}

);

/* =====================================================
GET RESPONSE
===================================================== */

const result =
await response.json();

console.log(
'API RESPONSE:',
result
);

/* =====================================================
SUCCESS
===================================================== */

if(

result.success === true

||

result.status === 'success'

){

/* =================================================
SAVE USER
================================================= */

localStorage.setItem(

'ERP_USER',

JSON.stringify(
result.data || result.user
)

);

/* =================================================
SAVE TOKEN
================================================= */

localStorage.setItem(

'ERP_TOKEN',

result.token || ''

);

/* =================================================
MESSAGE
================================================= */

showMessage(
'LOGIN SUCCESS',
'success'
);

/* =================================================
OPEN DASHBOARD
================================================= */

setTimeout(function(){

window.location.href =
'dashboard.html';

},1000);

}

/* =====================================================
INVALID LOGIN
===================================================== */

else{

showMessage(

result.message ||

'Invalid Username or Password',

'error'

);

}

/* =====================================================
RESET BUTTON
===================================================== */

resetButton(

loginBtn,

'🔐 LOGIN TO ERP'

);

}

/* =====================================================
ERROR
===================================================== */

catch(error){

console.log(
'LOGIN ENGINE ERROR:',
error
);

showMessage(

'SERVER CONNECTION FAILED',

'error'

);

const loginBtn =
document.querySelector('.login-btn');

resetButton(

loginBtn,

'🔐 LOGIN TO ERP'

);

}

}

/* =========================================================
LOGOUT ERP
========================================================= */

function logoutERP(){

localStorage.clear();

window.location.href =
'client-login.html';

}

/* =========================================================
CHECK LOGIN
========================================================= */

function checkLoginSession(){

const user =
localStorage.getItem(
'ERP_USER'
);

if(!user){

window.location.href =
'client-login.html';

}

}

/* =========================================================
GET USER
========================================================= */

function getCurrentUser(){

const user =
localStorage.getItem(
'ERP_USER'
);

if(user){

return JSON.parse(user);

}

return null;

}

/* =========================================================
AUTO LOAD
========================================================= */

window.addEventListener(

'load',

function(){

console.log(
'BALAJI NEXTGEN API ENGINE LOADED'
);

}

);