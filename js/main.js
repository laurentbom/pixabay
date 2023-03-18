const searchBar = document.querySelector(".searchBar");
const searchIcon = document.querySelector(".fa-magnifying-glass");
const selectField = document.querySelector(".selectField");
const selectFieldPic = document.querySelector(".selectFieldPic");
const selectFieldVid = document.querySelector(".selectFieldVid");

const horFilter = document.querySelector(".horFilter");
const verFilter = document.querySelector(".verFilter");
const allFilter = document.querySelector(".allFilter");

const resultsGrid = document.querySelector(".resultsGrid");

const apiKey = "33414931-f6877767de875df71d9f4e8ca";

const closeModalBtn = document.querySelector(".closeBtn");
const asideMedia = document.querySelector(".modalMedia");
const asideModal = document.querySelector(".modalAside");
const pagesContainer = document.querySelector(".results__pag");



searchIcon.addEventListener("click", function(){
  $(".error").fadeOut();
  if(searchBar.value != ""){
    $(".searchResult").html(searchBar.value);
    goSearch();
    searchBar.focus();
    setTimeout(function(){
      pagination();
    },200)
  } else {
    $(".error").fadeIn();
  }
})
// Activation fonction au click et sur enter
searchBar.addEventListener("keypress", function(e){
  if (e.key === "Enter"){
    $(".error").fadeOut();
    if(searchBar.value != ""){
      $(".searchResult").html(searchBar.value);
      goSearch();
      searchBar.focus();
      setTimeout(function(){
        pagination();
      },200)
    } else {
    $(".error").fadeIn();
    }
  }
})
closeModalBtn.addEventListener("click",function(){
  $("body").removeClass("black");
  $(".modalWindow").fadeOut();
})
verFilter.addEventListener("click", function(){
  $("[data-orientation='vertical']").fadeIn();
  $("[data-orientation='horizontal']").fadeOut();
  verFilter.classList.add("filterActive");
  horFilter.classList.remove("filterActive");
  allFilter.classList.remove("filterActive");
})
horFilter.addEventListener("click", function(){
  $("[data-orientation='horizontal']").fadeIn();
  $("[data-orientation='vertical']").fadeOut();
  verFilter.classList.remove("filterActive");
  horFilter.classList.add("filterActive");
  allFilter.classList.remove("filterActive");
})
allFilter.addEventListener("click", function(){
  $("[data-orientation='horizontal']").fadeIn();
  $("[data-orientation='vertical']").fadeIn();
  verFilter.classList.remove("filterActive");
  horFilter.classList.remove("filterActive");
  allFilter.classList.add("filterActive");
})

//------------------------------------------
//------------------------------------------
//------------------------------------------
function goSearch(){
  let searchInput = searchBar.value;
  searchBar.value = ""
  let okSearch = searchInput.split(' ').join('+');
  if(selectFieldPic.checked){
    picSearch(okSearch,1);
    document.querySelector(".searchResult").setAttribute("data-mediatype", "https://pixabay.com/api/")
  } else if(selectFieldVid.checked){
    videoSearch(okSearch,1);
    document.querySelector(".searchResult").setAttribute("data-mediatype", "https://pixabay.com/api/videos/")
  }
}




//------------------------------------------
// Function picture search
//------------------------------------------
function picSearch(searchInput, page){
  fetch(`https://pixabay.com/api/?key=${apiKey}&q=${searchInput}&image_type=photo&page=${page}`)
  .then(response => response.json())
  .then(data => {
    // console.log(data);
    let totalResults = Math.floor(data.totalHits / 25);
    resultsGrid.innerHTML = "";
    pagesContainer.innerHTML = "";
    // Content
    for(i=0; i < 20; i++){
      let orientation = "";
      if(data.hits[i].imageWidth > data.hits[i].imageHeight){
        orientation = "horizontal";
      } else {
        orientation = "vertical";
      }
      resultsGrid.innerHTML += `
      <div class="result" id="${data.hits[i].id}" data-orientation="${orientation}" data-mediaType="https://pixabay.com/api/">
        <img src="${data.hits[i].largeImageURL}" alt="img">
        <p class="authorPrev">${data.hits[i].user}</p>
        <p class="tagsPrev">${data.hits[i].tags}</p>
        <a href="${data.hits[i].pageURL}"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>
        <p class="prevBtn">Preview</p>
      </div>
      `;
    }
    // Pages
    for(i=0; i < totalResults; i++){
      pagesContainer.innerHTML += `
      <li><a href="#">${i+1}</a></li>      
      `
    }
    // Modal & pagination
    modalWindow();
    pagination();
  })
  .catch(error => {
    console.error("Erreur lors de la récupération des données :", error); 
  });
}


