import type { IBlock, ILayoutItem } from "@/store/builder/types";

export interface ISiteDTO {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  published: boolean;
}

export interface ISiteContentDTO {
  components: {[key: string]: IBlock}
  layout: ILayoutItem[]
}

export interface IAuthState {
  isAuthenticated: boolean;
}

export interface ISelectedPage {
  selected: number;
}
