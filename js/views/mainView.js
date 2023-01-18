import { wordToCamelcase, returnStringInLang } from "../utilities.js";
class MainView {
  #parentElement = document.querySelector(".main");
  #tableIcons = [
    `<svg class="icon--svg">
      <use href="../../icons.svg#icon-money"></use>
    </svg>`,
    `<svg class="icon--svg">
      <use href="../../icons.svg#icon-bag"></use>
    </svg>`,
    `<svg class="icon--svg">
      <use href="../../icons.svg#icon-wallet"></use>
    </svg>`,
    `<svg class="icon--svg">
      <use href="../../icons.svg#icon-credit-card"></use>
    </svg>`,
  ];
  #months = [
    "January",
    "February",
    "Marc",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // INSERT GENERETED HTML MARKUP TO MAIN VIEW
  _insertHtml(html = "") {
    this.#parentElement.innerHTML = "";
    this.#parentElement.insertAdjacentHTML("afterbegin", html);
  }

  // METHODS TO GENERATE CAROUSEL BODY
  #graphViewMobile() {
    return ` 
    <div class="carousel stretched"> 
        <ul class="carousel__slider stretched">
        </ul>
    </div>
    <div class="carousel__nav">
    </div>`;
  }

  // METHODS TO GENERATE TRANSACTIONS TABLE
  // return row with corresponding date
  #tableRowDate(date) {
    return `<tr class="tr__date">
    <td colspan="4">${date.getDate()} ${this.#months[date.getMonth()]}</td>
  </tr>`;
  }
  // return tbody grouped by date mobile view only
  #groupByDate(lang, t, tTypes) {
    // check that data exists
    if (!t.length && !tTypes.length) return;
    // always get sorted transactions descending by date
    let prevDate = new Date(t[0].date);

    const tbody =
      this.#tableRowDate(prevDate) +
      t
        .map((transacion) => {
          const dateD = new Date(transacion.date);
          const htmlToReturn = `${
            prevDate.getTime() !== dateD.getTime()
              ? this.#tableRowDate(dateD)
              : ""
          }
              <tr class="table__tr--expandable" data-expand="false">
                <td>${this.#tableIcons[transacion.type - 1]}</td>
                <td>${transacion.description}</td>
                <td>${transacion.amount}</td>
                <td>
                  <svg class="icon--svg">
                    <use href="../../icons.svg#icon-down-arrow"></use>
                  </svg>
                </td>
              </tr>
              <tr class="table__tr--expanded">
                <th data-lang-label="tableThDate">${returnStringInLang(
                  lang,
                  "Data",
                  "Date"
                )}:</th>
                <th data-lang-label="tableThType">${returnStringInLang(
                  lang,
                  "Typ",
                  "Type"
                )}:</th>
                <th data-lang-label="tableThBalance">${returnStringInLang(
                  lang,
                  "Saldo",
                  "Balance"
                )}:</th>
                <th></th>
              </tr>
              <tr class="table__tr--expanded">
                <td>${transacion.date}</td>
                <td>${tTypes[transacion.type]}</td>
                <td>${transacion.balance}</td>
                <td></td>
              </tr>`;
          prevDate = dateD;
          return htmlToReturn;
        })
        .join("");
    return tbody;
  }

  //  create options to generate thead
  #createOptions() {
    const options = {};
    if (window.matchMedia("(max-width: 768px)").matches) {
      options.tnameCol = 4;
      options.filterCol = 2;
      options.searchCol = 2;
    } else {
      options.tnameCol = 5;
      options.filterCol = 2;
      options.searchCol = 3;
    }
    return options;
  }

  #returnThTable(string, string768) {
    return window.matchMedia("(max-width: 768px)").matches ? string768 : string;
  }
  // generate thead
  #generateThead(lang, tTypes) {
    const options = this.#createOptions();
    const thead = `<thead>
    <tr>
      <th class="table--tname" colspan="${
        options.tnameCol
      }" data-lang-label="tableName">${returnStringInLang(
      lang,
      "Transakcje",
      "Transactions"
    )}</th>
    </tr>
    <tr>
      <th colspan="${options.filterCol}">
        <label for="table__filtr" data-lang-label="tableFilter">${returnStringInLang(
          lang,
          "Filtruj",
          "Filter"
        )}:</label>
        <select name="table__filtr" id="table__filtr">
          <option value="0" data-lang-label="tableOpt0">${returnStringInLang(
            lang,
            "Brak filtru",
            "No filter"
          )}</option>
          ${Object.keys(tTypes)
            .map(
              (key) =>
                `<option value="${key}" data-lang-label="tableOpt${key}">${tTypes[key]}</option>`
            )
            .join("")}
        </select>
       </th>
       <th colspan="${options.searchCol}">
        <div class="table__search">
          <label for="table__search--input" data-lang-label="tableSearch">${returnStringInLang(
            lang,
            "Szukaj",
            "Search"
          )}:</label>
          <form class="table__search--container">
            <input type="search" id="table__search--input" name="table__search--input">
            <button type="submit" class="bnt bnt--search">
              <svg>
                <use href="../../icons.svg#icon-search"></use>
              </svg>
            </button>
          </form>
        </div>
      </th>
    </tr>
    <tr>
      ${this.#returnThTable(
        `<th data-lang-label="tableThDate">${returnStringInLang(
          lang,
          "Data",
          "Date"
        )}:</th>`,
        ""
      )}
      <th data-lang-label="tableThType">${returnStringInLang(
        lang,
        "Typ",
        "Type"
      )}:</th>
      <th data-lang-label="tableThDesc">${returnStringInLang(
        lang,
        "Opis",
        "Description"
      )}:</th>
      <th data-lang-label="tableThAmount">${returnStringInLang(
        lang,
        "Kwota",
        "Amount"
      )}:</th>
        ${this.#returnThTable(
          `<th data-lang-label="tableThBalance">${returnStringInLang(
            lang,
            "Saldo",
            "Balance"
          )}:</th>`,
          "<th></th>"
        )}
    </tr>
  </thead>`;
    return thead;
  }
  #tableViewMobile(lang, t, tTypes) {
    const thead = this.#generateThead(lang, tTypes);
    const tbody = `<tbody>${this.#groupByDate(lang, t, tTypes)}</tbody>`;
    return `<table class="table">${thead + tbody}</table>`;
  }
  #tableViewDesktop(lang, t, tTypes) {
    const thead = this.#generateThead(lang, tTypes);
    const tbody =
      "<tbody>" +
      t
        .map(
          (transacion) =>
            `<tr>
      <td>${transacion.date}</td>
      <td>${this.#tableIcons[transacion.type - 1]}</td>
      <td>${transacion.description}<br>
      <span>${tTypes[transacion.type]}</span></td>
      <td>${transacion.amount}</td>
      <td>${transacion.balance}</td>
    </tr>`
        )
        .join("") +
      "</tbody>";
    return `<table class="table">${thead + tbody}</table>`;
  }

  // A METHOD TO CONNECT TRANSACTIONS AND CHARTS
  generateHtmlLoggedView(lang, t, tTypes, render = true) {
    if (!t && !tTypes) return;
    const markupG = `<div class="graphs">${
      window.matchMedia("(max-width: 768px)").matches
        ? this.#graphViewMobile(t, tTypes)
        : ""
    }</div>`;
    const markupT = `<div class="transactions">${
      window.matchMedia("(max-width: 768px)").matches
        ? this.#tableViewMobile(lang, t, tTypes)
        : this.#tableViewDesktop(lang, t, tTypes)
    }</div>`;
    if (!render) return markupT;
    this._insertHtml(markupG + markupT);
  }

  //   METHODS TO GENERETE FORMS
  #generateInputForm(inputName, labelValue) {
    return `<label for="${inputName}" class="form__item" data-lang-label="label${wordToCamelcase(
      inputName
    )}">${labelValue}:</label>
    <div>
      <input
        id="${inputName}"
        type="${inputName === "password" ? inputName : "text"}"
        class="form__item"
        name="${inputName}"
      />
      <p class="error error--${inputName}"></p>
    </div>`;
  }

  #generateSignUpForm(lang) {
    const username = this.#generateInputForm(
      "username",
      returnStringInLang(lang, "Nazwa użytkownika", "Username")
    );
    const password = this.#generateInputForm(
      "password",
      returnStringInLang(lang, "Hasło", "Password")
    );
    const email = this.#generateInputForm("email", "Email");
    const confirmEmail = this.#generateInputForm(
      "emailConfirm",
      returnStringInLang(lang, "Potwierdż email", "Confirm email")
    );
    return username + password + email + confirmEmail;
  }
  #generateSignInForm(lang) {
    const login = this.#generateInputForm(
      "login",
      returnStringInLang(lang, "Nazwa użytkownika/Email", "Username/Email")
    );
    const password = this.#generateInputForm(
      "password",
      returnStringInLang(lang, "Hasło", "Password")
    );

    return login + password;
  }
  generateHtmlForm(whichOne, lang) {
    const formInputs =
      whichOne === "form--sign-in"
        ? this.#generateSignInForm(lang)
        : this.#generateSignUpForm(lang);

    const buttonText =
      whichOne === "form--sign-in"
        ? returnStringInLang(lang, "zaloguj się", "sign in")
        : returnStringInLang(lang, "zarejestruj się", "sign up");
    const formButton = `
    <button type="submit" class="form__item bnt form__item--sign-${whichOne.slice(
      -2
    )}" data-lang-label="bntSign${wordToCamelcase(whichOne.slice(-2))}">
    ${buttonText}
    </button>`;

    const markup = `<form class="form ${whichOne}">${formInputs}${formButton}</form>`;
    this._insertHtml(markup);
  }

  generateHtmlLogOut() {
    this._insertHtml();
  }

  renderSpinner() {
    const markup = `
        <div class="spinner">
          <svg>
            <use href="../../icons.svg#icon-loader"></use>
          </svg>
        </div>`;
    this._insertHtml(markup);
  }
}

export default new MainView();
