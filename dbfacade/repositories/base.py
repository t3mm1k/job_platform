from pymongo.collection import Collection


class BaseRepository:
    __slots__ = ("_collection",)

    def __init__(self, collection: Collection) -> None:
        self._collection = collection

    @property
    def collection(self) -> Collection:
        return self._collection
