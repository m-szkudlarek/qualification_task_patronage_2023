import mainView from "./views/mainView.js";
import headerView from "./views/headerView.js";
import formView from "./views/formView.js";
import * as model from "./model.js";

function controlLoggedView() {
  // hide buttons "logowanie" "rejestracja" and show label with bnt "wyloguj się"
  headerView.loggedView(model.state.loggedIn);
  // generate main content /transactions table with graphs
  mainView.generateHtmlLoggedView();
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
    model.validLogin(logUser.username, logUser.password);
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

  // creat form for sign in/sign up
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
