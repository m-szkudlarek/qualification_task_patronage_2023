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
  #helperFormType(whichOne) {
    return whichOne === "form--sign-up" ? "username" : "login";
  }
  #tableRowDate(date) {
    return `<tr>
    <td colspan="4">${date.getDate()} ${this.#months[date.getMonth()]}</td>
  </tr>`;
  }
  #groupByDate(t, tTypes) {
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
                <th>Data:</th>
                <th>Typ:</th>
                <th>Saldo:</th>
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
  #tableViewMobile(t, tTypes) {
    const thead = `
    <thead>
      <tr>
        <th class="table--tname" colspan="4">Transactions</th>
      </tr>
      <tr>
        <th colspan="2">
          <label for="table__filtr">Filtruj:</label>
          <select name="table__filtr" id="table__filtr">
            <option value="0">Brak filtru</option>
            ${Object.keys(tTypes)
              .map((key) => `<option value="${key}">${tTypes[key]}</option>`)
              .join("")}
          </select>
        </th>
        <th colspan="2">
          <div class="table__search">
            <label for="table__search--input">Szukaj:</label>
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
        <th>Typ:</th>
        <th>Opis:</th>
        <th>Kwota:</th>
        <th></th>
      </tr>
    </thead>`;
    const tbody = `<tbody>${this.#groupByDate(t, tTypes)}</tbody>`;
    return `<table class="table">${thead + tbody}</table>`;
  }
  #tableViewDesktop(t, tTypes) {
    const thead = `<thead>
    <tr>
      <th class="table--tname" colspan="5">Transactions</th>
    </tr>
    <tr>
      <th colspan="2">
        <label for="table__filtr">Filtruj:</label>
        <select name="table__filtr" id="table__filtr">
          <option value="0" selected>Brak filtru</option>
          ${Object.keys(tTypes)
            .map((key) => `<option value="${key}">${tTypes[key]}</option>`)
            .join("")}
        </select>
       </th>
       <th colspan="3">
        <div class="table__search">
          <label for="table__search--input">Szukaj:</label>
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
      <th>Data:</th>
      <th>Typ transakcji:</th>
      <th>Opis:</th>
      <th>Kwota:</th>
      <th>Saldo:</th>
    </tr>
  </thead>`;
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
  _insertHtml(html = "") {
    this.#parentElement.innerHTML = "";
    this.#parentElement.insertAdjacentHTML("afterbegin", html);
  }
  //   generate markup html for both forms
  generateHtmlForm(whichOne) {
    // first part of form this always has to render
    const markupPartOne = `<form class="form ${whichOne}">
    <label for=${this.#helperFormType(
      whichOne
    )} class="form__item">Nazwa użytkownika${
      whichOne === "form--sign-up" ? "" : "/Email"
    }:</label>
    <div>
      <input
        id=${this.#helperFormType(whichOne)}
        type="text"
        class="form__item"
        name=${this.#helperFormType(whichOne)}
      />
      <p class="error error--${this.#helperFormType(whichOne)}"></p>
    </div>
    <label for="password" class="form__item">Hasło:</label>
    <div>
      <input
        id="password"
        type="password"
        class="form__item"
        name="password"
      />
      <p class="error error--password"></p>
    </div>`;

    const markupPartTwo =
      whichOne === "form--sign-up"
        ? `<label for="email" class="form__item">Email:</label>
    <div>
      <input id="email" type="text" class="form__item" name="email" />
      <p class="error error--email"></p>
    </div>
    <label for="emailConfirm" class="form__item">Potwierdż email:</label>
    <div>
      <input
        id="emailConfirm"
        type="text"
        class="form__item"
        name="emailConfirm"
      />
      <p class="error error--emailConfirm"></p>
    </div>
    <button type="submit" class="form__item bnt form__item--sign-up">
      zarejestruj się
    </button>
  </form>`
        : `<button type="submit" class="form__item bnt form__item--sign-in">
        zaloguj się
      </button>
    </form>`;
    this._insertHtml(markupPartOne + markupPartTwo);
  }

  generateHtmlLoggedView(t, tTypes, render = true) {
    if (!t || !tTypes) return;
    const markupT = `<div class="transactions">${
      window.matchMedia("(max-width: 768px)").matches
        ? this.#tableViewMobile(t, tTypes)
        : this.#tableViewDesktop(t, tTypes)
    }</div>`;
    if (!render) return markupT;
    this._insertHtml(markupT);
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
