
function getUrl(typeFilter, indexFilter) {
    let url = document.querySelector(".filters *").getAttribute("url");

    if (typeFilter == 0) {
        url = removeParam("type", url);
        url = url.indexOf("?") == -1 ? (url += "?") : (url += "&");
        url += `type=${indexFilter}`
    }
    else if (typeFilter == 1) {
        url = removeParam("genre", url);
        url = url.indexOf("?") == -1 ? (url += "?") : (url += "&");
        url += `genre=${indexFilter}`

    }
    console.log(url);
    window.location.href = url;
}

function removeParam(key, sourceURL) {
    var rtn = sourceURL.split("?")[0],
        param,
        params_arr = [],
        queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
        params_arr = queryString.split("&");
        for (var i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split("=")[0];
            if (param === key) {
                params_arr.splice(i, 1);
            }
        }
        if (params_arr.length) rtn = rtn + "?" + params_arr.join("&");
    }
    return rtn;
}

document.getElementById('voice-search').addEventListener('click',function(){
    var speech = true;
    window.SpeechRecognition = window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.interimResults = true;

    recognition.addEventListener('result', e => {
        const transcript = Array.from(e.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('')
        console.log(document.getElementById("keywords"));
        document.getElementById("keywords").value = transcript;
        console.log(transcript);
    });
    
    if (speech == true) {
        recognition.start();
    }
})