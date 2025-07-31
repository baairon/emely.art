# emely.art  

A clean, lightweight portfolio site built with React and GitHub Pages.  
It will host the artwork of an aspiring tattoo professional whose goal is to build a well-paid career in tattooing.  

## Live site  

<https://emely.art>  

## Build workflow (internal)  

```bash
# 1- Build the new static files
npm run build

# 2- Replace docs with the fresh build
rm -rf docs && mkdir docs
cp -r build/* docs/

# 3- Stage every change (code + docs)
git add -A            # or `git add .`

# 4- Commit and ship it
git commit -m "Site and docs update"
git push
```  

## Folder overview  

| Path      | Purpose                              |
|-----------|--------------------------------------|
| `src/`    | React source code                    |
| `public/` | CRA public assets                    |
| `docs/`   | Static files served by GitHub Pages  |  

## License  

MIT © Bairon Recinos  
