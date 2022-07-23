export type TUserInfo = {
  _id?: string,
  userGroupId?: string,
  username?: string,
  nickname?: string,
  mail?: string,
  phoneNumber?: number,
  avatar?: {
    url: string,
    attachmentId: string
  },
  organizationId?: string,
  verified?: {
    phoneNumber: boolean,
    mail: boolean,
    realName: boolean
  },
  createdAt?: number,
  updatedAt?: number,
  deletedAt?: number
}

export type TUserLogins = {
  _id: string
  token: string
  expiration: number
  createdAt: string
  updatedAt: string
  deletedAt: string
}

export type TUserFavoriteComponentGroups = {
  _id: string
  name: string
  description: string
  components: number
  userId: string
  organizatioId: string
  createdAt: string
  updatedAt: string
  deletedAt: string
}

export type TUserFaviorteComponents = {
  _id: string
  groupId: string | null
  userId: string
  organizationId: string
  createdAt: string
  updatedAt: string
  deletedAt: string
}

export type TUserGroups = {
  _id: string
  name: string
  permissions: Array<Record<string, boolean>>
  createdAt: string
  updatedAt: string
  deletedAt: string
}

export type TUserPermissions = {
  _id: string
  name: string
  title: string
  parentId: string
  createdAt: string
  updatedAt: string
  deletedAt: string
}

export type TOrganizations = {
  _id: string
  name: string
  logo: string
  agencyCode: string
  mailingAddress: object
  businessLicence: string
  verified: boolean
  contact: {
    name: string
    idNumber: string
    phoneNumber: number
  }
  createdAt: string
  updatedAt: string
  deletedAt: string
}