export default class ErrorCode {
	static readonly USER_NOT_FOUND = new ErrorCode(1001, 'User not found', 404);
	static readonly INVALID_CREDENTIALS = new ErrorCode(1002, 'Invalid credentials', 401);
	static readonly USER_ALREADY_EXISTS = new ErrorCode(1003, 'User already exists', 409);
	static readonly INTERNAL_SERVER_ERROR = new ErrorCode(
		1000,
		'Internal server error',
		500,
	);
	static readonly BAD_REQUEST = new ErrorCode(1004, 'Bad request', 400);
	static readonly LOGIN_FAILED = new ErrorCode(
		1005,
		'Email or password is incorrect',
		401,
	);
	code: number;
	message: string;
	status: number;
	private constructor(code: number, message: string, status: number) {
		this.code = code;
		this.message = message;
		this.status = status;
	}
}
