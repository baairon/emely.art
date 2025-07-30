# emely.art  

A clean, lightweight portfolio site built with React and GitHub Pages.  
It will host the artwork of an aspiring tattoo professional whose goal is to build a well-paid career in tattooing.  

## Live site  

<https://emely.art>  

## Build workflow (internal)  

```bash
npm run build  

rm -rf docs && mkdir docs  

cp -r build/* docs/  

git add docs  

git commit -m "Site update"  

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
