class MainView {
  #parentElement = document.querySelector(".main");
  #tableIcons = [
    "<i class='bx bx-money' ></i>",
    "<i class='bx bx-shopping-bag'></i>",
    "<i class='bx bx-wallet'></i>",
    "<i class='bx bx-credit-card-alt'></i>",
  ];
  #helperFormType(whichOne) {
    return whichOne === "form--sign-up" ? "username" : "login";
  }
  #tableViewMobile(t, tTypes) {
    const table =
      `<table class="table"><thead>
    <tr>
      <th class="table--tname" colspan="4">Transactions</th>
    </tr>
    <tr>
      <th>Ikona:</th>
      <th>Opis:</th>
      <th>Kwota:</th>
      <th></th>
    </tr>
  </thead><tbody>` +
      t
        .map(
          (transacion) =>
            `<tr class="table__tr--expandable" data-expand="false">
      <td>${this.#tableIcons[transacion.type - 1]}</td>
      <td>${transacion.description}</td>
      <td>${transacion.amount}</td>
      <td><i class="bx bxs-down-arrow"></i></td>
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
    </tr>`
        )
        .join("") +
      "</tbody></table>";
    return table;
  }
  #tableViewDesktop(t, tTypes) {
    const table =
      `<table class="table"><thead>
    <tr>
      <th class="table--tname" colspan="5">Transactions</th>
    </tr>
    <tr>
      <th>Data:</th>
      <th>Typ transakcji:</th>
      <th>Opis:</th>
      <th>Kwota:</th>
      <th>Saldo:</th>
    </tr>
  </thead><tbody>` +
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
      "</tbody></table>";
    return table;
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

  generateHtmlLoggedView(data) {
    if (!data) return;
    const { transactions, transacationTypes } = data;
    const markup = `<div class="transactions">${
      window.matchMedia("(max-width: 768px)").matches
        ? this.#tableViewMobile(transactions, transacationTypes)
        : this.#tableViewDesktop(transactions, transacationTypes)
    }</div>`;

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
