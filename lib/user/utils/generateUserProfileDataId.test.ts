import { USER_PROFILE_DATA_ID_PREFIX, generateUserProfileDataId } from "./generateUserProfileDataId";

describe("generateUserProfileDataId", () => {
  it("should prefix id with user profile data prefix", () => {
    const id = generateUserProfileDataId();

    const pattern = `^${USER_PROFILE_DATA_ID_PREFIX}`;
    expect(id).toMatch(new RegExp(pattern));
  });
});
