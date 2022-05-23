import { PERMISSIONS, ROLES } from '../constants';

export interface IUserInfo {
  _id?: string;
  image?: string;
  no?: string;
  name?: string;
  email?: string;
  phone?: string;
  center?: string;
  department?: string;
  university?: string;
  position?: string;
  permissions?: Array<typeof PERMISSIONS[number]>;
  role?: typeof ROLES[number];
}
