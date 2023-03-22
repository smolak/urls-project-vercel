import { FieldValues, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { api } from "../../../../utils/api";
import clsx from "clsx";
import { FiCheckCircle } from "react-icons/fi";

export const AddUrl = () => {
  const { register, handleSubmit, resetField, setFocus } = useForm();
  const [addedUrl, setAddedUrl] = useState("");
  const { mutate: addUrl, isLoading } = api.url.createUrl.useMutation({
    onSuccess: (data) => {
      setAddedUrl(data.url);

      resetField("url");
      setFocus("url");
    },
    onError: () => {},
  });

  useEffect(() => {
    setFocus("url");
  }, []);

  const onSubmit = (values: FieldValues) => {
    setAddedUrl("");
    const url = values.url as string;

    addUrl({ url });
  };

  return (
    <div className="flex flex-col space-y-4 w-1/3">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-control">
          <div className="input-group">
            <input
              {...register("url")}
              type="url"
              disabled={isLoading}
              className="input input-bordered w-full"
              placeholder="https://..."
            />
            <button type="submit" disabled={isLoading} className={clsx("btn btn-square", { loading: isLoading })}>
              {!isLoading && "Add"}
            </button>
          </div>
        </div>
      </form>
      {addedUrl !== "" && (
        <div className="alert alert-success shadow-lg" onClick={() => setAddedUrl("")}>
          <div>
            <FiCheckCircle />
            <span>URL added. It will be live soon.</span>
          </div>
        </div>
      )}
    </div>
  );
};
