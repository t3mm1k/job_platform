from __future__ import annotations

from pymongo import MongoClient
from pymongo.database import Database

from .repositories import (
    CompanyRepository,
    FavoriteRepository,
    ResponseRepository,
    ResumeRepository,
    UserRepository,
    VacancyRepository,
)
from .models import (
    CompanyModel,
    FavoriteModel,
    ResponseModel,
    ResumeModel,
    UserModel,
    VacancyModel,
)


class DBFacade:

    def __init__(self, mongo_uri: str, db_name: str = "job_platform") -> None:
        self._client = MongoClient(mongo_uri)
        self._db = self._client[db_name]

        self._users_repo = UserRepository(self._db["users"])
        self._resumes_repo = ResumeRepository(self._db["resumes"], self._users_repo)
        self._companies_repo = CompanyRepository(self._db["companies"], self._users_repo)
        self._vacancies_repo = VacancyRepository(self._db["vacancies"], self._users_repo)
        self._responses_repo = ResponseRepository(
            self._db["responses"],
            self._users_repo,
            self._vacancies_repo,
        )
        self._favorites_repo = FavoriteRepository(
            self._db["favorites"],
            self._users_repo,
            self._vacancies_repo,
        )

    @property
    def client(self) -> MongoClient:
        return self._client

    @property
    def db(self) -> Database:
        return self._db

    def close(self) -> None:
        self._client.close()

    def get_init_data(self, user_id: int) -> UserModel:
        return self._users_repo.get_by_id(user_id)

    def create_user(self, user: UserModel) -> UserModel:
        return self._users_repo.create(user)

    def load_resume_data(self, user_id: int) -> ResumeModel | None:
        return self._resumes_repo.get_by_user_id(user_id)

    def save_resume(self, resume: ResumeModel) -> ResumeModel:
        return self._resumes_repo.save(resume)

    def save_company_data(self, company: CompanyModel) -> CompanyModel:
        return self._companies_repo.save(company)

    def load_vacancies(self, only_active: bool = True) -> list[VacancyModel]:
        return self._vacancies_repo.list_all(only_active=only_active)

    def create_vacancy(self, vacancy: VacancyModel) -> VacancyModel:
        return self._vacancies_repo.create(vacancy)

    def upload_photo(self, vacancy_id: str, photo_url: str) -> VacancyModel:
        return self._vacancies_repo.append_photo(vacancy_id, photo_url)

    def load_responds_data(self, user_id: int) -> list[ResponseModel]:
        return self._responses_repo.list_by_user(user_id)

    def create_response(self, vacancy_id: str, user_id: int, message: str = "",) -> ResponseModel:
        return self._responses_repo.create(vacancy_id, user_id, message)

    def update_status_in_db(self, response_id: str, status: str, message: str = "",
    ) -> ResponseModel:
        return self._responses_repo.update_status(response_id, status, message)

    def add_favorite(self, user_id: int, vacancy_id: str) -> FavoriteModel:
        return self._favorites_repo.add(user_id, vacancy_id)

    def remove_favorite(self, user_id: int, vacancy_id: str) -> None:
        return self._favorites_repo.remove(user_id, vacancy_id)
