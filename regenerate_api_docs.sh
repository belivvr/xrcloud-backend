# HTML 문서 생성 (한국어)
npx @redocly/cli build-docs ./docs/api/ko/api.json 
rm -rf ./docs/api/ko/index.html
mv redoc-static.html ./docs/api/ko/index.html

# 마크다운 문서 생성 (한국어)
npx widdershins --language_tabs 'javascript:JavaScript' 'python:Python' --summary ./docs/api/ko/api.json -o ./docs/api/ko/api.md

# HTML 문서 생성 (영어)
npx @redocly/cli build-docs ./docs/api/en/api.json 
rm -rf ./docs/api/en/index.html
mv redoc-static.html ./docs/api/en/index.html

# 마크다운 문서 생성 (영어)
npx widdershins --language_tabs 'javascript:JavaScript' 'python:Python' --summary ./docs/api/en/api.json -o ./docs/api/en/api.md
