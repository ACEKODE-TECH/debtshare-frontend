import type { ID, ISODateString } from "./common";

export interface User {
  id: ID;
  name: string;
  alias: string;
  email: string;
  avatarUrl: string | null;
  createdAt: ISODateString;
}
