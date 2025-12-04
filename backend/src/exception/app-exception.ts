import ErrorCode from 'src/exception/error-code';
export class AppException extends Error {
	errorCode: ErrorCode;
	constructor(errorCode: ErrorCode) {
		super(errorCode.message);
		this.name = 'AppException';
		this.errorCode = errorCode;
	}
}
