import { api } from "../utils/api";

export default function IndexPage() {
  const hello = api.hello.hello.useQuery({ name: "Jacek" });

  if (!hello.data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>{hello.data.greeting}</p>
    </div>
  );
}
