let listaHTML = document.getElementById("Salvos");

document.getElementById("button").addEventListener("click", getback);

document.addEventListener('DOMContentLoaded', function showElements(){
    chrome.storage.sync.get(['resources'], function(result){
        if (result.resources.length === 0) {
            let emptyMessage = document.createElement("p");
            emptyMessage.textContent = "Adicione recursos para encher a sua mochila ReaCloud!";
            emptyMessage.className = "emptyMessage";
            listaHTML.appendChild(emptyMessage);
        } else {
            result.resources.forEach(element => {
                let newElement = document.createElement("a");
                newElement.href = element.link;
                newElement.target = "_blank";
                newElement.textContent = element.title;
                newElement.style.color = "rgb(24,24,24)";

                let deleteButton = document.createElement("img");
                deleteButton.src = "images/CloseButton.svg";
                deleteButton.alt = "Excluir";
                deleteButton.className = "deleteButton"; 

                let listItem = document.createElement('li');
                listItem.appendChild(newElement);
                listItem.appendChild(deleteButton);

                listaHTML.appendChild(listItem);

                deleteButton.addEventListener('click', function() {
                    // Função para excluir o item quando a imagem "CloseButton" for clicada
                    deleteResource(element.link);
                    listItem.remove();
                });
            });
        }
    });
});

function deleteResource(link) {
    chrome.storage.sync.get(['resources'], function(result) {
        if (result.resources && result.resources.length > 0) {
            const newResourceList = result.resources.filter(resource => resource.link !== link);
            chrome.storage.sync.set({'resources': newResourceList});
        }
    });
}

function getback(){
    window.location.href = "./popup.html";
}
