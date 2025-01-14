# 如何解决订单相关问题？

## 重复提交订单

使用分布式锁，在用户第一次提交订单时，就尝试获取分布式锁，key 不能简单的设置为 orderId，因为 orderId 通常都是用雪花算法生成的，第二次重复提交订单时，得到的 orderId 时不同的，但是我们可以使用 userId 和任何一些 xxx 你想要减小锁细度的东西。

## 支付订单问题

问题描述：当用户付款时，正好到了订单自动取消的时间。而用户付完款后，订单的状态确实超时取消。

个人想法：在点击支付的时候尝试设置分布式锁（使用 orderId），点击取消订单的时候也尝试设置分布式锁（与上面的是同一个 key）这样当你点击支付后，即使到期了也因为无法获得分布式锁而不会自动取消订单。
