from datetime import datetime

from bson import ObjectId
from pymongo.collection import Collection

from ..exceptions import NotFoundError
from ..models import FavoriteModel
from .base import BaseRepository
from .users import UserRepository
from .vacancies import VacancyRepository


class FavoriteRepository(BaseRepository):
    def __init__(
        self,
        collection: Collection,
        users: UserRepository,
        vacancies: VacancyRepository,
    ) -> None:
        super().__init__(collection)
        self._users = users
        self._vacancies = vacancies

    def add(self, user_id: int, vacancy_id: str) -> FavoriteModel:
        self._users.require(user_id)
        self._vacancies.require(vacancy_id)

        existing = self._collection.find_one({
            "user_id": user_id,
            "vacancy_id": vacancy_id,
        })
        if existing:
            return FavoriteModel.model_validate(existing)

        favorite = FavoriteModel(
            _id=str(ObjectId()),
            user_id=user_id,
            vacancy_id=vacancy_id,
            added_at=datetime.utcnow(),
        )
        self._collection.insert_one(favorite.model_dump(by_alias=True))
        return favorite

    def remove(self, user_id: int, vacancy_id: str) -> None:
        result = self._collection.delete_one({
            "user_id": user_id,
            "vacancy_id": vacancy_id,
        })
        if result.deleted_count == 0:
            raise NotFoundError("Избранное не найдено")
