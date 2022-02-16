<template>
  <view class="uni-container">
    <uni-forms ref="form" :value="formData" validateTrigger="bind">
      <uni-forms-item name="order_guid" label="编号" required>
        <uni-easyinput placeholder="唯一订单编号" v-model="formData.order_guid" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="user_id" label="" required>
        <uni-easyinput placeholder="下单用户ID， 参考`uni-id-users` 表" v-model="formData.user_id"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="good_id" label="商品id">
        <uni-easyinput placeholder="商品id，参考`uni-mall-goods`表" v-model="formData.good_id"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="platform_type" label="" required>
        <uni-easyinput placeholder="平台类型：1为线下，2为O2O，3为B2C" type="number" v-model="formData.platform_type"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="total_cash" label="" required>
        <undefined v-model="formData.total_cash"></undefined>
      </uni-forms-item>
      <uni-forms-item name="discount_cash" label="">
        <undefined v-model="formData.discount_cash"></undefined>
      </uni-forms-item>
      <uni-forms-item name="is_promotion" label="">
        <uni-easyinput placeholder="提取状态：0为待提取，1为提取" type="number" v-model="formData.is_promotion"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="payment_date" label="">
        <uni-datetime-picker return-type="timestamp" v-model="formData.payment_date"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="cancel_date" label="">
        <uni-datetime-picker return-type="timestamp" v-model="formData.cancel_date"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="create_date" label="" required>
        <uni-datetime-picker return-type="timestamp" v-model="formData.create_date"></uni-datetime-picker>
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
  import { validator } from '../../../js_sdk/validator/opendb-mall-order.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'opendb-mall-order';

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
        "order_guid": "",
        "user_id": "",
        "good_id": "",
        "platform_type": null,
        "total_cash": null,
        "discount_cash": null,
        "is_promotion": null,
        "payment_date": null,
        "cancel_date": null,
        "create_date": null
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
