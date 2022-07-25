document.addEventListener('DOMContentLoaded', function showElements(){
    let saved = document.getElementById("Salvos");
    chrome.storage.sync.get(['resources'], function(result){
        result.resources.forEach(element => {
            let newElement = document.createElement("li");
            newElement.textContent = element.title;
            saved.appendChild(newElement);
        });
    })
});
