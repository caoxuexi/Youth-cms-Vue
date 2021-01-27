<template>
  <div class="container" v-if="!showEdit">
    <div class="header">
      <div class="title">Tag列表</div>
      <el-button style="margin-left:30px;" @click.prevent="addTag" type="primary" plain size="medium">
        添加Tag
      </el-button>
    </div>
    <el-table stripe v-loading="loading" :data="tableData">
      <el-table-column prop="id" label="id" width="100"></el-table-column>
      <el-table-column prop="title" label="标题" min-width="200"></el-table-column>
      <el-table-column prop="description" label="描述" min-width="200" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="highlight" label="高亮" min-width="200"></el-table-column>
      <el-table-column prop="type" label="是否显示" min-width="200"></el-table-column>
      <el-table-column fixed="right" width="150" label="操作">
        <template slot-scope="scope">
          <el-button @click.prevent="handleEdit(scope.row)" type="primary" plain size="mini">查看</el-button>
          <el-button
            @click.prevent="handleDelete(scope.row)"
            type="danger"
            plain
            size="mini"
            v-permission="{ permission: '删除Tag', type: 'disabled' }"
          >删除
          </el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :background="true"
        :page-size="pageCount"
        :current-page="currentPage"
        v-if="refreshPagination"
        layout="prev, pager, next, jumper"
        :total="totalNums"
      ></el-pagination>
    </div>
  </div>
  <!-- 详情页 -->
  <tag-edit v-else @editClose="editClose" :tagId="tagId" :isCreate="isCreate"></tag-edit>
</template>

<script>
import Tag from "@/model/tag";
import TagEdit from './tag-edit'

export default {
  components: {
    TagEdit
  },
  data() {
    return {
      loading: false,
      tagId: null,
      isCreate: null,//是修改还是创建
      showEdit: false,
      tableData: [],
      totalNums: 0, // 总条数
      currentPage: 1,
      pageCount: 10, //每页条数
      refreshPagination: true, // 页数增加的时候，因为缓存的缘故，需要刷新Pagination组件
      detailTagId: 0,
    }
  },
  name: "tag-manage",
  async created() {
    this.loading = true
    await this.getTags()
    this.loading = false
  },
  methods: {
    async getTags() {
      const page = this.currentPage - 1
      const count=this.PageCount
      const res = await Tag.getTags(page,count)
      this.totalNums = res.total
      this.tableData = res.items
    },
    //删除数据时调用的获取Tags的方法，为了PageCount保持原值不变
    async getTagsAfterDelete() {
      const page = this.currentPage - 1
      const res = await Tag.getTags(page)
      //还是用原来的totalNums
      this.tableData = res.items
    },
    // 切换table页
    async handleCurrentChange(val) {
      this.currentPage = val
      this.loading = true
      this.getTags()
      this.loading = false
    },
    //添加tag
    addTag() {
      this.isCreate = true
      this.tagId = null
      this.showEdit = true
    },
    //修改tag
    handleEdit(val) {
      this.isCreate = false
      this.tagId = `${val.id}`
      this.showEdit = true
    },
    //删除tag
    handleDelete(val) {
      let res
      this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        try {
          this.loading = true
          res = await Tag.deleteTag(val.id)
        } catch (e) {
          this.loading = false
          console.log(e)
        }
        if (res.code < window.MAX_SUCCESS_CODE) {
          this.loading = false
          await this.getTagsAfterDelete()
          this.$message({
            type: 'success',
            message: `${res.message}`,
          })
        } else {
          this.loading = false
          this.$message.error(`${res.message}`)
        }
      })
    },
    //edit页面保存和返回
    editClose() {
      this.showEdit = false
      this.getTags()
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 30px;

  .header {
    display: flex;
    //justify-content: space-between;
    align-items: center;

    .title {
      height: 59px;
      line-height: 59px;
      color: $parent-title-color;
      font-size: 16px;
      font-weight: 500;
    }

  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    margin: 20px;
  }

}
</style>
