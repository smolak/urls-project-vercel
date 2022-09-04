import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import { Url } from "@prisma/client";
import prisma from "../prisma";
import { decompressMetadata } from "../lib/metadata/compression";
import { Metadata } from "../lib/metadata/getMetadata";

const UrlsPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ urls }) => {
  return (
    <div>
      <ul>
        {urls.map((url) => (
          <li key={url.id}>{url.url}</li>
        ))}
      </ul>
    </div>
  );
};

export default UrlsPage;

interface UrlVM extends Omit<Url, "createdAt" | "updatedAt" | "metadata"> {
  createdAt: string;
  updatedAt: string;
  metadata: Metadata;
}

interface UrlsProps {
  urls: ReadonlyArray<UrlVM>;
}

export const getServerSideProps: GetServerSideProps<UrlsProps> = async () => {
  const urls = await prisma.url
    .findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
    })
    .then((urls) =>
      urls.map((url) => ({
        ...url,
        createdAt: url.createdAt.toISOString(),
        updatedAt: url.updatedAt.toISOString(),
        metadata: decompressMetadata(url.metadata as Object),
      }))
    );

  return {
    props: {
      urls,
    },
  };
};
