// Every API route lives here — referenced by both MSW handlers and the api
// client. When the real backend is ready, adjust paths here and the rest of
// the codebase follows without changes.

export const ENDPOINTS = {
  // Auth / current user
  ME: "/me",

  // Users
  USERS: "/users",
  USER: (id: string) => `/users/${id}`,
  USER_BY_ALIAS: (alias: string) => `/users/alias/${alias}`,

  // Groups
  GROUPS: "/groups",
  GROUP: (id: string) => `/groups/${id}`,
  GROUP_MEMBERS: (groupId: string) => `/groups/${groupId}/members`,
  GROUP_MEMBER: (groupId: string, memberId: string) => `/groups/${groupId}/members/${memberId}`,

  // Categories
  CATEGORIES: "/categories",

  // Expenses
  GROUP_EXPENSES: (groupId: string) => `/groups/${groupId}/expenses`,
  EXPENSE: (id: string) => `/expenses/${id}`,

  // Splits (embedded in expense responses, but mutations need their own route)
  EXPENSE_SPLITS: (expenseId: string) => `/expenses/${expenseId}/splits`,

  // Receipts
  RECEIPTS: "/receipts",
  RECEIPT: (id: string) => `/receipts/${id}`,
  RECEIPT_PROCESS: "/receipts/process",

  // Settlements
  GROUP_SETTLEMENTS: (groupId: string) => `/groups/${groupId}/settlements`,
  SETTLEMENT: (id: string) => `/settlements/${id}`,

  // Balances & debts
  GROUP_BALANCES: (groupId: string) => `/groups/${groupId}/balances`,
  GROUP_DEBTS: (groupId: string) => `/groups/${groupId}/debts`,

  // Invitations
  GROUP_INVITATIONS: (groupId: string) => `/groups/${groupId}/invitations`,
  INVITATION: (id: string) => `/invitations/${id}`,
  INVITATION_ACCEPT: (id: string) => `/invitations/${id}/accept`,
  INVITATION_DECLINE: (id: string) => `/invitations/${id}/decline`,
  INVITATION_RESOLVE: (token: string) => `/invitations/token/${token}`,

  // Notifications
  NOTIFICATIONS: "/notifications",
  NOTIFICATION: (id: string) => `/notifications/${id}`,
  NOTIFICATIONS_READ_ALL: "/notifications/read-all",

  // Exchange rates
  EXCHANGE_RATES: "/exchange-rates",
} as const;
