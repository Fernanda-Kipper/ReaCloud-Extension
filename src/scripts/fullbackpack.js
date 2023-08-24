const button = document.getElementById('button')

function redirectToMyResources() {
    window.location.href = "./myResources.html";
}

button.addEventListener('click', redirectToMyResources);
