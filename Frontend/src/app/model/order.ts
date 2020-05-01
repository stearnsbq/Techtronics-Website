import { Media } from './media';

export interface Order {
    Order_ID: number;
    Type: string;
    Media_Count: number;
    Address: string;
    Zip_Code: string; 
    State: string;
    Country: string;  
    Order_Items: Media[];   
  }
  