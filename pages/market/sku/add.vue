<template>
  <view class="uni-container">
    <uni-forms ref="form" :value="formData" validateTrigger="bind">
      <uni-forms-item name="create_date" label="" required>
        <uni-datetime-picker return-type="timestamp" v-model="formData.create_date"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="goods_id" label="" required>
        <uni-easyinput placeholder="商品 id，参考 opendb-mall-goods 表" v-model="formData.goods_id"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="market_price" label="">
        <uni-easyinput placeholder="市场价，以分为单位，避免浮点计算的精度问题" type="number" v-model="formData.market_price"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="price" label="" required>
        <uni-easyinput placeholder="价格，以分为单位，避免浮点计算的精度问题" type="number" v-model="formData.price"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="sku_name" label="" required>
        <uni-easyinput placeholder="SKU名称" v-model="formData.sku_name" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="stock" label="" required>
        <uni-easyinput placeholder="库存" type="number" v-model="formData.stock"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="update_date" label="" required>
        <uni-datetime-picker return-type="timestamp" v-model="formData.update_date"></uni-datetime-picker>
      </uni-forms-item>
      <view class="uni-button-group">
        <button type="primary" class="uni-button" style="width: 100px;" @click="submit">提交</button>
        <navigator open-type="navigateBack" style="margin-left: 15px;">
          <button class="uni-button" style="width: 100px;">返回</button>
        </navigator>
      </view>
    </uni-forms>
  </view>
</template>

<script>
  import { validator } from '../../../js_sdk/validator/opendb-mall-sku.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'opendb-mall-sku';

  function getValidator(fields) {
    let result = {}
    for (let key in validator) {
      if (fields.includes(key)) {
        result[key] = validator[key]
      }
    }
    return result
  }

  export default {
    data() {
      let formData = {
        "create_date": null,
        "goods_id": "",
        "market_price": null,
        "price": null,
        "sku_name": "",
        "stock": null,
        "update_date": null
      }
      return {
        formData,
        formOptions: {},
        rules: {
          ...getValidator(Object.keys(formData))
        }
      }
    },
    onReady() {
      this.$refs.form.setRules(this.rules)
    },
    methods: {
      /**
       * 验证表单并提交
       */
      submit() {
        uni.showLoading({
          mask: true
        })
        this.$refs.form.validate().then((res) => {
          return this.submitForm(res)
        }).catch(() => {
        }).finally(() => {
          uni.hideLoading()
        })
      },

      /**
       * 提交表单
       */
      submitForm(value) {
        // 使用 clientDB 提交数据
        return db.collection(dbCollectionName).add(value).then((res) => {
          uni.showToast({
            title: '新增成功'
          })
          this.getOpenerEventChannel().emit('refreshData')
          setTimeout(() => uni.navigateBack(), 500)
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        })
      }
    }
  }
</script>
