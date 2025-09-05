import { FINANCE_ADVISOR_PROMPT } from './finance-advisor';

describe('FINANCE_ADVISOR_PROMPT', () => {
  it('should be defined', () => {
    expect(FINANCE_ADVISOR_PROMPT).toBeDefined();
  });

  it('should be a string', () => {
    expect(typeof FINANCE_ADVISOR_PROMPT).toBe('string');
  });

  it('should not be empty', () => {
    expect(FINANCE_ADVISOR_PROMPT.length).toBeGreaterThan(0);
  });

  it('should contain key sections', () => {
    const prompt = FINANCE_ADVISOR_PROMPT;

    // Check for main sections
    expect(prompt).toContain('Eres un asesor financiero experto');
    expect(prompt).toContain('## Contexto del Usuario:');
    expect(prompt).toContain('## Datos Financieros:');
    expect(prompt).toContain('## Instrucciones:');
    expect(prompt).toContain('## Formato de respuesta:');
    expect(prompt).toContain('## Consideraciones importantes:');
    expect(prompt).toContain('## Estructura de respuesta recomendada:');
  });

  it('should contain placeholder variables for data interpolation', () => {
    const prompt = FINANCE_ADVISOR_PROMPT;

    // Check for placeholder variables
    expect(prompt).toContain('{period}');
    expect(prompt).toContain('{currency}');
    expect(prompt).toContain('{household_size}');
    expect(prompt).toContain('{dependents}');
    expect(prompt).toContain('{has_debt}');
    expect(prompt).toContain('{goals}');
    expect(prompt).toContain('{incomes}');
    expect(prompt).toContain('{expenses}');
  });

  it('should contain formatting instructions', () => {
    const prompt = FINANCE_ADVISOR_PROMPT;

    // Check for formatting instructions
    expect(prompt).toContain('Usa emojis estratégicamente');
    expect(prompt).toContain('Estructura la respuesta en secciones claras');
    expect(prompt).toContain('Usa listas con viñetas');
    expect(prompt).toContain('Usa **negrita** para destacar');
    expect(prompt).toContain('formato markdown');
  });

  it('should contain response structure template', () => {
    const prompt = FINANCE_ADVISOR_PROMPT;

    // Check for response structure
    expect(prompt).toContain('## 📊 Resumen Ejecutivo');
    expect(prompt).toContain('## 💰 Análisis de Ingresos');
    expect(prompt).toContain('## 💸 Análisis de Gastos');
    expect(prompt).toContain('## 🎯 Recomendaciones Clave');
    expect(prompt).toContain('## 🚀 Acciones Inmediatas');
  });

  it('should contain professional tone instructions', () => {
    const prompt = FINANCE_ADVISOR_PROMPT;

    // Check for professional tone instructions
    expect(prompt).toContain('Mantén un tono profesional pero accesible');
    expect(prompt).toContain('Sé empático y comprensivo');
    expect(prompt).toContain('No juzgues los gastos del usuario');
    expect(prompt).toContain('Enfócate en soluciones prácticas');
  });

  it('should contain specific formatting requirements', () => {
    const prompt = FINANCE_ADVISOR_PROMPT;

    // Check for specific formatting requirements
    expect(prompt).toContain(
      '**IMPORTANTE**: La respuesta debe tener un formato perfecto',
    );
    expect(prompt).toContain('**NO incluyas espacios innecesarios**');
    expect(prompt).toContain('**NO uses líneas vacías**');
    expect(prompt).toContain('Mantén el texto compacto pero legible');
  });

  it('should contain Argentina-specific context', () => {
    const prompt = FINANCE_ADVISOR_PROMPT;

    // Check for Argentina-specific context
    expect(prompt).toContain(
      'Considera el contexto económico local (Argentina)',
    );
  });

  it('should have proper markdown formatting', () => {
    const prompt = FINANCE_ADVISOR_PROMPT;

    // Check for markdown formatting
    expect(prompt).toContain('## '); // Headers
    expect(prompt).toContain('**'); // Bold text
    expect(prompt).toContain('- '); // Bullet points
    expect(prompt).toContain('1. '); // Numbered lists
  });

  it('should be well-structured and readable', () => {
    const prompt = FINANCE_ADVISOR_PROMPT;

    // Check that it has reasonable length (not too short, not too long)
    expect(prompt.length).toBeGreaterThan(1000);
    expect(prompt.length).toBeLessThan(10000);

    // Check that it has proper line breaks
    expect(prompt).toContain('\n');

    // Check that it doesn't have excessive whitespace (allow up to 20% empty lines)
    const lines = prompt.split('\n');
    const emptyLines = lines.filter((line) => line.trim() === '');
    expect(emptyLines.length).toBeLessThan(lines.length * 0.2); // Less than 20% empty lines
  });
});
