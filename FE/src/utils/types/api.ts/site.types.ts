export interface ISiteDTO {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  published: boolean;
}

export interface IAuthState {
  isAuthenticated: boolean;
}
