$(function () {
  $.get("http://localhost:5001/api/v1/status/", function (data) {
    if (data.status === "OK") {
      $("#api_status").addClass("available");
    } else {
      $("#api_status").removeClass("available");
    }
  });

  $.ajax({
    url: "http://localhost:5001/api/v1/places_search/",
    type: "POST",
    data: "{}",
    contentType: "application/json",
    dataType: "json",
    success: publishPlaces,
  });

  const amenities = {};
  $(".amenities input").change(function () {
    if ($(this).is(":checked")) {
      amenities[$(this).attr("data-id")] = $(this).attr("data-name");
    } else {
      delete amenities[$(this).attr("data-id")];
    }
    $(".amenities H4").text(Object.values(amenities).join(", "));
  });

  const filters = {};
  const states = {};
  $(".locations > .popover > ul > li > input").change(function () {
    if ($(this).is(":checked")) {
      states[$(this).attr("data-id")] = $(this).attr("data-name");
      filters[$(this).attr("data-id")] = $(this).attr("data-name");
    } else {
      delete states[$(this).attr("data-id")];
      delete filters[$(this).attr("data-id")];
    }
    $(".locations H4").text(Object.values(filters).join(", "));
  });

  const cities = {};
  $(".locations > .popover > ul > li > ul > li > input").change(function () {
    if ($(this).is(":checked")) {
      cities[$(this).attr("data-id")] = $(this).attr("data-name");
      filters[$(this).attr("data-id")] = $(this).attr("data-name");
    } else {
      delete cities[$(this).attr("data-id")];
      delete filters[$(this).attr("data-id")];
    }
    $(".locations H4").text(Object.values(filters).join(", "));
  });

  $(".filters button").click(function () {
    const data = JSON.stringify({
      states: Object.keys(states).join(", "),
      cities: Object.keys(cities).join(", "),
      amenities: Object.keys(amenities).join(", "),
    });
    $.ajax({
      url: "http://localhost:5001/api/v1/places_search/",
      type: "POST",
      data: data,
      contentType: "application/json",
      dataType: "json",
      success: publishPlaces,
    });
  });
});

function publishPlaces(places) {
  $(".places").empty();
  places.forEach((place) => {
    let placeID = place.id;
    $(".places").append(`<article>
        <div class="title_box">
        <h2>${place.name}</h2>
        <div class="price_by_night">\$${place.price_by_night}</div>
        </div>
        <div class="information">
        <div class="max_guest">${place.max_guest} Guests</div>
            <div class="number_rooms">${place.number_rooms} Bedrooms</div>
            <div class="number_bathrooms">${place.number_bathrooms} Bathrooms</div>
        </div>
        <div id=${place.user_id} class="user"></div>
        <div class="description">${place.description}</div>
        <div class="reviews" id="${placeID}"></div>
        </article`);
    $.get(
      `http://localhost:5001/api/v1/users/${place.user_id}`,
      function (owner) {
        $("#" + place.user_id).html(
          `<b>Owner</b>: ${owner.first_name} ${owner.last_name}`
        );
      }
    );
    $.ajax({
      url: `http://localhost:5001/api/v1/places/${place.id}/reviews`,
      type: "GET",
      success: (reviews) => {
        let count = "Reviews";
        if (reviews.length == 1) count = "Review";
        $("#" + placeID)
          .html(`<h2>${reviews.length} ${count} <span>show...</span></h2>
        <ul></ul>`);
        reviews.forEach((review) => {
          $.ajax({
            url: `http://localhost:5001/api/v1/users/${review.user_id}`,
            type: "GET",
            success: (user) => {
              $("#" + placeID + "> ul").append(
                `<li><h3>From ${
                  user.first_name + " " + user.last_name
                } the ${new Date(review.created_at).toDateString()}</h3><p>${
                  review.text
                }</p></li>`
              );
            },
          });
        });
        $(".reviews span").click(function () {
          $(this).parent().next().css("display", "block");
          // $(this).parent().next().toggleClass("show hide");
        });
      },
    });
  });
}
