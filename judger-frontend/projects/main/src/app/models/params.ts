export interface IParams {
  [key: string]: string | number | Date | boolean;
  q?: string;
  page?: number;
  limit?: number;
  sort?: string;
}
