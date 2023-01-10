import mainView from "./views/mainView.js";
import headerView from "./views/headerView.js";
import formView from "./views/formView.js";
import tableView from "./views/tableView.js";
import * as model from "./model.js";

function hideRow(row) {
  // change dataset clicked row on false
  row.dataset.expand = row.dataset.expand === "true" ? false : false;
  showRow(row);
}
function showRow(row) {
  // change icon for visualization that you can click on row
  row.lastElementChild.innerHTML = `<svg class="icon--svg">
  <use href="../../icons.svg#icon-${
    row.dataset.expand === "true" ? "up" : "down"
  }-arrow"></use></svg>`;
  // show/hide rows to next clickable row
  let toShowHide = row.nextElementSibling;
  while (toShowHide) {
    toShowHide.classList.toggle("showRow");
    toShowHide = toShowHide.nextElementSibling;
    if (toShowHide?.classList.contains("table__tr--expandable")) break;
  }
}
const controlTableRow = function (clicked) {
  // check for open row
  const prevOpened =
    clicked.parentElement.querySelector(`[data-expand="true"]`);
  // change dataset clicked row on opposite
  clicked.dataset.expand = clicked.dataset.expand === "false" ? true : false;
  // show or hide clicked row
  clicked.dataset.expand === "false" && hideRow(clicked);
  clicked.dataset.expand === "true" && showRow(clicked);
  // hide previous opened row if was open
  clicked !== prevOpened && prevOpened && hideRow(prevOpened);
};

const controlTableSearch = function (searched) {
  // make if filtr is on search only filtred data
  let filtredArray = model.state.transactions;
  if (model.state.filtredArray) filtredArray = model.state.filtredArray;

  // search table for search string no matter of lenght "" return all rows
  const searchedArray = filtredArray.filter((t) =>
    t.description.toLowerCase().includes(searched)
  );

  const newMarkup = mainView.generateHtmlLoggedView(
    searchedArray,
    model.state.transacationTypes,
    false
  );
  tableView.updateTableView(newMarkup);
};
const controlTableFilter = function (selected) {
  // filter table on type property or return all rows if 0-no filtr
  model.state.filtredArray = model.state.transactions.filter(
    (t) => t.type === Number(selected) || Number(selected) === 0
  );

  const newMarkup = mainView.generateHtmlLoggedView(
    model.state.filtredArray,
    model.state.transacationTypes,
    false
  );
  tableView.updateTableView(newMarkup);
};
async function controlLoggedView() {
  try {
    // hide buttons "logowanie" "rejestracja" and show label with bnt "wyloguj się"
    headerView.loggedView(model.state.loggedIn);
    // render spinner
    mainView.renderSpinner();
    // get data to generate table transaction
    const { transactions, transacationTypes } = await model.fetchData();
    model.state.transactions = transactions;
    model.state.transacationTypes = transacationTypes;
    // sort transactions by date
    model.state.transactions.sort(
      (objA, objB) => new Date(objB.date) - new Date(objA.date)
    );
    // generate main content /transactions table with graphs
    mainView.generateHtmlLoggedView(
      model.state.transactions,
      model.state.transacationTypes
    );
    // set parent element for created table
    tableView.init();
    // add handler to serve click on row
    tableView.addHandlerExpandRow(controlTableRow);
    // add handler to serve filter by type
    tableView.addHandlerFilter(controlTableFilter);
    // add handler to serve search by description
    tableView.addHandlerSearch(controlTableSearch);
  } catch (error) {
    console.error(error);
  }
}
function controlLogOutView() {
  // opposite effect of headerView.loggedView();
  headerView.logOutView();
  //clear main content
  mainView.generateHtmlLogOut();
}

const controlRegisterUser = function (formData) {
  // get the data from form
  const newUser = {};
  for (const iterator of formData) {
    newUser[iterator[0]] = iterator[1];
  }
  model.state.canRegister = true;
  // valid fileds of registartion
  // 1.username
  tryCatchHelper(model.validUsername.bind(null, newUser.username));

  // 2.Password
  tryCatchHelper(model.validPassword.bind(null, newUser.password));

  // 3.Email
  tryCatchHelper(model.validEmail.bind(null, newUser.email));

  // 4.Confirmed email
  tryCatchHelper(
    model.validEmailConfirm.bind(null, newUser.email, newUser.emailConfirm)
  );

  // Validaiton gone wrong cannot register new user
  if (!model.state.canRegister) return;

  // push new user to array of all registred users and set loggedIn object
  model.registerUser(newUser);
  // change to logged user view
  controlLoggedView();
};

// Multiple erros have to use multi trycatch statemant
const tryCatchHelper = function (callback) {
  // cathcing erros and showing them in contect of field
  try {
    callback();
  } catch (error) {
    formView.showError(error.name, error.message);
    model.state.canRegister = false;
  }
};
const controlLoggedInUser = function (formData) {
  try {
    // get the data from form
    const logUser = {};
    for (const iterator of formData) {
      logUser[iterator[0]] = iterator[1];
    }

    // valid that user exist and password is correct
    const temp = model.validLogin(logUser.login, logUser.password);
    // log user
    model.logUser(temp);
    //change to logged user view
    controlLoggedView();
  } catch (error) {
    formView.showError(error.name, error.message);
  }
};
const controlFormFlow = function (clicked) {
  // Take data for generated form and send them further
  const formData = new FormData(clicked);
  clicked.classList.contains("form--sign-up")
    ? controlRegisterUser(formData)
    : controlLoggedInUser(formData);
};

const controlHeaderFlow = function (clicked) {
  // operations to click sign out
  if (clicked.classList.contains("bnt--sign-out")) {
    controlLogOutView();
    model.logOutUser();
    return;
  }

  // operations to click sign in
  headerView.hideBnt(clicked);
  if (clicked.classList.contains("bnt--sign-in")) {
    headerView.showBnt(document.querySelector(".bnt--sign-up"));
    mainView.generateHtmlForm("form--sign-in");
  }
  // operations to click sign up
  if (clicked.classList.contains("bnt--sign-up")) {
    headerView.showBnt(document.querySelector(".bnt--sign-in"));
    mainView.generateHtmlForm("form--sign-up");
  }

  // set parent element for class
  formView.init();
  // add handler to serve click on button
  formView.addHandlerSubmit(controlFormFlow);
};

// Init handlers to control flow of views
const init = function () {
  model.loadSessionStorage();
  model.state.loggedIn.logged ? controlLoggedView() : controlLogOutView();
  headerView.addHandlerButtons(controlHeaderFlow);
};
init();
