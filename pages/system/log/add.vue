<template>
  <view class="uni-container">
    <uni-forms ref="form" :value="formData" validateTrigger="bind" :rules="rules">
      <uni-forms-item name="user_id" label="用户id" required>
        <uni-easyinput placeholder="用户id" v-model="formData.user_id"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="ua" label="用户代理">
        <uni-easyinput placeholder="用户代理" v-model="formData.ua"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="type" label="类型">
        <uni-data-checkbox v-model="formData.type" :localdata="formOptions.type_localdata"></uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item name="state" label="状态">
        <uni-easyinput placeholder="结果：0 失败、1 成功" type="number" v-model="formData.state"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="ip" label="ip地址">
        <uni-easyinput placeholder="ip地址" v-model="formData.ip"></uni-easyinput>
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
  import { validator } from '../../../js_sdk/validator/system-log.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'system-log';

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
        "user_id": "",
        "ua": "",
        "type": "",
        "state": null,
        "ip": ""
      }
      return {
        formData,
        formOptions: {
          "type_localdata": [
            {
              "value": "login",
              "text": "login"
            },
            {
              "value": "logout",
              "text": "logout"
            }
          ]
        },
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
