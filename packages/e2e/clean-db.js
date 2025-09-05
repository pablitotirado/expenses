// Script para limpiar la base de datos antes de ejecutar tests
import { ApiClient } from './test-utils.js';

const api = new ApiClient();

async function cleanDatabase() {
  console.log('🧹 Limpiando base de datos...');

  try {
    // Obtener todos los datos existentes
    const [expenses, incomes, categories] = await Promise.all([
      api.getExpenses(),
      api.getIncomes(),
      api.getCategories(),
    ]);

    // Eliminar gastos
    if (expenses.ok && expenses.data.length > 0) {
      console.log(`🗑️  Eliminando ${expenses.data.length} gastos...`);
      for (const expense of expenses.data) {
        try {
          await api.deleteExpense(expense.id);
        } catch (error) {
          console.log(
            `⚠️  No se pudo eliminar gasto ${expense.id}:`,
            error.message
          );
        }
      }
    }

    // Eliminar ingresos
    if (incomes.ok && incomes.data.length > 0) {
      console.log(`🗑️  Eliminando ${incomes.data.length} ingresos...`);
      for (const income of incomes.data) {
        try {
          await api.deleteIncome(income.id);
        } catch (error) {
          console.log(
            `⚠️  No se pudo eliminar ingreso ${income.id}:`,
            error.message
          );
        }
      }
    }

    // Eliminar categorías
    if (categories.ok && categories.data.length > 0) {
      console.log(`🗑️  Eliminando ${categories.data.length} categorías...`);
      for (const category of categories.data) {
        try {
          await api.deleteCategory(category.id);
        } catch (error) {
          console.log(
            `⚠️  No se pudo eliminar categoría ${category.id}:`,
            error.message
          );
        }
      }
    }

    console.log('✅ Base de datos limpiada exitosamente');
  } catch (error) {
    console.error('❌ Error limpiando la base de datos:', error.message);
    process.exit(1);
  }
}

cleanDatabase();
