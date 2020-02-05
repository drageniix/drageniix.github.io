import BarrowDevAPI from '../utilities/BarrowDevAPI';

describe('tests all gets', () => {
    it('should create an api for barrow-dev', () => {
        expect(BarrowDevAPI.baseApi.baseUrl).toBe('barrow-dev.herokuapp.com');
    });

    it('should get hello world', async () => {
        BarrowDevAPI.baseApi.baseRequest = jest.fn();
        BarrowDevAPI.baseApi.baseRequest.mockReturnValue(
            Promise.resolve({ message: 'Howdy World' })
        );

        const res = await BarrowDevAPI.getTest();
        return expect(res).toEqual({ message: 'Howdy World' });
    });
});
