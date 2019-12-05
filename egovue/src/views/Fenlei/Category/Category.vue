<template>
  <div>
    <el-tree
      :props="props"
      :load="loadNode"
      lazy
      @node-click="nodeClick"
      node-key="id"
      :render-content="renderContent"
    ></el-tree>

    <!-- 添加对话框 -->
    <el-dialog title="添加" :visible.sync="addDialog" width="50%" :before-close="handleClose">
      <span>添加分类</span>
      <el-input v-model="addName"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addQD">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog title="修改" :visible.sync="updateDialog" width="50%" :before-close="handleClose">
      <span>修改分类</span>
      <el-input v-model="updateName"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateQD">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "Category",
  data() {
    return {
      props: {
        label: "name",
        children: true
      },
      addDialog: false,
      updateDialog: false,
      addName: "",
      addParentId: "",
      updateName: "",
      updateParentId: ""
    };
  },
  methods: {
    ...mapActions(["addCategoryAction"]),
    //关闭按钮事件
    handleClose() {
      this.addDialog = false;
    },
    //   点击tree节点获取数据
    nodeClick(data, node) {
      // console.log(data.name);
      // console.log(node);
      if (node.level > 2) {
        this.addCategoryAction({ categoryId: data.id ,categoryName: data.name});
        /* this.addCategoryNameAction({ categoryName: data.name }); */
      }
    },
    // 梳妆结构加载数据功能
    loadNode(node, resolve) {
      //   console.log(node, resolve);
      if (node.level == 0) {
        this.axios
          .post("/content_api/content/selectContentCategoryByParentId")
          .then(data => {
            let shuju = data.data.data;
            resolve(shuju);
          });
      }
      if (node.level > 0) {
        let oid = node.data.id;
        this.axios
          .post("/content_api/content/selectContentCategoryByParentId", {
            id: oid
          })
          .then(data => {
            let shuju = data.data.data;
            resolve(shuju);
          });
      }
      return resolve([]);
    },
    // 点击修改节点确定按钮
    updateQD() {
      this.axios
        .post("/content_api/content/updateContentCategory", {
          id: this.updateParentId,
          name: this.updateName
        })
        .then(data => {
          console.log(data);
          if (data.data.status == 200) {
            this.$message({
              type: "success",
              message: "修改成功"
            });
          } else {
            this.$message({
              type: "error",
              message: "修改失败"
            });
          }
        });
      this.updateDialog = false;
    },
    // 点击添加节点确定按钮
    addQD() {
      this.axios
        .post("/content_api/content/insertContentCategory", {
          parentId: this.addParentId,
          name: this.addName
        })
        .then(data => {
          console.log(data);
          if (data.data.status == 200) {
            this.$message({
              type: "success",
              message: "添加成功"
            });
          } else {
            this.$message({
              type: "error",
              message: "添加失败"
            });
          }
        });
      this.addDialog = false;
    },
    // 修改节点
    updated(node, data) {
      this.updateDialog = true;
      this.updateParentId = data.id;
    },
    // 添加节点
    append(node, data) {
      this.addDialog = true;
      this.addParentId = data.id;
    },
    // 删除节点
    remove(node, data) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axios
            .post("/content_api/content/deleteContentCategoryById", {
              categoryId: data.id
            })
            .then(data => {
              if (data.data.status == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
              } else {
                this.$message({
                  type: "info",
                  message: "删除失败，后台问题!"
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
    },
    //   自定义内容节点
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
          <span>
            <el-button
              size="mini"
              type="text"
              on-click={() => this.updated(node, data)}
            >
              修改
            </el-button>
            <el-button
              size="mini"
              type="text"
              on-click={() => this.append(node, data)}
            >
              添加
            </el-button>
            <el-button
              size="mini"
              type="text"
              on-click={() => this.remove(node, data)}
            >
              删除
            </el-button>
          </span>
        </span>
      );
    }
  }
};
</script>

<style scoped>
</style>