// Dependency analysis utilities for safe component migration
// Ensures components can be moved without breaking circular imports

interface ComponentDependency {
  component: string;
  imports: string[];
  importedBy: string[];
}

export const analyzeDependencies = (components: Map<string, string[]>): Map<string, ComponentDependency> => {
  const analysis = new Map<string, ComponentDependency>();

  components.forEach((imports, component) => {
    analysis.set(component, {
      component,
      imports: imports || [],
      importedBy: [],
    });
  });

  components.forEach((imports, fromComponent) => {
    imports.forEach(toComponent => {
      const dep = analysis.get(toComponent);
      if (dep) {
        dep.importedBy.push(fromComponent);
      }
    });
  });

  return analysis;
};

export const detectCircularDependencies = (
  analysis: Map<string, ComponentDependency>,
): string[][] => {
  const cycles: string[][] = [];
  const visited = new Set<string>();

  const hasCycle = (component: string, path: string[] = []): boolean => {
    if (path.includes(component)) {
      cycles.push([...path, component]);
      return true;
    }

    if (visited.has(component)) return false;

    visited.add(component);
    const deps = analysis.get(component);

    if (deps) {
      for (const dep of deps.imports) {
        if (hasCycle(dep, [...path, component])) return true;
      }
    }

    return false;
  };

  analysis.forEach((_, component) => {
    hasCycle(component);
  });

  return cycles;
};

export const getSafeMigrationOrder = (
  analysis: Map<string, ComponentDependency>,
): string[] => {
  const sorted: string[] = [];
  const visited = new Set<string>();
  const visiting = new Set<string>();

  const visit = (component: string) => {
    if (visited.has(component)) return;
    if (visiting.has(component)) {
      console.warn(`Circular dependency detected involving ${component}`);
      return;
    }

    visiting.add(component);

    const deps = analysis.get(component);
    if (deps) {
      deps.imports.forEach(dep => {
        if (!visited.has(dep)) {
          visit(dep);
        }
      });
    }

    visiting.delete(component);
    visited.add(component);
    sorted.push(component);
  };

  analysis.forEach((_, component) => {
    visit(component);
  });

  return sorted;
};

export const validateMigrationPath = (
  fromComponent: string,
  analysis: Map<string, ComponentDependency>,
): { safe: boolean; conflicts: string[] } => {
  const conflicts: string[] = [];
  const deps = analysis.get(fromComponent);

  if (deps) {
    deps.importedBy.forEach(importer => {
      const importerDeps = analysis.get(importer);
      if (importerDeps && importerDeps.imports.includes(fromComponent)) {
        conflicts.push(importer);
      }
    });
  }

  return { safe: conflicts.length === 0, conflicts };
};

export const generateDependencyGraph = (
  analysis: Map<string, ComponentDependency>,
): string => {
  let graph = 'digraph ComponentDependencies {\n';
  graph += '  rankdir=LR;\n';
  graph += '  node [shape=box];\n\n';

  analysis.forEach(dep => {
    dep.imports.forEach(importedComponent => {
      graph += `  "${dep.component}" -> "${importedComponent}";\n`;
    });
  });

  graph += '}\n';

  return graph;
};
