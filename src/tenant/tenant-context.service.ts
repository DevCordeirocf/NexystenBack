import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

// Define a estrutura de dados que será armazenada no contexto
interface TenantStore {
  tenantId: string;
}

// Cria a instância do AsyncLocalStorage para o nosso contexto multi-tenant.
// Será exportada e injetada no serviço.
export const tenantStore = new AsyncLocalStorage<TenantStore>();

@Injectable()
export class TenantContextService {
  /**
   * Executa uma função (geralmente o restante do ciclo de vida da requisição)
   * com o Tenant ID armazenado no contexto assíncrono.
   *
   * @param tenantId O ID único do inquilino (Loja)
   * @param callback A função a ser executada no contexto isolado.
   */
  public run(tenantId: string, callback: () => void): void {
    if (!tenantId) {
      throw new InternalServerErrorException('Tenant ID deve ser fornecido para iniciar o contexto.');
    }
    
    // O método run() do ALS garante que o store (TenantStore)
    // estará disponível apenas para a execução deste callback e suas chamadas subsequentes.
    tenantStore.run({ tenantId }, callback);
  }

  /**
   * Obtém o Tenant ID do contexto assíncrono atual.
   * Este método será usado por todos os serviços e pelo Prisma Middleware.
   *
   * @returns O Tenant ID da requisição atual.
   */
  public getTenantId(): string | undefined {
    // Retorna o store ligado ao contexto assíncrono atual.
    const store = tenantStore.getStore();

    // Se a requisição estiver rodando em um contexto sem tenant (ex: rota pública, worker),
    // o store pode ser undefined.
    return store?.tenantId;
  }

  /**
   * Obtém o Tenant ID, lançando um erro se não estiver disponível.
   * Usado em rotas que exigem estritamente o isolamento multi-tenant (ex: Estoque, Pedidos).
   *
   * @returns O Tenant ID da requisição atual.
   * @throws InternalServerErrorException se o Tenant ID não estiver no contexto.
   */
  public getRequiredTenantId(): string {
    const tenantId = this.getTenantId();

    if (!tenantId) {
      throw new InternalServerErrorException('Falha de contexto multi-tenant: Tenant ID não disponível para esta operação.');
    }

    return tenantId;
  }
}