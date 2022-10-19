import axios, { Axios } from "axios";
import { User } from "@prisma/client";

import { fetchUsers } from "./fetchUsers";
import { createUser } from "../../../../test/fixtures/user";

vi.mock("axios");

const mockedAxios = vi.mocked<Axios>(axios);

describe("fetchUsers", () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValue([]);
  });

  it("should fetch users", async () => {
    await fetchUsers();

    expect(mockedAxios.get).toHaveBeenCalledWith("/api/user");
  });

  it("should return fetched users", async () => {
    const users: ReadonlyArray<User> = [createUser()];
    mockedAxios.get.mockResolvedValue({ data: users });

    const fetchedUsers = await fetchUsers();

    expect(fetchedUsers).toEqual(users);
  });
});
