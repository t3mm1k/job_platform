import {
  StorageKeys,
  UserRole,
  emptyCompany,
  emptyCompanySavePayload,
  emptyFavorite,
  emptyFavoritePayload,
  emptyResponse,
  emptyResume,
  emptyResumeSavePayload,
  emptyUser,
  emptyUserCreatePayload,
  emptyVacancy,
  emptyVacancyCreatePayload
} from "./dto";

describe("dto factories", () => {
  it("UserRole and StorageKeys are frozen string enums", () => {
    expect(UserRole.EMPLOYER).toBe("employer");
    expect(UserRole.JOB_SEEKER).toBe("job_seeker");
    expect(StorageKeys.USER_ROLE).toBe("userRole");
  });

  it.each([
    ["emptyUser", emptyUser, ["_id", "first_name", "balance"]],
    ["emptyResume", emptyResume, ["user_id", "phone"]],
    ["emptyCompany", emptyCompany, ["creator_id", "accountType"]],
    ["emptyVacancy", emptyVacancy, ["employer_id", "position", "is_active"]],
    ["emptyResponse", emptyResponse, ["vacancy_id", "status"]],
    ["emptyFavorite", emptyFavorite, ["user_id", "vacancy_id"]]
  ])("%s has expected keys", (_, factory, keys) => {
    const o = factory();
    keys.forEach(k => expect(o).toHaveProperty(k));
  });

  it("payload templates include user_id or creator_id", () => {
    expect(emptyVacancyCreatePayload()).toHaveProperty("employer_id");
    expect(emptyResumeSavePayload()).toHaveProperty("user_id");
    expect(emptyCompanySavePayload()).toHaveProperty("creator_id");
    expect(emptyUserCreatePayload()).toHaveProperty("user_id");
    expect(emptyFavoritePayload()).toHaveProperty("user_id");
  });
});
