import { UserDocument } from "./../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument | undefined;
    }
  }
}

export interface UserType {
  _id: string;
  name: string;
  email: string;
  password: string;
  profilePicture?: string;
}
