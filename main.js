const address = document.getElementById("address");
const startinput = document.getElementById("sunstart");
const stopinput = document.getElementById("sunstop");
const nestlow = document.getElementById("nestlow");
const nesthigh = document.getElementById("nesthigh");
const log = document.getElementById("log");
const monitor = document.getElementById("monitor");

address.value = localStorage.getItem("address");
function onAddresschange() {
  localStorage.setItem("address", address.value);
}

startinput.value = localStorage.getItem("sunstart");
stopinput.value = localStorage.getItem("sunstop");
function onsuninputchange() {
  localStorage.setItem("sunstart", startinput.value);
  localStorage.setItem("sunstop", stopinput.value);
}

async function GET(path) {
  var msg = "";
  const url = address.value;
  const resp = await fetch(url + path, {
    method: 'GET',
  });
  msg = await resp.text();
  
  return msg;
}

async function POST(path, body) {
  var msg = "";

  const url = address.value;
  const resp = await fetch(url + path, {
    method: 'POST',
    body: JSON.stringify(body)
  });
  msg = await resp.text();

  return msg;
}

function clearlog(){
  log.innerText = "";
}

function dolog(msg){
  const time = new Date();
  var newline = "[" + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + "]";
  newline += "\n\n" + msg + "\n\n";
  log.innerText = newline + log.innerText;
}

async function root(e){
  const resp = await GET("/");
  dolog(resp);
}

async function localip() {
  const resp = await  GET("/localip");
  dolog(resp);
}

async function publicip() {
  const resp = await  GET("/publicip");
  dolog(resp);
}

async function reqtest() {
  const reqbody = { 
    "randomdata" : "my dick is huge",
    "randomdata2" : "my dick is also bent",
    "list" : {
      "a" : "aaaa",
      "b" : "beee",
      "c" : "seeeeeee"
    }
  }
  const msg = await POST("/reqtest", reqbody);
  dolog(msg);
}

async function getnest(){
  const msg = await GET("/nest");
  dolog(msg);
}

async function setnest(){
  var reqbody = {
    "low" : nestlow.value,
    "high" : nesthigh.value
  }
  const resp = await POST("/nest", reqbody);
  dolog(resp);
}

async function getlight(){
  const msg = await GET("/light");
  dolog(msg);
}

async function setlighton(){
  const postbody = {
    "mode" : "direct",
    "newstate" : "on"
  }
  const msg = await POST("/light", postbody);
  dolog(msg);
}

async function setlightoff(){
  const postbody = {
    "mode" : "direct",
    "newstate" : "off"
  }
  const msg = await POST("/light", postbody);
  dolog(msg);
}

async function setlightroutine() {
  const startarray = startinput.value.split(':');
  const stoptarray = stopinput.value.split(':');
  const startseconds = (startarray[0]) * 60 * 60 + (startarray[1]) * 60; 
  const stopseconds = (stoptarray[0]) * 60 * 60 + (stoptarray[1]) * 60;
  const body = { 
    "mode" : "daily",
    "newstate" : [
      startseconds,
      stopseconds
    ]
  };
  const msg = await POST("/light", body);
  const date = new Date();
  const current = date.getHours() * 60 * 60 + date.getMinutes() * 60;
  dolog(msg + "current time: " + current);
}


setInterval(async () => {
  try {
    const time = await GET("/time");
    const lightstr = await GET("/light");
    const light = JSON.parse(lightstr);
    const neststr = await GET("/nest");
    const nest = JSON.parse(neststr);

    monitor.innerText = "";
    monitor.innerText += time;
    monitor.innerText += "\n\n";
    monitor.innerText += "light: " + light["pin"] + " mode: " + light["mode"];
    monitor.innerText += "\n";
    monitor.innerText += "nest: " + nest["value"];

  } catch (error) {
    dolog(error);
  }
}, 1000);
