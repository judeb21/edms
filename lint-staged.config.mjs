export default {
  "*.{ts,tsx,js,jsx}": ["pnpm exec eslint --max-warnings=0", "git add"],
  "*.{css,scss,md,mdx}": ["pnpm exec prettier --write", "git add"],
};