const imageWrapper = document.querySelector(".images");
const loadMoreButton = document.querySelector(".load-more");
const searchButton = document.querySelector(".search-box input");
const lightBox = document.querySelector(".lightbox");
const closeBtn = lightBox.querySelector(".uil-times");
const downloadBtn = lightBox.querySelector(".uil-import");
const tagsBtnContainer = document.querySelector(".tags-container .tags");

const apiKey = "lS6bjT8WnficZf6ecshUJ5bubrnKfix0WdfxLIC39qzz9lN7N2f2fwPE";
const perPage = 15;
let currentPage = 1;
let searchTerm = null;
const tags = ["city","mountain","plant","education","tree","men","women","boy","girl","night","sky","watches"];

for(let tag of tags) {
    tagsBtnContainer.innerHTML += `<button onclick="searchByTag('${tag}')">${tag}</button>`;
}

const openLightBox = (name, img) => {
    lightBox.classList.add("show");
    lightBox.querySelector("span").innerText = name;
    downloadBtn.setAttribute("data-img",img);
    console.log(downloadBtn);
    // downloadImageUrl = img;
    lightBox.querySelector("img").src = img;
    document.body.style.overflow = "hidden";
}

const closeLightBox = () => {
    lightBox.classList.remove("show");
    document.body.style.overflow = "auto";
}

const generateHTML = (images) => {
    imageWrapper.innerHTML += images.map(img => 
        `<li class="card" onclick="openLightBox('${img.photographer}','${img.src.large2x}')">
            <img src="${img.src.large2x}" alt="">
            <div class="details">
                <div class="photographer">
                    <i class="uil uil-camera"></i>
                    <span>${img.photographer}</span>
                </div>
                <button onclick="downloadImage('${img.src.large2x}')"><i class="uil uil-import"></i></button>
            </div>
        </li>`).join("");
}

const downloadImage = (imgUrl) => {
    fetch(imgUrl).then(res => res.blob()).then(file => {
        // console.log(file);
        const a = document.createElement('a');
        a.href = URL.createObjectURL(file);
        a.download = new Date().getTime();
        a.click();
    }).catch(() => alert("Failed to download"));
}

const getImages = (apiURL) => {
    // fetching images by API call with authorization
    loadMoreButton.innerText = "Loading...";
    loadMoreButton.classList.add("disabled");

    fetch(apiURL, {
        headers: { Authorization: apiKey }
    }).then( res => res.json()).then(data =>{
            console.log(data)
            generateHTML(data.photos);
            if(data.photos.length == 0) {
                loadMoreButton.innerText = "No Content Found";    
            } else {
                loadMoreButton.innerText = "Load More";
                loadMoreButton.classList.remove("disabled");
            }
        }).catch(() => {
            loadMoreButton.innerText = "No Content Found";
        })
}

const loadMoreImages = () => {
    currentPage++;
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiURL;
    getImages(apiURL);
}

const searchImage = (e) => {

    if(e.target.value === "") return searchTerm = null;

    if(e.key === "Enter") {
        // console.log("Enter pressed");
        currentPage = 1;
        searchTerm = e.target.value;
        imageWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);

    }
}

const searchByTag = (tag) => {
    currentPage = 1;
    searchTerm = tag;
    imageWrapper.innerHTML = "";
    getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}`);
}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);

loadMoreButton.addEventListener("click", loadMoreImages);
searchButton.addEventListener("keypress", searchImage);
closeBtn.addEventListener("click", closeLightBox)
downloadBtn.addEventListener("click", (e) => downloadImage(e.target.dataset.img));