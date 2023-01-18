export const langData = {
  PL: {
    signIn: "logowanie",
    signUp: "rejestracja",
    signOut: "wyloguj",
    //  form labels
    labelLogin: "Nazwa użytkownika/Email:",
    labelUsername: "Nazwa użytkownika:",
    labelPassword: "Hasło:",
    labelEmail: "Email:",
    labelEmailConfirm: "Potwierdż email:",
    // form buttons
    bntSignIn: "zaloguj się",
    bntSignUp: "zarejestruj się",
    // transactions types
    transacationTypes: {
      1: "Wpływy - inne",
      2: "Wydatki - zakupy",
      3: "Wpływy - wynagrodzenie",
      4: "Wydatki - inne",
    },
    // table
    tableName: "Transakcje",
    tableFilter: "Filtruj:",
    tableOpt0: "Brak filtru",
    tableOpt1: "Wpływy - inne",
    tableOpt2: "Wydatki - zakupy",
    tableOpt3: "Wpływy - wynagrodzenie",
    tableOpt4: "Wydatki - inne",
    tableSearch: "Szukaj:",
    tableThDate: "Data:",
    tableThType: "Typ:",
    tableThDesc: "Opis:",
    tableThAmount: "Kwota:",
    tableThBalance: "Saldo:",
  },
  EN: {
    signIn: "log in",
    signUp: "sign up",
    signOut: "log out",
    //  form labels
    labelLogin: "Username/Email:",
    labelUsername: "Username:",
    labelPassword: "Password:",
    labelEmail: "Email:",
    labelEmailConfirm: "Confirm email:",
    // form buttons
    bntSignIn: "sign in",
    bntSignUp: "sign up",
    // transactions types
    transacationTypes: {
      1: "Influences - other",
      2: "Expenses - shopping",
      3: "Influence - salary",
      4: "Expenses - other",
    },
    // table
    tableName: "Transactions",
    tableFilter: "Filter:",
    tableOpt0: "No filter",
    tableOpt1: "Influences - other",
    tableOpt2: "Expenses - shopping",
    tableOpt3: "Influence - salary",
    tableOpt4: "Expenses - other",
    tableSearch: "Search:",
    tableThDate: "Date:",
    tableThType: "Type:",
    tableThDesc: "Description:",
    tableThAmount: "Amount:",
    tableThBalance: "Balance:",
  },

  changeLanguage: function (lang) {
    const loadedLanguage = langData[lang];
    const elements = Array.from(document.querySelectorAll("[data-lang-label]"));
    elements.forEach((element) => {
      element.textContent = loadedLanguage[element.dataset.langLabel];
    });
  },

  mapTransactionType: function (lang, tTypes) {
    const loadedLanguage = langData[lang];
    const types = loadedLanguage["transacationTypes"];
    Object.keys(types).forEach((key) => {
      tTypes[key] = types[key];
    });

    return tTypes;
  },
};
