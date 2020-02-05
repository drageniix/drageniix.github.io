export default class BaseClientAPI {
    baseUrl: string;
    headers: HeadersInit;

    constructor(
        baseURL: string,
        defaultHeaders: HeadersInit = {
            'Content-Type': 'application/json'
        }
    ) {
        this.baseUrl = baseURL;
        this.headers = defaultHeaders;
    }

    async baseRequest({
        endpoint = '/',
        method = 'GET',
        headers = {},
        body
    }: {
        endpoint?: string;
        method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
        headers?: HeadersInit;
        body?: object;
    } = {}): Promise<any> {
        const url = this.getFullURL(endpoint);
        const request = this.formatRequest(method, headers, body);
        const response = await fetch(url, request);
        return this.formatResponse(response);
    }

    getFullURL(endpoint: string): string {
        if (!endpoint.startsWith('/')) {
            throw new Error('Endpoint must lead with a slash.');
        }

        const url = this.baseUrl + endpoint;
        return url;
    }

    getBody(
        method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
        body?: object
    ): string {
        if (body && method === 'GET') {
            throw new Error('Cannot use "GET" method with a body.');
        }

        const stringBody = JSON.stringify(body);
        return stringBody;
    }

    formatRequest(
        method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
        headers?: HeadersInit,
        body?: object
    ): RequestInit {
        const request: RequestInit = {
            method,
            headers: { ...this.headers, ...headers }
        };

        const stringBody = this.getBody(method, body);
        stringBody && (request.body = stringBody);

        return request;
    }

    async formatResponse(response: Response): Promise<any> {
        const statusCode = response.status;
        const responseBody = await response.json();
        if (statusCode === 200 || statusCode === 201) {
            return responseBody;
        } else throw new Error(responseBody.message);
    }
}
