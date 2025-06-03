#!/usr/bin/env node

import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

/**
 * Fixes ANTLR-generated TypeScript imports to be ES module compatible
 * by adding .js extensions to antlr4ts imports
 */
async function fixAntlrImports() {
  const antlrDir = 'src/antlr';

  try {
    const files = await readdir(antlrDir);
    const tsFiles = files.filter(file => file.endsWith('.ts'));

    for (const file of tsFiles) {
      const filePath = join(antlrDir, file);
      let content = await readFile(filePath, 'utf8');
      let modified = false;

      // Fix antlr4ts imports - add .js extension
      const antlrImportRegex = /from\s+["']antlr4ts\/([^"']+)["']/g;
      const newContent = content.replace(antlrImportRegex, (match, path) => {
        modified = true;
        return `from "antlr4ts/${path}.js"`;
      });

      // Fix relative imports to other generated files
      const relativeImportRegex = /from\s+["']\.\/([^"']+)["']/g;
      const finalContent = newContent.replace(relativeImportRegex, (match, path) => {
        // Only add .js if it doesn't already have an extension
        if (!path.includes('.')) {
          modified = true;
          return `from "./${path}.js"`;
        }
        return match;
      });

      if (modified) {
        await writeFile(filePath, finalContent, 'utf8');
        console.log(`Fixed imports in ${file}`);
      }
    }

    console.log('✅ ANTLR import fixing completed');
  } catch (error) {
    console.error('❌ Error fixing ANTLR imports:', error);
    process.exit(1);
  }
}

fixAntlrImports();
