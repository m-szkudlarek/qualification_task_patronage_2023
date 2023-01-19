import mainView from "./views/mainView.js";
import headerView from "./views/headerView.js";
import formView from "./views/formView.js";
import tableView from "./views/tableView.js";
import chartView from "./views/chartView.js";
import carouselView from "./views/carouselView.js";
import * as model from "./model.js";
import { langData } from "./views/langView.js";
let resizeObserver;

// Init handlers to control flow of views
const init = function () {
  model.loadSessionStorage();
  model.state.loggedIn.logged ? controlLoggedView() : controlLogOutView();
  headerView.addHandlerButtons(controlHeaderFlow);
};
init();

// HEADER PAGE CONTROLLER ---------------------------------------------------------------------------------

// controlling which buttons should be displayed
function controlHeaderFlow(clicked) {
  // operations to click sign out
  if (clicked.classList.contains("bnt--sign-out")) {
    controlLogOutView();
    model.logOutUser();
    return;
  }
  //  change language
  if (clicked.classList.contains("toggle__indicator")) {
    // change label on button
    clicked.textContent.trim() === "PL"
      ? (clicked.textContent = "EN")
      : (clicked.textContent = "PL");
    // animation of changing language
    clicked.classList.toggle("EN");
    // set language on page
    settingLanguage(clicked.textContent);
    return;
  }
  // operations to click sign in
  headerView.hideBnt(clicked);
  if (clicked.classList.contains("bnt--sign-in")) {
    headerView.showBnt(document.querySelector(".bnt--sign-up"));
    mainView.generateHtmlForm("form--sign-in", model.state.language);
  }
  // operations to click sign up
  if (clicked.classList.contains("bnt--sign-up")) {
    headerView.showBnt(document.querySelector(".bnt--sign-in"));
    mainView.generateHtmlForm("form--sign-up", model.state.language);
  }

  // animation of appear content
  mainView.playAnimation();
  // set parent element for class
  formView.init();
  // add handler to serve click on button
  formView.addHandlerSubmit(controlFormFlow);
}

// MAIN VIEW FORM CONTROLLER-----------------------------------------------------------

// identifying which of the forms has been submit
function controlFormFlow(clicked) {
  // Take data for generated form and send them further
  const formData = new FormData(clicked);
  clicked.classList.contains("form--sign-up")
    ? controlRegisterUser(formData)
    : controlLoggedInUser(formData);
}

//LOGIN CONTROL
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

// REGISTER CONTROL
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

// HELPER TO SHOW ERROS FORMS
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
//VIEWS DEPENDING ON LOGGED IN/OUT STATUS---------------------------------------------------------------

// LOG IN
async function controlLoggedView() {
  try {
    // hide buttons "logowanie" "rejestracja" and show label with bnt "wyloguj się"
    headerView.loggedView(model.state.loggedIn);
    // render spinner
    mainView.renderSpinner();
    // get data to generate table transaction
    const { transacationTypes } = await model.fetchData();
    model.state.transacationTypes = langData.mapTransactionType(
      model.state.language,
      transacationTypes
    );
    // sort transactions by date
    model.state.loggedIn.transactions.sort(
      (objA, objB) => new Date(objB.date) - new Date(objA.date)
    );
    // recognize device width to show right view
    model.recognizeDevice();
    // generate main content and watch to resize window to change styles for mobile/desktop
    controlMainLayout();
  } catch (error) {
    console.error(error);
  }
}

// LOG OUT
function controlLogOutView() {
  // opposite effect of headerView.loggedView();
  headerView.logOutView();
  // turn off resize observer
  if (resizeObserver) resizeObserver.disconnect();
  //clear main content
  mainView.generateHtmlLogOut();
}

// RESZIE OBSERVER TO CHANGING LAYOUT OF MAIN VIEW
const controlMainLayout = function () {
  resizeObserver = new ResizeObserver(function () {
    let diff = window.matchMedia("(min-width: 768px)").matches ? -1 : 1;
    if (diff === model.state.isChangeMainLayout) {
      handleGenerateMain();
      model.state.isChangeMainLayout *= -1;
    }
  });
  resizeObserver.observe(document.body);
};

