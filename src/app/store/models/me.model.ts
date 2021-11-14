export interface MeType {
  Account: {
    Id: number,
    UserId: number,
    FirstName: string,
    LastName: string,
    Email: string,
    GroupId: number,
    IsActive: boolean,
    Login: string,
    IsPremium: boolean,
    IsPremiumDemo: boolean,
    ExpiredPremiumDate: number // timestamp
  },
  Refresh: number,
  User: {
    FirstName: string,
    LastName: string
  },
  Class: {
    Id: number,
    Url: string
  }
}
