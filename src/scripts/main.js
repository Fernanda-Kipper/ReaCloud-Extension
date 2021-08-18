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

function save(){
    chrome.storage.sync.get(['resources'], function(result) {
        let newResource = {link: currentUrl, title: input.value}
        if(result.resources && result.resources.length > 0){
            chrome.storage.sync.set({'resources': [...result.resources, newResource]}, function() {
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

document.addEventListener('DOMContentLoaded', ()=>{
    chrome.storage.sync.get(['resources'], function(result) {
        chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
            currentUrl = tabs[0].url
            if(result.resources && result.resources.length > 0){
                if(result.resources.some(element => element.link === currentUrl)){
                    deleteButtonMode()
                    paragraph.textContent = 'Essa página já foi salva como possível recurso, entre no seu painel do ReaCloud para administrá-la'
                }else{
                    button.addEventListener('click',save)
                }
            }else{
                button.addEventListener('click',save)
            }
        })
    })
})
