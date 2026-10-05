const fs = require('fs');
const path = require('path');

const read = p => fs.readFileSync(path.join(__dirname, '..', p), 'utf8');

const HOME = 'src/kshope/screens/Home/redesign/HomeRedesignScreen.tsx';
const SKELETON = 'src/kshope/screens/Home/HomeSkeleton.tsx';

test('the home loading state is the skeleton, not a bare spinner', () => {
  const source = read(HOME);
  expect(source).toMatch(/if \(loading\) \{[\s\S]*?<HomeSkeleton \/>[\s\S]*?\n  \}/);
  expect(source).not.toMatch(/ActivityIndicator/);
});

test('the skeleton mirrors the header background so the loaded screen does not jump', () => {
  const source = read(SKELETON);
  expect(source).toMatch(/backgroundColor: UI_COLORS\.canvas/);
});

test('the skeleton draws its blocks with the shared Shimmer atom', () => {
  expect(read(SKELETON)).toMatch(
    /import \{ Shimmer \} from '\.\.\/\.\.\/components\/atoms'/,
  );
  expect(read('src/kshope/components/atoms/index.ts')).toMatch(
    /export \{ default as Shimmer \} from '\.\/Shimmer'/,
  );
});
