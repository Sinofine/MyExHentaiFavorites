//import { register } from "https://cdn.jsdelivr.net/npm/@ax-design/reveal-highlight@0.1.9/es/index.js";
const Data = "./dataFromAPI.json";

//register();

(async () => {
    let data = await (fetch(Data).then(w => w.json()));
    let dataWithEl = data.map(v => {
        let p = attacher(v);
        p.el.innerHTML = `<!--<ax-reveal-provider>--><article>
        <div class="image-box" style="background-image:url(${v.thumb})">
            <div class="mask"></div>
            <img class="thumb" src="${v.thumb}">
        </div>
        <section class="info">
            <div class="title">${v.title}</div>
            <div class="publish-date">${(new Date(v.posted*1000)).toLocaleString()}</div>
            <!--<ax-reveal-bound>--><section class="tags">
                ${(() => {
                let res = "";
                let tagList = {};
                for (let o of v.tags) {
                    let r = o.split(":");
                    if(r.length === 1) (tagList["misc"]) || (tagList["misc"] = []), r.splice(0,0,"misc");
                    (tagList[r[0]]) || (tagList[r[0]] = []);
                    tagList[r[0]].push(r[1]);
                }
                for (let p in tagList) {
                    let str = `<section class="tags-group" data-tagfield="${p}">`;
                    for (let q of tagList[p]) str += `<!--<ax-reveal>--><div class="tag" data-tag="${q}">${q}</div><!--</ax-reveal>-->`;
                    str += `</section>`;
                    res += str;
                };
                return res;
            })()}
            </section>
            <section class="actions">
                <!--<ax-reveal>--><button class="open-exhentai">EXHentai</button><!--</ax-reveal>-->
                <!--<ax-reveal>--><button class="google-it">Google it!</button><!--</ax-reveal>-->
            </section><!--</ax-reveal-bound>-->
        </section>
    </article><!--</ax-reveal-provider>-->`;
        p.el.querySelector(".open-exhentai").addEventListener("click",()=>window.open(p.node.url));
        p.el.querySelector(".google-it").addEventListener("click",()=>window.open("https://www.google.com/search?q="+encodeURI(p.node.title_jpn)));
        for(let el of p.el.querySelectorAll(".tag")) el.addEventListener("click", (e)=>(document.querySelector("#searchBox").value = (e.target.dataset["tag"]),document.querySelector("#searchBox").dispatchEvent(new InputEvent("input"))));
        return p;
    });
    const list = new List({dataWithEl, binding:document.getElementById("listField"),listBar:(()=>{
        let bar = document.createElement("div");
        bar.innerHTML = `<!--<ax-reveal-provider>--><!--<ax-reveal-bound>--><button class="previous">Previous</button><button class="next">Next</button><!--</ax-reveal-bound>--><!--</ax-reveal-provider>-->`;
        bar.querySelector(".previous").addEventListener("click",()=>list.previous());
        bar.querySelector(".next").addEventListener("click",()=>list.next());
        return bar;
    })()});
    list.render();!
    document.querySelector('#searchBox').addEventListener("input",(e)=>list.commit(e.target.value));
})();

class List {
    constructor({dataWithEl,binding,perPageCount=20,listBar}){
        this._dataWithEl = dataWithEl;
        this.data = null;
        this.binding = binding;
        this._pointer = 0;
        this.perPageCount = perPageCount?perPageCount:20;
        this.listBar = listBar;
    }
    previous(){
        this.pointer-=this.perPageCount;
        this.render(this.dataWithEl.slice(this.pointer,this.pointer+this.perPageCount),true);
    }
    next(){
        this.pointer+=this.perPageCount;
        this.render(this.dataWithEl.slice(this.pointer,this.pointer+this.perPageCount),true);
    }
    render(opt,list=true) {
        let p = this.binding.parentElement;
        p.removeChild(this.binding);
        while(this.binding.childNodes[0]) this.binding.removeChild(this.binding.childNodes[0]);
        for(let {el} of (opt?opt:(list?this.dataWithEl.slice(0,this.perPageCount):this.dataWithEl))) this.binding.appendChild(el);
        list&&this.binding.appendChild(this.listBar);
        p.appendChild(this.binding);
    }
    commit(query){
        query instanceof RegExp || (query = new RegExp(query));
        this.data = null;
        this.pointer = 0;
        this.data = this._dataWithEl.filter(({node})=>query.test(node.tags.join('[]')));
        this.render();
    }
    get dataWithEl(){
        return this.data || this._dataWithEl;
    }
    get pointer(){
        return this._pointer;
    }
    set pointer(val){
        this._pointer = val<0?0:val;
    }

}

function attacher(node) {
    let el = document.createElement('div');
    return { node, el };
}