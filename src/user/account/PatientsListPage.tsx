import React from 'react';
import './PatientsListPage.css';
// import useResponsive from '../../ui-components/useResponsive';
import PatientsList from '../../ui-components/patient/PatientsListComponent';
import { useTranslation } from 'react-i18next';

const patientsMockList = [
  {
    name: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    pesel: 12345678901
  },
  {
    name: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    pesel: 98765432101
  },
  {
    name: 'Emily',
    lastName: 'Johnson',
    email: 'emily.johnson@example.com',
    pesel: 11223344556
  },
  {
    name: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@example.com',
    pesel: 22334455667
  }
];
function SeePatientsPage() {
  const { t } = useTranslation();
  return (
    <div className="patients-list-container">
      <div className="searchContainer">
        <input type="text" className="searchInput" placeholder={t('search')} />
        <select className="searchType">
          <option value="">{t("all")}</option>
          <option value="email">{t("email")}</option>
          <option value="pesel">PESEL</option>
          <option value="lastName">{t("last_name")}</option>
        </select>
      </div>
      <div className="patients-container">
        <PatientsList patients={patientsMockList} />
      </div>
    </div>
  );
}

export default SeePatientsPage;
