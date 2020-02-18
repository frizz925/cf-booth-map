import Category from '@models/Category';
import Circle from '@models/Circle';
import Day from '@models/Day';
import Social, { SocialType } from '@models/Social';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import slugify from 'slugify';
import Parser from './Parser';

export interface RawCircle {
  id: number;
  name: string;
  src: string;
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
  SellsPhotobook: 0;
  booth_number: string;
  fandom: string;
  rating: string;
  circle_twitter: string;
  circle_instagram: string;
  circle_facebook: string;
}

export default class CircleParser implements Parser<RawCircle, Circle> {
  private baseUrl: URL;

  constructor(baseUrl?: string | URL) {
    this.baseUrl = normalizeBaseUrl(baseUrl);
  }

  public parse(circle: RawCircle): Circle {
    return {
      id: circle.id,
      slug: slugify(circle.name.toLowerCase()),
      name: circle.name,
      imageUrl: this.normalizeUrl(circle.src),
      boothNumber: sanitizeBoothNumber(circle.booth_number),
      boothNumbers: parseBoothNumbers(circle.booth_number),
      rating: circle.rating,
      fandoms: parseFandoms(circle.fandom),
      categories: parseCategories(circle),
      socials: parseSocials(circle),
      day: parseDay(circle),
      search: parseSearch(circle.booth_number),
    };
  }

  private normalizeUrl(raw: string): string {
    if (raw.indexOf('://') > 0) {
      return raw;
    }
    return new URL(raw, this.baseUrl).toString();
  }
}

const normalizeBaseUrl = (url: string | URL | undefined) => {
  url = url || '/';
  if (url instanceof URL) {
    return url;
  }
  if (url.indexOf('://') > 0) {
    return new URL(url);
  }
  return new URL(url, window.location.toString());
};

const parseBoothNumbers = (boothNumbers: string): string[] => {
  return reduce(
    sanitizeBoothNumber(boothNumbers).split('/'),
    (results, booth) => {
      const [prefix, middle] = booth.split('-', 2);
      const matches = middle.match(/([0-9]+)([A-Z]+)/i);
      if (!matches) {
        return results;
      }

      const boothNum = parseInt(matches[1], 10);
      const boothSuffixes = matches[2];
      boothSuffixes.split('').forEach(suffix => {
        results.push(`${prefix}${boothNum}${suffix}`);
      });
      return results;
    },
    [],
  );
};

const sanitizeBoothNumber = (boothNumber: string): string => {
  return boothNumber.split(' ')[0];
};

const parseFandoms = (fandoms: string): string[] => {
  return map(fandoms.trim().split(','), fandom => {
    if (!fandom) {
      return fandom;
    }
    return map(fandom.trim().split(' '), token => {
      return token[0].toUpperCase() + token.substring(1);
    })
      .join(' ')
      .trim();
  });
};

const parseCategories = (circle: RawCircle): Category[] => {
  const mappings = [
    [Category.Artbook, circle.SellsArtbook],
    [Category.CD, circle.SellsCD],
    [Category.Comic, circle.SellsComic],
    [Category.GameAnalog, circle.SellsGameAnalog],
    [Category.GameDigital, circle.SellsGameDigital],
    [Category.Goods, circle.SellsGoods],
    [Category.LiveCommission, circle.SellsLiveCommision],
    [Category.Novel, circle.SellsNovel],
    [Category.Photobook, circle.SellsPhotobook],
  ].filter(mapping => !!mapping[1]);
  return map(mappings, mapping => mapping[0] as Category);
};

const parseSocials = (circle: RawCircle): Social[] => {
  const mappings = [
    {
      type: SocialType.Facebook,
      url: circle.circle_facebook,
      normalizer: normalizeFacebook,
    },
    {
      type: SocialType.Twitter,
      url: circle.circle_twitter,
      normalizer: normalizeTwitter,
    },
    {
      type: SocialType.Instagram,
      url: circle.circle_instagram,
      normalizer: normalizeInstagram,
    },
  ].filter(mapping => mapping.url && mapping.url !== '-');
  return map(mappings, ({ type, url, normalizer }) => ({
    type,
    url: normalizer(url),
  }));
};

const parseDay = (circle: RawCircle): Day => {
  if (!circle.isSunday) {
    return Day.Saturday;
  } else if (!circle.isSaturday) {
    return Day.Sunday;
  }
  return Day.Both;
};

const parseSearch = (boothNumber: string) => {
  return sanitizeBoothNumber(boothNumber)
    .replace(/-0/g, '')
    .replace(/-/g, '')
    .toLowerCase();
};

const normalizeFacebook = (url: string) => {
  return normalizeSocialUrl('https://facebook.com', url);
};
const normalizeTwitter = (url: string) => {
  return normalizeSocialUrl('https://twitter.com', url);
};
const normalizeInstagram = (url: string) => {
  return normalizeSocialUrl('https://instagram.com', url);
};

const normalizeSocialUrl = (baseUrl: string, url: string): string => {
  if (url.indexOf('://') > 0) {
    return url;
  } else if (url.indexOf('/') > 0) {
    return `https://${url}`;
  } else if (url.startsWith('@')) {
    url = url.substring(1);
  }
  return `${baseUrl}/${url}`;
};
