from datetime import datetime

from bson import ObjectId
from pymongo.collection import Collection

from ..exceptions import DBError, NotFoundError
from ..models import ResponseModel
from .base import BaseRepository
from .users import UserRepository
from .vacancies import VacancyRepository


class ResponseRepository(BaseRepository):
    def __init__(
        self,
        collection: Collection,
        users: UserRepository,
        vacancies: VacancyRepository,
    ) -> None:
        super().__init__(collection)
        self._users = users
        self._vacancies = vacancies

    def list_by_user(self, user_id: int) -> list[ResponseModel]:
        docs = self._collection.find({"user_id": user_id})
        return [ResponseModel.model_validate(doc) for doc in docs]

    def create(
        self,
        vacancy_id: str,
        user_id: int,
        message: str = "",
    ) -> ResponseModel:
        self._users.require(user_id)
        self._vacancies.require(vacancy_id)

        response = ResponseModel(
            _id=str(ObjectId()),
            vacancy_id=vacancy_id,
            user_id=user_id,
            message=message,
            status="new",
            created_at=datetime.utcnow(),
        )

        self._collection.insert_one(response.model_dump(by_alias=True))
        return response

    def update_status(
        self,
        response_id: str,
        status: str,
        message: str = "",
    ) -> ResponseModel:
        result = self._collection.update_one(
            {"_id": response_id},
            {"$set": {"status": status, "message": message}},
        )
        if result.matched_count == 0:
            raise NotFoundError(f"Отклик {response_id} не найден")

        doc = self._collection.find_one({"_id": response_id})
        if not doc:
            raise DBError("Не удалось получить отклик после обновления")
        return ResponseModel.model_validate(doc)
