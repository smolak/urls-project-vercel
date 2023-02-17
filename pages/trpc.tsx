import { trpc } from "../trpc/utils";

export default function IndexPage() {
  const hello = trpc.hello.useQuery({ name: "Jacek" });

  if (!hello.data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>{hello.data.greeting}</p>
    </div>
  );
}
