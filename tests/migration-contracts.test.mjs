import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('browser environment variables use the Next public prefix', () => {
  const files = ['src/api.js', 'src/utils/imageUrl.js', 'src/Components/BuyingPage.js'];
  for (const file of files) assert.doesNotMatch(read(file), /REACT_APP_/);
});

test('category pages resolve their route parameters rather than navigation state', () => {
  assert.match(read('src/Components/SubCategories.js'), /useParams/);
  assert.match(read('src/Components/MiniCategory.js'), /const \{ id, subcat \} = useParams\(\)/);
});
