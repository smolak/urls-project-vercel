import { FieldValues, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { api } from "../../../../utils/api";
import { FiCheckCircle } from "react-icons/fi";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "../../../utils";

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
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex w-full items-center justify-center space-x-2">
          <Input
            {...register("url")}
            type="url"
            inputMode="url"
            disabled={isLoading}
            placeholder="https://..."
            className="max-w-md"
          />
          <Button type="submit" disabled={isLoading} className={cn("h-10 space-x-1", { loading: isLoading })}>
            <Plus size={18} />
            <span>Add</span>
          </Button>
        </div>
      </form>
      {addedUrl !== "" && (
        <div className="" onClick={() => setAddedUrl("")}>
          <div>
            <FiCheckCircle />
            <span>URL added. It will be live soon.</span>
          </div>
        </div>
      )}
    </div>
  );
};
