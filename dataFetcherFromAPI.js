const rawData = require("./dataFromFavorites.json");
const fetch = require("node-fetch");
let it = 0;
let newData = [];
(async function getData(){
    newData = [...newData,...await (fetch("https://api.e-hentai.org/api.php",{method:"POST",body:JSON.stringify({
        "method": "gdata",
        "gidlist": rawData.slice(it,it+=10).map((val)=>{
            let res = val.url.match(/https:\/\/exhentai.org\/g\/(.*)\/(.*)\//);
            return [parseInt(res[1]),res[2]]
        }),
        "namespace": 1
      })}).then(p=>p.json()).then(p=>p["gmetadata"]).then(p=>p.map(val=>({...val,url:`https://exhentai.org/g/${val.gid}/${val.token}/`}))))];
    it<rawData.length ?  (getData()) : require("fs").writeFileSync("./public/dataFromAPI.json",JSON.stringify(newData.filter(a=>require("process").env['NSFW']||(a['category']==='Non-H'))));
})();
