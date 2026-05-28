/* =========================================================
BALAJI NEXTGEN ERP
FILE NAME : api-engine.js
SAVE LOCATION :
/js/api/api-engine.js
========================================================= */

/* =========================================================
LIVE GOOGLE APPS SCRIPT WEB APP URL
========================================================= */

const API_URL =
"https://script.google.com/macros/s/PASTE_DEPLOYMENT_ID/exec";

/* =========================================================
COMMON API FUNCTION
========================================================= */

async function callERPAPI(payload){

try{

const response = await fetch(

API_URL,

{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify(payload)

}

);

const result =
await response.json();

return result;

}catch(error){

console.error(error);

showMessage(

"Server Connection Failed",
"error"

);

}

}

/* =========================================================
MESSAGE ENGINE
========================================================= */

function showMessage(message,type="success"){

const old =
document.getElementById("erpMessageBox");

if(old){

old.remove();

}

const box =
document.createElement("div");

box.id =
"erpMessageBox";

box.innerHTML =
message;

box.style.position =
"fixed";

box.style.top =
"20px";

box.style.right =
"20px";

box.style.padding =
"16px 24px";

box.style.borderRadius =
"12px";

box.style.fontSize =
"14px";

box.style.fontWeight =
"600";

box.style.zIndex =
"999999";

box.style.color =
"#fff";

box.style.boxShadow =
"0 10px 30px rgba(0,0,0,0.15)";

box.style.background =

type == "success"
?
"linear-gradient(135deg,#16a34a,#22c55e)"
:
"linear-gradient(135deg,#dc2626,#ef4444)";

document.body.appendChild(box);

setTimeout(function(){

box.remove();

},3000);

}

/* =========================================================
CONTACT FORM SUBMIT
========================================================= */

async function submitContactForm(){

const submitButton =
document.getElementById(
"contactSubmitBtn"
);

if(submitButton){

submitButton.innerHTML =
"Submitting...";

submitButton.disabled = true;

}

const payload = {

action:"CONTACT",

fullName:
document.getElementById("name").value,

companyName:
document.getElementById("company").value,

email:
document.getElementById("email").value,

mobile:
document.getElementById("mobile").value,

service:
document.getElementById("service").value,

message:
document.getElementById("message").value

};

const result =
await callERPAPI(payload);

if(result && result.success){

showMessage(
"Contact Saved Successfully"
);

/* =========================
WHATSAPP OPEN
========================= */

const whatsappText =

`Hello BALAJI NEXTGEN ERP

Name : ${payload.fullName}

Company : ${payload.companyName}

Service : ${payload.service}

Mobile : ${payload.mobile}

Requirement :
${payload.message}`;

window.open(

`https://wa.me/919832014403?text=${encodeURIComponent(whatsappText)}`,

"_blank"

);

document
.getElementById("contactForm")
.reset();

}else{

showMessage(

result.message ||
"Unable To Save Contact",

"error"

);

}

if(submitButton){

submitButton.innerHTML =
"Submit Inquiry";

submitButton.disabled = false;

}

}

/* =========================================================
DEMO REGISTER
========================================================= */

async function submitDemoRegister(){

const submitButton =
document.getElementById(
"demoSubmitBtn"
);

if(submitButton){

submitButton.innerHTML =
"Registering...";

submitButton.disabled = true;

}

const payload = {

action:"DEMO_REGISTER",

fullName:
document.getElementById("fullName").value,

companyName:
document.getElementById("companyName").value,

businessType:
document.getElementById("businessType").value,

email:
document.getElementById("email").value,

mobile:
document.getElementById("mobile").value,

city:
document.getElementById("city").value,

state:
document.getElementById("state").value,

employeeSize:
document.getElementById("employeeSize").value,

modules:
document.getElementById("modules").value,

plan:
document.getElementById("plan").value,

message:
document.getElementById("message").value

};

const result =
await callERPAPI(payload);

if(result && result.success){

showMessage(
"Demo Registration Successful"
);

document
.getElementById("demoForm")
.reset();

window.location.href =
"login.html";

}else{

showMessage(

result.message ||
"Registration Failed",

"error"

);

}

if(submitButton){

submitButton.innerHTML =
"Start Free Demo";

submitButton.disabled = false;

}

}

/* =========================================================
ERP LOGIN
========================================================= */

async function loginERP(){

const loginButton =
document.getElementById(
"loginBtn"
);

if(loginButton){

loginButton.innerHTML =
"Authenticating...";

loginButton.disabled = true;

}

const payload = {

action:"LOGIN",

username:
document.getElementById("username").value,

password:
document.getElementById("password").value

};

const result =
await callERPAPI(payload);

if(result && result.success){

localStorage.setItem(

"ERP_USER",

JSON.stringify(result.data)

);

showMessage(
"Login Successful"
);

setTimeout(function(){

window.location.href =
"dashboard.html";

},1000);

}else{

showMessage(

result.message ||
"Invalid Login",

"error"

);

}

if(loginButton){

loginButton.innerHTML =
"Login ERP";

loginButton.disabled = false;

}

}

/* =========================================================
LOAD DASHBOARD
========================================================= */

async function loadDashboardCounts(){

const payload = {

action:"DASHBOARD"

};

const result =
await callERPAPI(payload);

if(result && result.success){

if(document.getElementById("totalContacts")){

document.getElementById(
"totalContacts"
).innerText =
result.data.contacts;

}

if(document.getElementById("totalDemos")){

document.getElementById(
"totalDemos"
).innerText =
result.data.demos;

}

if(document.getElementById("totalUsers")){

document.getElementById(
"totalUsers"
).innerText =
result.data.users;

}

if(document.getElementById("totalClients")){

document.getElementById(
"totalClients"
).innerText =
result.data.clients;

}

if(document.getElementById("todayLeads")){

document.getElementById(
"todayLeads"
).innerText =
result.data.todayLeads;

}

if(document.getElementById("restaurantSales")){

document.getElementById(
"restaurantSales"
).innerText =

"₹ " +
result.data.restaurantSales;

}

}

}

/* =========================================================
CHECK LOGIN SESSION
========================================================= */

function checkLoginSession(){

const user =
localStorage.getItem(
"ERP_USER"
);

if(!user){

window.location.href =
"login.html";

}

}

/* =========================================================
LOAD LOGGED USER
========================================================= */

function loadLoggedUser(){

const user =
JSON.parse(

localStorage.getItem(
"ERP_USER"
)

);

if(
user &&
document.getElementById(
"loggedUser"
)
){

document.getElementById(
"loggedUser"
).innerText =
user.name;

}

}

/* =========================================================
LOGOUT ERP
========================================================= */

function logoutERP(){

localStorage.clear();

window.location.href =
"login.html";

}

/* =========================================================
AUTO LOAD
========================================================= */

window.addEventListener(

"load",

function(){

/* =========================
DASHBOARD AUTO LOAD
========================= */

if(

window.location.pathname
.includes("dashboard")

){

checkLoginSession();

loadDashboardCounts();

loadLoggedUser();

}

}

);

/* =========================================================
ERP API LOADED
========================================================= */

console.log(
"BALAJI NEXTGEN ERP API ENGINE LOADED"
);