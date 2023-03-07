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
      states: Object.keys(states),
      cities: Object.keys(cities),
      amenities: Object.keys(amenities),
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

function publishPlaces(data, statusText) {
  $(".places").empty();
  $(".places").append(
    data.map((place) => {
      return `<article>
        <div class="title_box">
        <h2>${place.name}</h2>
        <div class="price_by_night">\$${place.price_by_night}</div>
        </div>
        <div class="information">
        <div class="max_guest">${place.max_guest} Guests</div>
            <div class="number_rooms">${place.number_rooms} Bedrooms</div>
            <div class="number_bathrooms">${place.number_bathrooms} Bathrooms</div>
        </div>
        <div class="description">${place.description}</div>
    </article>`;
    })
  );
}
