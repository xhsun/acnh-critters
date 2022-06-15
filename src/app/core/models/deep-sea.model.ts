import { Month } from "./month.model";

export interface DeepSea {
  /**
   * Deep sea creature's name
   */
   name: string;
   /**
   * Deep sea creature's shadow size
   */
  shadowSize: string;
  /**
   * Deep sea creature's swimming pattern
   */
   swimmingPattern: string;
    /**
   * Time of day when this deep sea creature can be found
   */
  time: string;
  /**
   * Deep sea creature's price
   */
   price: number;
  /**
   * Time of month when this Deep sea creature can be found
   */
  month: Month;
}
