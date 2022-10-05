let listaHTML = document.getElementById("Salvos");

document.getElementById("clearButton").addEventListener("click", clearLocalResources);

document.addEventListener('DOMContentLoaded', function showElements(){
    chrome.storage.sync.get(['resources'], function(result){
        result.resources.forEach(element => {
            let newElement = document.createElement("a")
            newElement.href = element.link
            newElement.target = "_blank"
            newElement.textContent = element.title
            newElement.style.color = "rgb(24,24,24)"
            let wrapper = document.createElement('li')
            wrapper.appendChild(newElement)
            listaHTML.appendChild(wrapper)
        });
    })
});

function clearLocalResources(){
    chrome.storage.sync.get(['resources'], function(result){
        chrome.storage.sync.clear();
    });
    listaHTML.innerHTML = '';
}