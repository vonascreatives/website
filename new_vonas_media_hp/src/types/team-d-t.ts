export interface ITeamDT {
  id: number;
  image: string;
  designation: string;
  name: string;
  bio?: string;
  bioText?: string;
  email?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    website?: string;
    youtube?: string;
  };
  youtubeChannels?: {
    _id: string;
    channel_name: string;
    slug: {
      current: string;
    };
    cta_button_url?: string;
    category?: string;
  }[];
  _id?: string;
  slug?: {
    current: string;
  };
}
