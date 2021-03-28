import { AccountStatus } from "./enums/AccountStatus"
import { Roles } from "./enums/Roles"

export class Authenticated {
    username: string
    password: string
    email: string
    role: Roles
    accountStatus: AccountStatus
    createdDate: Date
}