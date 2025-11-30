import type { ISiteDTO } from "./types";

export const paginate = (items: ISiteDTO[], pageNumber: number, pageSize: number) => {
  const startIndex = (pageNumber - 1) * pageSize;

  return [...items].splice(startIndex, pageSize);
};
