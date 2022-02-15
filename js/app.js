const urlBase = "http://www.goldpagescop.com";
const extension = "php";

let userId = 0;
let firstName = "";
let lastName = "";
let error = "";

// variables for contacts page
let cidToDelete = 0;
let cidToEdit = 0;
let toSearch = "";

// user login
function login() {
  userId = 0;
  firstName = "";
  lastName = "";
  error = "";

  const login = document.getElementById("loginName").value;
  const password = document.getElementById("loginPassword").value;
  const hash = md5(password);

  document.getElementById("loginResult").innerHTML = "";

  const tmp = { login: login, password: hash };
  const jsonPayload = JSON.stringify(tmp);

  const url = urlBase + "/LAMPAPI/Login." + extension;
  const xhr = new XMLHttpRequest();

  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        const jsonObject = JSON.parse(xhr.responseText);
        userId = jsonObject.id;
        error = jsonObject.error;

        if (error !== "") {
          document.getElementById("loginResult").innerHTML =
            "User/Password combination incorrect";
          return;
        }

        firstName = jsonObject.firstName;
        lastName = jsonObject.lastName;

        saveCookie();

        window.location.href = "contacts.html";
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("loginResult").innerHTML = err.message;
  }
}

//user registration
function register() {
  error = "";

  const first = document.getElementById("firstName").value;
  const last = document.getElementById("lastName").value;
  const login = document.getElementById("signupUsername").value;
  const password = document.getElementById("regPassword").value;
  const confirmPassword = document.getElementById("conPassword").value;
  const hash = md5(password);

  document.getElementById("registerResult").innerHTML = "";

  if (password !== confirmPassword) {
    document.getElementById("registerResult").innerHTML =
      "Passwords do not match";
    return;
  }

  if (password === "" || password === null) {
    document.getElementById("registerResult").innerHTML = "Invalid password";
    return;
  }

  if (login === "" || login === null) {
    document.getElementById("registerResult").innerHTML = "Invalid username";
    return;
  }

  const tmp = {
    firstName: first,
    lastName: last,
    login: login,
    password: hash,
  };
  const jsonPayload = JSON.stringify(tmp);

  const url = urlBase + "/LAMPAPI/Register." + extension;
  const xhr = new XMLHttpRequest();

  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        const jsonResponse = JSON.parse(xhr.responseText);
        error = jsonResponse.error;
        document.getElementById("registerResult").innerHTML = "Signed in.";

        if (error !== "") {
          document.getElementById("registerResult").innerHTML =
            "Sign Up Failed";
          return;
        }

        saveCookie();

        window.location.href = "index.html";
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("registerResult").innerHTML = err.message;
  }
}

function saveCookie() {
  let minutes = 20;
  let date = new Date();
  date.setTime(date.getTime() + minutes * 60 * 1000);
  document.cookie =
    "firstName=" +
    firstName +
    ",lastName=" +
    lastName +
    ",userId=" +
    userId +
    ";expires=" +
    date.toGMTString();
}

function readCookie() {
  userId = -1;
  let data = document.cookie;
  let splits = data.split(",");
  for (var i = 0; i < splits.length; i++) {
    let thisOne = splits[i].trim();
    let tokens = thisOne.split("=");
    if (tokens[0] == "firstName") {
      firstName = tokens[1];
    } else if (tokens[0] == "lastName") {
      lastName = tokens[1];
    } else if (tokens[0] == "userId") {
      userId = parseInt(tokens[1].trim());
    }
  }

  if (userId < 0) {
    window.location.href = "/index.html";
  } else {
    document.getElementById("userNameDisplay").innerHTML = "User: ".concat(
      firstName,
      " ",
      lastName
    );
  }
}

/*
| functions for contacts page below
|
|
|
|
|
*/

function doLogout() {
  userId = 0;
  firstName = "";
  lastName = "";
  error = "";
  cidToDelete = 0;
  cidToEdit = 0;
  toSearch = "";
  document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  window.location.href = "/index.html";
}

