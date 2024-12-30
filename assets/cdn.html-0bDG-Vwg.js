import{_ as t,c as n,b as i,o as a}from"./app-CUlMDguP.js";const l="/RoseWhisperInTheWind/assets/%E8%A7%A3%E6%9E%90CND%E5%9F%9F%E5%90%8D%E6%B5%81%E7%A8%8B-DLo1NISS.png",o={};function s(r,e){return a(),n("div",null,e[0]||(e[0]=[i('<h1 id="你知道什么是-cdn-吗" tabindex="-1"><a class="header-anchor" href="#你知道什么是-cdn-吗"><span>你知道什么是 CDN 吗？</span></a></h1><h2 id="概念" tabindex="-1"><a class="header-anchor" href="#概念"><span>概念</span></a></h2><p>要讲解 CDN（内容分发网络） 就一定要先知道 OSS。大家肯定都知道图片这种东西肯定是不能存储在数据库的，那应该存储在哪呢？放心云服务厂商都给你提供好专门的对象存储！没错就是<strong>OSS</strong>！CDN 与 OSS 之间的关系就好比是 MySQL 和 Redis 之间的关系。是不是有点迷糊？别急往下看。</p><h2 id="cdn-是如何工作的" tabindex="-1"><a class="header-anchor" href="#cdn-是如何工作的"><span>CDN 是如何工作的？</span></a></h2><p>我们通常是通过了一个 url 地址来访问某张图片。那么这个 url 是什么样呢？哎呀肯定是 www.域名/xxx.png 这种，那么这个域名是谁的啊？就是 CDN 的域名喽！那么当我们去在浏览器中输入这个域名会发生什么呢？很简单呀！肯定是返回 CDN 服务器的 IP 地址，但这个过程却不那么简单。</p><ol><li>首先电脑会查询浏览器缓存和操作系统缓存如果缓存中没有，就会根据最近的 DNS 服务器查询域名，但这时 DNS 返回的并不是一个 IP 地址，而是 CDN 域名的别名（CNAME） <img src="'+l+'" alt="Alt" loading="lazy"></li><li>然后 DNS 根据 CDN 专用的 DNS 调度系统去找一个理你<strong>最近</strong>的 CDN 服务器的 ip 交给你。浏览器去访问这个 ip 就可以得到图片了。有没有人想知道多加的这一层的 CDN 专用 DNS 调度系统的作用是什么呢？上面提到了就是：给你一个离你最近的 CDN 服务器的 ip。</li></ol><h2 id="什么是回源" tabindex="-1"><a class="header-anchor" href="#什么是回源"><span>什么是回源？</span></a></h2><ol><li>就像是在 Redis 没有命中，去请求数据库，然后把数据库中查到的数据缓存到 Redis 中。</li><li>CDN 本质上就是一层缓存，当你第一次访问 CDN 获取某张图片，如果 CDN 中是没有就会触发回源，到 OSS 中找到这个图片，然后保存到 CDN 中。因为 OSS 是对象存储，所以视频，音频都可以用这套流程进行 CDN 加速。</li></ol><h2 id="什么时候不需要-cdn" tabindex="-1"><a class="header-anchor" href="#什么时候不需要-cdn"><span>什么时候不需要 CDN</span></a></h2><ol><li>就比如在公司内网中，并且服务请求的图片等文件不会被多次重复调用，就可以不用 CDN。</li><li>如果回源比例太高也可不用 CDN 了。</li></ol><h2 id="如何解决-cdn-中与-oss-的数据不一致问题" tabindex="-1"><a class="header-anchor" href="#如何解决-cdn-中与-oss-的数据不一致问题"><span>如何解决 CDN 中与 OSS 的数据不一致问题？</span></a></h2><ol><li>主动刷新 CDN 缓存</li><li>设置合理的缓存策略（合理的 ttl）</li><li>使 CDN 与 OSS 联动：可以设置一个事件触发机制，如当 OSS 中的某个文件被更新时，去自动触发 CDN 的刷新。</li></ol>',12)]))}const d=t(o,[["render",s],["__file","cdn.html.vue"]]),p=JSON.parse('{"path":"/anything/cdn.html","title":"你知道什么是 CDN 吗？","lang":"zh-CN","frontmatter":{"description":"你知道什么是 CDN 吗？ 概念 要讲解 CDN（内容分发网络） 就一定要先知道 OSS。大家肯定都知道图片这种东西肯定是不能存储在数据库的，那应该存储在哪呢？放心云服务厂商都给你提供好专门的对象存储！没错就是OSS！CDN 与 OSS 之间的关系就好比是 MySQL 和 Redis 之间的关系。是不是有点迷糊？别急往下看。 CDN 是如何工作的？ 我...","head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/RoseWhisperInTheWind/anything/cdn.html"}],["meta",{"property":"og:site_name","content":"风中玫瑰的低语"}],["meta",{"property":"og:title","content":"你知道什么是 CDN 吗？"}],["meta",{"property":"og:description","content":"你知道什么是 CDN 吗？ 概念 要讲解 CDN（内容分发网络） 就一定要先知道 OSS。大家肯定都知道图片这种东西肯定是不能存储在数据库的，那应该存储在哪呢？放心云服务厂商都给你提供好专门的对象存储！没错就是OSS！CDN 与 OSS 之间的关系就好比是 MySQL 和 Redis 之间的关系。是不是有点迷糊？别急往下看。 CDN 是如何工作的？ 我..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-12-30T08:18:18.000Z"}],["meta",{"property":"article:modified_time","content":"2024-12-30T08:18:18.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"你知道什么是 CDN 吗？\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-12-30T08:18:18.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Rose\\",\\"url\\":\\"https://mister-hope.com\\"}]}"]]},"headers":[{"level":2,"title":"概念","slug":"概念","link":"#概念","children":[]},{"level":2,"title":"CDN 是如何工作的？","slug":"cdn-是如何工作的","link":"#cdn-是如何工作的","children":[]},{"level":2,"title":"什么是回源？","slug":"什么是回源","link":"#什么是回源","children":[]},{"level":2,"title":"什么时候不需要 CDN","slug":"什么时候不需要-cdn","link":"#什么时候不需要-cdn","children":[]},{"level":2,"title":"如何解决 CDN 中与 OSS 的数据不一致问题？","slug":"如何解决-cdn-中与-oss-的数据不一致问题","link":"#如何解决-cdn-中与-oss-的数据不一致问题","children":[]}],"git":{"createdTime":1735131860000,"updatedTime":1735546698000,"contributors":[{"name":"Rose","email":"2677596161@qq.com","commits":1}]},"readingTime":{"minutes":2.23,"words":669},"filePathRelative":"anything/cdn.md","localizedDate":"2024年12月25日","excerpt":"\\n<h2>概念</h2>\\n<p>要讲解 CDN（内容分发网络） 就一定要先知道 OSS。大家肯定都知道图片这种东西肯定是不能存储在数据库的，那应该存储在哪呢？放心云服务厂商都给你提供好专门的对象存储！没错就是<strong>OSS</strong>！CDN 与 OSS 之间的关系就好比是 MySQL 和 Redis 之间的关系。是不是有点迷糊？别急往下看。</p>\\n<h2>CDN 是如何工作的？</h2>\\n<p>我们通常是通过了一个 url 地址来访问某张图片。那么这个 url 是什么样呢？哎呀肯定是 www.域名/xxx.png 这种，那么这个域名是谁的啊？就是 CDN 的域名喽！那么当我们去在浏览器中输入这个域名会发生什么呢？很简单呀！肯定是返回 CDN 服务器的 IP 地址，但这个过程却不那么简单。</p>","autoDesc":true}');export{d as comp,p as data};
