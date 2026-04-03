// Component placement validator for enforcing organization rules

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

interface ComponentPlacement {
  name: string;
  currentPath: string;
  targetPath: string;
}

const categoryRules = {
  common: {
    allowedDependencies: ['ui'],
    prohibitedDependencies: ['proposals', 'voting', 'dashboard', 'wallet', 'charts', 'forms'],
    description: 'Reusable UI components with no feature-specific logic',
  },
  proposals: {
    allowedDependencies: ['common', 'ui', 'charts', 'forms'],
    prohibitedDependencies: ['voting', 'dashboard', 'wallet'],
    description: 'All proposal-related components and forms',
  },
  voting: {
    allowedDependencies: ['common', 'ui', 'charts', 'forms', 'proposals'],
    prohibitedDependencies: ['dashboard', 'wallet'],
    description: 'Voting and delegation components',
  },
  dashboard: {
    allowedDependencies: ['common', 'ui', 'charts', 'proposals', 'voting', 'forms'],
    prohibitedDependencies: ['wallet'],
    description: 'User dashboard and profile pages',
  },
  wallet: {
    allowedDependencies: ['common', 'ui'],
    prohibitedDependencies: ['proposals', 'voting', 'dashboard', 'charts', 'forms'],
    description: 'Wallet integration components',
  },
  charts: {
    allowedDependencies: ['common', 'ui'],
    prohibitedDependencies: ['proposals', 'voting', 'dashboard', 'wallet', 'forms'],
    description: 'Data visualization components',
  },
  forms: {
    allowedDependencies: ['common', 'ui'],
    prohibitedDependencies: ['proposals', 'voting', 'dashboard', 'wallet', 'charts'],
    description: 'Generic form components and inputs',
  },
};

export const validateComponentPlacement = (
  component: ComponentPlacement,
  dependencies: string[],
): ValidationResult => {
  const result: ValidationResult = { valid: true, errors: [], warnings: [] };

  const targetCategory = component.targetPath.split('/').pop() as keyof typeof categoryRules;
  const rules = categoryRules[targetCategory];

  if (!rules) {
    result.errors.push(`Unknown target category: ${targetCategory}`);
    result.valid = false;
    return result;
  }

  dependencies.forEach(dep => {
    const depCategory = dep.split('/')[0];

    if (rules.prohibitedDependencies.includes(depCategory)) {
      result.errors.push(
        `${component.name} in ${targetCategory} cannot depend on ${depCategory}`,
      );
      result.valid = false;
    }

    if (!rules.allowedDependencies.includes(depCategory) && depCategory !== targetCategory) {
      result.warnings.push(
        `${component.name} depends on ${depCategory} which is not in allowed list`,
      );
    }
  });

  return result;
};

export const validateCategoryStructure = (
  files: Map<string, string[]>,
): Map<string, ValidationResult> => {
  const results = new Map<string, ValidationResult>();

  files.forEach((dependencies, filePath) => {
    const parts = filePath.split('/');
    const category = parts[parts.length - 2];
    const fileName = parts[parts.length - 1];

    const result = validateComponentPlacement(
      { name: fileName, currentPath: filePath, targetPath: category },
      dependencies,
    );

    results.set(filePath, result);
  });

  return results;
};

export const enforcePlacementRules = (component: ComponentPlacement, deps: string[]): boolean => {
  const validation = validateComponentPlacement(component, deps);
  return validation.valid;
};

export const getCategoryDescription = (category: keyof typeof categoryRules): string => {
  return categoryRules[category]?.description || 'Unknown category';
};

export const getAllowedDependencies = (category: keyof typeof categoryRules): string[] => {
  return categoryRules[category]?.allowedDependencies || [];
};

export const getProhibitedDependencies = (category: keyof typeof categoryRules): string[] => {
  return categoryRules[category]?.prohibitedDependencies || [];
};
