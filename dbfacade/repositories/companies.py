from bson import ObjectId
from pymongo.collection import Collection
from ..exceptions import DBError
from ..models import CompanyModel
from .base import BaseRepository
from .users import UserRepository

class CompanyRepository(BaseRepository):

    def __init__(self, collection: Collection, users: UserRepository) -> None:
        super().__init__(collection)
        self._users = users

    def save(self, company: CompanyModel) -> CompanyModel:
        self._users.require(company.creator_id)
        data = company.model_dump(by_alias=True, exclude_none=True)
        if company.id:
            self._collection.update_one({'_id': company.id}, {'$set': data})
            doc = self._collection.find_one({'_id': company.id})
            if not doc:
                raise DBError('Не удалось обновить компанию')
            return CompanyModel.model_validate(doc)
        data['_id'] = str(ObjectId())
        self._collection.insert_one(data)
        return CompanyModel.model_validate(data)

    def list_all(self) -> list[CompanyModel]:
        docs = self._collection.find({})
        return [CompanyModel.model_validate(doc) for doc in docs]
