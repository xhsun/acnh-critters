export default class TimeOption {
  /**
   * True for north hemisphere schedule; False for south hemisphere schedule
   */
  isNorth: boolean;
  /**
   * True to show all months; False to use month field
   */
  isAll: boolean;
  month: number;

  constructor(month?: number, isAll: boolean = false, isNorth: boolean = true) {
    this.month = !month ? new Date().getMonth() + 1 : month;
    this.isAll = isAll;
    this.isNorth = isNorth;
  }
}
