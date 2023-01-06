import axios, { Axios } from "axios";

import { toggleFollowUser, ToggleFollowUserSuccess } from "./toggleFollowUser";
import { generateUserId } from "../../user/utils/generateUserId";

vi.mock("axios");

const mockedAxios = vi.mocked<Axios>(axios);

describe("toggleFollowUser", () => {
  beforeEach(() => {
    // Anything, as long as the `data` destructuring works.
    mockedAxios.post.mockResolvedValue({});
  })

  it("should send request for toggling user follow", async () => {
    const payload = { userId: generateUserId() };

    await toggleFollowUser(payload);

    expect(mockedAxios.post).toHaveBeenCalledWith("/api/toggle-follow-user", payload);
  });

  describe("when user was not followed", () => {
    it("should reply with following user response", async () => {
      const userId = generateUserId();
      const followingUserResponse: ToggleFollowUserSuccess = { following: userId };
      mockedAxios.post.mockResolvedValue({ data: followingUserResponse });

      const result = await toggleFollowUser({ userId });

      expect(result).toEqual(followingUserResponse);
    });
  });

  describe("when user is being followed", () => {
    it("should reply with unfollowing user response", async () => {
      const userId = generateUserId();
      const unfollowingUserResponse: ToggleFollowUserSuccess = { unfollowed: userId };
      mockedAxios.post.mockResolvedValue({ data: unfollowingUserResponse });

      const result = await toggleFollowUser({ userId });

      expect(result).toEqual(unfollowingUserResponse);
    });
  });
});
