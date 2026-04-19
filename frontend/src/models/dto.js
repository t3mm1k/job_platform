export const UserRole = Object.freeze({
  EMPLOYER: "employer",
  JOB_SEEKER: "job_seeker"
});

export const StorageKeys = Object.freeze({
  USER_ROLE: "userRole",
  SELECTED_COMPANY_ID: "selectedCompanyId",
  ROLE_SELECTION_COUNT: "roleSelectionCount",
  ROLE_SELECTION_CONFIRMED: "roleSelectionConfirmed",
  LOCATION_CONFIRMED: "locationConfirmed"
});

export function emptyUser() {
  return {
    _id: 0,
    first_name: "",
    last_name: "",
    username: "",
    name: "",
    avatar: "",
    balance: 0
  };
}

export function emptyResume() {
  return {
    user_id: 0,
    first_name: "",
    last_name: "",
    experience: "",
    desired_salary: "",
    phone: "",
    additional_info: ""
  };
}

export function emptyCompany() {
  return {
    _id: "",
    creator_id: 0,
    accountType: "",
    phone: "",
    legalAddress: "",
    inn: "",
    fullName: "",
    ogrnip: "",
    companyName: "",
    kpp: "",
    ogrn: ""
  };
}

export function emptyVacancy() {
  return {
    _id: "",
    employer_id: 0,
    vacancy_type: "",
    position: "",
    salary: "",
    schedule: "",
    work_duration: "",
    payment: "",
    experience: "",
    description: "",
    marketplace: "",
    address: {},
    photo: [],
    is_active: true
  };
}

export function emptyResponse() {
  return {
    vacancy_id: "",
    user_id: 0,
    status: "new",
    message: ""
  };
}

export function emptyFavorite() {
  return {
    user_id: 0,
    vacancy_id: ""
  };
}

export function emptyVacancyCreatePayload() {
  return {
    employer_id: 0,
    position: "",
    description: "",
    salary: "",
    vacancy_type: "",
    schedule: "",
    work_duration: "",
    payment: "",
    experience: "",
    marketplace: "",
    address: {}
  };
}

export function emptyResumeSavePayload() {
  return {
    user_id: 0,
    first_name: "",
    last_name: "",
    experience: "",
    desired_salary: "",
    phone: "",
    additional_info: ""
  };
}

export function emptyCompanySavePayload() {
  return {
    company_id: null,
    creator_id: 0,
    accountType: "",
    phone: "",
    legalAddress: "",
    inn: "",
    fullName: "",
    ogrnip: "",
    companyName: "",
    kpp: "",
    ogrn: ""
  };
}

export function emptyUserCreatePayload() {
  return {
    user_id: 0,
    username: "",
    first_name: "",
    last_name: "",
    name: ""
  };
}

export function emptyFavoritePayload() {
  return {
    user_id: 0,
    vacancy_id: ""
  };
}

export function emptyResponseCreatePayload() {
  return {
    vacancy_id: "",
    user_id: 0,
    message: ""
  };
}
