import{_ as t,c as n,b as o,o as l}from"./app-K3Q9rIlZ.js";const r={};function i(a,e){return l(),n("div",null,e[0]||(e[0]=[o('<h1 id="链路层" tabindex="-1"><a class="header-anchor" href="#链路层"><span>链路层</span></a></h1><h2 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h2><ol><li><strong>链路</strong>：就是从一个结点到相邻结点的一段物理线路，而中间没有任何其他的交换节点。</li><li><strong>数据链路</strong>：把实现通信协议的硬件和软件加到链路上，就构成了数据链路。</li><li>链路层以帧为单位传输和处理数据。</li><li><strong>封装成帧</strong>：给上面的网络层传来的“网络层协议数据单元”添加帧头和帧尾。</li><li><strong>差错检测</strong>：基于待发送的数据和检错算法计算出检错码，并封装到帧尾。接收方通过检错码和检错算法就可知道是否出错。</li><li><strong>可靠传输</strong>：要保证发送发发送什么，接收方就能收到什么。</li></ol><h2 id="封装成帧" tabindex="-1"><a class="header-anchor" href="#封装成帧"><span>封装成帧</span></a></h2><ol><li>封装成帧是指链路层给上层交付的协议数据单元添加帧头和帧尾使之成帧。 <ul><li>封装成帧是指数据链路层给上层交付的协议数据单元添加帧头和帧尾使之成帧。</li><li>帧头和帧尾的作用之一就是<span style="color:red;">帧定界</span>。</li><li>实际上以太网的数据链路层封装好 MAC 帧后,将其交付给物理层,物理层会在 MAC 帧 前面添加 8 字节的前导码,然后再将比特流转换成电信号发送。前导码中的前 7 个字节为前同步码,作用是使接收方的时钟同步之后的一字节为帧开始定界符。</li></ul></li><li>透明传输是指<span style="color:red;">链路层对上层交付的传输数据没有任何限制</span>，就好像链路层不存在一样。</li></ol>',5)]))}const c=t(r,[["render",i],["__file","lianluceng.html.vue"]]),p=JSON.parse('{"path":"/computer/computernetwork/lianluceng.html","title":"链路层","lang":"zh-CN","frontmatter":{"description":"链路层 概述 链路：就是从一个结点到相邻结点的一段物理线路，而中间没有任何其他的交换节点。 数据链路：把实现通信协议的硬件和软件加到链路上，就构成了数据链路。 链路层以帧为单位传输和处理数据。 封装成帧：给上面的网络层传来的“网络层协议数据单元”添加帧头和帧尾。 差错检测：基于待发送的数据和检错算法计算出检错码，并封装到帧尾。接收方通过检错码和检错算法...","head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/RoseWhisperInTheWind/computer/computernetwork/lianluceng.html"}],["meta",{"property":"og:site_name","content":"风中玫瑰的低语"}],["meta",{"property":"og:title","content":"链路层"}],["meta",{"property":"og:description","content":"链路层 概述 链路：就是从一个结点到相邻结点的一段物理线路，而中间没有任何其他的交换节点。 数据链路：把实现通信协议的硬件和软件加到链路上，就构成了数据链路。 链路层以帧为单位传输和处理数据。 封装成帧：给上面的网络层传来的“网络层协议数据单元”添加帧头和帧尾。 差错检测：基于待发送的数据和检错算法计算出检错码，并封装到帧尾。接收方通过检错码和检错算法..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-12-13T12:00:35.000Z"}],["meta",{"property":"article:modified_time","content":"2024-12-13T12:00:35.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"链路层\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-12-13T12:00:35.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Rose\\",\\"url\\":\\"https://mister-hope.com\\"}]}"]]},"headers":[{"level":2,"title":"概述","slug":"概述","link":"#概述","children":[]},{"level":2,"title":"封装成帧","slug":"封装成帧","link":"#封装成帧","children":[]}],"git":{"createdTime":1734091235000,"updatedTime":1734091235000,"contributors":[{"name":"Rose","email":"2677596161@qq.com","commits":1}]},"readingTime":{"minutes":1.42,"words":426},"filePathRelative":"computer/computernetwork/lianluceng.md","localizedDate":"2024年12月13日","excerpt":"\\n<h2>概述</h2>\\n<ol>\\n<li><strong>链路</strong>：就是从一个结点到相邻结点的一段物理线路，而中间没有任何其他的交换节点。</li>\\n<li><strong>数据链路</strong>：把实现通信协议的硬件和软件加到链路上，就构成了数据链路。</li>\\n<li>链路层以帧为单位传输和处理数据。</li>\\n<li><strong>封装成帧</strong>：给上面的网络层传来的“网络层协议数据单元”添加帧头和帧尾。</li>\\n<li><strong>差错检测</strong>：基于待发送的数据和检错算法计算出检错码，并封装到帧尾。接收方通过检错码和检错算法就可知道是否出错。</li>\\n<li><strong>可靠传输</strong>：要保证发送发发送什么，接收方就能收到什么。</li>\\n</ol>","autoDesc":true}');export{c as comp,p as data};
