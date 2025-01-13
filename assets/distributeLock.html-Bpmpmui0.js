import{_ as s,c as e,b as a,o as n}from"./app-DeUaIzc7.js";const t="/RoseWhisperInTheWind/assets/redisson%E6%89%A7%E8%A1%8C%E6%B5%81%E7%A8%8B-Cs9SmHNj.png",l={};function h(d,i){return n(),e("div",null,i[0]||(i[0]=[a(`<h1 id="分布式锁" tabindex="-1"><a class="header-anchor" href="#分布式锁"><span>分布式锁</span></a></h1><p><strong>没有最最完美的方案，只有最适合的方案</strong></p><h2 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h2><p>大家如果学习过 JUC 的话，应该对并发问题有更深刻的了解。对于采用哪种方案来解决并发问题也有自己的理解。但是，JUC 的内容只是帮助你在一个 JVM 中解决共享资源竞争问题，而事实上现在很多项目会用到微服务或分布式部署，那么仅使用 JUC 是无法解决的。上吧！分布式锁就是你了！ 我只了解 Redis 的分布式锁，只能给大家介绍 Redis 实现分布式锁相关的内容嘻嘻。Redis 中使用分布式锁的话简单来说就是使用<code>setnx</code>（set if not exists）命令。当 key 不存在时，把 value 赋值，而当 key 已经存在则不进行任何操作。所以我们在操作共享资源时候去<code>setnx</code>一下，如果返回 true 则可以操作共享资源，如果返回 false 则不能操作共享资源。这样是不是就解决了并发问题呢嘿嘿？非也非也。</p><h2 id="如何设计分布式锁" tabindex="-1"><a class="header-anchor" href="#如何设计分布式锁"><span>如何设计分布式锁？</span></a></h2><p>那我们考虑一下如何设计一个分布式锁吧！</p><ol><li><p>分布式锁释放</p><ol><li>比如获取分布式锁后，业务代码出现异常导致无法释放锁怎么办？（使用 try-catch-finally?）</li><li>那如果是执行业务代码时服务器突然挂了（锁来不及释放就挂了）怎么办？（加个过期时间？）</li></ol></li><li><p>分布式锁删除问题: 如何保证自己加的分布式锁不会被别人删除呢？ 是自己线程本身加的锁才可以删除,可以把自己的线程的 id 添加到分布式锁中。</p></li><li><p>在业务代码还没有执行完，锁就已经过期了怎么办？ 答案是进行锁续期！设置定时任务，每过一定时间后，检查分布式锁是否还在，然后进行续期</p></li><li><p>主从架构中，对主节点加锁成功，主节点会去异步同步从节点，而当主节点还没来得及通知从节点自己就挂了。而又有一个新的请求来获取分布式锁了（扣减同一个商品）。这时因为主节点挂了，从节点被选举为新的主节点，而它没来得及同步，所以新的请求也会得到分布式锁。这时候该怎么办？</p><ol><li>我们可以通过<code>Redlock</code>机制，使 Java 客户端对多个 Redis 服务端发送加锁命令，当<strong>超过半数</strong>的 Redis 服务端响应加锁成功后，Java 客户端才会认为加锁成功。这时来新的请求加锁，发现无法得到半数以上加锁成功的响应，就认为加锁失败。</li><li>如果使用 RedLock 的话，<strong>三个</strong>Redis 节点就可以做到高可用了，我可以随便挂掉其中的一台机器。那如果部署 5 个 Redis 节点怎样呢？那你就得保证大于 2.5（至少是 3）个节点给你返回加锁成功，这时你就可以随便挂其中两台了（可用性提高了）。那么部署 4 个节点怎么样呢？其实也可以但是就可用性方面比，与 3 个节点没区别，因为 4 个节点要保证大于 2 个（至少是 3）节点返回加锁成功，才可以。这与 3 个 Redis 节点对可用性提高的效果是相同的。</li></ol></li></ol><div class="language-mermaid line-numbers-mode" data-highlighter="shiki" data-ext="mermaid" data-title="mermaid" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">graph TD</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    A[Java Client] --&gt;|加锁| B1[redis1]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    A --&gt;|加锁| B2[redis2]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    A --&gt;|加锁| B3[redis3]</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    B1 --&gt;|成功反馈?| C(超过半数的节点加锁成功, JavaClient才认为加锁成功)</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    B2 --&gt;|成功反馈?| C</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    B3 --&gt;|成功反馈?| C</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ol start="5"><li>Redlock 的坑 <ol><li>使用了 Redlock 后的主节点不能设置从节点，否则可能会出现与上面相似的问题。假设我们还是使用了 3 个 Redis 服务端：因为 Redis 的主从架构，主节点挂了，从节点会自动成为新的主节点，此时从节点还没来得及同步，主节点就挂了。（原来是两个主节点记录了分布式锁，挂了一个后的从节点没有同步到，只有一个节点记录了分布式锁，所以其他请求还可以获得这个分布式锁）这时来新的请求加锁，发现无法得到半数以上加锁成功的响应，就认为加锁失败。</li><li>Redis 如果使用 AOF 来持久化的话，如果参数设置为“每秒更新一次”，也有可能出现问题，因为加分布式锁的命令恰好在那 1 秒内，而这时 Redis 挂了，也会出现其他请求获得到锁的问题。</li></ol></li></ol><h2 id="redisson" tabindex="-1"><a class="header-anchor" href="#redisson"><span>Redisson</span></a></h2><p>感觉自己写分布式锁用起来太费劲了？上吧！Redisson 让大家见识一下你的实力吧！Redisson 是 Java 语言实现的分布式锁，它早就帮你把可能出现的问题都给你解决了，只要调用其 api 就可以了。 <img src="`+t+`" alt="Redisson执行流程" loading="lazy"></p><h3 id="redisson-的锁续期是怎么做到的" tabindex="-1"><a class="header-anchor" href="#redisson-的锁续期是怎么做到的"><span>Redisson 的锁续期是怎么做到的？</span></a></h3><p>执行定时任务</p><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">Timeout</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> task </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;"> this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">getServiceManager</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">().</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">newTimeout</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> TimerTask</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">() {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> void</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> run</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;">Timeout</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;"> timeout</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">)</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> throws</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> Exception</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">        // 定时任务执行逻辑</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    }</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">    // 定时任务的执行间隔时间，为锁的租约时间的三分之一</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">}, </span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">internalLockLeaseTime</span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;"> /</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 3L</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">TimeUnit</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">MILLISECONDS</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="分布式锁性能优化" tabindex="-1"><a class="header-anchor" href="#分布式锁性能优化"><span>分布式锁性能优化</span></a></h3><p>如何让一个秒杀场景（高并发）的并发度突然提高 10 倍？</p><ol><li>分段锁：比如一件商品有 100 个库存，你不选择把 100 个库存放到一个 key 里，而是分成 10 个 key，这样就可以有 10 个请求同时拿到分布式锁。但这样的话后端代码肯定会更加复杂。</li></ol>`,17)]))}const p=s(l,[["render",h],["__file","distributeLock.html.vue"]]),k=JSON.parse('{"path":"/backend/redis/distributeLock.html","title":"分布式锁","lang":"zh-CN","frontmatter":{"description":"分布式锁 没有最最完美的方案，只有最适合的方案 概述 大家如果学习过 JUC 的话，应该对并发问题有更深刻的了解。对于采用哪种方案来解决并发问题也有自己的理解。但是，JUC 的内容只是帮助你在一个 JVM 中解决共享资源竞争问题，而事实上现在很多项目会用到微服务或分布式部署，那么仅使用 JUC 是无法解决的。上吧！分布式锁就是你了！ 我只了解 Redi...","head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/RoseWhisperInTheWind/backend/redis/distributeLock.html"}],["meta",{"property":"og:site_name","content":"风中玫瑰的低语"}],["meta",{"property":"og:title","content":"分布式锁"}],["meta",{"property":"og:description","content":"分布式锁 没有最最完美的方案，只有最适合的方案 概述 大家如果学习过 JUC 的话，应该对并发问题有更深刻的了解。对于采用哪种方案来解决并发问题也有自己的理解。但是，JUC 的内容只是帮助你在一个 JVM 中解决共享资源竞争问题，而事实上现在很多项目会用到微服务或分布式部署，那么仅使用 JUC 是无法解决的。上吧！分布式锁就是你了！ 我只了解 Redi..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2024-12-25T13:04:20.000Z"}],["meta",{"property":"article:modified_time","content":"2024-12-25T13:04:20.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"分布式锁\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2024-12-25T13:04:20.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Rose\\",\\"url\\":\\"https://mister-hope.com\\"}]}"]]},"headers":[{"level":2,"title":"概述","slug":"概述","link":"#概述","children":[]},{"level":2,"title":"如何设计分布式锁？","slug":"如何设计分布式锁","link":"#如何设计分布式锁","children":[]},{"level":2,"title":"Redisson","slug":"redisson","link":"#redisson","children":[{"level":3,"title":"Redisson 的锁续期是怎么做到的？","slug":"redisson-的锁续期是怎么做到的","link":"#redisson-的锁续期是怎么做到的","children":[]},{"level":3,"title":"分布式锁性能优化","slug":"分布式锁性能优化","link":"#分布式锁性能优化","children":[]}]}],"git":{"createdTime":1735131860000,"updatedTime":1735131860000,"contributors":[{"name":"Rose","email":"2677596161@qq.com","commits":1}]},"readingTime":{"minutes":4.88,"words":1463},"filePathRelative":"backend/redis/distributeLock.md","localizedDate":"2024年12月25日","excerpt":"\\n<p><strong>没有最最完美的方案，只有最适合的方案</strong></p>\\n<h2>概述</h2>\\n<p>大家如果学习过 JUC 的话，应该对并发问题有更深刻的了解。对于采用哪种方案来解决并发问题也有自己的理解。但是，JUC 的内容只是帮助你在一个 JVM 中解决共享资源竞争问题，而事实上现在很多项目会用到微服务或分布式部署，那么仅使用 JUC 是无法解决的。上吧！分布式锁就是你了！\\n我只了解 Redis 的分布式锁，只能给大家介绍 Redis 实现分布式锁相关的内容嘻嘻。Redis 中使用分布式锁的话简单来说就是使用<code>setnx</code>（set if not exists）命令。当 key 不存在时，把 value 赋值，而当 key 已经存在则不进行任何操作。所以我们在操作共享资源时候去<code>setnx</code>一下，如果返回 true 则可以操作共享资源，如果返回 false 则不能操作共享资源。这样是不是就解决了并发问题呢嘿嘿？非也非也。</p>","autoDesc":true}');export{p as comp,k as data};