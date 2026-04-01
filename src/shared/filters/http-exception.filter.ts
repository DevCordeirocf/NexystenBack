import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Filtro global para captura e padronização de exceções HTTP.
 * Garante que todas as respostas de erro da API sigam o mesmo formato.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('API_ERROR');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Determina o status HTTP (padrão 500 se não for uma HttpException)
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Extrai a mensagem de erro
    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Erro interno no servidor';

    // Monta o objeto de resposta padronizado
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: typeof exceptionResponse === 'object' ? (exceptionResponse as any).message || exceptionResponse : exceptionResponse,
      error: typeof exceptionResponse === 'object' ? (exceptionResponse as any).error || 'Internal Server Error' : 'Internal Server Error',
    };

    // Log detalhado no terminal para facilitar o debug
    this.logger.error(
      `[${request.method}] ${request.url} | Status: ${status} | Erro: ${JSON.stringify(errorResponse.message)}`,
      exception instanceof Error ? exception.stack : '',
    );

    response.status(status).json(errorResponse);
  }
}
