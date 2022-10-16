import { PublicUserDataVM } from "../../../user/models/PublicUserData.vm";
import { UserUrlVM } from "../../../user-url/models/UserUrl.vm";
import { UrlVM } from "../../../url/models/Url.vm";

export interface AdminUrlListItemVM {
  url: UrlVM;
  user: PublicUserDataVM;
  userUrl: UserUrlVM;
}
