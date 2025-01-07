import{_ as n,c as t,b as i,o as l}from"./app-CeKw4B_U.js";const o="/RoseWhisperInTheWind/assets/%E7%BC%93%E5%AD%98%E6%95%B0%E6%8D%AE%E5%BA%93%E6%95%B0%E6%8D%AE%E4%B8%80%E8%87%B4-DPiM9os_.png",a="/RoseWhisperInTheWind/assets/canal%E8%AE%A2%E9%98%85binlog-DL1pb4on.png",s={};function r(p,e){return l(),t("div",null,e[0]||(e[0]=[i('<h1 id="缓存与数据库的一致性" tabindex="-1"><a class="header-anchor" href="#缓存与数据库的一致性"><span>缓存与数据库的一致性</span></a></h1><p>这个问题很常见，而且也有一个比较适合的解决方案，但肯定不能保证百分百一致，只是不一致的现象很难发生。不卖关子了，也不说其他方案有什么不好了，我直接给你讲为什么要用这个方案吧。那就是<strong>先更新数据库，后删除缓存</strong>。（本篇学自<code>水滴与银弹</code>微信公众号文章）</p><h2 id="先更新数据库-后删除缓存" tabindex="-1"><a class="header-anchor" href="#先更新数据库-后删除缓存"><span>先更新数据库，后删除缓存</span></a></h2><ol><li><p>出错情况：这种情况可能会出现不一致，但是概率非常低。</p><ol><li>缓存中 A 不存在（数据库中 A = 1）</li><li>线程 1 读取数据库，得到旧值（A = 1）</li><li>线程 2 更新数据库（A = 2）</li><li>线程 2 删除缓存 A</li><li>线程 1 把读到的旧 A 写入缓存</li></ol></li><li><p>为什么概率低？ 它必须满足以下的条件：</p><ol><li>缓存恰好过期</li><li>读请求和写请求并发执行</li><li>上面线程 2 花费的时间比线程 1 花费的少（线程 2 先于线程 1 执行完）但是一般写入数据库（MySQL）你肯定是要加锁的，表锁或行锁，那么花费的时间通常是比读数据库操作的长。</li></ol></li><li><p><strong>如何保证更新完数据库后，删除缓存操作一定成功？</strong> 就是你了**<em>重试</em><strong>。但是要考虑好重试次数，如果一直重试会一直占用这个线程资源。那么怎么办才好啊？就是你了</strong><em>异步重试</em>**：其实就是把重试请求写到消息队列中，然后由专门的消费者来重试，直到成功。那你又加了一个消息队列，不是让业务更复杂了吗？嗯是这样的，但是消息队列的好处也是大大的，除了上面的功能外，如果执行删除缓存的线程在重试过程中，突然后端服务挂了，那么重试请求也停止了（丢失了）导致数据库和缓存中的数据不一致了，而把这个删除缓存的请求放到消息队列中，等你重启后，还可以继续消费。况且你的项目中一定有别的地方也会用到消息队列，所以就是新增一个“队列”就行了。 <img src="'+o+'" alt="先修改数据库后删缓存" loading="lazy"></p></li><li><p>除了消息队列，现在比较流行的是<strong>订阅数据库变更日志，再操作缓存</strong>。如当 MySQL 修改数据后，会在 Binlog 中记录一条日志，然后通过订阅这个日志，再删除对应的缓存。 <img src="'+a+'" alt="订阅数据库日志" loading="lazy"> 这样就不用考虑后端写入消息队列时失败的情况了。</p></li></ol><h2 id="介绍延迟双删" tabindex="-1"><a class="header-anchor" href="#介绍延迟双删"><span>介绍延迟双删</span></a></h2><ol><li>在<strong>先删除缓存后更新数据库</strong>时可以使用延时双删：在某个线程删除缓存、更新完数据库之后，先“休眠一会”，再“删除”一次缓存。</li><li>在数据库使用了主从架构时，因为在<strong>先更新数据库后删除缓存</strong>的情况下，使用了主从，在修改完主数据库后删完缓存后还没来的及更新从数据库时，有一个新的请求来访问数据（肯定是去从数据库），得到旧值，又写入缓存（旧值），从而·导致数据不一致。该怎么办？ <ol><li>也是使用延迟双删的思想。当主数据库更新完后，写入消息队列中一条延迟消息（用于删除缓存）时间就设置在差不多从数据库更新完后的大小。</li><li>除了 MQ 还可以使用 DelayQueue，但其会随着 JVM 进程的死亡，丢失更新的风险</li></ol></li></ol><h2 id="先删缓存再更新数据库" tabindex="-1"><a class="header-anchor" href="#先删缓存再更新数据库"><span>先删缓存再更新数据库</span></a></h2><p>以下这种情况可能会在上亿流量<strong>高并发</strong>的情况下产生：数据发生了变更，先删除了缓存，然后要去修改数据库，此时还没修改。一个请求过来，去读缓存，发现缓存空了，去查询数据库，查到了修改前的旧数据，放到了缓存中。随后数据变更的程序完成了数据库的修改。完了，数据库和缓存中的数据不一样了...</p><h3 id="解决方案" tabindex="-1"><a class="header-anchor" href="#解决方案"><span>解决方案</span></a></h3><p>在更新数据时，将缓存删除后，将这个更新数据的请求放到一个队列中。在读数据时，如果发现缓存中没有，就也把读数据+更新缓存的命令放到同一个队列中。这里的读数据时可做一点优化，因为多次更新缓存是无意义的，所以加一个判断：如果队列中有一个更新缓存的命令后，就不用将以后的更新缓存命令放到队列中了。 想必大家已经猜到了，每个队列对应一个工作线程，让每个队列中的任务串行执行。这样的话，一个更新数据的请求到达，先去删除缓存然后去更新数据库，但更新还没有完成。而如果这时又来了一个读请求，发现缓存中没有（就要去读数据库并且更新缓存），就把自己放到队列中阻塞等待，知道更新数据库任务结束后开始执行读请求以及更新缓存。</p><h3 id="方案中的问题" tabindex="-1"><a class="header-anchor" href="#方案中的问题"><span>方案中的问题</span></a></h3><p>如果修改操作太多的话，简简单单的读请求就会阻塞很长时间。所以读请求命令要在队列中设置一个合适的超时时间，如果超时了就不得不去读数据库。 而且一个队列中也许有多个数据项的更新数据命令，所以可以设置多个队列，每个队列分配不同的任务。</p><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h2><p>其实我也只是个大学生，没经历过多么多么高并发量的开发，以上都是我读大佬的文章总结出自己的解决方案。所以双写一致的解决方案还是要根据你的业务场景来定，在写代码前考虑好自己的业务逻辑，想好其中的难点，根据 QPS 来进行合理的设计。</p>',14)]))}const d=n(s,[["render",r],["__file","dataConsistence.html.vue"]]),h=JSON.parse('{"path":"/backend/redis/dataConsistence.html","title":"缓存与数据库的一致性","lang":"zh-CN","frontmatter":{"description":"缓存与数据库的一致性 这个问题很常见，而且也有一个比较适合的解决方案，但肯定不能保证百分百一致，只是不一致的现象很难发生。不卖关子了，也不说其他方案有什么不好了，我直接给你讲为什么要用这个方案吧。那就是先更新数据库，后删除缓存。（本篇学自水滴与银弹微信公众号文章） 先更新数据库，后删除缓存 出错情况：这种情况可能会出现不一致，但是概率非常低。 缓存中 ...","head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/RoseWhisperInTheWind/backend/redis/dataConsistence.html"}],["meta",{"property":"og:site_name","content":"风中玫瑰的低语"}],["meta",{"property":"og:title","content":"缓存与数据库的一致性"}],["meta",{"property":"og:description","content":"缓存与数据库的一致性 这个问题很常见，而且也有一个比较适合的解决方案，但肯定不能保证百分百一致，只是不一致的现象很难发生。不卖关子了，也不说其他方案有什么不好了，我直接给你讲为什么要用这个方案吧。那就是先更新数据库，后删除缓存。（本篇学自水滴与银弹微信公众号文章） 先更新数据库，后删除缓存 出错情况：这种情况可能会出现不一致，但是概率非常低。 缓存中 ..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-01-07T10:20:52.000Z"}],["meta",{"property":"article:modified_time","content":"2025-01-07T10:20:52.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"缓存与数据库的一致性\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-01-07T10:20:52.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Rose\\",\\"url\\":\\"https://mister-hope.com\\"}]}"]]},"headers":[{"level":2,"title":"先更新数据库，后删除缓存","slug":"先更新数据库-后删除缓存","link":"#先更新数据库-后删除缓存","children":[]},{"level":2,"title":"介绍延迟双删","slug":"介绍延迟双删","link":"#介绍延迟双删","children":[]},{"level":2,"title":"先删缓存再更新数据库","slug":"先删缓存再更新数据库","link":"#先删缓存再更新数据库","children":[{"level":3,"title":"解决方案","slug":"解决方案","link":"#解决方案","children":[]},{"level":3,"title":"方案中的问题","slug":"方案中的问题","link":"#方案中的问题","children":[]}]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[]}],"git":{"createdTime":1735131860000,"updatedTime":1736245252000,"contributors":[{"name":"Rose","email":"2677596161@qq.com","commits":1}]},"readingTime":{"minutes":5.33,"words":1599},"filePathRelative":"backend/redis/dataConsistence.md","localizedDate":"2024年12月25日","excerpt":"\\n<p>这个问题很常见，而且也有一个比较适合的解决方案，但肯定不能保证百分百一致，只是不一致的现象很难发生。不卖关子了，也不说其他方案有什么不好了，我直接给你讲为什么要用这个方案吧。那就是<strong>先更新数据库，后删除缓存</strong>。（本篇学自<code>水滴与银弹</code>微信公众号文章）</p>\\n<h2>先更新数据库，后删除缓存</h2>\\n<ol>\\n<li>\\n<p>出错情况：这种情况可能会出现不一致，但是概率非常低。</p>\\n<ol>\\n<li>缓存中 A 不存在（数据库中 A = 1）</li>\\n<li>线程 1 读取数据库，得到旧值（A = 1）</li>\\n<li>线程 2 更新数据库（A = 2）</li>\\n<li>线程 2 删除缓存 A</li>\\n<li>线程 1 把读到的旧 A 写入缓存</li>\\n</ol>\\n</li>\\n<li>\\n<p>为什么概率低？\\n它必须满足以下的条件：</p>\\n<ol>\\n<li>缓存恰好过期</li>\\n<li>读请求和写请求并发执行</li>\\n<li>上面线程 2 花费的时间比线程 1 花费的少（线程 2 先于线程 1 执行完）但是一般写入数据库（MySQL）你肯定是要加锁的，表锁或行锁，那么花费的时间通常是比读数据库操作的长。</li>\\n</ol>\\n</li>\\n<li>\\n<p><strong>如何保证更新完数据库后，删除缓存操作一定成功？</strong>\\n就是你了**<em>重试</em><strong>。但是要考虑好重试次数，如果一直重试会一直占用这个线程资源。那么怎么办才好啊？就是你了</strong><em>异步重试</em>**：其实就是把重试请求写到消息队列中，然后由专门的消费者来重试，直到成功。那你又加了一个消息队列，不是让业务更复杂了吗？嗯是这样的，但是消息队列的好处也是大大的，除了上面的功能外，如果执行删除缓存的线程在重试过程中，突然后端服务挂了，那么重试请求也停止了（丢失了）导致数据库和缓存中的数据不一致了，而把这个删除缓存的请求放到消息队列中，等你重启后，还可以继续消费。况且你的项目中一定有别的地方也会用到消息队列，所以就是新增一个“队列”就行了。\\n</p>\\n</li>\\n<li>\\n<p>除了消息队列，现在比较流行的是<strong>订阅数据库变更日志，再操作缓存</strong>。如当 MySQL 修改数据后，会在 Binlog 中记录一条日志，然后通过订阅这个日志，再删除对应的缓存。\\n\\n这样就不用考虑后端写入消息队列时失败的情况了。</p>\\n</li>\\n</ol>","autoDesc":true}');export{d as comp,h as data};
