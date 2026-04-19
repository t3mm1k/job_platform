import { buildResumeSavePayload } from "./resumePayload";

describe("buildResumeSavePayload", () => {
  it("fills defaults and keeps phone", () => {
    expect(
      buildResumeSavePayload({
        user_id: 1,
        phone: "+7999"
      })
    ).toEqual({
      user_id: 1,
      first_name: "",
      last_name: "",
      experience: "",
      desired_salary: "",
      phone: "+7999",
      additional_info: ""
    });
  });

  it("preserves explicit string fields", () => {
    const p = buildResumeSavePayload({
      user_id: 2,
      first_name: "Иван",
      last_name: "Петров",
      experience: "3y",
      desired_salary: "100k",
      phone: "+7",
      additional_info: "remote"
    });
    expect(p).toMatchObject({
      user_id: 2,
      first_name: "Иван",
      last_name: "Петров",
      experience: "3y",
      desired_salary: "100k",
      phone: "+7",
      additional_info: "remote"
    });
  });
});
