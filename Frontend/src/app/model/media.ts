

export interface Media {
  Media_ID?: number;
  Name: string;
  Platform: string;
  Price: number;
  Condition: string;
  Quantity?: number;
  Type: string;
  Specials: any[];
  User_rating?: number;
  Game_Genre?: string;
  ESRB_Rating?: string;
  Video_Genre?: string;
  Hardware_Type?: string;
  MPAA_Rating?: string;
  Software_Type?: string;
  images?: string[];
  companyInfo: {
    publisher?: string,
    developer?: string,
    manufacturer?: string
  };
}
