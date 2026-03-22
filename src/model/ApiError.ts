interface RequestUrl {
	protocol: string
	port: number
	host: string
	path: string
}

interface Request {
	url: RequestUrl
	headers: any
	method: string
}

interface Response {
	statusCode: number,
	body: any,
	headers: any,
	request: Request,
}

interface ErrorResponse {
	response: Response
	body: any
}

export class ApiError {

	statusCode: number
	body: any
	headers: any
	request: Request

	constructor(error: any) {
		// Axios HTTP adapter shape: error.response.status, error.response.data, etc.
		// Fetch adapter / generic errors: may lack .response entirely (XeroAPI/xero-node#765)
		const response = error?.response;
		const request = error?.request;

		this.statusCode = response?.status ?? response?.statusCode ?? 0;
		this.body = response?.data ?? response?.body ?? error?.message ?? error;
		this.headers = response?.headers ?? {};
		this.request = {
			url: {
				protocol: request?.protocol ?? '',
				port: request?.agent?.defaultPort ?? request?.socket?.localPort ?? 0,
				host: request?.host ?? '',
				path: request?.path ?? '',
			},
			headers: typeof request?.getHeaders === 'function' ? request.getHeaders() : (request?.headers ?? {}),
			method: request?.method ?? '',
		};
	}

	generateError(): ErrorResponse {
		return {
			response: {
				statusCode: this.statusCode,
				body: this.body,
				headers: this.headers,
				request: this.request,
			},
			body: this.body
		};
	}
}
