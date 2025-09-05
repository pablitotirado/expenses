const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

export class ApiClient {
  constructor(baseUrl = BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json().catch(() => null);

    return {
      status: response.status,
      data,
      ok: response.ok,
    };
  }

  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  async post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async patch(endpoint, body) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Health check
  async healthCheck() {
    return this.get('/health');
  }

  // Categories
  async createCategory(name) {
    return this.post('/categories', { name });
  }

  async getCategories() {
    return this.get('/categories');
  }

  async getCategory(id) {
    return this.get(`/categories/${id}`);
  }

  async updateCategory(id, name) {
    return this.patch(`/categories/${id}`, { name });
  }

  async deleteCategory(id) {
    return this.delete(`/categories/${id}`);
  }

  // Expenses
  async createExpense(amount, categoryId, description = null) {
    return this.post('/expenses', {
      amount,
      categoryId,
      description,
    });
  }

  async getExpenses() {
    return this.get('/expenses');
  }

  async getExpense(id) {
    return this.get(`/expenses/${id}`);
  }

  async updateExpense(id, data) {
    return this.patch(`/expenses/${id}`, data);
  }

  async deleteExpense(id) {
    return this.delete(`/expenses/${id}`);
  }

  // Incomes
  async createIncome(amount, description = null) {
    return this.post('/incomes', {
      amount,
      description,
    });
  }

  async getIncomes() {
    return this.get('/incomes');
  }

  async getIncome(id) {
    return this.get(`/incomes/${id}`);
  }

  async updateIncome(id, data) {
    return this.patch(`/incomes/${id}`, data);
  }

  async deleteIncome(id) {
    return this.delete(`/incomes/${id}`);
  }

  // Statistics
  async getStatistics() {
    return this.get('/statistics/summary');
  }
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function generateRandomString(length = 8) {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}
