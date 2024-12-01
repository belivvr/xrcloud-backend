npx @redocly/cli build-docs ./docs/api/ko/api.json 
mv redoc-static.html ./docs/api/ko/index.html
npx @redocly/cli build-docs ./docs/api/en/api.json 
mv redoc-static.html ./docs/api/en/index.html