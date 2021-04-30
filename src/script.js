const button = document.getElementById('saveButton')
const paragraph = document.getElementById('paragraph')
let currentUrl = ''

function afterExclusionMode(){
    button.removeAttribute('class')
    button.removeEventListener('click', exclude)
    button.style = "display: none;"
    paragraph.textContent = "ATENÇÃO: Recarregue a página caso deseja salvar esse link novamente"
}

function exclude(){
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let currentUrl = tabs[0].url
        chrome.storage.sync.get(['resources'], function(result) {
            const newResourceList = result.resources.filter(value => value != currentUrl)
            chrome.storage.sync.set({'resources': newResourceList}, function() {
                button.textContent = 'Salvar URL'
                paragraph.textContent = 'Salve URL´s de recursos educacionais para publicar no Reacloud mais tarde'
                afterExclusionMode()
            })
        })
    })
}

function deleteButtonMode(){
    button.textContent = 'Excluir Link'
    button.setAttribute('class', 'delete')
    button.addEventListener('click', exclude)
}

function save(){
    chrome.storage.sync.get(['resources'], function(result) {
        console.log(` ta aqui no save ue .... ${currentUrl}`)
        if(result.resources && result.resources.length > 0){
            chrome.storage.sync.set({'resources': [...result.resources, currentUrl]}, function() {
                paragraph.textContent = 'Salvo com sucesso'
                deleteButtonMode()
            })
        }else{
            chrome.storage.sync.set({'resources': [currentUrl]}, function() {
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
                if(result.resources.some(element => element === currentUrl)){
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
