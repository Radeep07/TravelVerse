$(document).ready(function () {

  $("#pac-input").change(function (e) {
    e.preventDefault();

    let query = $("#pac-input").val();
    let url = "http://newsapi.org/v2/top-headlines?" + query + "&country=us&category=business&apiKey=b82ab58abf26449bab3c410639821a37";

    if (query !== "") {
      $.ajax({
        url: url,
        method: "GET",
        dataType: "json",
        beforeSend: function () {
          $("#loader").show();
        },
        complete: function () {
          $("#loader").hide();
        },
        success: function (news) {
          let output = "";
          let latestNews = news.articles;

          for (var i = 0; i < 3; i++) {
            output += `
                <div class="col l6 m6 s12">

                <h2> <strong>${latestNews[i].title}</strong> </h2> 

                <p>${latestNews[i].description}</p>
                <p>${latestNews[i].content}</p>                
                <a href="${latestNews[i].url}" class="btn">Read more</a>
                </div>
              `;
          }

          if (output !== "") {
            $("#newsResults").html(output);
            M.toast({
              html: "There you go, nice reading",
              classes: 'green'
            });

          } else {
            let noNews = `<div style='text-align:center; font-size:36px; margin-top:40px;'>This news isn't available. Sorry about that.<br>Try searching for something else </div>`;
            $("#newsResults").html(noNews);
            M.toast({
              html: "This news isn't available",
              classes: 'red'
            });
          }

        },

        error: function () {
          let internetFailure = `
             <div style="font-size:34px; text-align:center; margin-top:40px;">Please check your internet connection and try again.
             <img src="img/internet.png" class="responsive-img">
             </div>`;

          $("#newsResults").html(internetFailure);
          M.toast({
            html: "We encountered an error, please try again",
            classes: 'red'
          });
        }


      });

    } else {
      let missingVal = `<div style="font-size:34px; text-align:center; margin-top:40px;">Please enter any search term in the search engine</div>`;
      $("#newsResults").html(missingVal);
      M.toast({
        html: "Please enter something",
        classes: 'red'
      });
    }

  });

});