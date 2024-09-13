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
          name: "name",
          last_name: "last name",
          email: "e-mail address",
          pwz: "pwz number",
          password: "password",
          repeat_password: "repeat password",
          message_login:"Don't have an account yet? Sign up",
          message_signup: "Already have an account? Sign in",
          add_patient: "Add Patient",
          see_patients: "See patients",
          profile: "Profile",
          new_results: "New results:",
          patient_id: "Patient ID",
          mode: "Mode",
          date: "Date",
          see_more: "See more",
          date_of_birth: "date of birth",
          seizure: "first seizure - age",
          additional_info: "additional information",
          contact_info: "contact information",
          parent_contact_info: "parent contact information",
          meds:"medication description",
          freq: "seizure frequency",
          pharmacological:"pharmacological treatment",
          phone: "phone number",
          option: "please select an option",
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
          name: "imię",
          last_name: "nazwisko",
          email: "adres e-mail",
          pwz: "numer pwz",
          password: "hasło",
          repeat_password: "powtórz hasło",
          message_login:"Nie masz jeszcze konta? Zarejestruj się",
          message_signup: "Masz już konto? Zaloguj się",
          add_patient: "Dodaj pacjenta",
          see_patients: "Lista pacjentów",
          profile: "Profil",
          new_results: "Nowe wyniki:",
          patient_id: "ID pacjenta",
          mode: "Tryb",
          date: "Data wykonania",
          see_more: "Zobacz więcej",
          date_of_birth: "data urodzenia",
          seizure: "napad drgawkowy - wiek",
          additional_info: "dodatkowe informacje",
          contact_info: "dane kontaktowe",
          parent_contact_info: "dane kontaktowe rodzica",
          meds: "opis zażywanych leków",
          freq: "częstotliwość występowania napadów",
          pharmacological:"leczenie farmakologiczne",
          phone: "numer telefonu",
          option: "proszę wybrać opcję",

        },
      },
    },
  });

export default i18n;