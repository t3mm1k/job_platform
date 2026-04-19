import { configureStore } from "@reduxjs/toolkit";
import * as api from "../../api/client";
import userReducer, { updateResume } from "./userSlice";

jest.mock("../../api/client");

describe("updateResume thunk", () => {
  it("fulfilled updates resume slice", async () => {
    api.saveResume.mockResolvedValue({
      first_name: "A",
      last_name: "B",
      phone: "+1",
      experience: "e",
      desired_salary: "s",
      additional_info: "i"
    });
    const store = configureStore({ reducer: { user: userReducer } });
    await store.dispatch(
      updateResume({
        user_id: 1,
        phone: "+1",
        first_name: "A",
        last_name: "B",
        experience: "e",
        desired_salary: "s",
        additional_info: "i"
      })
    );
    const { user } = store.getState();
    expect(user.loading).toBe(false);
    expect(user.resume.first_name).toBe("A");
    expect(api.saveResume).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 1,
        phone: "+1"
      })
    );
  });
});
