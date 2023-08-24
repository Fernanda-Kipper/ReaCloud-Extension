chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
    if (request === 'isExtensionInstalled') {
      sendResponse(true);
    }
  });

chrome.runtime.onMessageExternal.addListener(
    function(request, sender, sendResponse) {
        if(request.getTargetData){
            chrome.storage.sync.get(['resources'], function(result) {
                if(result){
                    return sendResponse({setTargetData: result.resources})
                }else{
                    return sendResponse({setTargetData: false})
                }
            })
        }
        else if(request.delete){
            try{
                chrome.storage.sync.get(['resources'], function(result) {
                    const newResourceList = result.resources.filter(resource => resource.link != request.delete)
                    chrome.storage.sync.set({'resources': newResourceList}, function() {
                        return sendResponse({deleted: true, setTargetData: newResourceList})
                    })
                })
            }catch(error){
                return sendResponse({deleted: false})
            }
        }
        else if(request.version){
            return sendResponse({version: 1.3})
        }
    }
)
