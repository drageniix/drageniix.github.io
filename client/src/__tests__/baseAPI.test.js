import BaseClientAPI from '../utilities/baseApi';

let baseClientApi;

afterEach(fetch.resetMocks);

describe('creation of api', () => {
    it('should create a base api with default headers', () => {
        baseClientApi = new BaseClientAPI('localhost:5000');
        expect(baseClientApi.baseUrl).toBe('localhost:5000');
        expect(baseClientApi.headers).toEqual({
            'Content-Type': 'application/json'
        });
    });

    it('should create a custom base api', () => {
        const baseApi = new BaseClientAPI('test.test', { foo: 'bar' });

        expect(baseApi.baseUrl).toBe('test.test');
        expect(baseApi.headers).toEqual({ foo: 'bar' });
    });
});

describe('invalid request structure', () => {
    it('should have an invalid endpoint', async () => {
        try {
            await baseClientApi.baseRequest({
                endpoint: 'meow'
            });
        } catch (err) {
            expect(err.message).toBe('Endpoint must lead with a slash.');
        }
        expect(fetch).not.toHaveBeenCalled();
    });

    it('should have an invalid body', async () => {
        try {
            await baseClientApi.baseRequest({
                body: { foo: 'bar' }
            });
        } catch (err) {
            expect(err.message).toBe('Cannot use "GET" method with a body.');
        }
        expect(fetch).not.toHaveBeenCalled();
    });
});

describe('resolved fetch requests', () => {
    it('should create a default base api request', async () => {
        fetch.mockResponseOnce(JSON.stringify({ hello: 'World 1' }));

        const res = await baseClientApi.baseRequest();

        expect(res).toEqual({ hello: 'World 1' });
        expect(fetch).toHaveBeenCalled();
        expect(fetch.mock.calls[0][0]).toBe('localhost:5000/');
        expect(fetch.mock.calls[0][1]).toEqual({
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
    });

    it('should create a custom base api request', async () => {
        fetch.mockResponseOnce(JSON.stringify({ hello: 'World 2' }));

        const res = await baseClientApi.baseRequest({
            endpoint: '/meow',
            headers: { foo: 'bar' },
            body: { hello: 'world' },
            method: 'POST'
        });

        expect(res).toEqual({ hello: 'World 2' });
        expect(fetch).toHaveBeenCalled();
        expect(fetch.mock.calls[0][0]).toBe('localhost:5000/meow');
        expect(fetch.mock.calls[0][1]).toEqual({
            method: 'POST',
            headers: { 'Content-Type': 'application/json', foo: 'bar' },
            body: '{"hello":"world"}'
        });
    });
});

describe('rejected fetch requests', () => {
    it('should have an invalid status code', async () => {
        fetch.mockResponseOnce(
            JSON.stringify({ message: 'Arbitrary failure.' }),
            {
                status: 400
            }
        );

        try {
            await baseClientApi.baseRequest();
        } catch (err) {
            expect(err.message).toBe('Arbitrary failure.');
        }
        expect(fetch).toHaveBeenCalled();
    });

    it('should have a rejected fetch', async () => {
        fetch.mockRejectOnce(new Error('no hello! >:('));
        try {
            await baseClientApi.baseRequest();
        } catch (err) {
            expect(err.message).toBe('no hello! >:(');
        }
        expect(fetch).toHaveBeenCalled();
    });
});
