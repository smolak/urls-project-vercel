import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html className="h-full">
      <Head />
      <body className="flex max-w-[1200px] container mx-auto">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
