import { Month } from './month.model';

export interface Fish {
  name: string;
  shadowSize: string;
  location: string;
  time: string;
  price: number;
  month: Month;
}
