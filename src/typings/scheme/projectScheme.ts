export type TProjects = {
  id?: string,
  name?: string,
  icon?: string,
  description?: string,
  version?: string,
  typeId?: number,
  appGroupId?: string,
  organizationId?: string,
  pin?: number,
  createdAt?: number,
  createdAtFormat?: string,
  updatedAt?: number,
  updatedAtFormat?: string,
  deletedAt?: number
  deletedAtFormat?: string,
  expiration?: number,
  expirationFormat?: string,
}

export type TProjectGroups = {
  id?: string,
  name?: string,
  description?: string,
  userId?: string,
  organizationId?: string,
  projects?: number,
  icon?: string,
  pin?: number,
  createdAt?: number,
  createdAtText?: string,
  updatedAt?: number,
  deletedAt?: number
}

export type TProjectPages = {
  _id: string,
  appId: string,
  parentPageId: string,
  type: number,
  appType: number,
  name: string,
  title: string,
  description: string,
  path: string,
  url: string,
  hasChanged: number,
  components: Array<{
    name: string,
    path: string,
    props: Record<string, any>,
    _id: string,
  }>,
  createdAt?: number,
  updatedAt?: number,
  deletedAt?: number
}

export type TComponents = {
  _id: string,
  name: string,
  path: string,
  props: Record<string, any>,
  paid: boolean,
  cost: number,
  title: string,
  tags: Array<string>,
  userId: string,
  organizationId: string,
  appType: string,
  visibility: number,
  cover: string,
  previewImages: Array<string>,
  likes: number,
  favorites: number,
  technologys: Array<string>,
  typeId: string,
  scores: {
    code: number
  },
  createdAt: number,
  updatedAt: number,
  deletedAt: number
}

export type TComponentTypes = {
  _id: string
  name: string
  parentId: string
  createdAt: string
  updatedAt: string
  deletedAt: string
}

export type TProjectPackages = {
  _id: string
  appId: string
  downloadUrl: string
  downloads: number
  size: number
  createdAt: string
  updatedAt: string
  deletedAt: string
}


export type TComponentOrders = {
  _id: string
  useId: string
  organizationId: string
  componentId: string
  fees: number
  oayOrderId: string
  expiredAt: string
  createdAt: string
  updatedAt: string
  deletedAt: string
}

export type TProjectTypes = {
  _id: string
  name: string
  icon: string
  description: string
  createdAt: string
  updatedAt: string
  deletedAt: string
}

export type TProjectTechnologyTypes = {
  id: string
  title: string
  name: string
  templateUrl: string
  icon: string
  description: string
  components: number
  createdAt: string
  updatedAt: string
  deletedAt: string
}

export type TProjectBuildRecordTypes = {
  id: string,
  folderName: string,
  userId: string,
  projectId: string,
  startAt: string,
  endAt: string,
  buildStartAt: string,
  buildEndAt: string,
  buildDuration: number,
  progress: number,
  pageCount: number,
  folderExpiredName: string,
  technologyId: string,
  status: number,
  createdAt: string,
  updatedAt: string,
  deletedAt: string,
}

export type TProjectOperationRecordItem = {
  id: string,
  relatedId: string,
  statusCode: number,
  code: string,
  details: string,
  message: string,
  userId: string,
  type: string,
  technologyId: string,
  recordId: string,
  createdAt: string,
  createdAtFormat?: string,
  updatedAt: string,
  deletedAt: string
}