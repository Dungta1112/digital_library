import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { fail } from '../response/api-response';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const body = exception instanceof HttpException ? exception.getResponse() : 'Internal server error';
    const message = typeof body === 'object' && body !== null && 'message' in body ? String((body as { message: unknown }).message) : String(body);
    const errors = Array.isArray((body as { message?: unknown })?.message) ? ((body as { message: string[] }).message) : [];

    response.status(status).json(fail(message, errors));
  }
}
