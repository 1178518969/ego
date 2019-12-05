<template>
  <div>
    <!--添加按钮  -->
    <el-button
      type="primary"
      v-if="category.categoryName"
      @click="openDialog"
    >添加{{category.categoryName}}</el-button>
    <!-- 打开的添加信息表 -->
    <el-dialog title="添加内容" width="80%" :visible.sync="outerVisible" @close="close">
      <el-form ref="form" :model="contentData" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="contentData.title"></el-input>
        </el-form-item>
        <el-form-item label="子标题">
          <el-input v-model="contentData.subTitle"></el-input>
        </el-form-item>
        <el-form-item label="商品描述">
          <el-input v-model="contentData.content"></el-input>
        </el-form-item>
        <el-form-item label="链接">
          <el-input v-model="contentData.url"></el-input>
        </el-form-item>
        <el-form-item label="商品图片">
          <el-button type="primary" @click="innerVisible = true">点击上传</el-button>
          <img :src="contentData.pic" alt />
        </el-form-item>
        <el-form-item label="内容">
          <!-- 富文本编辑安器 -->
          <vue-ueditor-wrap :config="myConfig" v-model="contentData.titleDesc"></vue-ueditor-wrap>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="onSubmit">提 交</el-button>
      </div>

      <!-- 上传图片 -->
      <el-dialog width="80%" title="上传图片" :visible.sync="innerVisible" append-to-body>
        <el-upload
          class="upload-demo"
          ref="upload"
          action="/product_api/file/upload"
          :on-success="uploadSuccess"
          :file-list="fileList"
          :auto-upload="false"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload"
          >上传到服务器</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-dialog>
    </el-dialog>

    <!-- 表格的表头 -->
    <el-table :data="tableData" style="width: 90%; margin:0 auto;">
      <el-table-column :show-overflow-tooltip="true" prop="id" label="ID"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="title" label="标题"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="subTitle" label="子标题"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="content" label="描述"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="url" label="连接"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="pic" label="图片"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="created" label="创建日期"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="updated" label="更新日期"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="danger" circle size="mini" @click="deleteClick(scope.row)">
            <i class="el-icon-delete"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Content",
  data() {
    return {
      tableData: [],
      outerVisible: false,
      innerVisible: false,
      contentData: {
        title: "",
        subTitle: "",
        content: "",
        url: "",
        pic: "",
        titleDesc: ""
      },
      fileList: [],
      myConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 240,
        // 初始容器宽度
        initialFrameWidth: "100%",
        // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        // serverUrl: 'http://35.201.165.105:8000/controller.php',
        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        UEDITOR_HOME_URL: "UEditor/"
      }
    };
  },
  computed: {
    ...mapState({
      category: state => state.category
      //   categoryName: state => state.categoryName,
    })
  },
  watch: {
    "category.categoryId": function() {
      console.log(this.category.categoryId);
      this.getData();
    }
  },
  methods: {
    //  上传图片功能
    submitUpload() {
      this.$refs.upload.submit();
    },
    //   上传成功事件
    uploadSuccess(data) {
    //   console.log(data);
      this.innerVisible = false;
      this.contentData.pic = data.data;
    },
    //   提交添加信息框
    onSubmit() {
      this.axios
        .post("/content_api/content/insertTbContent", {
          ...this.contentData,
          categoryId: this.category.categoryId
        })
        .then(data => {
        //   console.log(data);
          if (data.data.status == 200) {
            this.$message({
              type: "success",
              message: "添加成功"
            });
          }
          this.getData();
          this.outerVisible = false;
        });
    },
    //   取消添加信息框
    closeDialog() {},
    //   点击×关闭
    close() {
      this.outerVisible = false;
    },
    //   打开添加信息框
    openDialog() {
      this.outerVisible = true;
    },
    //   封装接口请求
    getData() {
      console.log(666);
      this.axios
        .post("/content_api/content/selectTbContentAllByCategoryId", {
          categoryId: this.category.categoryId
        })
        .then(data => {
          console.log(data);
          if (data.data.status == 200) {
            this.tableData = data.data.data.result;
          } else {
            this.$message({
              message: data.data.msg,
              type: "error"
            });
          }
        });
    },
    //   删除条目触发的函数
    deleteClick(res) {
      console.log(res);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 请求删除数据，进行删除
          this.axios
            .post("/content_api/content/deleteContentByIds", {
              ids: res.id
            })
            .then(data => {
              if (data.status == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.getData();
              } else {
                this.$message({
                  type: "info",
                  message: "删除失败，后台错误!"
                });
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

<style scoped>
</style>