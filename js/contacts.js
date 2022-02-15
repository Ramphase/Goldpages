// enables tooltips
$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip();
});

// displays the edit modal
function displayEditModal() {
  $("#editContactModal").modal("show");
}

// displays the delete modal
function displayDeleteModal() {
  $("#deleteContactModal").modal("show");
}

// hides search result message when the page is first displayed
function hideSearchResult() {
  document.getElementById("contactSearchResult").innerHTML = "";
}

// clear the edit result
function clearEditResult() {
  document.getElementById("editContactResult").innerHTML = "";
}

//clear the delete result
function clearDeleteResult() {
  document.getElementById("deleteContactResult").innerHTML = "";
}
