<template>
  <ul class="c-goods-list">
    <li>
      <img
        src="https://img.alicdn.com/bao/uploaded/i1/2273169350/O1CN01vt034B2IwLqll4gMc_!!0-item_pic.jpg_400x400q90.jpg_.webp"
        alt="">
      <div class="goods-body">
        scybe喜碧水杯耐热玻璃杯子大容量牛奶杯早餐杯麦片杯酸奶杯家用
        <div class="goods-summary">
          耐热400℃加厚防侧翻
        </div>
        <div class="goods-price">
          <span class="goods-currency">￥</span>
          9.9
        </div>
      </div>
    </li>
  </ul>
</template>

<script lang="ts" setup>
</script>

<style scoped>
.c-goods-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  row-gap: 10px;
}

.c-goods-list img {
  width: 80px;
  height: 80px;
  border-radius: 4px;
}

.c-goods-list>li {
  display: flex;
  align-items: flex-start;
  column-gap: 6px;
}

.goods-body {
  font-size: 16px;
  color: #111;
  text-align: left;
}

.goods-summary {
  margin-top: 4px;
  font-size: 12px;
}

.goods-price {
  color: red;
  font-size: 20px;
}

.goods-currency {
  font-size: 12px;
}
</style>