// MAIN VIEW CONTROLLER TO DISPLAY CHARTS AND TRANSACTIONS TABLE ----------------------------------------------------------
function handleGenerateMain() {
  mainView.setLanguageMonths(model.state.language);
  // generate markups for main content /transactions table with graphs
  mainView.generateHtmlLoggedView(
    model.state.language,
    model.state.loggedIn.transactions,
    model.state.transacationTypes
  );

  // set parent element for chart view
  chartView.init();
  // create pie chart and add him to view
  chartView.addChartToView(
    chartView.createPieChart(
      model.state.language,
      model.state.loggedIn.transactions,
      model.state.transacationTypes
    )
  );
  // create bar chart and add him to view
  chartView.addChartToView(
    chartView.createBarChart(
      model.state.language,
      model.state.loggedIn.transactions
    )
  );

  // carousel support for width below 768px
  if (!window.matchMedia("(min-width: 768px)").matches) {
    // init data for the carousel to work
    carouselView.init();
    carouselView.setPositionSlides();
    // add  handler to move charts
    carouselView.addHandlerPointerDown(carouselPointerDown);
    carouselView.addHandlerPointerUp(carouselPointerUp);

    // add handler to use dots navigation
    carouselView.addHandlerClickedDot(carouselControlDots);
  }
  // set parent element for created table
  tableView.init();
  // add handler to serve click on row
  tableView.addHandlerExpandRow(controlTableRow);
  // add handler to serve filter by type
  tableView.addHandlerFilter(controlTableFilter);
  // add handler to serve search by description
  tableView.addHandlerSearch(controlTableSearch);
  // animation of appear content
  mainView.playAnimation();
}

// CHARTS CONTROLLER
// add navigations by dots in mobile view
const carouselControlDots = function (e) {
  const clickedDot = e.target.closest("button");
  if (!clickedDot) return;
  const dots = Array.from(carouselView.getCarouselNav().children);
  const currentDot = carouselView
    .getCarouselNav()
    .querySelector(".current-dot");

  const targetIndex = dots.findIndex((dot) => dot === clickedDot);
  carouselView.moveToSlide(carouselView.getSlideAt(targetIndex));
  carouselView.updateDots(currentDot, clickedDot);
};

// add navigation by moving the chart
const carouselPointerDown = function (e) {
  carouselView.setInitialPosition(e.pageX);
};
const carouselPointerUp = function (e) {
  const currentPos = e.pageX;
  const diff = carouselView.getInitialPosition() - currentPos;
  if (diff < 0) carouselView.prevSlide();
  if (diff > 0) carouselView.nextSlide();
};

// TABLE CONTROLLER
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
    if (toShowHide?.classList.contains("tr__date")) break;
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
  let filtredArray = model.state.loggedIn.transactions;
  if (model.state.filtredArray) filtredArray = model.state.filtredArray;

  // search table for search string no matter of lenght "" return all rows
  filtredArray = filtredArray.filter((t) =>
    t.description.toLowerCase().includes(searched.toLowerCase())
  );

  renderTBody(filtredArray);
  document.getElementById("table__search--input").value = "";
};
const controlTableFilter = function (selected) {
  // filter table on type property or return all rows if 0-no filtr
  model.state.filtredArray = model.state.loggedIn.transactions.filter(
    (t) => t.type === Number(selected) || Number(selected) === 0
  );

  renderTBody(model.state.filtredArray);
};

// RERENDAR TABLE BODY
function renderTBody(data) {
  const newMarkup = mainView.generateHtmlLoggedView(
    model.state.language,
    data,
    model.state.transacationTypes,
    false
  );
  tableView.updateTableView(newMarkup);
}
// CHANGING LANGUAGE OF PAGE
const settingLanguage = function (lang) {
  // set in state language
  model.state.language = lang;
  // set every element with dataset attribute appropriate language
  langData.changeLanguage(lang);
  // set transactions types appropriate language(only for legged user)
  if (!model.state.loggedIn.logged) return;
  model.state.transacationTypes = langData.mapTransactionType(
    lang,
    model.state.transacationTypes
  );
  // update charts to appropriate language
  chartView.reloadChartLabels(
    model.state.language,
    model.state.transacationTypes
  );

  mainView.setLanguageMonths(model.state.language);
  // update table body
  const useTable = model.state.filtredArray
    ? model.state.filtredArray
    : model.state.loggedIn.transactions;
  renderTBody(useTable);
};
