export interface Social {
  facebook?: string;
  twitter?: string;
  instagram?: string;
}

export enum Work {
  Artbook = 'Artbooks',
  CD = 'CD',
  Comic = 'Comics',
  GameAnalog = 'Game (Analog)',
  GameDigital = 'Game (Digital)',
  Goods = 'Goods/Merchandise',
  LiveCommission = 'Live Commission',
  Novel = 'Novel',
  Photobook = 'Photobooks',
}

export default interface Circle {
  id: number;
  name: string;
  boothNumber: string;
  boothNumbers: string[];
  isSaturday: boolean;
  isSunday: boolean;

  imageUrl: string;
  fandoms: string[];
  rating: string;
  works: Work[];

  social: Social;
  sample?: string;
}

export interface CircleData {
  id: number;
  name: string;
  booth_number: string;
  isSaturday: number;
  isSunday: number;

  SellsArtbook: number;
  SellsCD: number;
  SellsComic: number;
  SellsGameAnalog: number;
  SellsGameDigital: number;
  SellsGoods: number;
  SellsLiveCommision: number;
  SellsNovel: number;
  SellsPhotobook: number;

  src: string;
  fandom: string;
  rating: string;
  sample: string;

  circle_facebook: string;
  circle_instagram: string;
  circle_twitter: string;
}

export const workMap = {
  SellsArtbook: Work.Artbook,
  SellsCD: Work.CD,
  SellsComic: Work.Comic,
  SellsGameAnalog: Work.GameAnalog,
  SellsGameDigital: Work.GameDigital,
  SellsGoods: Work.Goods,
  SellsLiveCommision: Work.LiveCommission,
  SellsNovel: Work.Novel,
  SellsPhotobook: Work.Photobook,
};
