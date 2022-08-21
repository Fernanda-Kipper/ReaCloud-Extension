const button = document.getElementById('button')
const paragraph = document.getElementById('paragraph')
const input = document.getElementById('title-input')
const label = document.getElementById('label')
let currentUrl = ''

function afterExclusionMode(){
    button.removeAttribute('class')
    button.removeEventListener('click', exclude)
    button.style = "display: none;"
    paragraph.textContent = "ATENÇÃO! Se deseja salvar novamente esse link novamente, feche e abra a janela da extensão"
}

function exclude(){
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let currentUrl = tabs[0].url
        chrome.storage.sync.get(['resources'], function(result) {
            const newResourceList = result.resources.filter(resource => resource.link != currentUrl)
            chrome.storage.sync.set({'resources': newResourceList}, function() {
                afterExclusionMode()
            })
        })
    })
}

function deleteButtonMode(){
    button.textContent = 'Excluir Link'
    button.setAttribute('class', 'delete')
    button.addEventListener('click', exclude)
    input.style = 'display: none;'
    label.style = 'display: none;'
}

function saveYt(){
}

function saveScratch(){
}

function save(){
    chrome.storage.sync.get(['resources'], function(storage) {

        let newResource = null

        if(currentUrl.includes("www.youtube.com/watch?v=")){ // Youtube Video Case
            let video_id = currentUrl.split('v=')[1];
            let endPosition = video_id.indexOf('&');
            if(endPosition != -1) 
            video_id = video_id.substring(0, endPosition);

            fetch("https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=" + video_id + "&key=AIzaSyCOKOSVWLbAmThCnn4L4W3AjpPhOUDMQHk")
            .then((data) => {
                return data.json()
            })
            .then((result) => {
                newResource = {
                    link: currentUrl, 
                    title: input.value,
                    videoTitle: result.items[0].snippet.title,
                    channel: result.items[0].snippet.channelTitle,
                    description: result.items[0].snippet.description
                }
                return newResource;
            })
            .then((newResource) => {
                console.log(newResource);
                console.log(storage);
                if(storage.resources && storage.resources.length > 0){
                    chrome.storage.sync.set({'resources': [...storage.resources, newResource]}, function() {
                        paragraph.textContent = 'Salvo com sucesso'
                        deleteButtonMode()
                    })
                }else{
                    chrome.storage.sync.set({'resources': [newResource]}, function() {
                        paragraph.textContent = 'Salvo com sucesso'
                        deleteButtonMode()
                    })
                }                
            })
        }
        else{
            newResource = {
                link: currentUrl, 
                title: input.value
            }
            if(storage.resources && storage.resources.length > 0){
                chrome.storage.sync.set({'resources': [...storage.resources, newResource]}, function() {
                    paragraph.textContent = 'Salvo com sucesso'
                    deleteButtonMode()
                })
            }else{
                chrome.storage.sync.set({'resources': [newResource]}, function() {
                    paragraph.textContent = 'Salvo com sucesso'
                    deleteButtonMode()
                })
            }  
        }
    })
}

document.addEventListener('DOMContentLoaded', ()=>{
    chrome.storage.sync.get(['resources'], function(result) {
        chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
            currentUrl = tabs[0].url

            let signal_popup = document.getElementById("verified_img")

            fetch("supported.json")
            .then(response => response.json())
            .then(
            json => {
                console.log(json)
                if(json.supportedRepos.some(element => currentUrl.includes(element))){
                    signal_popup.src="images/developing.png"
                    signal_popup.title="Este recurso está em desenvolvimento"
                }
                else{
                    signal_popup.src="images/notsupported.png"
                    signal_popup.title="Este recurso ainda não tem grande compatibilidade com o ReaCloud"
                }
            });

            if(result.resources && result.resources.length > 0){
                if(result.resources.some(element => element.link === currentUrl)){
                    deleteButtonMode()
                    paragraph.textContent = 'Essa página já foi salva, entre no seu painel do ReaCloud para administrar ou exclua o recurso.'
                }else{
                    button.addEventListener('click', save)
                }
            }else{
                button.addEventListener('click', save)
            }
        })
    })
})
