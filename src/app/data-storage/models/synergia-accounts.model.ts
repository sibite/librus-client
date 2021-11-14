export interface SynergiaAccountsType {
  lastModification: number, // timestamp
  accounts: {
    id: number,
    accountIdentifier: string,
    group: string, // student
    accessToken: string // Bearer
    login: string,
    studentName: string,
    scopes: any[] | string,
    state: 'active' | string
  }[]
}