// clear the input and result message of the create contact modal
function clearFields() {
  document.getElementById("firstNameInput").value = "";
  document.getElementById("lastNameInput").value = "";
  document.getElementById("phoneInput").value = "";
  document.getElementById("emailInput").value = "";
  document.getElementById("createContactResult").innerHTML = "";
}

// populate the input fields of the edit contact modal with the attributes of the contact to be editted
function populateFields() {
  let rowToEdit = document.getElementById(cidToEdit.toString());
  document.getElementById("firstNameEdit").value =
    rowToEdit.children[0].innerText;
  document.getElementById("lastNameEdit").value =
    rowToEdit.children[1].innerText;
  document.getElementById("phoneEdit").value = rowToEdit.children[2].innerText;
  document.getElementById("emailEdit").value = rowToEdit.children[3].innerText;
}

// create the delete confirmation message using the first and last name of the contact to be deleted
function createDeleteMessage() {
  let rowToDelete = document.getElementById(cidToDelete.toString());
  let result = "Are you sure you want to delete ".concat(
    rowToDelete.children[0].innerText,
    " ",
    rowToDelete.children[1].innerText,
    " from your contact list?"
  );
  document.getElementById("deleteConfirmationMessage").innerHTML = result;
}

// get the CID of the contact to be deleted
function assignCidToDelete(cid) {
  cidToDelete = parseInt(cid.substring(6));
}

// get the CID of the contact to be editted
function assignCidToEdit(cid) {
  cidToEdit = parseInt(cid.substring(4));
}

// assign the string to search for
function assignToSearch() {
  toSearch = document.getElementById("searchInput").value;
}

// add a contact
function addContact() {
  let fname = document.getElementById("firstNameInput").value;
  let lname = document.getElementById("lastNameInput").value;
  let phoneNumber = document.getElementById("phoneInput").value;
  let email = document.getElementById("emailInput").value;

  document.getElementById("createContactResult").innerHTML = "";

  if (fname === "" || fname === null) {
    document.getElementById("createContactResult").innerHTML =
      "Please enter a first name.";
    return;
  }
  if (
    (phoneNumber === "" || phoneNumber === null) &&
    (email === "" || email === null)
  ) {
    document.getElementById("createContactResult").innerHTML =
      "Please enter contact information.";
    return;
  }

  let emailExp = /^([a-z\d\.-_]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
  let phoneExp = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

  if (email !== "" && email !== null && !emailExp.test(email)) {
    document.getElementById("createContactResult").innerHTML =
      "Please enter a valid email address.";
    return;
  }

  if (
    phoneNumber !== "" &&
    phoneNumber !== null &&
    !phoneExp.test(phoneNumber)
  ) {
    document.getElementById("createContactResult").innerHTML =
      "Please enter a valid phone number.";
    return;
  }

  let tmp = {
    userId: userId,
    firstName: fname,
    lastName: lname,
    email: email,
    phoneNumber: phoneNumber,
  };

  let jsonPayload = JSON.stringify(tmp);
  let url = urlBase + "/LAMPAPI/AddContact." + extension;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log("Contact Created Successfully");

        clearFields();
        $("#addContactModal").modal("hide");
        searchContacts();
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("createContactResult").innerHTML = err.message;
    console.log(err.message);
  }
}

// delete a contact
function deleteContact() {
  document.getElementById("deleteContactResult").innerHTML = "";

  let tmp = { userId: userId, contId: cidToDelete };

  let jsonPayload = JSON.stringify(tmp);
  let url = urlBase + "/LAMPAPI/DeleteContact." + extension;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log("Contact Deleted Successfully");
        document.getElementById("deleteContactResult").innerHTML = "";
        $("#deleteContactModal").modal("hide");
        searchContacts();
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("deleteContactResult").innerHTML = err.message;
    console.log(err.message);
  }
}

