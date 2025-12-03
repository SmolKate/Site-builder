export interface ISiteDTO {
  id: string;
  title: string;
  description: string;
  siteContentId: string;
  createdAt: string;
  published: boolean;
}

export interface IAuthState {
  isAuthenticated: boolean;
}

export interface ISelectedPage {
  selected: number;
}
