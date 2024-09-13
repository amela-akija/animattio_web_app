import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
  .use(initReactI18next)
  .init({

    lng: "en",
    fallbackLng: "en",

    debug: true,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          sign_in: "Sign in",
          sign_up: "Sign up",
          about: "About",
          settings: "Settings",
          log_out: "Log out",
          login_page: "Log in",
          signup_page: "Sign up",
          name: "name:",
          last_name: "last name:",
          email: "e-mail address:",
          pwz: "pwz number",
          password: "password:",
          repeat_password: "repeat password:",
          message_login:"Don't have an account yet? Sign up",
          message_signup: "Already have an account? Sign in"
        },
      },
      pl: {
        translation: {
          sign_in: "Zaloguj się",
          sign_up: "Zarejestruj się",
          about: "O aplikacji",
          settings: "Ustawienia",
          log_out: "Wyloguj się",
          login_page: "Logowanie",
          signup_page: "Rejestracja",
          name: "imię:",
          last_name: "nazwisko:",
          email: "adres e-mail:",
          pwz: "numer pwz",
          password: "hasło:",
          repeat_password: "powtórz hasło:",
          message_login:"Nie masz jeszcze konta? Zarejestruj się",
          message_signup: "Masz już konto? Zaloguj się"
        },
      },
    },
  });

export default i18n;