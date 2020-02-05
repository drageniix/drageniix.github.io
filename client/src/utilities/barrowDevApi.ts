import BaseClientAPI from './baseApi';

class BarrowDevApi {
    baseApi = new BaseClientAPI('barrow-dev.herokuapp.com');

    getTest(): Promise<any> {
        return this.baseApi.baseRequest({ endpoint: '/test' });
    }
}

export default new BarrowDevApi();
