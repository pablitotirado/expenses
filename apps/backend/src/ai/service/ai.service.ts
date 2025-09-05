import { Injectable } from '@nestjs/common';
import { IncomeRepository } from '../../incomes/repositories/income.repository';
import { ExpenseRepository } from '../../expenses/repositories/expense.repository';
import OpenAI from 'openai';
import { FINANCE_ADVISOR_PROMPT } from '../prompts/finance-advisor';

interface AIRequest {
  period: string;
  userGoal?: string;
}

interface FinancialData {
  period: {
    from: string;
    to: string;
    days: number;
  };
  currency: string;
  incomes: Array<{
    date: string;
    amount: number;
    source: string;
  }>;
  expenses: Array<{
    date: string;
    amount: number;
    category: string;
    fixed: boolean;
    notes?: string;
  }>;
  user_profile: {
    household_size: number;
    dependents: number;
    has_debt: boolean;
    goals: string[];
  };
}

@Injectable()
export class AIService {
  private openai: OpenAI;

  constructor(
    private readonly incomeRepository: IncomeRepository,
    private readonly expenseRepository: ExpenseRepository,
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async getFinancialAnalysis(
    request: AIRequest,
  ): Promise<{ analysis: string; data: FinancialData }> {
    // Obtener datos financieros basados en el período
    const financialData = await this.getFinancialData(
      request.period,
      request.userGoal,
    );

    // Generar análisis usando IA
    const analysis = await this.generateAIResponse(
      financialData,
      request.userGoal,
    );

    return { analysis, data: financialData };
  }

  private async getFinancialData(
    period: string,
    userGoal?: string,
  ): Promise<FinancialData> {
    const { from, to, toForAI, days } = this.calculatePeriod(period);

    // Usar las fechas ISO directamente desde calculatePeriod
    const fromDate = new Date(from);
    const toDate = new Date(to);

    // Obtener ingresos del período usando repository
    const incomes = await this.incomeRepository.findByDateRange(
      fromDate,
      toDate,
    );

    // Obtener gastos del período con categorías usando repository
    const expenses = await this.expenseRepository.findByDateRange(
      fromDate,
      toDate,
    );

    // Transformar datos al formato requerido
    const transformedIncomes = incomes.map((income) => ({
      date: income.date.toISOString().split('T')[0],
      amount: income.amount,
      source: income.description || 'Sin descripción',
    }));

    const transformedExpenses = expenses.map((expense) => ({
      date: expense.date.toISOString().split('T')[0],
      amount: expense.amount,
      category: expense.category.name,
      fixed: this.isFixedExpense(expense.category.name),
      notes: expense.description || undefined,
    }));

    return {
      period: { from, to: toForAI, days },
      currency: 'ARS', // Por defecto, se puede hacer configurable
      incomes: transformedIncomes,
      expenses: transformedExpenses,
      user_profile: {
        household_size: 1, // Por defecto, se puede hacer configurable
        dependents: 0, // Por defecto, se puede hacer configurable
        has_debt: false, // Por defecto, se puede hacer configurable
        goals: userGoal ? [userGoal] : [], // Incluir la meta del usuario si existe
      },
    };
  }

  private calculatePeriod(period: string): {
    from: string;
    to: string;
    toForAI: string;
    days: number;
  } {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let from: Date;
    let days: number;

    switch (period) {
      case 'current_month':
        from = new Date(now.getFullYear(), now.getMonth(), 1);
        days = Math.ceil(
          (today.getTime() - from.getTime()) / (1000 * 60 * 60 * 24),
        );
        break;
      case 'last_month':
        from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        days = lastMonthEnd.getDate();
        break;
      case 'last_3_months':
        from = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        days = Math.ceil(
          (today.getTime() - from.getTime()) / (1000 * 60 * 60 * 24),
        );
        break;
      default:
        from = new Date(now.getFullYear(), now.getMonth(), 1);
        days = Math.ceil(
          (today.getTime() - from.getTime()) / (1000 * 60 * 60 * 24),
        );
    }

    // Asegurar que 'to' incluya todo el día actual (hasta las 23:59:59) para consultas DB
    const toDateForDB = new Date(today);
    toDateForDB.setHours(23, 59, 59, 999);

    // Para la IA, usar solo la fecha de hoy (sin hora)
    const toDateForAI = today.toISOString().split('T')[0];

    return {
      from: from.toISOString(),
      to: toDateForDB.toISOString(), // Para consultas DB
      toForAI: toDateForAI, // Para la IA
      days,
    };
  }

  private isFixedExpense(categoryName: string): boolean {
    const fixedCategories = [
      'Alquiler',
      'Servicios',
      'Streaming',
      'Seguros',
      'Préstamos',
      'Gimnasio',
    ];
    return fixedCategories.some((fixed) =>
      categoryName.toLowerCase().includes(fixed.toLowerCase()),
    );
  }

  private async generateAIResponse(
    data: FinancialData,
    userGoal?: string,
  ): Promise<string> {
    try {
      // Llamar a la API de OpenAI con el formato específico
      const res = await this.openai.responses.create({
        // Modelitos balanceados en costo/latencia: gpt-4o / gpt-4o-mini / o4-mini
        model: 'gpt-4o-mini',
        // "instrucciones" = comportamiento por defecto del asistente
        instructions: FINANCE_ADVISOR_PROMPT,
        // "input" = lo que varía por request
        input: [
          {
            role: 'user',
            content: [
              { type: 'input_text', text: 'Contexto (JSON):' },
              { type: 'input_text', text: JSON.stringify(data) },
              {
                type: 'input_text',
                text: `Tarea: Analiza estos datos financieros y proporciona recomendaciones específicas y accionables.`,
              },
            ],
          },
        ],
      });

      return res.output_text; // string listo para mostrar
    } catch (error) {
      // Fallback a respuesta simulada en caso de error
      return this.generateFallbackResponse(data, userGoal);
    }
  }

  private generateFallbackResponse(
    data: FinancialData,
    userGoal?: string,
  ): string {
    const totalIncome = data.incomes.reduce(
      (sum, income) => sum + income.amount,
      0,
    );
    const totalExpenses = data.expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );
    const balance = totalIncome - totalExpenses;

    let response = `📊 **Análisis Financiero - ${data.period.days} días**\n\n`;

    response += `💰 **Resumen:**\n`;
    response += `• Ingresos totales: $${totalIncome.toLocaleString()}\n`;
    response += `• Gastos totales: $${totalExpenses.toLocaleString()}\n`;
    response += `• Balance: $${balance.toLocaleString()}\n\n`;

    if (userGoal) {
      response += `🎯 **Tu meta:** ${userGoal}\n\n`;
    }

    response += `💡 **Recomendaciones:**\n`;

    if (balance < 0) {
      response += `• ⚠️ Tienes un déficit de $${Math.abs(balance).toLocaleString()}. Considera reducir gastos o aumentar ingresos.\n`;
    } else {
      response += `• ✅ Excelente! Tienes un superávit de $${balance.toLocaleString()}.\n`;
    }

    response += `\n*Nota: El servicio de IA no está disponible temporalmente. Esta es una respuesta básica.*`;

    return response;
  }
}
