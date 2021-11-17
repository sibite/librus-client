export interface SynergiaAccountType {
  id: number,
  accountIdentifier: string,
  group: string, // student
  accessToken: string, // Bearer
  login: string,
  studentName: string,
  scopes: any[] | string,
  state: 'active' | string
}
