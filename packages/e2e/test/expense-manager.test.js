import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { ApiClient, sleep, generateRandomString } from '../test-utils.js';

describe('Expense Manager E2E Tests', () => {
  let api;
  let createdCategoryId;
  let createdExpenseId;
  let createdIncomeId;

  before(async () => {
    api = new ApiClient();

    // Wait for the application to be ready
    console.log('⏳ Waiting for application to be ready...');
    let retries = 30;
    while (retries > 0) {
      try {
        const health = await api.healthCheck();
        if (health.ok) {
          console.log('✅ Application is ready!');
          break;
        }
      } catch (error) {
        // Application not ready yet
      }
      await sleep(1000);
      retries--;
    }

    if (retries === 0) {
      throw new Error('Application did not start within 30 seconds');
    }
  });

  after(async () => {
    // Clean up created data
    console.log('🧹 Cleaning up test data...');

    if (createdExpenseId) {
      try {
        await api.deleteExpense(createdExpenseId);
        console.log('✅ Cleaned up expense');
      } catch (error) {
        console.log('⚠️  Could not clean up expense:', error.message);
      }
    }

    if (createdIncomeId) {
      try {
        await api.deleteIncome(createdIncomeId);
        console.log('✅ Cleaned up income');
      } catch (error) {
        console.log('⚠️  Could not clean up income:', error.message);
      }
    }

    if (createdCategoryId) {
      try {
        await api.deleteCategory(createdCategoryId);
        console.log('✅ Cleaned up category');
      } catch (error) {
        console.log('⚠️  Could not clean up category:', error.message);
      }
    }
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await api.healthCheck();

      assert.strictEqual(response.status, 200);
      assert.strictEqual(response.data.status, 'ok');
      assert.strictEqual(response.data.test, 'test');
      assert.ok(response.data.timestamp);
      assert.ok(typeof response.data.uptime === 'number');
    });
  });

  describe('Balance Validation', () => {
    it('should reject expense creation with insufficient balance', async () => {
      // First create a category for the test
      const categoryResponse = await api.createCategory(
        'Test Category for Balance'
      );
      const testCategoryId = categoryResponse.data.id;

      // Try to create an expense without any income (balance = 0)
      const response = await api.createExpense(100, testCategoryId);

      assert.strictEqual(response.status, 400);
      assert.ok(response.data);
      assert.ok(response.data.message.includes('Balance insuficiente'));

      // Clean up the test category
      await api.deleteCategory(testCategoryId);
    });
  });

  describe('Categories Flow', () => {
    it('should start with empty categories list', async () => {
      const response = await api.getCategories();

      assert.strictEqual(response.status, 200);
      assert.ok(Array.isArray(response.data));
      assert.strictEqual(response.data.length, 0);
    });

    it('should create a new category', async () => {
      const categoryName = `Test Category ${generateRandomString()}`;
      const response = await api.createCategory(categoryName);

      assert.strictEqual(response.status, 201);
      assert.strictEqual(response.data.name, categoryName);
      assert.ok(response.data.id);
      assert.ok(response.data._count);

      createdCategoryId = response.data.id;
    });

    it('should retrieve the created category', async () => {
      const response = await api.getCategory(createdCategoryId);

      assert.strictEqual(response.status, 200);
      assert.strictEqual(response.data.id, createdCategoryId);
      assert.ok(response.data.name);
    });

    it('should list categories with the created one', async () => {
      const response = await api.getCategories();

      assert.strictEqual(response.status, 200);
      assert.ok(Array.isArray(response.data));
      assert.strictEqual(response.data.length, 1);
      assert.strictEqual(response.data[0].id, createdCategoryId);
    });

    it('should update the category', async () => {
      const newName = `Updated Category ${generateRandomString()}`;
      const response = await api.updateCategory(createdCategoryId, newName);

      assert.strictEqual(response.status, 200);
      assert.strictEqual(response.data.name, newName);
      assert.strictEqual(response.data.id, createdCategoryId);
    });
  });

  describe('Expenses Flow', () => {
    it('should start with empty expenses list', async () => {
      const response = await api.getExpenses();

      assert.strictEqual(response.status, 200);
      assert.ok(Array.isArray(response.data));
      assert.strictEqual(response.data.length, 0);
    });

    it('should create a new expense', async () => {
      // First create an income to have sufficient balance
      const incomeData = {
        amount: 100,
        description: 'Test income for expense',
      };
      const incomeResponse = await api.createIncome(
        incomeData.amount,
        incomeData.description
      );
      assert.strictEqual(incomeResponse.status, 201);
      createdIncomeId = incomeResponse.data.id;

      // Now create the expense
      const expenseData = {
        amount: 25.5,
        categoryId: createdCategoryId,
        description: 'Test expense for coffee',
      };

      const response = await api.createExpense(
        expenseData.amount,
        expenseData.categoryId,
        expenseData.description
      );

      assert.strictEqual(response.status, 201);
      assert.strictEqual(response.data.amount, expenseData.amount);
      assert.strictEqual(response.data.description, expenseData.description);
      assert.strictEqual(response.data.categoryId, expenseData.categoryId);
      assert.ok(response.data.id);
      assert.ok(response.data.category);

      createdExpenseId = response.data.id;
    });

    it('should retrieve the created expense', async () => {
      const response = await api.getExpense(createdExpenseId);

      assert.strictEqual(response.status, 200);
      assert.strictEqual(response.data.id, createdExpenseId);
      assert.strictEqual(response.data.amount, 25.5);
      assert.ok(response.data.category);
    });

    it('should list expenses with the created one', async () => {
      const response = await api.getExpenses();

      assert.strictEqual(response.status, 200);
      assert.ok(Array.isArray(response.data));
      assert.strictEqual(response.data.length, 1);
      assert.strictEqual(response.data[0].id, createdExpenseId);
    });

    it('should update the expense', async () => {
      const updateData = {
        amount: 30.0,
        description: 'Updated expense description',
      };

      const response = await api.updateExpense(createdExpenseId, updateData);

      assert.strictEqual(response.status, 200);
      assert.strictEqual(response.data.amount, updateData.amount);
      assert.strictEqual(response.data.description, updateData.description);
      assert.strictEqual(response.data.id, createdExpenseId);
    });
  });

  describe('Incomes Flow', () => {
    it('should start with one income from expenses test', async () => {
      const response = await api.getIncomes();

      assert.strictEqual(response.status, 200);
      assert.ok(Array.isArray(response.data));
      assert.strictEqual(response.data.length, 1);
    });

    it('should create a new income', async () => {
      const incomeData = {
        amount: 1000.0,
        description: 'Test salary income',
      };

      const response = await api.createIncome(
        incomeData.amount,
        incomeData.description
      );

      assert.strictEqual(response.status, 201);
      assert.strictEqual(response.data.amount, incomeData.amount);
      assert.strictEqual(response.data.description, incomeData.description);
      assert.ok(response.data.id);

      createdIncomeId = response.data.id;
    });

    it('should retrieve the created income', async () => {
      const response = await api.getIncome(createdIncomeId);

      assert.strictEqual(response.status, 200);
      assert.strictEqual(response.data.id, createdIncomeId);
      assert.strictEqual(response.data.amount, 1000.0);
    });

    it('should list incomes with the created one', async () => {
      const response = await api.getIncomes();

      assert.strictEqual(response.status, 200);
      assert.ok(Array.isArray(response.data));
      assert.strictEqual(response.data.length, 2); // 1 from expenses test + 1 from this test

      // Find the income created in this test
      const createdIncome = response.data.find(
        income => income.id === createdIncomeId
      );
      assert.ok(createdIncome);
      assert.strictEqual(createdIncome.id, createdIncomeId);
    });

    it('should update the income', async () => {
      const updateData = {
        amount: 1200.0,
        description: 'Updated salary income',
      };

      const response = await api.updateIncome(createdIncomeId, updateData);

      assert.strictEqual(response.status, 200);
      assert.strictEqual(response.data.amount, updateData.amount);
      assert.strictEqual(response.data.description, updateData.description);
      assert.strictEqual(response.data.id, createdIncomeId);
    });
  });

  describe('Statistics Flow', () => {
    it('should get statistics summary', async () => {
      const response = await api.getStatistics();

      assert.strictEqual(response.status, 200);
      assert.ok(response.data);

      // Should have some basic statistics structure
      assert.ok(typeof response.data === 'object');
    });
  });

  describe('Error Handling', () => {
    it('should handle non-existent category', async () => {
      const response = await api.getCategory('non-existent-id');

      assert.strictEqual(response.status, 404);
      assert.ok(response.data);
      assert.ok(response.data.message.includes('not found'));
    });

    it('should handle non-existent expense', async () => {
      const response = await api.getExpense('non-existent-id');

      assert.strictEqual(response.status, 404);
      assert.ok(response.data);
      assert.ok(response.data.message.includes('not found'));
    });

    it('should handle non-existent income', async () => {
      const response = await api.getIncome('non-existent-id');

      assert.strictEqual(response.status, 404);
      assert.ok(response.data);
      assert.ok(response.data.message.includes('not found'));
    });

    it('should reject invalid expense creation without category', async () => {
      const response = await api.createExpense(100, 'invalid-category-id');

      assert.strictEqual(response.status, 400);
      assert.ok(response.data);
    });
  });

  describe('Data Integrity', () => {
    it('should maintain data consistency across operations', async () => {
      // Get current counts
      const categoriesResponse = await api.getCategories();
      const expensesResponse = await api.getExpenses();
      const incomesResponse = await api.getIncomes();

      // We should have 1 category, 1 expense, and 2 incomes (1 from Incomes Flow + 1 from Expenses Flow)
      assert.strictEqual(categoriesResponse.data.length, 1);
      assert.strictEqual(expensesResponse.data.length, 1);
      assert.strictEqual(incomesResponse.data.length, 2);

      // Verify the expense is linked to the correct category
      const expense = expensesResponse.data[0];
      assert.strictEqual(expense.categoryId, createdCategoryId);
      assert.ok(expense.category);
      assert.strictEqual(expense.category.id, createdCategoryId);
    });
  });
});
