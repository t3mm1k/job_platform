import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dbfacade import CompanyModel, DBFacade, NotFoundError, ResumeModel, UserModel, VacancyModel

class UserCreate(BaseModel):
    user_id: int
    username: str = ''
    first_name: str = ''
    last_name: str = ''
    name: str = ''

class VacancyCreate(BaseModel):
    employer_id: int
    position: str
    description: str
    salary: str = ''
    vacancy_type: str = ''
    schedule: str = ''
    work_duration: str = ''
    payment: str = ''
    experience: str = ''
    marketplace: str = ''
    address: dict = Field(default_factory=dict)

class ResumeSave(BaseModel):
    user_id: int
    first_name: str = ''
    last_name: str = ''
    experience: str = ''
    desired_salary: str = ''
    phone: str
    additional_info: str = ''

class CompanySave(BaseModel):
    company_id: str | None = None
    creator_id: int
    accountType: str
    phone: str
    legalAddress: str = ''
    inn: str = ''
    fullName: str = ''
    ogrnip: str = ''
    companyName: str = ''
    kpp: str = ''
    ogrn: str = ''

class VacancyPhotoUpload(BaseModel):
    photo_url: str

class ResponseCreate(BaseModel):
    vacancy_id: str
    user_id: int
    message: str = ''

class ResponseStatusUpdate(BaseModel):
    status: str
    message: str = ''

class FavoritePayload(BaseModel):
    user_id: int
    vacancy_id: str

@asynccontextmanager
async def lifespan(app: FastAPI):
    uri = os.environ.get('MONGODB_URI', 'mongodb://mongo:27017')
    db_name = os.environ.get('MONGODB_DB', 'job_platform')
    app.state.facade = DBFacade(uri, db_name=db_name)
    try:
        yield
    finally:
        app.state.facade.close()
app = FastAPI(title='Lab3 API', lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','), allow_credentials=True, allow_methods=['*'], allow_headers=['*'])

@app.get('/health')
async def health() -> dict:
    return {'status': 'ok'}

@app.post('/users')
async def create_user(payload: UserCreate) -> dict:
    facade: DBFacade = app.state.facade
    user = UserModel(_id=payload.user_id, username=payload.username, first_name=payload.first_name, last_name=payload.last_name, name=payload.name)
    created = facade.upsert_user(user)
    return created.model_dump(by_alias=True, mode='json')

@app.get('/users/{user_id}')
async def get_user(user_id: int) -> dict:
    facade: DBFacade = app.state.facade
    try:
        user = facade.get_init_data(user_id)
        return user.model_dump(by_alias=True, mode='json')
    except NotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

@app.post('/vacancies')
async def create_vacancy(payload: VacancyCreate) -> dict:
    facade: DBFacade = app.state.facade
    vacancy = VacancyModel(employer_id=payload.employer_id, position=payload.position, description=payload.description, salary=payload.salary, vacancy_type=payload.vacancy_type, schedule=payload.schedule, work_duration=payload.work_duration, payment=payload.payment, experience=payload.experience, marketplace=payload.marketplace, address=payload.address)
    created = facade.create_vacancy(vacancy)
    return created.model_dump(by_alias=True, mode='json')

@app.get('/vacancies')
async def list_vacancies(only_active: bool=True) -> list[dict]:
    facade: DBFacade = app.state.facade
    vacancies = facade.load_vacancies(only_active=only_active)
    return [item.model_dump(by_alias=True, mode='json') for item in vacancies]

@app.post('/vacancies/{vacancy_id}/photo')
async def upload_vacancy_photo(vacancy_id: str, payload: VacancyPhotoUpload) -> dict:
    facade: DBFacade = app.state.facade
    try:
        vacancy = facade.upload_photo(vacancy_id=vacancy_id, photo_url=payload.photo_url)
        return vacancy.model_dump(by_alias=True, mode='json')
    except NotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

@app.get('/resumes/{user_id}')
async def get_resume(user_id: int) -> dict | None:
    facade: DBFacade = app.state.facade
    resume = facade.load_resume_data(user_id)
    if resume is None:
        return None
    return resume.model_dump(by_alias=True, mode='json')

@app.post('/resumes')
async def save_resume(payload: ResumeSave) -> dict:
    facade: DBFacade = app.state.facade
    existing = facade.load_resume_data(payload.user_id)
    resume = ResumeModel(_id=existing.id if existing else None, user_id=payload.user_id, first_name=payload.first_name, last_name=payload.last_name, experience=payload.experience, desired_salary=payload.desired_salary, phone=payload.phone, additional_info=payload.additional_info)
    saved = facade.save_resume(resume)
    return saved.model_dump(by_alias=True, mode='json')

@app.post('/companies')
async def save_company(payload: CompanySave) -> dict:
    facade: DBFacade = app.state.facade
    company = CompanyModel(_id=payload.company_id, creator_id=payload.creator_id, accountType=payload.accountType, phone=payload.phone, legalAddress=payload.legalAddress, inn=payload.inn, fullName=payload.fullName, ogrnip=payload.ogrnip, companyName=payload.companyName, kpp=payload.kpp, ogrn=payload.ogrn)
    saved = facade.save_company_data(company)
    return saved.model_dump(by_alias=True, mode='json')

@app.get('/companies')
async def list_companies() -> list[dict]:
    facade: DBFacade = app.state.facade
    companies = facade.list_companies()
    return [item.model_dump(by_alias=True, mode='json') for item in companies]

@app.get('/favorites/{user_id}')
async def list_favorites(user_id: int) -> list[str]:
    facade: DBFacade = app.state.facade
    return facade.list_favorite_vacancy_ids(user_id)

@app.get('/responses/{user_id}')
async def get_user_responses(user_id: int) -> list[dict]:
    facade: DBFacade = app.state.facade
    responses = facade.load_responds_data(user_id)
    return [item.model_dump(by_alias=True, mode='json') for item in responses]

@app.post('/responses')
async def create_response(payload: ResponseCreate) -> dict:
    facade: DBFacade = app.state.facade
    response = facade.create_response(vacancy_id=payload.vacancy_id, user_id=payload.user_id, message=payload.message)
    return response.model_dump(by_alias=True, mode='json')

@app.patch('/responses/{response_id}')
async def update_response_status(response_id: str, payload: ResponseStatusUpdate) -> dict:
    facade: DBFacade = app.state.facade
    try:
        response = facade.update_status_in_db(response_id=response_id, status=payload.status, message=payload.message)
        return response.model_dump(by_alias=True, mode='json')
    except NotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

@app.post('/favorites')
async def add_favorite(payload: FavoritePayload) -> dict:
    facade: DBFacade = app.state.facade
    favorite = facade.add_favorite(user_id=payload.user_id, vacancy_id=payload.vacancy_id)
    return favorite.model_dump(by_alias=True, mode='json')

@app.delete('/favorites')
async def remove_favorite(payload: FavoritePayload) -> dict:
    facade: DBFacade = app.state.facade
    facade.remove_favorite(user_id=payload.user_id, vacancy_id=payload.vacancy_id)
    return {'ok': True}
