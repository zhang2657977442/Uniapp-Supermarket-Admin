<template>
  <view class="uni-container">
    <uni-forms ref="form" :value="formData" validateTrigger="bind" :rules="rules">
      <uni-forms-item name="category_id" label="">
        <uni-easyinput placeholder="分类 id" v-model="formData.category_id"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="goods_sn" label="货号" required>
        <uni-easyinput placeholder="商品的唯一货号" v-model="formData.goods_sn" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="name" label="名称" required>
        <uni-easyinput placeholder="商品名称" v-model="formData.name" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="keywords" label="关键字">
        <uni-easyinput placeholder="商品关键字，为搜索引擎收录使用" v-model="formData.keywords" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="goods_desc" label="详细描述">
        <uni-easyinput placeholder="商品详细描述" v-model="formData.goods_desc" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="goods_thumb" label="缩略图地址">
        <uni-easyinput placeholder="商品缩略图，用于在列表或搜索结果中预览显示" v-model="formData.goods_thumb" trim="both"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="goods_banner_imgs" label="">
        <uni-data-checkbox :multiple="true" v-model="formData.goods_banner_imgs"></uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item name="remain_count" label="库存数量" required>
        <uni-easyinput placeholder="库存数量" type="number" v-model="formData.remain_count"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="month_sell_count" label="" required>
        <uni-easyinput placeholder="月销量" type="number" v-model="formData.month_sell_count"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="total_sell_count" label="" required>
        <uni-easyinput placeholder="总销量" type="number" v-model="formData.total_sell_count"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="comment_count" label="" required>
        <uni-easyinput placeholder="累计评论数" type="number" v-model="formData.comment_count"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="is_real" label="是否为实物" required>
        <switch @change="binddata('is_real', $event.detail.value)" :checked="formData.is_real"></switch>
      </uni-forms-item>
      <uni-forms-item name="is_on_sale" label="是否上架" required>
        <switch @change="binddata('is_on_sale', $event.detail.value)" :checked="formData.is_on_sale"></switch>
      </uni-forms-item>
      <uni-forms-item name="is_alone_sale" label="" required>
        <switch @change="binddata('is_alone_sale', $event.detail.value)" :checked="formData.is_alone_sale"></switch>
      </uni-forms-item>
      <uni-forms-item name="is_best" label="" required>
        <switch @change="binddata('is_best', $event.detail.value)" :checked="formData.is_best"></switch>
      </uni-forms-item>
      <uni-forms-item name="is_new" label="是否新品" required>
        <switch @change="binddata('is_new', $event.detail.value)" :checked="formData.is_new"></switch>
      </uni-forms-item>
      <uni-forms-item name="is_hot" label="" required>
        <switch @change="binddata('is_hot', $event.detail.value)" :checked="formData.is_hot"></switch>
      </uni-forms-item>
      <uni-forms-item name="add_date" label="">
        <uni-datetime-picker return-type="timestamp" v-model="formData.add_date"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="last_modify_date" label="">
        <uni-datetime-picker return-type="timestamp" v-model="formData.last_modify_date"></uni-datetime-picker>
      </uni-forms-item>
      <uni-forms-item name="seller_note" label="">
        <uni-easyinput placeholder="商家备注，仅商家可见" v-model="formData.seller_note" trim="both"></uni-easyinput>
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
    import { validator } from '../../../js_sdk/validator/opendb-mall-goods.js';

  const db = uniCloud.database();
  const dbCmd = db.command;
  const dbCollectionName = 'opendb-mall-goods';

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
        "category_id": "",
        "goods_sn": "",
        "name": "",
        "keywords": "",
        "goods_desc": "",
        "goods_thumb": "",
        "goods_banner_imgs": [],
        "remain_count": null,
        "month_sell_count": null,
        "total_sell_count": null,
        "comment_count": null,
        "is_real": null,
        "is_on_sale": null,
        "is_alone_sale": null,
        "is_best": null,
        "is_new": null,
        "is_hot": null,
        "add_date": null,
        "last_modify_date": null,
        "seller_note": ""
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
        db.collection(dbCollectionName).doc(id).field("category_id,goods_sn,name,keywords,goods_desc,goods_thumb,goods_banner_imgs,remain_count,month_sell_count,total_sell_count,comment_count,is_real,is_on_sale,is_alone_sale,is_best,is_new,is_hot,add_date,last_modify_date,seller_note").get().then((res) => {
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
