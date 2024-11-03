interface IDataResponse {
  title: string;
  type: string;
  chapter: string;
  rating: string;
  href: string;
  thumbnail: string;
}

interface IGenre {
  title: string;
  href: string;
}

interface IChapter {
  title: string;
  href: string;
  date: string;
}

interface IMangaData {
  title: string;
  rating: string;
  status: string;
  type: string;
  released: string;
  author: string;
  genre: IGenre[];
  description: string;
  thumbnail: string;
  chapter: IChapter[];
}

/* Eksport Interface */

export interface IResponse {
  success: boolean;
  data: IDataResponse[];
}

export interface IDetailResponse {
  status: string;
  data: IMangaData;
}
