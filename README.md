# listsearch

```
//pug g.js 
script(src="https://gnjo.github.io/_g/g.js?repo=minire")

let img= new Image()
img.src=_g('xyz.png')
document.body.appendChild(img)
```
```
function getrepo(){
 return fn.qa('script').filter(d=>/_g\.js/.test(d.src)).map(d=>d.src.split('=').pop())
}

let repo=getrepo()

```
