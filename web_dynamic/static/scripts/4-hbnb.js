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

  $(".filters button").click(function () {
    $.ajax({
      url: "http://localhost:5001/api/v1/places_search/",
      type: "POST",
      data: JSON.stringify({ amenities: Object.keys(amenities)}),
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