//edit a contact
function editContact() {
  let fname = document.getElementById("firstNameEdit").value;
  let lname = document.getElementById("lastNameEdit").value;
  let phoneNumber = document.getElementById("phoneEdit").value;
  let email = document.getElementById("emailEdit").value;

  document.getElementById("editContactResult").innerHTML = "";

  if (fname === "" || fname === null) {
    document.getElementById("editContactResult").innerHTML =
      "Please enter a first name.";
    return;
  }
  if (
    (phoneNumber === "" || phoneNumber === null) &&
    (email === "" || email === null)
  ) {
    document.getElementById("editContactResult").innerHTML =
      "Please enter contact information.";
    return;
  }

  let emailExp = /^([a-z\d\.-_]+)@([a-z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;
  let phoneExp = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

  if (email !== "" && email !== null && !emailExp.test(email)) {
    document.getElementById("editContactResult").innerHTML =
      "Please enter a valid email address.";
    return;
  }

  if (
    phoneNumber !== "" &&
    phoneNumber !== null &&
    !phoneExp.test(phoneNumber)
  ) {
    document.getElementById("editContactResult").innerHTML =
      "Please enter a valid phone number.";
    return;
  }

  let tmp = {
    userId: userId,
    contId: cidToEdit,
    firstName: fname,
    lastName: lname,
    email: email,
    phoneNumber: phoneNumber,
  };

  let jsonPayload = JSON.stringify(tmp);
  let url = urlBase + "/LAMPAPI/EditContact." + extension;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log("Contact Updated Successfully");
        document.getElementById("editContactResult").innerHTML = "";
        $("#editContactModal").modal("hide");
        searchContacts();
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("editContactResult").innerHTML = err.message;
    console.log(err.message);
  }
}

// search for contacts
function searchContacts() {
  document.getElementById("contactSearchResult").innerHTML = "";

  let contactsList = "";

  let tmp = { userId: userId, search: toSearch };
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + "/LAMPAPI/SearchContact." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        if (toSearch === "") {
          document.getElementById("contactSearchResult").innerHTML =
            "All Contacts Retrieved.";
        } else {
          document.getElementById("contactSearchResult").innerHTML =
            "Matching Contacts Retrieved.";
        }
        let jsonObject = JSON.parse(xhr.responseText);

        for (
          let i = 0;
          jsonObject.results != null && i < jsonObject.results.length;
          i++
        ) {
          // row header
          contactsList +=
            '<div class="table-row" id="' +
            jsonObject.results[i].contId.toString() +
            '">\n';
          // data coumns in the row
          contactsList +=
            '<div class="table-column table-fname">' +
            jsonObject.results[i].firstName +
            "</div>\n";
          contactsList +=
            '<div class="table-column table-lname">' +
            jsonObject.results[i].lastName +
            "</div>\n";
          contactsList +=
            '<div class="table-column table-phone">' +
            jsonObject.results[i].phoneNumber +
            "</div>\n";
          contactsList +=
            '<div class="table-column table-email">' +
            jsonObject.results[i].email +
            "</div>\n";
          // buttons defined below
          contactsList +=
            '<div onClick="assignCidToEdit(id);populateFields();displayEditModal();" data-toggle="tooltip" title="Edit" class="table-column edit-btn" id="edit' +
            jsonObject.results[i].contId.toString() +
            '"><i class="fa-solid fa-pen-to-square fa-lg"></i></div>\n';
          contactsList +=
            '<div onClick="assignCidToDelete(id);createDeleteMessage();displayDeleteModal()" data-toggle="tooltip" title="Delete" class="table-column delete-btn" id="delete' +
            jsonObject.results[i].contId.toString() +
            '"><i class="fa-solid fa-trash fa-lg"></i></div>\n';
          contactsList += "</div>\n";
        }
        // set innerhtml of table to the generated html, refreshing the list
        document.getElementById("tableBody").innerHTML = contactsList;
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById("contactSearchResult").innerHTML = err.message;
    console.log(err.message);
  }
}
