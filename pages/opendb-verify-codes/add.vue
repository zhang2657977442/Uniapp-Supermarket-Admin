<template>
  <view class="uni-container">
    <uni-forms ref="form" :value="formData" validateTrigger="bind">
      <uni-forms-item name="mobile" label="">
        <uni-easyinput placeholder="手机号码" v-model="formData.mobile"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="email" label="">
        <uni-easyinput placeholder="邮箱" v-model="formData.email"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="code" label="">
        <uni-easyinput placeholder="验证码" v-model="formData.code"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="type" label="">
        <uni-easyinput placeholder="验证类型：login, bind, unbind, pay" v-model="formData.type"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="state" label="">
        <uni-easyinput placeholder="验证状态：0 未验证、1 已验证、2 已作废" type="number" v-model="formData.state"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="ip" label="">
        <uni-easyinput placeholder="请求时客户端IP地址" v-model="formData.ip"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="created_at" label="">
        <uni-datetime-picker return-type="timestamp" v-model="formData.created_at"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="expired_at" label="">
        <uni-datetime-picker return-type="timestamp" v-model="formData.expired_at"></uni-datetime-picker>
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
  import { validator } from '../../js_sdk/validator/opendb-verify-codes.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'opendb-verify-codes';

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
        "mobile": "",
        "email": "",
        "code": "",
        "type": "",
        "state": null,
        "ip": "",
        "created_at": null,
        "expired_at": null
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
