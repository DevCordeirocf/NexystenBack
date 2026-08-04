import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

/**
 * PrismaErrorHandler centraliza o mapeamento de erros do Prisma para exceções HTTP do NestJS.
 * Não deve expor mensagens sensíveis do banco de dados ao cliente. Inclua um contexto (nome da
 * entidade/serviço) para mensagens mais úteis sem vazar detalhes técnicos.
 */
export class PrismaErrorHandler {
  static handle(error: unknown, context?: { entity?: string }): never {
    const entityLabel = context?.entity ? `${context.entity} ` : '';

    if (error && typeof error === 'object') {
      // Known Prisma errors have specific classes under Prisma
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2002': // Unique constraint failed
            throw new ConflictException(`${entityLabel}já existe.`);

          case 'P2025': // An operation failed because it depends on one or more records that were required but not found.
            throw new NotFoundException(`${entityLabel}não encontrado(a).`);

          case 'P2003': // Foreign key constraint failed
            throw new BadRequestException(`${entityLabel}operação violou restrição de chave estrangeira.`);

          // Adicione outros códigos específicos conforme necessário
          default:
            // Evitar vazar detalhes do DB: logar externamente (logger) e retornar 500 genérico
            throw new InternalServerErrorException('Erro de banco de dados. Entre em contato com o suporte.');
        }
      }

      if (
        error instanceof Prisma.PrismaClientInitializationError ||
        // @ts-expect-error: rust panic type may not exist at compile time dependendo da versão do Prisma
        (Prisma as any).PrismaClientRustPanicError && error instanceof (Prisma as any).PrismaClientRustPanicError
      ) {
        throw new ServiceUnavailableException('Serviço de banco de dados indisponível.');
      }
    }

    // Se não for um erro do Prisma, retornar 500 genérico
    throw new InternalServerErrorException('Erro interno do servidor.');
  }
}
