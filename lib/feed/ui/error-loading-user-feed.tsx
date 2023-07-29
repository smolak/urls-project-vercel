export const ErrorLoadingUserFeed = () => {
  return (
    <section className="p-5 sm:px-0 sm:py-20">
      <h1 className="mb-8 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
        <span className="inline">We couldn&apos;t load the feed data, sorry 😞</span>{" "}
      </h1>
      <div className="p-4">
        <p className="mb-2 flex gap-2">
          <span>✅</span> We log those things are aware of the problem.
        </p>
        <p className="mb-2 flex gap-2">
          <span>💡</span> You can try refreshing the page, and if the problem is still there, wait a bit, we will handle
          it ASAP.
        </p>
      </div>
    </section>
  );
};
