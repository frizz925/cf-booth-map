export enum SocialType {
  Facebook = 'Facebook',
  Twitter = 'Twitter',
  Instagram = 'Instagram',
  Web = 'Website',
}

export default interface Social {
  type: SocialType;
  url: string;
}
