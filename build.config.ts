import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: [
    { input: 'src/', outDir: 'dist/', format: 'cjs', ext: 'cjs' },
    { input: 'src/', outDir: 'dist/', format: 'esm' },
  ],
  declaration: true, // generate .d.ts files
});
