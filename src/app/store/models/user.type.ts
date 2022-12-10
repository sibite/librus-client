export interface UserType {
  AccountId?: string;
  FirstName: string;
  Id: number;
  LastName: string;
  Url?: string;
  IsEmployee?: boolean;
  IsSchoolAdministrator?: boolean;
  GroupId?: number;
  [key: string]: any;
}
