export type AuthUser = {
  id: string;
  email: string;
  role: 'user' | 'organizer' | 'moderator' | 'admin';
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};
