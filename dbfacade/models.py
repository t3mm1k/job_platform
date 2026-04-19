from __future__ import annotations
from datetime import datetime
from typing import Any, Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator

class BaseDocument(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: Optional[str] = Field(default=None, alias='_id')

class UserModel(BaseDocument):
    id: int = Field(alias='_id')
    first_name: str = ''
    last_name: str = ''
    username: str = ''
    name: str = ''
    avatar: str = ''
    balance: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ResumeModel(BaseDocument):
    user_id: int
    first_name: str = ''
    last_name: str = ''
    experience: str = ''
    desired_salary: str = ''
    phone: str = ''
    additional_info: str = ''

    @field_validator('phone')
    @classmethod
    def validate_phone(cls, value: str) -> str:
        if not value.strip():
            raise ValueError('Поле phone обязательно')
        return value

class CompanyModel(BaseDocument):
    creator_id: int
    accountType: str = ''
    phone: str = ''
    legalAddress: str = ''
    inn: str = ''
    fullName: str = ''
    ogrnip: str = ''
    companyName: str = ''
    kpp: str = ''
    ogrn: str = ''

    @field_validator('accountType', 'phone')
    @classmethod
    def validate_required_fields(cls, value: str) -> str:
        if not value.strip():
            raise ValueError('Обязательное поле не заполнено')
        return value

class VacancyModel(BaseDocument):
    employer_id: int
    vacancy_type: str = ''
    position: str = ''
    salary: str = ''
    schedule: str = ''
    work_duration: str = ''
    payment: str = ''
    experience: str = ''
    description: str = ''
    marketplace: str = ''
    address: dict[str, Any] = Field(default_factory=dict)
    photo: list[str] = Field(default_factory=list)
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    archived_at: Optional[datetime] = None

    @field_validator('position', 'description')
    @classmethod
    def validate_required_fields(cls, value: str) -> str:
        if not value.strip():
            raise ValueError('Обязательное поле не заполнено')
        return value

class ResponseModel(BaseDocument):
    vacancy_id: str
    user_id: int
    status: str = 'new'
    message: str = ''
    created_at: datetime = Field(default_factory=datetime.utcnow)

class FavoriteModel(BaseDocument):
    user_id: int
    vacancy_id: str
    added_at: datetime = Field(default_factory=datetime.utcnow)
