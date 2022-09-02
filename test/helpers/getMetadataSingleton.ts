import { GetMetadata, getMetadata } from "../../lib/metadata/getMetadata";

jest.mock("../../lib/metadata/GetMetadata");

beforeEach(() => {
  // @ts-ignore
  getMetadataMock.mockReset();
});

export const getMetadataMock = getMetadata as unknown as GetMetadata;
