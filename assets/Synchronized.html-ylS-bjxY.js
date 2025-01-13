import{_ as s,c as n,b as a,o as l}from"./app-DeUaIzc7.js";const e="/RoseWhisperInTheWind/assets/Monitor%E7%BB%93%E6%9E%84-CdXNdR3A.png",t="/RoseWhisperInTheWind/assets/%E8%BD%BB%E9%87%8F%E7%BA%A7%E9%94%81-DW61TOwF.png",h="/RoseWhisperInTheWind/assets/%E8%BD%BB%E9%87%8F%E7%BA%A7%E9%94%81%E9%87%8D%E5%85%A5-BZGAhUe5.png",p="/RoseWhisperInTheWind/assets/%E8%BD%BB%E9%87%8F%E7%BA%A7%E9%94%81%E8%86%A8%E8%83%80-BLO0WK_X.png",r="/RoseWhisperInTheWind/assets/%E9%87%8D%E9%87%8F%E7%BA%A7%E9%94%81-B4N7OEJe.png",k={};function d(c,i){return l(),n("div",null,i[0]||(i[0]=[a('<h1 id="深挖-synchronized-原理" tabindex="-1"><a class="header-anchor" href="#深挖-synchronized-原理"><span>深挖 Synchronized 原理</span></a></h1><p>写在前面：我太懒了，这里的图都是来自我学习 JUC 时候看的黑马程序员视频中的图。感谢这个教学视频，感谢讲解这个教学的老师。</p><h2 id="synchronized-能干啥" tabindex="-1"><a class="header-anchor" href="#synchronized-能干啥"><span>synchronized 能干啥</span></a></h2><p><strong>简单一句话</strong>：synchronized 关键字用于实现同步控制，确保同一时刻只有一个线程可以执行被保护的代码块或方法。</p><h2 id="monitor-原理" tabindex="-1"><a class="header-anchor" href="#monitor-原理"><span>Monitor 原理</span></a></h2><p>在提起 synchronized 之前必须要和大家说一下 Monitor 对象。Monitor 被翻译成监视器，每个 Java 对象都可以关联一个 Monitor 对象，如果给一个对象加上重量级锁后，这个对象头中的 Mark Word 就被设置成指向 Monitor 对象的指针。 <img src="'+e+'" alt="Alt" loading="lazy"></p><ul><li>WaitSet：是那些调用了 wait( )方法的线程，调用 wait( )的线程会进入进入 WAITING 状态并，主动放弃这个锁对象进入 WaitSet 中等别的线程 notify，在别的线程 notify 后会进入 EntryList 中和大家一起竞争锁资源。</li><li>EntryList：那些没有竞争到锁只好阻塞的 loser。（可怜呜呜呜）</li><li>Owner：锁的持有者。</li></ul><h2 id="synchronized-之偏向锁" tabindex="-1"><a class="header-anchor" href="#synchronized-之偏向锁"><span>Synchronized 之偏向锁</span></a></h2><ol><li>适用于只有一个线程访问同步块的场景。好不好奇为啥啊？</li><li>因为 JVM 会把这个共享变量的的对象头的 MarkWord 设置成这个线程 id，之后如果还是这个线程来访问，就不用 CAS 了！嘶。。。是不是很奇怪这里我为啥要写 CAS 呢？请看轻量级锁！！！</li></ol><h2 id="synchronized-之轻量级锁" tabindex="-1"><a class="header-anchor" href="#synchronized-之轻量级锁"><span>Synchronized 之轻量级锁</span></a></h2><ol><li><strong>适用场景</strong>：有多个线程来竞争，但是竞争不太激烈，比如加锁的时间是错开的。</li><li><strong>如何实现呢？</strong> JVM 会在当前的线程的栈帧中创建一个 Lock Record 对象，并尝试使用 CAS 把这个共享变量的对象头中的 Mark Word 替换为指向这个 Lock Record 的指针。同时 JVM 在轻量级锁的实现中引入了 锁计数器 和 持有线程的标识（保存在对象头的 Mark Word 里）。 <img src="'+t+'" alt="Alt" loading="lazy"></li><li><strong>如果 CAS 失败了呢？</strong> 黑马课程告诉你会有两种情况：一是可能出现其他线程来竞争了，二是可能是自己锁重入。但我告诉你这不对，因为这样太傻了！为啥自己锁重入还要 CAS 啊？CAS 还得比对这那的，为啥不在 CAS 前看看 Mark Word 里持有线程标识是不是自己就好了呢？看我的第四条！ <ul><li>有其他线程来获取锁了，发现这个共享变量对象头的 Mark Word 已经被修改了。完蛋啦完蛋啦，出现竞争啦，锁膨胀叭。</li></ul></li><li><strong>锁重入</strong> 轻量级锁重入就是发现 Mark Word 里的线程标识就是自己，然后不去 CAS，直接把锁计数器+1。退出就-1 呗。 <img src="'+h+'" alt="轻量级锁重入" loading="lazy"></li><li><strong>锁释放</strong> 当退出 synchronized 代码块（解锁时）锁记录的值不为 null，这时使用 CAS 将 Mark Word 的值恢复给对象头。请问会失败吗？会！因为有可能出现了锁升级，这时就要进行重量级锁的解锁流程。</li></ol><h2 id="synchronized-之重量级锁" tabindex="-1"><a class="header-anchor" href="#synchronized-之重量级锁"><span>Synchronized 之重量级锁</span></a></h2><ol><li><strong>适用场景</strong>：当多个线程频繁竞争同一个对象的锁，导致轻量级锁无法有效处理时。</li><li><strong>如何实现</strong>：终于用到了开头说的 Monitor 对象了！JVM 会将对象头的 Mark Word 指向一个名为 ObjectMonitor 的数据结构。ObjectMonitor 包含了所有与锁相关的状态信息，如持有锁的线程（Owner）、等待队列（WaitSet）、阻塞队列（EntryList）等。</li><li><strong>锁膨胀</strong>：当一个线程已经获取到轻量级锁后，如何升级为重量级锁呢？ <img src="'+p+'" alt="Alt" loading="lazy"><img src="'+r+`" alt="Alt" loading="lazy"></li></ol><h2 id="自旋优化" tabindex="-1"><a class="header-anchor" href="#自旋优化"><span>自旋优化</span></a></h2><p>有没有感觉升级到重量级锁的过程太简单了，感觉锁膨胀和阻塞会很频繁吧？人家大佬肯定也知道，所以来看看这个 JVM 的 sao 操作。</p><ol><li><strong>解释一下</strong>：就是让线程在短时间内不断尝试通过 CAS 操作获取锁，而不立即进入阻塞状态。如果在这段时间内锁被释放，线程可以立即获得锁并继续执行，避免了阻塞和唤醒的开销。这多好啊！( CPU 说：你最好是个人？)</li><li>自旋优化比较适合那些竞争不太激烈，而每个线程占用锁的时间比较短的情况。对了，自旋优化的一些参数还可以手动在启动 JVM 前配置，感兴趣的朋友可以用大语言模型搜搜。</li></ol><h2 id="锁粒度" tabindex="-1"><a class="header-anchor" href="#锁粒度"><span>锁粒度</span></a></h2><ol><li>类级锁：锁是类对象（Class 对象）</li><li>类对象锁：使用实例对象锁</li></ol><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">class</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> ClassLevelExample</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">   private</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> static</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> int</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> staticCount</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">    // 这是一个类级别的同步静态方法 (类级锁)</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">   public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> static</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> synchronized</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> void</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> incrementStaticCount</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">()</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">      staticCount++;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">   }</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">   public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> static</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> void</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> incrementStaticCount2</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">()</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">      // 这是一个类级别的同步静态方法 (类级锁)</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">      synchronized</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">ClassLevelExample</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">class</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">){</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">         staticCount++;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">      }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">   }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">   public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> int</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> getStaticCount</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">()</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">      return</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> staticCount;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">   }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">   private</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> int</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> instanceCount</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">   // 对象级锁</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">   public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> synchronized</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> void</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> incrementInstanceCount</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">()</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">      instanceCount++;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">   }</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">   public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> synchronized</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> void</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> incrementInstanceCount2</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">()</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">      // 对象级锁</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">      synchronized</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">){</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">         instanceCount++;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">      }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">   }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">   public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> int</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> getInstanceCount</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">()</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">      return</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> instanceCount;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">   }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当一个线程使用了类级锁的时候。其他任何线程都不能使用这个类（包括其他对象实例）中任何有类级锁修饰的方法。而对象级锁是其他线程不能使用这同一个对象的有对象级锁修饰的方法。但是如果一个线程使用了类级锁的方法，其他线程仍然可以使用对象级锁的方法。</p><h2 id="synchronized-的作用" tabindex="-1"><a class="header-anchor" href="#synchronized-的作用"><span>Synchronized 的作用</span></a></h2><ol><li>保证原子性、可见性</li><li>保证有序性：如果在本线程内观察，所有的操作都是有序的；如果在一个线程观察另一个线程，所有的操作都是无序的。（但是不能防止指令重排序，需要与 volatile 一起使用）如下面的单例模式：</li></ol><div class="language-java line-numbers-mode" data-highlighter="shiki" data-ext="java" data-title="java" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">// 双重校验锁的懒汉单例</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> final</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> class</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> Singleton</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">   private</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> Singleton</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">()</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> { }</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">   // 使用volatile关键字，防止指令重排序</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">   private</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> static</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> volatile</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> Singleton</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;"> INSTANCE </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> null</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">   public</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> static</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> Singleton</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> getInstance</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">()</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">      if</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> (INSTANCE </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">!=</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> null</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">) {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">         return</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> INSTANCE;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">      }</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">      synchronized</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> (</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">Singleton</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">class</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">) {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">         if</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> (INSTANCE </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">!=</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> null</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">) {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">            return</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> INSTANCE;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">         }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">         INSTANCE </span><span style="--shiki-light:#383A42;--shiki-dark:#56B6C2;">=</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> Singleton</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">();</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">         return</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> INSTANCE;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">      }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">   }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,23)]))}const A=s(k,[["render",d],["__file","Synchronized.html.vue"]]),y=JSON.parse('{"path":"/backendPro/juc/Synchronized.html","title":"深挖 Synchronized 原理","lang":"zh-CN","frontmatter":{"description":"深挖 Synchronized 原理 写在前面：我太懒了，这里的图都是来自我学习 JUC 时候看的黑马程序员视频中的图。感谢这个教学视频，感谢讲解这个教学的老师。 synchronized 能干啥 简单一句话：synchronized 关键字用于实现同步控制，确保同一时刻只有一个线程可以执行被保护的代码块或方法。 Monitor 原理 在提起 sync...","head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/RoseWhisperInTheWind/backendPro/juc/Synchronized.html"}],["meta",{"property":"og:site_name","content":"风中玫瑰的低语"}],["meta",{"property":"og:title","content":"深挖 Synchronized 原理"}],["meta",{"property":"og:description","content":"深挖 Synchronized 原理 写在前面：我太懒了，这里的图都是来自我学习 JUC 时候看的黑马程序员视频中的图。感谢这个教学视频，感谢讲解这个教学的老师。 synchronized 能干啥 简单一句话：synchronized 关键字用于实现同步控制，确保同一时刻只有一个线程可以执行被保护的代码块或方法。 Monitor 原理 在提起 sync..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2025-01-11T13:55:34.000Z"}],["meta",{"property":"article:modified_time","content":"2025-01-11T13:55:34.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"深挖 Synchronized 原理\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2025-01-11T13:55:34.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Rose\\",\\"url\\":\\"https://mister-hope.com\\"}]}"]]},"headers":[{"level":2,"title":"synchronized 能干啥","slug":"synchronized-能干啥","link":"#synchronized-能干啥","children":[]},{"level":2,"title":"Monitor 原理","slug":"monitor-原理","link":"#monitor-原理","children":[]},{"level":2,"title":"Synchronized 之偏向锁","slug":"synchronized-之偏向锁","link":"#synchronized-之偏向锁","children":[]},{"level":2,"title":"Synchronized 之轻量级锁","slug":"synchronized-之轻量级锁","link":"#synchronized-之轻量级锁","children":[]},{"level":2,"title":"Synchronized 之重量级锁","slug":"synchronized-之重量级锁","link":"#synchronized-之重量级锁","children":[]},{"level":2,"title":"自旋优化","slug":"自旋优化","link":"#自旋优化","children":[]},{"level":2,"title":"锁粒度","slug":"锁粒度","link":"#锁粒度","children":[]},{"level":2,"title":"Synchronized 的作用","slug":"synchronized-的作用","link":"#synchronized-的作用","children":[]}],"git":{"createdTime":1733850087000,"updatedTime":1736603734000,"contributors":[{"name":"Rose","email":"2677596161@qq.com","commits":2}]},"readingTime":{"minutes":5.2,"words":1561},"filePathRelative":"backendPro/juc/Synchronized.md","localizedDate":"2024年12月10日","excerpt":"\\n<p>写在前面：我太懒了，这里的图都是来自我学习 JUC 时候看的黑马程序员视频中的图。感谢这个教学视频，感谢讲解这个教学的老师。</p>\\n<h2>synchronized 能干啥</h2>\\n<p><strong>简单一句话</strong>：synchronized 关键字用于实现同步控制，确保同一时刻只有一个线程可以执行被保护的代码块或方法。</p>\\n<h2>Monitor 原理</h2>\\n<p>在提起 synchronized 之前必须要和大家说一下 Monitor 对象。Monitor 被翻译成监视器，每个 Java 对象都可以关联一个 Monitor 对象，如果给一个对象加上重量级锁后，这个对象头中的 Mark Word 就被设置成指向 Monitor 对象的指针。\\n</p>","autoDesc":true}');export{A as comp,y as data};