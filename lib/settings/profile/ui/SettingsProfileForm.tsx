import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "debounce";
import { ChangeEvent, useState } from "react";
import axios from "axios";
import { ApiResponse } from "../../../user/handlers/usernameCheckHandler";
import { usernameCheckHandlerPayloadSchema } from "../../../user/handlers/usernameCheckHandler/payload";

export const SettingsProfileForm = () => {
  const {
    register,
    clearErrors,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
    },
    criteriaMode: "all",
    resolver: zodResolver(usernameCheckHandlerPayloadSchema),
  });
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<null | boolean>(null);

  const checkUsernameAvailability = async (username: string) => {
    const validationResult = usernameCheckHandlerPayloadSchema.safeParse({ username });

    if (validationResult.success) {
      clearErrors("username");

      // Check availability of the username
      const { data } = await axios.post<ApiResponse>("/api/username-check", {
        username: validationResult.data.username,
      });

      setIsUsernameAvailable(data.usernameAvailable);
    } else {
      await trigger("username");
    }
  };

  return (
    <form>
      <label>
        Username
        <input
          {...register("username")}
          required={true}
          placeholder="Your username (aka handle)"
          onChange={debounce(async (e: ChangeEvent<HTMLInputElement>) => {
            await checkUsernameAvailability(e.target.value);
          }, 500)}
          onBlur={async (e) => await checkUsernameAvailability(e.target.value)}
        />
      </label>
      <div>
        {isUsernameAvailable !== null &&
          (isUsernameAvailable ? <p>Available</p> : <p>Username taken, choose another one</p>)}
        {errors.username && <p>{errors.username.message}</p>}
      </div>

      <div>
        <button type={"submit"}>Save</button>
      </div>
    </form>
  );
};
