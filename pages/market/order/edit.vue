<template>
  <view class="uni-container">
    <uni-forms ref="form" :value="formData" validateTrigger="bind"  :rules="rules">
      <uni-forms-item name="order_guid" label="编号" required>
        <uni-easyinput placeholder="唯一订单编号" v-model="formData.order_guid" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="good_id" label="商品id" required>
        <uni-easyinput placeholder="商品id" v-model="formData.good_id"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="total_cash" label="实付金额" required>
      	<uni-easyinput placeholder="实付金额" type="number" v-model="formData.total_cash"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="discount_cash" label="优惠金额">
       	<uni-easyinput placeholder="优惠金额" type="number" v-model="formData.discount_cash"></uni-easyinput>
      </uni-forms-item>
	  <uni-forms-item name="create_date" label="创建时间" required>
	    <uni-datetime-picker return-type="timestamp" v-model="formData.create_date"></uni-datetime-picker>
	  </uni-forms-item>
      <uni-forms-item name="payment_date" label="支付时间">
        <uni-datetime-picker return-type="timestamp" v-model="formData.payment_date"></uni-datetime-picker>
      </uni-forms-item>
  <!--    <uni-forms-item name="cancel_date" label="">
        <uni-datetime-picker return-type="timestamp" v-model="formData.cancel_date"></uni-datetime-picker>
      </uni-forms-item> -->
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
  import { validator } from '../../../js_sdk/validator/market-order.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'market-order';

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
        "good_id": "",
        "total_cash": 0,
        "discount_cash": 0,
        "payment_date": null,
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
    onLoad(e) {
      if (e.id) {
        const id = e.id
        this.formDataId = id
        this.getDetail(id)
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
        return db.collection(dbCollectionName).doc(this.formDataId).update(value).then((res) => {
          uni.showToast({
            title: '修改成功'
          })
          this.getOpenerEventChannel().emit('refreshData')
          setTimeout(() => uni.navigateBack(), 500)
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        })
      },

      /**
       * 获取表单数据
       * @param {Object} id
       */
      getDetail(id) {
        uni.showLoading({
          mask: true
        })
        db.collection(dbCollectionName).doc(id).field("order_guid,user_id,good_id,platform_type,total_cash,discount_cash,is_promotion,payment_date,cancel_date,create_date").get().then((res) => {
          const data = res.result.data[0]
          if (data) {
            this.formData = data
          }
        }).catch((err) => {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        }).finally(() => {
          uni.hideLoading()
        })
      }
    }
  }
</script>
