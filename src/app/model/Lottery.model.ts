// To parse this data:
//
//   import { Convert } from "./file";
//
//   const lottery = Convert.toLottery(json);

export interface Lottery {
    id:            number;
    ticket_number: number;
    price:         number;
    quantity:      number;
    period:        number;
    set_number:    number;
    created_at:    string;
    updated_at:    string;
    isSelected?: boolean;
    [key: string]: any;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toLottery(json: string): Lottery[] {
        return JSON.parse(json);
    }

    public static lotteryToJson(value: Lottery[]): string {
        return JSON.stringify(value);
    }
    
}
