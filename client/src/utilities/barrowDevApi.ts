import BaseClientAPI from "./baseApi";

class BarrowDevApi {
  baseApi = new BaseClientAPI("barrow-dev.herokuapp.com");

  getTest(): Promise<any> {
    return this.baseApi.baseRequest({ endpoint: "/test" });
  }

  getRawBudget(): Promise<any> {
    return this.baseApi.baseRequest({ endpoint: "/budget/raw" });
  }

  getPaycheckBudget(): Promise<any> {
    return this.baseApi.baseRequest({ endpoint: "/budget/paycheck" });
  }
}

export default new BarrowDevApi();
