import axios from '../lib/axios';

export interface AIRequest {
  period: string;
  userGoal?: string;
}

export interface AIResponse {
  analysis: string;
  data: {
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
  };
}

export const aiService = {
  async getFinancialAnalysis(request: AIRequest): Promise<AIResponse> {
    try {
      const response = await axios.post('/ia', request);

      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
};
