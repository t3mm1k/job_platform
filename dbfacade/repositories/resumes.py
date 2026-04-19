from bson import ObjectId
from pymongo.collection import Collection
from ..exceptions import DBError
from ..models import ResumeModel
from .base import BaseRepository
from .users import UserRepository

class ResumeRepository(BaseRepository):

    def __init__(self, collection: Collection, users: UserRepository) -> None:
        super().__init__(collection)
        self._users = users

    def get_by_user_id(self, user_id: int) -> ResumeModel | None:
        doc = self._collection.find_one({'user_id': user_id})
        return ResumeModel.model_validate(doc) if doc else None

    def save(self, resume: ResumeModel) -> ResumeModel:
        self._users.require(resume.user_id)
        data = resume.model_dump(by_alias=True, exclude_none=True)
        if resume.id:
            self._collection.update_one({'_id': resume.id}, {'$set': data})
            doc = self._collection.find_one({'_id': resume.id})
            if not doc:
                raise DBError('Не удалось обновить резюме')
            return ResumeModel.model_validate(doc)
        data['_id'] = str(ObjectId())
        self._collection.insert_one(data)
        return ResumeModel.model_validate(data)
