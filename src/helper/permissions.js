export const FEATURE_LIST = {
  team: "team",
  dashboard: "dashboard",
  profile: "profile",
  permissions:"permissions",
  product:"product",
  designer:"designer",
  master:"master"
};

export const PERMISSION_TYPES = {
  edit:0,
  create:1,
  delete:2,
  view:3,
  patch:4
}

export const FEATURE_PERMISSIONS = {
  dashboard: [
    { name: "view", code: 3 },
  ],

  designer: [
    { name: "create", code: 1 },
    { name: "edit", code: 0 },
    { name: "delete", code: 2 },
    { name: "view", code: 3 },
    { name: "patch", code: 4 },
  ],
  master: [
    { name: "create", code: 1 },
    { name: "edit", code: 0 },
    { name: "delete", code: 2 },
    { name: "view", code: 3 },
    { name: "patch", code: 4 },
  ],
  team: [
    { name: "create", code: 1 },
    { name: "edit", code: 0 },
    { name: "delete", code: 2 },
    { name: "view", code: 3 },
    { name: "patch", code: 4 },
  ],
  product: [
    { name: "create", code: 1 },
    { name: "edit", code: 0 },
    { name: "delete", code: 2 },
    { name: "view", code: 3 },
    { name: "patch", code: 4 },
  ],

  profile: [
    { name: "view", code: 3 },
    { name: "patch", code: 4 },
  ],

  permissions: [
    { name: "view", code: 3 },
    { name: "edit", code: 0 },
  ],
};
export const ProductionRoles={
  Filing:"Filing",
  Setting: "Setting",
  PrePolish: "Pre Polish",
  Polish: "Polish", 
  Repair:"Repair",
  Casting:"Casting",
}