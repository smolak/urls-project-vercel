import axios, { Axios } from "axios";

import { saveUserProfileData, SaveUserProfileDataPayload } from "./saveUserProfileData";
import { createUserProfileData } from "../../../test/fixtures/userProfileData";

vi.mock("axios");

const mockedAxios = vi.mocked<Axios>(axios);
const userProfileDataToSave: SaveUserProfileDataPayload = {
  username: "Jacek",
};
const userProfileData = createUserProfileData(userProfileDataToSave);

describe("saveUserProfileData", () => {
  beforeEach(() => {
    mockedAxios.post.mockResolvedValue({ data: userProfileData });
  });

  it("should post to endpoint saving user profile data", async () => {
    await saveUserProfileData(userProfileDataToSave);

    expect(mockedAxios.post).toHaveBeenCalledWith("/api/user-profile-data", userProfileDataToSave);
  });

  it("should return saved data", async () => {
    const savedData = await saveUserProfileData(userProfileDataToSave);

    expect(savedData).toEqual(userProfileData);
  });
});
