<template>
  <div>
    <sticky-top>
      <div class="title">
        <span>{{ isCreate ? '创建Tag' : '更新Tag' }}</span>
        <span class="back" @click="back"> <i class="iconfont icon-fanhui"></i> 返回 </span>
        <el-divider></el-divider>
      </div>
    </sticky-top>
    <div class="container">
      <div class="wrap">
        <el-row>
          <el-col :lg="16" :md="20" :sm="24" :xs="24">
            <el-form v-loading="loading" :model="form" status-icon ref="form" label-width="100px" @submit.native.prevent>
              <el-form-item label="标题" prop="title">
                <el-input size="medium" v-model="form.title" placeholder="请填写标题"></el-input>
              </el-form-item>
              <el-form-item label="tag描述" prop="description">
                <el-input size="medium" v-model="form.description" placeholder="请填写tag描述"></el-input>
              </el-form-item>
              <el-form-item label="是否高亮">
                <el-switch
                  size="medium"
                  v-model="onHighlighted"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="高亮"
                  inactive-text="不高亮"
                ></el-switch>
              </el-form-item>
              <el-form-item label="是否显示">
                <el-switch
                  size="medium"
                  v-model="onlined"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-text="显示"
                  inactive-text="不显示"
                ></el-switch>
              </el-form-item>


              <el-form-item class="submit">
                <el-button
                  v-permission="{ permission: ['创建Tag', '更新Tag'], type: 'disabled' }"
                  type="primary"
                  @click="submitForm('form')"
                >保 存
                </el-button
                >
                <el-button @click="resetForm('form')">重 置</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import Tag from '@/model/tag'
export default {
  name: "tag-edit",
  props: {
    isCreate: {
      type: Boolean,
      default: false,
    },
    tagId: {
      type: String,
      default: null,
    },
  },
  watch: {
    onlined(val) {
      this.form.type = val ? 1 : 0
    },
    onHighlighted(val) {
      this.form.highlight = val ? 1 : 0
    },
  },
  data(){
    return{
      loading:false,
      form: {
        title: '',
        description: '',
        highlight: 0,
        type: 0,
      },
      onlined:false,//form中type的bool转化
      onHighlighted:false,//form中highlight的bool转化
    }
  },
  //生命周期函数
  async mounted() {
    if (!this.isCreate) {
      this.loading = true
      const res = await this.getDetail()
      this.loading = false
      this.form = res
    }
  },

  methods: {
    async submitForm(formName) {
      try {
        const postData = { ...this.form }
        let res
        if (this.isCreate) {
          res = await Tag.addTag(postData)
        } else {
          res = await Tag.editTag(this.tagId, postData)
        }
        if (res.code < window.MAX_SUCCESS_CODE) {
          this.$message.success(`${res.message}`)
          this.$confirm('是否返回上一页', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(async () => {
            this.$emit('editClose')
          })
        }
      } catch (error) {
        console.error(error)
      }
    },
    async getDetail() {
      const detail = await Tag.getTag(this.tagId)
      this.onHighlighted=detail.highlight==1?true:false
      this.onlined=detail.type==1?true:false;
      // console.log(detail)
      return detail
    },
    //重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.onlined=false;
      this.onHighlighted=false;
    },
    back() {
      this.$emit('editClose')
    },
  }
}
</script>

<style lang="scss" scoped>
.el-divider--horizontal {
  margin: 0;
}

.container {
  .title {
    height: 59px;
    line-height: 59px;
    color: $parent-title-color;
    font-size: 16px;
    font-weight: 500;
    text-indent: 40px;

    .back {
      float: right;
      margin-right: 40px;
      cursor: pointer;
    }
  }

  .wrap {
    padding: 20px;
  }

  .submit {
    float: left;
  }
}

.display_img {
  max-width: 100px;
  max-height: 50px;
  width: auto;
  height: auto;
}

.plus {
  display: flex;
  justify-content: space-between;
}

.complete {
  margin-top: 20px;
  display: flex;
  .add {
    margin-left: 10px;
  }
}

.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;
    display: inline-flex;
    align-content: space-around;
    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .id {
      margin-right: 15px;
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}
</style>
