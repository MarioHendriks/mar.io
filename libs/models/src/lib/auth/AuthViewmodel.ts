import { ProfileViewmodel } from "../profile/ProfileViewmodel"
import { AccountStatus } from "./enums/AccountStatus"
import { Roles } from "./enums/Roles"

export class AuthViewmodel { 
    username: string
    role: Roles
    token: string
    accountStatus: AccountStatus
    profile: ProfileViewmodel

}