
console.log("hi :>")

var result = chrome.scripting.args[0];
result = JSON.parse(result)

console.log("the result is... " + result)

var div = document.createElement("div"); 
div.id = "myId";
div.style = "position: sticky; background-color: white; border: 5px solid green; float: right; padding: 10px; width: 200px; left: 10px; bottom: 10px;"; // top: 0px; z-index: 0;"
div.innerText = "the result is " + result;
document.body.appendChild(div);

