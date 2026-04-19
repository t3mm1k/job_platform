from datetime import datetime
from bson import ObjectId
from pymongo.collection import Collection
from ..exceptions import DBError, NotFoundError
from ..models import VacancyModel
from .base import BaseRepository
from .users import UserRepository

class VacancyRepository(BaseRepository):

    def __init__(self, collection: Collection, users: UserRepository) -> None:
        super().__init__(collection)
        self._users = users

    def list_all(self, only_active: bool=True) -> list[VacancyModel]:
        query = {'is_active': True} if only_active else {}
        docs = self._collection.find(query)
        return [VacancyModel.model_validate(doc) for doc in docs]

    def get_by_id(self, vacancy_id: str) -> VacancyModel:
        doc = self._collection.find_one({'_id': vacancy_id})
        if not doc:
            raise NotFoundError(f'Вакансия {vacancy_id} не найдена')
        return VacancyModel.model_validate(doc)

    def require(self, vacancy_id: str) -> VacancyModel:
        return self.get_by_id(vacancy_id)

    def create(self, vacancy: VacancyModel) -> VacancyModel:
        self._users.require(vacancy.employer_id)
        data = vacancy.model_dump(by_alias=True, exclude_none=True)
        data['_id'] = vacancy.id or str(ObjectId())
        data.setdefault('photo', [])
        data.setdefault('is_active', True)
        data.setdefault('created_at', datetime.utcnow())
        data.setdefault('archived_at', None)
        self._collection.insert_one(data)
        return VacancyModel.model_validate(data)

    def append_photo(self, vacancy_id: str, photo_url: str) -> VacancyModel:
        result = self._collection.update_one({'_id': vacancy_id}, {'$push': {'photo': photo_url}})
        if result.matched_count == 0:
            raise NotFoundError(f'Вакансия {vacancy_id} не найдена')
        doc = self._collection.find_one({'_id': vacancy_id})
        if not doc:
            raise DBError('Не удалось получить вакансию после загрузки фото')
        return VacancyModel.model_validate(doc)
