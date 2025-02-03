import{_ as t,c as l,b as a,o as i}from"./app-Bbo_IWtf.js";const n={};function o(r,e){return i(),l("div",null,e[0]||(e[0]=[a('<h1 id="所有的锁" tabindex="-1"><a class="header-anchor" href="#所有的锁"><span>所有的锁</span></a></h1><h2 id="悲观锁与乐观锁" tabindex="-1"><a class="header-anchor" href="#悲观锁与乐观锁"><span>悲观锁与乐观锁</span></a></h2><ol><li>悲观锁：认为共享资源在每次被访问的时候都会出现问题（如被其他线程修改），所以每次使用这个共享资源时都加锁，使用完后再释放锁。</li><li>乐观锁：认为共享资源在每次被访问的时候都不会（很少）出现问题，所以每次使用这个共享资源时只是去验证这个数据有没有被其他线程修改。（CAS）</li></ol><p>ps：乐观锁不适合在并发量大的场景中使用，大量线程不断 CAS 极大可能 CAS 失败，而一直重试使得性能下降。</p><h2 id="公平锁与非公平锁" tabindex="-1"><a class="header-anchor" href="#公平锁与非公平锁"><span>公平锁与非公平锁</span></a></h2><ol><li>公平锁：每次获取锁的线程都是按照队列的顺序来获取锁的。当前线程需要放到阻塞队列中等待。</li><li>非公平锁：每次获取锁时当前线程有可能直接获取到锁。</li></ol><h2 id="可中断锁与不可中断锁" tabindex="-1"><a class="header-anchor" href="#可中断锁与不可中断锁"><span>可中断锁与不可中断锁</span></a></h2><ol><li>可中断锁：允许线程在等待锁的过程中响应中断请求。如果线程在等待锁时被中断，它会抛出 InterruptedException 并停止等待。 适用于需要及时取消任务的场景。</li><li>不可中断锁：在等待锁时不会响应中断请求，线程会一直等待直到获取锁。 适用于有必须要完成的关键任务，这个任务必须完成不能中途取消。</li></ol><h2 id="共享锁与独占锁" tabindex="-1"><a class="header-anchor" href="#共享锁与独占锁"><span>共享锁与独占锁</span></a></h2><ol><li>共享锁（读锁）：一个锁可被多个线程占有。只用于读不能修改。当有一个线程占用共享锁时，其他线程不同获取排他锁。 适用于读多写少的场景。</li><li>排他锁（写锁）：一个锁只能被一个线程占有。与共享锁互斥。 适用于写操作多的场景。</li></ol>',10)]))}const s=t(n,[["render",o],["__file","allLock.html.vue"]]),p=JSON.parse('{"path":"/backendPro/juc/allLock.html","title":"所有的锁","lang":"zh-CN","frontmatter":{"description":"所有的锁 悲观锁与乐观锁 悲观锁：认为共享资源在每次被访问的时候都会出现问题（如被其他线程修改），所以每次使用这个共享资源时都加锁，使用完后再释放锁。 乐观锁：认为共享资源在每次被访问的时候都不会（很少）出现问题，所以每次使用这个共享资源时只是去验证这个数据有没有被其他线程修改。（CAS） ps：乐观锁不适合在并发量大的场景中使用，大量线程不断 CAS...","head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/RoseWhisperInTheWind/backendPro/juc/allLock.html"}],["meta",{"property":"og:site_name","content":"风中玫瑰的低语"}],["meta",{"property":"og:title","content":"所有的锁"}],["meta",{"property":"og:description","content":"所有的锁 悲观锁与乐观锁 悲观锁：认为共享资源在每次被访问的时候都会出现问题（如被其他线程修改），所以每次使用这个共享资源时都加锁，使用完后再释放锁。 乐观锁：认为共享资源在每次被访问的时候都不会（很少）出现问题，所以每次使用这个共享资源时只是去验证这个数据有没有被其他线程修改。（CAS） ps：乐观锁不适合在并发量大的场景中使用，大量线程不断 CAS..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-02-03T04:53:07.000Z"}],["meta",{"property":"article:modified_time","content":"2025-02-03T04:53:07.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"所有的锁\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-02-03T04:53:07.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Rose\\",\\"url\\":\\"https://mister-hope.com\\"}]}"]]},"headers":[{"level":2,"title":"悲观锁与乐观锁","slug":"悲观锁与乐观锁","link":"#悲观锁与乐观锁","children":[]},{"level":2,"title":"公平锁与非公平锁","slug":"公平锁与非公平锁","link":"#公平锁与非公平锁","children":[]},{"level":2,"title":"可中断锁与不可中断锁","slug":"可中断锁与不可中断锁","link":"#可中断锁与不可中断锁","children":[]},{"level":2,"title":"共享锁与独占锁","slug":"共享锁与独占锁","link":"#共享锁与独占锁","children":[]}],"git":{"createdTime":1738558387000,"updatedTime":1738558387000,"contributors":[{"name":"Rose","email":"2677596161@qq.com","commits":1}]},"readingTime":{"minutes":1.57,"words":472},"filePathRelative":"backendPro/juc/allLock.md","localizedDate":"2025年2月3日","excerpt":"\\n<h2>悲观锁与乐观锁</h2>\\n<ol>\\n<li>悲观锁：认为共享资源在每次被访问的时候都会出现问题（如被其他线程修改），所以每次使用这个共享资源时都加锁，使用完后再释放锁。</li>\\n<li>乐观锁：认为共享资源在每次被访问的时候都不会（很少）出现问题，所以每次使用这个共享资源时只是去验证这个数据有没有被其他线程修改。（CAS）</li>\\n</ol>\\n<p>ps：乐观锁不适合在并发量大的场景中使用，大量线程不断 CAS 极大可能 CAS 失败，而一直重试使得性能下降。</p>\\n<h2>公平锁与非公平锁</h2>\\n<ol>\\n<li>公平锁：每次获取锁的线程都是按照队列的顺序来获取锁的。当前线程需要放到阻塞队列中等待。</li>\\n<li>非公平锁：每次获取锁时当前线程有可能直接获取到锁。</li>\\n</ol>","autoDesc":true}');export{s as comp,p as data};
