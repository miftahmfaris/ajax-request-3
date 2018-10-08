/* eslint-env jquery */

(function() {
  const form = document.querySelector("#search-form");
  const searchField = document.querySelector("#search-keyword");
  let searchedForText;
  const responseContainer = document.querySelector("#response-container");

  form.addEventListener("submit", function(e) {
    e.preventDefault();
    responseContainer.innerHTML = "";
    searchedForText = searchField.value;
    fetch(
      `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`,
      {
        headers: {
          Authorization:
            "Client-ID 8ddbf37655b3d18cb9787dc474d586f1872d30533617696a143a7136a5cdb791"
        }
      }
    )
      .then(resultImage => resultImage.json())
      .then(addImage)
      .catch(error => requestError(error, "image"));
    fetch(
      `https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=3590ce02812940c9aad1bf040d96b785`
    )
      .then(resultArticle => resultArticle.json())
      .then(addArticles)
      .catch(error => requestError(error, "article"));
  });

  function addImage(data) {
    let htmlContent = "";
    if (data && data.results && data.results[0]) {
      const firstImage = data.results[0];
      htmlContent = `<figure>
            <img src="${firstImage.urls.regular}" alt="${searchedForText}">
            <figcaption>${searchedForText} by ${
        firstImage.user.name
      }</figcaption>
            </figure>
            `;
    } else {
      htmlContent = `<div class="error-no-image">No Image Available</div>`;
    }

    responseContainer.insertAdjacentHTML("afterbegin", htmlContent);
  }

  function addArticles(data) {
    let htmlContent = "";

    if (data.response && data.response.docs && data.response.docs.length > 1) {
      htmlContent =
        `<ul>` +
        data.response.docs
          .map(
            article => `<li class="article"><h2><a href="${article.web_url}">${
              article.headline.main
            }</a></h2>
            <p>${article.snippet}</p>
            </li>`
          )
          .join("") +
        `</ul>`;
    } else {
      htmlContent = `<div class="error-no-article">No Articles Available</div>`;
    }
    responseContainer.insertAdjacentHTML("beforeend", htmlContent);
  }

  function requestError(e, part) {
    console.log(e);
    responseContainer.insertAdjacentHTML(
      "beforeend",
      `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`
    );
  }
})();
