npx @redocly/cli build-docs ./docs/api/ko/api.json 
rm -rf ./docs/api/ko/index.html
mv redoc-static.html ./docs/api/ko/index.html
npx @redocly/cli build-docs ./docs/api/en/api.json 
rm -rf ./docs/api/en/index.html
mv redoc-static.html ./docs/api/en/index.html
