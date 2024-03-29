process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const JSDOM = require("jsdom").JSDOM;
const EHParser = require("./eh-parser");
const fetch = require("node-fetch");
let data = [];
(async function getData(url){
    let content = await (fetch(url,{method:"GET",headers:{"Cookie":require("process").env["EX_COOKIE"]}}).then(data=>data.text()));
    let res = EHParser.parseSearchPage((new JSDOM(content)).window.document);
    data = [...data,...(res.results)];
    if(res.next) 
        getData(res.next)
    else
        require("fs").writeFileSync("./dataFromFavorites.json",JSON.stringify(data));
})("https://exhentai.org/favorites.php");
