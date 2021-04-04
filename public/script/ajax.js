const subject_link = document.getElementById('sub__link');
const main = document.getElementById('main');

subject_link.addEventListener("click", () => {
    fetch('pages/subject.html')
        .then((response) => {
            return response.text();
        })
        .then(html => {
            main.innerHTML = html;
        })
})
