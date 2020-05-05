import { Month } from './month.model';

export interface Bug {
  name: string;
  location: string;
  time: string;
  price: number;
  month: Month;
}
