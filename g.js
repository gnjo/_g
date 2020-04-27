/*history
v0.1 
*/
;(function(root){
 let fn={}
 fn.qa=(s,doc=document)=>{return [].slice.call(doc.querySelectorAll(s))}

 function istile(str){return /\.x([0-9]*)\./.test(str)}
 function gettilenum(name){return parseInt(name.match(/\.x([0-9]*)\./).pop())}
 async function loadtile(url,num){return new Promise(caller=>{
  let size=num
  let img=new Image()
  img.crossOrigin = "Anonymous"; 
  img.onload=calc;
  img.src=url
  let loaded=0
  let images=[]
  function calc(){
   var canvas = document.createElement( 'canvas' );
   canvas.width=canvas.height=size
   var context = canvas.getContext( '2d' );
   let cellw=parseInt(img.naturalWidth/size)
   let cellh=parseInt(img.naturalHeight/size)
   for(let y=0;y<cellh;y++)
    for(let x=0;x<cellw;x++){
     context.drawImage(img, x*size, y*size, size, size, 0, 0, size, size);
     images[loaded] = canvas.toDataURL() 
     loaded++;
    }
   /*
  for(;loaded<6;loaded++){
   context.drawImage(img, loaded*size, 0, size, size, 0, 0, size, size);
   images[loaded] = canvas.toDataURL() 
  }
*/  
   return caller(images);
  }
  return images;
 })}
 function getrepo(){
  return fn.qa('script').filter(d=>/g\.js/.test(d.src)).map(d=>d.src.split('=').pop()).pop()
 }

 async function getfiles(user,token,repo,max){
  let url=`https://api.github.com/repos/${user}/${repo}/contents/?per_page=${max}`
  let updatetime;
  let list=await fetch(url,{Authorization:`token ${token}`}).then(d=>{
   updatetime=d.headers.get("last-modified")
   console.log(updatetime)
   return d.json()
  })
  //data,filetype
  for(let wk of list){
   wk.filetype=wk.name.split('.').pop()
   let t=wk.filetype,u=wk.download_url
   if(/png|gif|jpg|jpeg|ogg|mp4|mp3|mpeg|avi/.test(t)){
    wk.data=URL.createObjectURL( await fetch(u).then(d=>d.blob()) )
   }
   if(/json/.test(t))
    wk.data=await fetch(u).then(d=>d.json())
   /*tile*/
   if(!wk.data)
    wk.data=await fetch(u).then(d=>d.text())
  }

  /*tilemake*/
  let ary=list.filter(d=>istile(d.name))
  for(let wk of ary){
   let url=wk.data
   let name=wk.name
   console.log(name)
   let num=gettilenum(name)
   let repstr='x'+num
   let images=await loadtile(url,num)
   let i=0
   for(let u of images){
    let obj={}
    obj.data=URL.createObjectURL( await fetch(u).then(d=>d.blob()) )
    obj.name=name.replace(repstr,i)
    list.push(obj)
    i++;
    //console.log(obj)
   }
  }

  return list;
 }
 let user='gnjo' 
 let token='ed1835b2779c35828927f20a505c836df190c299'
 let repo=getrepo()
 let max=100*10
 let list=void 0;
 function _g(name){
  let o=list.filter(d=>d.name===name).pop();
  if(o)return o.data
  console.log('_g unkown name',name)
 }
 ;
 getfiles(user,token,repo,max).then(d=>{
  list=d;
  let nameary=list.map(d=>d.name)
  console.log(nameary)
  root._glist=list
 })
 root._g=_g
 //root._glist=list //
})(this); 
