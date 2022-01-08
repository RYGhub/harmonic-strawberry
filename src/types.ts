export type UUID = string
export type Crystal = string
export type DateString = string

export type StrawberryModel = {}

export type ApplicationEdit = StrawberryModel & {
    name: string
    description: string
}

export type GroupEdit = StrawberryModel & {
    crystal: Crystal
}

export enum WebhookKind {
    STRAWBERRY = "STRAWBERRY",
    DISCORD = "DISCORD",
}

export type WebhookEdit = StrawberryModel & {
    url: string
    kind: WebhookKind
}

export enum Alloy {
    BRONZE = "BRONZE",
    SILVER = "SILVER",
    GOLD = "GOLD",
}

export type AchievementEdit = StrawberryModel & {
    name: string
    description: string
    alloy: Alloy
    secret: boolean
    icon: string | null
    repeatable: boolean
    crystal: Crystal
}

export type UnlockEdit = StrawberryModel & {
    achievement_id: UUID
    user_id: UUID
}

export type UserEdit = StrawberryModel & {
    crystal: Crystal
}

export type ApplicationRead = ApplicationEdit & {
    id: UUID
    token: string
}

export type GroupRead = GroupEdit & {
    id: UUID
    application_id: UUID
}

export type WebhookRead = WebhookEdit & {
    id: UUID
    group_id: UUID
}

export type AchievementRead = AchievementEdit & {
    id: UUID
    group_id: UUID
    token: string
}

export type UnlockRead = UnlockEdit & {
    id: UUID
    timestamp: DateString
}

export type UserRead = UserEdit & {
    id: UUID
    application_id: UUID
}

export type ApplicationFull = ApplicationRead & {
    groups: GroupRead[]
    users: UserRead[]
}

export type GroupFull = GroupRead & {
    application: ApplicationRead
    achievements: AchievementRead[]
}

export type WebhookFull = WebhookRead & {
    group: GroupRead
}

export type AchievementFull = AchievementRead & {
    group: GroupRead
    unlocks: UnlockRead[]
}

export type UserFull = UserRead & {
    application: ApplicationRead
    unlocks: UnlockRead[]
}
