import{_ as s,c as a,b as e,o as l}from"./app-CUlMDguP.js";const n={};function t(h,i){return l(),a("div",null,i[0]||(i[0]=[e(`<h1 id="nio-基础" tabindex="-1"><a class="header-anchor" href="#nio-基础"><span>NIO 基础</span></a></h1><p>non-blocking IO / New IO（同步非阻塞 IO）</p><h2 id="核心组件" tabindex="-1"><a class="header-anchor" href="#核心组件"><span>核心组件</span></a></h2><ol><li>Channel：可以同时用于读写数据的，非阻塞的数据通道。</li><li>Buffer：缓冲区，读到的数据要写入数据都先进入 buffer 中。很常见比如 OS 的用户空间、内核空间进行数据交换时也使用 buffer</li><li>Selector：一个 thread 使用一个 selector，一个 selector 管理多个 channel，当某个 channel 上有事件发生时，selector 可以立刻监听到。所以这些 channel 是非阻塞模式的。</li></ol><h2 id="channel-和-buffer-的使用" tabindex="-1"><a class="header-anchor" href="#channel-和-buffer-的使用"><span>Channel 和 Buffer 的使用</span></a></h2><p>下面的 buffer 为什么要调用 flip()和 clear()呢？</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    try</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> (</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">FileChannel</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> channel </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> FileInputStream</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;data.txt&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">)</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">getChannel</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">()</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">) {</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">        // 准备缓冲区</span></span>
<span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">        ByteBuffer</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> buffer </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> ByteBuffer</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">allocate</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">10</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">        while</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> (</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">true</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">) {</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">            // 从channel读取数据，写到buffer</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">            int</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> len </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> channel</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">read</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(buffer);</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">            log</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">debug</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;读取到的字节数 {}&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,len);</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">            if</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> (len </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">==</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> -</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">1</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">) {</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">// channel中无内容了</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">                break</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">            }</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">            buffer</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">flip</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">();</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;"> // 切换buffer读模式</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">            while</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> (</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">buffer</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">hasRemaining</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">()</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">) {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">                byte</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> b </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> buffer</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">get</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">();</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">                log</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">debug</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;读取到的是{}&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,(</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">char</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)b);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">            }</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">            buffer</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">clear</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">();</span><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">// 切换到写模式</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">        }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">    } </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">catch</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> (</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">IOException</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;"> e</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">) {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">    }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我感觉 ByteBuffer 的设计很巧，它有三个重要的参数：capacity，limit，position。而且 ByteBuffer 就是一个数组。</p><ol><li>capacity：表示缓冲区能容纳的最大元素个数。</li><li>limit：表示缓冲区中可以操作元素的最大索引位置，<code>limit==capacity</code> 表示缓冲区中可以操作所有元素。</li><li>position：表示缓冲区中当前可以操作元素的索引位置，<code>position==limit</code> 表示缓冲区中没有可以操作的元素。读 buffer 和写 buffer 都需要使用它。 所以呢，写入 buffer 时，position 后移。然后当你想读的时候，你不还得是用到 position 嘛，所以 <code>flip()</code>就是把 position 移动到 0 索引，并把 limit 设置为原来 position 的位置，这样你就可以读 buffer 了。而 <code>clear()</code>是把 position 移动到 0，而 limit 移动到 capacity。</li><li>还有一个方法叫<code>compact()</code>这是在你的 buffer 没读完的时候，你想写入数据。这个方法会把 position 到 limit 之间的数据拷贝到 buffer 的 0 到 limit 之间，然后把 position 设置为 limit，limit 设置为 capacity。</li></ol><h2 id="channel-事件类型" tabindex="-1"><a class="header-anchor" href="#channel-事件类型"><span>Channel 事件类型</span></a></h2><ol><li>accept - 会在有连接请求时触发</li><li>connect - 客户端在连接成功时触发</li><li>read - 可读事件</li><li>write - 可写事件</li></ol><h2 id="selector-的使用" tabindex="-1"><a class="header-anchor" href="#selector-的使用"><span>Selector 的使用</span></a></h2><ol><li>Selector 中会维护一个 SelectionKey 集合<code>Set&lt;SelectionKey&gt; selectionKeys = selector.selectedKeys();</code>每当有一个事件触发了就会往这个集合中添加一个 SelectionKey。这个 SelectionKey 相当于 channel 的管理员，它负责管理 channel 的事件。</li><li>详细地说： <ol><li>SelectionKey 是一个代表 Channel 在 Selector 中的注册状态和事件就绪状态的对象。当一个 Channel 注册到 Selector 时，会返回一个 SelectionKey,并且记录了该 Channel 感兴趣的事件是 OP_READ（表示可读事件）。</li></ol><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">     SelectionKey</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> scKey </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> sc</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">register</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(selector, </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">0</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">null</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">     scKey</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">interestOps</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">SelectionKey</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">OP_READ</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div></li><li>处理消息边界问题：客户端传来的消息长度是不一定的，也许比你服务端的 ByteBuffer 更长（没装下，半包），也许也可能更小。有可能一个 ByteBuffer 里保存了多个消息（粘包）。所以应该怎么处理呢？ **答：**使用<code>LTV</code>格式，L 表示消息的长度，T 表示消息的类型，V 表示消息的内容。客户端先传来消息长度和消息类型（LT），再传实际的内容（V）。</li></ol><h2 id="selector-的坑" tabindex="-1"><a class="header-anchor" href="#selector-的坑"><span>Selector 的坑</span></a></h2><ol><li>每当我们使用完一个 SelectionKey 后，应该把其从 SelectionKey 集合中移除，否则下次循环遍历到它时，就会对相同的事件进行重复处理。</li><li>在客户端断开连接时会产生一个 read 事件，需要我们手动处理，看看是正常断开还是异常断开</li></ol>`,15)]))}const p=s(n,[["render",t],["__file","NIO.html.vue"]]),r=JSON.parse('{"path":"/netty/NIO.html","title":"NIO 基础","lang":"zh-CN","frontmatter":{"description":"NIO 基础 non-blocking IO / New IO（同步非阻塞 IO） 核心组件 Channel：可以同时用于读写数据的，非阻塞的数据通道。 Buffer：缓冲区，读到的数据要写入数据都先进入 buffer 中。很常见比如 OS 的用户空间、内核空间进行数据交换时也使用 buffer Selector：一个 thread 使用一个 sele...","head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/RoseWhisperInTheWind/netty/NIO.html"}],["meta",{"property":"og:site_name","content":"风中玫瑰的低语"}],["meta",{"property":"og:title","content":"NIO 基础"}],["meta",{"property":"og:description","content":"NIO 基础 non-blocking IO / New IO（同步非阻塞 IO） 核心组件 Channel：可以同时用于读写数据的，非阻塞的数据通道。 Buffer：缓冲区，读到的数据要写入数据都先进入 buffer 中。很常见比如 OS 的用户空间、内核空间进行数据交换时也使用 buffer Selector：一个 thread 使用一个 sele..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-12-30T08:18:18.000Z"}],["meta",{"property":"article:modified_time","content":"2024-12-30T08:18:18.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"NIO 基础\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-12-30T08:18:18.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Rose\\",\\"url\\":\\"https://mister-hope.com\\"}]}"]]},"headers":[{"level":2,"title":"核心组件","slug":"核心组件","link":"#核心组件","children":[]},{"level":2,"title":"Channel 和 Buffer 的使用","slug":"channel-和-buffer-的使用","link":"#channel-和-buffer-的使用","children":[]},{"level":2,"title":"Channel 事件类型","slug":"channel-事件类型","link":"#channel-事件类型","children":[]},{"level":2,"title":"Selector 的使用","slug":"selector-的使用","link":"#selector-的使用","children":[]},{"level":2,"title":"Selector 的坑","slug":"selector-的坑","link":"#selector-的坑","children":[]}],"git":{"createdTime":1735131860000,"updatedTime":1735546698000,"contributors":[{"name":"Rose","email":"2677596161@qq.com","commits":2}]},"readingTime":{"minutes":3.04,"words":912},"filePathRelative":"netty/NIO.md","localizedDate":"2024年12月25日","excerpt":"\\n<p>non-blocking IO / New IO（同步非阻塞 IO）</p>\\n<h2>核心组件</h2>\\n<ol>\\n<li>Channel：可以同时用于读写数据的，非阻塞的数据通道。</li>\\n<li>Buffer：缓冲区，读到的数据要写入数据都先进入 buffer 中。很常见比如 OS 的用户空间、内核空间进行数据交换时也使用 buffer</li>\\n<li>Selector：一个 thread 使用一个 selector，一个 selector 管理多个 channel，当某个 channel 上有事件发生时，selector 可以立刻监听到。所以这些 channel 是非阻塞模式的。</li>\\n</ol>","autoDesc":true}');export{p as comp,r as data};