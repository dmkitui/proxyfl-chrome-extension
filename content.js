const addDownloadBtn = () => {
  let magneticLink;
  const link =  $(".download")[0];
  magneticLink = $(link).find('a')[0].href;
  
  const loadingAnimation = document.createElement("IMG"); //
  loadingAnimation.alt = "Loading...be patient";
  loadingAnimation.setAttribute('class', 'loading');
  loadingAnimation.src = chrome.runtime.getURL("static/bar.gif");
  
  $('#detailsframe').before('<div class="container-div"></div>').slideDown(10000);
  $('.container-div').append('<button class="addButton" >Add To Download List</button>').hide().fadeIn(1000);
  $('.addButton').on('click', () => {
    $('.addButton').replaceWith(loadingAnimation);
    apiScript(magneticLink)
  });
  return true
};

document.addEventListener("DOMContentLoaded", function() {
  setTimeout(addDownloadBtn, 1500)
});