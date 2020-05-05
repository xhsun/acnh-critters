export default class TimeOption {
  isAll: boolean;
  month: number;

  constructor(month?: number, isAll?: boolean) {
    this.month = !month ? new Date().getMonth() : month;
    this.isAll = isAll;
  }
}
