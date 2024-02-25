function processImage(tab, imageUrl) {
    const apiUrl = 'http://localhost:8000/process_image'; // URL of your Python backend

    // Data to send in the request body
    const requestData = {
        imageUrl: imageUrl
    };

    // Options for the fetch request
    const requestOptions = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    };

    // Make the HTTP request to the Python backend
    fetch(apiUrl, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Process the response from the Python backend
            console.log('Processed text:', data.result);
            // console.log("hi :>?")
            generatePopup(tab, data.result)
            // Do something with the processed text
        })
            .catch(error => {
            console.error('Error:', error);
        });
}


function displayPopup(result) {
    var div = document.createElement("div"); 
    div.id = "myId";
    div.style = "position: fixed; background-color: white; border: 5px solid green; float: right; padding: 10px; width: 200px; right : 10px; bottom: 10px;"; // top: 0px; z-index: 0;"
    div.innerText = "The probability of this image being AI-generated is " + result + " out of 1.";  
    document.body.appendChild(div);
}

function generatePopup(tab, result) {
    // console.log('Result before serialization:', result);
    // const serializedResult = JSON.stringify(result);
    // console.log('Serialized result:', serializedResult);

    chrome.scripting.executeScript({
        target: {tabId: tab.id, allFrames: true},
        func: displayPopup,
        args: [result]
    });
}


// returns image url?
function analyze(tab) {
    console.log("working?")
    chrome.scripting.executeScript({
        target: {tabId: tab.id, allFrames: true},
        files: ['testfile2.js'],
    });
}

// background script
// chrome.runtime.onMessage.addListener(function (message, sender, senderResponse) {
//     if (message.type === "image") {
//       fetch('<https://www.alleycat.org/wp-content/uploads/2019/03/FELV-cat.jpg>', {
//             method: 'POST',
//             headers: {
//                 'Authorization': `Basic ${btoa('api:xxxxxx')}`,
//                 'Content-Type': 'application/json'
//             },
    
//                 body: JSON.stringify({source: {url: message.url}})
//         }).then(res => {
//             return res.json();
//         }).then(res => {
//             senderResponse(res);
//         })
//     }
//     return true
// });


chrome.contextMenus.create({
    id: 'my_menu_item',
    title: 'Check if image is AI-generated',
    contexts: ['image']
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'my_menu_item') {
        const imageUrl = info.srcUrl;
        processImage(tab, imageUrl)
        // console.log('result should be: ' + result)
        // analyze(tab)
        // generatePopup(tab, result)
    }
});