import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // Базовые настройки
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,

  // Настройки для специфичных файлов
  {
    files: ['**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off'
    }
  }
);