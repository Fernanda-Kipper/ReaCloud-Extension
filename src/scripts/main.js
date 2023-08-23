const button = document.getElementById('button')
const paragraph = document.getElementById('paragraph')

const input = document.getElementById('title-input')
const link = document.getElementById('link-input')

const label = document.getElementById('label')

let currentUrl = ''
let currentSrc = ''

function saveUnsupported() {
    const newResource = { link: link.value, title: input.value };

    chrome.storage.sync.get(['resources'], function(result) {
        const updatedResources = result.resources ? [...result.resources, newResource] : [newResource];

        chrome.storage.sync.set({ resources: updatedResources }, function() {
            window.location.href = "./saveFeedBackADDED.html";
        });
    });
}

function saveYoutube() {
    const video_id = currentUrl.includes("www.youtube.com/watch?v=") ? currentUrl.split('v=')[1].split('&')[0] : null;

    if (!video_id) {
        console.log("Link inválido");
        window.location.href = "./saveFeedBackERROR.html";
        return;
    }

    const apiUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${video_id}&key=AIzaSyCOKOSVWLbAmThCnn4L4W3AjpPhOUDMQHk`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => data.items[0].snippet)
        .then(snippet => {
            const newResource = {
                link: currentUrl,
                title: input.value,
                videoTitle: snippet.title,
                channel: snippet.channelTitle,
                description: snippet.description
            };

            chrome.storage.sync.get(['resources'], function(storage) {
                const updatedResources = storage.resources ? [...storage.resources, newResource] : [newResource];

                chrome.storage.sync.set({ resources: updatedResources }, function() {
                    window.location.href = "./saveFeedBackADDED.html";
                });
            });
        })
        .catch(error => {
            console.log("Erro no Fetch da Youtube API");
            console.log(error);
            window.location.href = "./saveFeedBackERROR.html";
        });
}

function saveScratch() {
    const project_id = currentUrl.includes("scratch.mit.edu/projects/") ? currentUrl.split("projects/")[1].split("/")[0] : null;

    if (!project_id) {
        console.log("Link inválido");
        window.location.href = "./saveFeedBackERROR.html";
        return;
    }

    const apiUrl = `https://api.scratch.mit.edu/projects/${project_id}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(result => {
            const newResource = {
                title: result.title,
                projectId: result.id,
                link: currentUrl,
                instructions: result.instructions,
                description: result.description,
                project_token: result.project_token
            };

            chrome.storage.sync.get(['resources'], function(storage) {
                const updatedResources = storage.resources ? [...storage.resources, newResource] : [newResource];

                chrome.storage.sync.set({ resources: updatedResources }, function() {
                    window.location.href = "./saveFeedBackADDED.html";
                });
            });
        })
        .catch(error => {
            console.log("Erro no Fetch da API Scratch");
            console.log(error);
            window.location.href = "./saveFeedBackERROR.html";
        });
}

function save() {
    chrome.storage.sync.get(['resources'], function(storage) {
        switch (currentSrc) {
            case "youtube.com":
                saveYoutube();
                break;
            case "scratch.mit.edu":
                saveScratch();
                break;
            // case "khanacademy.org":
            //     saveKhanAcademy();
            default:
                saveUnsupported();
                break;
        }
    });
}

document.addEventListener('DOMContentLoaded', ()=>{
    chrome.storage.sync.get(['resources'], function(result) {
        chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
            currentUrl = tabs[0].url

            // Análise no arquivo supported.json e armazenamento da fonte do recurso

            fetch("supported.json")
            .then(response => response.json())
            .then(
            json => {
                if(json.working.some(element => {
                    if(currentUrl.includes(element)){
                        currentSrc = element
                        changeSupportState(currentSrc, "working")
                        return true
                    }
                        else return false
                    })){
                        //changeSupportState()
                    }
                else if(json.developing.some(element => {
                    if(currentUrl.includes(element)){
                        currentSrc = element         
                        console.log(currentSrc);   
                        changeSupportState(currentSrc, "developing")
                        return true
                    }
                        else return false
                    })){
                        //changeSupportState()
                    }
            })

            link.value = currentUrl

            if(result.resources && result.resources.length > 0){
                if(result.resources.some(element => element.link === currentUrl)){
                    window.location.href = "./saveFeedBackSAVED.html"
                }else{
                    button.addEventListener('click', save)
                }
            }else{
                button.addEventListener('click', save)
            }
        })
    })
})

function changeSupportState(source, compatibility){

    const linkInputContainer = document.getElementById("linkInputContainer");
    linkInputContainer.style.display = "none";

    console.log(source, compatibility);
    console.log(typeof(source), typeof(compatibility));

    var dynamicSourceElement = document.getElementById('dynamicSource');
    var compatibilityElement = document.getElementById('compatibility');
    var checkImgElement = document.getElementById('checkImg');
    var sourceFeedbackElement = document.getElementById('sourceFeedback');

    if(source == "youtube.com"){
        dynamicSourceElement.textContent = "Youtube";
        compatibilityElement.textContent = "COMPATIBILIDADE TOTAL";
    }

    if(source == "scratch.mit.edu"){
        dynamicSourceElement.textContent = "Scratch";
        compatibilityElement.textContent = "COMPATIBILIDADE TOTAL";
    }
    
    checkImgElement.src = "images/check.svg"; 

    if(compatibility == "working"){
        sourceFeedbackElement.style.backgroundColor = '#22AA61';
    }
    else{
        if(source == "proedu.rnp.br"){
            dynamicSourceElement.textContent = "ProEdu";
            compatibilityElement.textContent = "COMPATIBILIDADE PARCIAL";
        }
        if(source == "khanacademy.org"){
            dynamicSourceElement.textContent = "Khan";
            compatibilityElement.textContent = "COMPATIBILIDADE PARCIAL";
        }
        sourceFeedbackElement.style.backgroundColor = '#FAAB6B';
        compatibilityElement.style.color = '#FAAB6B';
        checkImgElement.src = "images/check_orange.svg";
    }

    sourceFeedbackElement.style.display = 'flex'
}
