interface IDataResponse {
  title: string;
  type: string;
  chapter: string;
  rating: string;
  href: string;
  thumbnail: string;
}

export interface IResponse {
  success: boolean;
  data: IDataResponse[];
}