//------------------------------------------
// Function video search
//------------------------------------------
function videoSearch(searchInput,page){
  fetch(`https://pixabay.com/api/videos/?key=${apiKey}&q=${searchInput}&safesearch="true"&page=${page}`)
  .then(response => response.json())
  .then(data => {
    // console.log(data);
    let totalResults = Math.floor(data.totalHits / 25);
    resultsGrid.innerHTML = "";
    pagesContainer.innerHTML = "";
    console.log("total videos: "+totalResults)
    for(i=0; i < 20; i++){
      resultsGrid.innerHTML += `
      <div class="result" id="${data.hits[i].id}" data-orientation="horizontal" data-mediaType="https://pixabay.com/api/videos/">
        <img src="https://i.vimeocdn.com/video/${data.hits[i].picture_id}_640x360.jpg" alt="img">
        <p class="authorPrev">${data.hits[i].user}</p>
        <p class="tagsPrev">${data.hits[i].tags}</p>
        <a href="${data.hits[i].pageURL}"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>
        <div class="prevBtn">Play</div>
      </div>
      `;
    }
    for(i=0; i < totalResults; i++){
      pagesContainer.innerHTML += `
      <li><a href="#">${i+1}</a></li>      
      `
    }
    modalWindow();
    pagination();
  })
  .catch(error => {
    console.error("Erreur lors de la récupération des données :", error); 
  });
}



//------------------------------------------
// Function modal
//------------------------------------------
function modalWindow(){
  let openModalBtns = document.querySelectorAll(".prevBtn");
  openModalBtns.forEach(function(openModalBtn){
    let id = openModalBtn.parentElement.id;
    openModalBtn.addEventListener("click", function(){
      let mediaType = openModalBtn.parentElement.getAttribute('data-mediaType')
      byIdSearch(id, mediaType);
      $(".modalWindow").fadeIn();
      $("body").addClass("black");
    })
  })
}

function byIdSearch(id, mediaType){
  fetch(`${mediaType}?key=${apiKey}&id=${id}`)
  .then(response => response.json())
  .then(data => {
    // console.log(data);
    if (mediaType == "https://pixabay.com/api/"){
      let templateMedia = `
      <img src="${data.hits[0].largeImageURL}" alt="media">
      `
      let templateAside = `
      <div class="authorpic">
        <img src="${data.hits[0].userImageURL}" alt="user">
        <div class="authorCreator">
          Author: <p class="creatorModal">${data.hits[0].user}</p>
        </div>
      </div>
      <div class="authorTags">
          Tags: <p class="tagModal">${data.hits[0].tags}</p>
      </div>
      <div class="views">Views: ${data.hits[0].views}</div>
      <div>Size: ${data.hits[0].imageWidth}px X ${data.hits[0].imageHeight}px</div>
      <a href="${data.hits[0].pageURL}">Link to the original page</a>
      <a href="${data.hits[0].largeImageURL}" download>Link to download</a>    
      `
      $(".modalMedia").html(templateMedia);
      $(".modalAside").html(templateAside);
    } else {
      let templateMedia = `
      <iframe id="inlineFrameExample"
      title="Inline Frame Example"
      width="100%"
      height="100%"
      src="${data.hits[0].videos.medium.url}">
      `
      let templateAside = `
      <div class="authorpic">
        <img src="${data.hits[0].userImageURL}" alt="user">
        <div class="authorCreator">
          Author: <p class="creatorModal">${data.hits[0].user}</p>
        </div>
      </div>
      <div class="authorTags">
          Tags: <p class="tagModal">${data.hits[0].tags}</p>
      </div>
      <div class="views">Views: ${data.hits[0].views}</div>
      <a href="${data.hits[0].pageURL}">Link to the original page</a>
      <a href="${data.hits[0].videos.medium.url}" download>Link to download</a>    
      `
      $(".modalMedia").html(templateMedia);
      $(".modalAside").html(templateAside);
    }
    
  })
  .catch(error => {
    console.error("Erreur lors de la récupération des données :", error); 
  });
}




//------------------------------------------
// Function pagination
//------------------------------------------
function pagination(){
  let pages = document.querySelectorAll(".results__pag li a");
  console.log("test")
  pages.forEach(function(page){
    page.addEventListener("click", function(){
      pages.forEach(function(page){
        page.classList.remove("active");
      })
      page.classList.add("active");
      let numPage = page.innerHTML;
      let searchWord = document.querySelector(".searchResult").innerHTML.split(' ').join('+');
      let mediaType = document.querySelector(".searchResult").getAttribute('data-mediaType');
      if(searchWord != ""){
        if(mediaType == "https://pixabay.com/api/"){
          picSearch(searchWord,numPage);
        } else {
          videoSearch(searchWord,numPage);
        }
      }
    })
  })
}
