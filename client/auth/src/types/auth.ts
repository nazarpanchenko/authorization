export type User = {
  id: string;
  email: string;
  isActivated: boolean;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};
