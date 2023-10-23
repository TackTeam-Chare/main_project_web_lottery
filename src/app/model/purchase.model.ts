// To parse this data:
//
//   import { Convert } from "./file";
//
//   const lottery = Convert.toLottery(json);

export interface Purchase {
    purchase_id: number;
    user_id: number;
    lottery_id: number;
    purchase_date: number;
    quantity: number;
    total_price: string;
    created_at: string;
    updated_at?: boolean;
   
 
  }
  
  // Converts JSON strings to/from your types
  export class Convert {
      public static toLottery(json: string): Purchase[] {
          return JSON.parse(json);
      }
  
      public static lotteryToJson(value: Purchase[]): string {
          return JSON.stringify(value);
      }
      
  }
  