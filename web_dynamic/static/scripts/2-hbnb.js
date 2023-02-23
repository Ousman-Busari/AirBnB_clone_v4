$(function () {
  amenities = {};
  $(".amenities input").change(function () {
    if ($(this).is(":checked")) {
      amenities[$(this).attr("data-id")] = $(this).attr("data-name");
    } else {
      delete amenities[$(this).attr("data-id")];
    }
    $(".amenities H4").text(Object.values(amenities).join(", "));
  });

  $.get("http://127.0.0.1:5001/api/v1/status/", function (data) {
    if (data.status === "OK") {
      $("#api_status").addClass("available")
    } else {
      $("#api_status").removeClass("available")
    }
  });
});
