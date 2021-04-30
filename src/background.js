chrome.runtime.onMessageExternal.addListener(
    function(request, sender, sendResponse) {
        if(request.getTargetData){
            chrome.storage.sync.get(['resources'], function(result) {
                if(result){
                    return sendResponse(result.resources)
                }else{
                    return sendResponse([])
                }
            })
        }
    }
)