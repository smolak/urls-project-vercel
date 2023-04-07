import { PublicUserDataVM } from "../../../user/models/public-user-data.vm";
import { UserUrlVM } from "../../../user-url/models/user-url.vm";
import { UrlVM } from "../../../url/models/url.vm";

export interface AdminUrlListItemVM {
  url: UrlVM;
  user: PublicUserDataVM;
  userUrl: UserUrlVM;
}
