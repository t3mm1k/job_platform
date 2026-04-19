from ..exceptions import NotFoundError
from ..models import UserModel
from .base import BaseRepository

class UserRepository(BaseRepository):

    def get_by_id(self, user_id: int) -> UserModel:
        doc = self._collection.find_one({'_id': user_id})
        if not doc:
            raise NotFoundError(f'Пользователь {user_id} не найден')
        return UserModel.model_validate(doc)

    def require(self, user_id: int) -> UserModel:
        return self.get_by_id(user_id)

    def create(self, user: UserModel) -> UserModel:
        self._collection.insert_one(user.model_dump(by_alias=True))
        return user

    def upsert(self, user: UserModel) -> UserModel:
        data = user.model_dump(by_alias=True)
        self._collection.replace_one({'_id': user.id}, data, upsert=True)
        return user
