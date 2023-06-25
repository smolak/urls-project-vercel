import { UserUrlVM } from "../../../user-url/models/user-url.vm";
import { UrlVM } from "../../../url/models/url.vm";
import { PublicUserProfileDataVM } from "../../../user-profile-data/models/public-user-profile-data.vm";

export interface AdminUrlListItemVM {
  url: UrlVM;
  userProfileData: Pick<PublicUserProfileDataVM, "id" | "username" | "image">;
  userUrl: UserUrlVM;
}
