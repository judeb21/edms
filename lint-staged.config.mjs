export default {
  "*.{ts,tsx,js,jsx}": ["pnpm exec eslint --max-warnings=0"],
  "*.{css,scss,md,mdx}": ["pnpm exec prettier --write"]
};