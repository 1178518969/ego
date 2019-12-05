<template>
  <div>
    <el-button type="primary" @click="openDialog">增加规格参数</el-button>
    <!-- 对话框 -->
    <!-- 外层类目选择 -->
    <el-dialog title="类目选择" :visible.sync="outerVisible" width="60%">
      <!-- 树状结构加载 -->
      <el-tree :props="props" :load="loadNode" @node-click="nodeClick" lazy></el-tree>
      <!-- 内层form表单 -->
      <el-dialog width="60%" title="添加规格参数" :visible.sync="innerVisible" append-to-body>
        <el-form :model="myFormData" ref="myFormData" label-width="100px" class="demo-dynamic">
          <!-- 添加大分组 -->
          <el-button @click="addDomain">添加分组</el-button>
          <!-- 内层form表单 da分组-->
          <el-form-item
            v-for="(domain, index) in myFormData.domains"
            :label="'规格参数' + index"
            :key="domain.key"
            :prop="'domains.' + index + '.value'"
            :rules="{
      required: true, message: '不能为空', trigger: 'blur'
    }"
          >
            <el-input v-model="domain.value"></el-input>
            <!-- 添加小分组 -->
            <el-button @click="addGGCS(index)">添加规格参数</el-button>
            <!-- 删除大分组 -->
            <el-button @click.prevent="removeDomain(domain)">删除</el-button>
            <!-- 内层form表单 小分组-->
            <el-form-item
              v-for="(son, sonindex) in myFormData.domains[index].children"
              :label="'参数' + sonindex"
              :key="son.key"
              :prop="'domains.' + index + '.children.'+sonindex+'.childValue'"
              :rules="{
      required: true, message: '不能为空', trigger: 'blur'
    }"
            >
              <el-input v-model="son.childValue"></el-input>
              <!-- 删除小分组 -->
              <el-button @click.prevent="removeSon(son,index)">删除</el-button>
            </el-form-item>
          </el-form-item>
          <el-button type="primary" @click="submitForm('myFormData')">提交</el-button>
          <el-button @click="resetForm('myFormData')">重置</el-button>
        </el-form>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible = false">取 消</el-button>
        <el-button type="primary" @click="innerVisible = true">打开规格参数</el-button>
      </div>
    </el-dialog>

    <!-- 商品列表 start -->
    <el-table v-if="tableData" :data="tableData" style="width:90%;margin:0 auto;">
      <el-table-column :show-overflow-tooltip="true" prop="id" label="ID" width="80"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="itemCatId" label="类目ID" width="80"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="paramData" label="规格(只显示分组名称)"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="created" label="创建日期" width="245"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="updated" label="更新日期" width="245"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="deleteClick(scope.row)" type="danger" size="small" circle>
            <i class="el-icon-delete"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-else>暂无数据</div>
    <!-- 商品列表 end -->
  </div>
</template>

<script>
export default {
  name: "Guige",
  data() {
    return {
      tableData: [],
      outerVisible: false,
      innerVisible: false,
      props: {
        label: "name",
        children: "children"
      },
      leimuId: "",
      myFormData: {
        domains: [
          {
            value: "",
            key: Date.now(),
            children: [
              {
                value: "",
                childValue: "",
                key: Date.now()
              }
            ]
          }
        ]
      }
    };
  },
  mounted() {
    this.getGGData();
  },
  methods: {
    //   删除小的分组
    removeSon(sonitem, item) {
      var index = this.myFormData.domains[item].children.indexOf(sonitem);
      if (index !== -1) {
        this.myFormData.domains[item].children.splice(index, 1);
      }
    },
    //   添加小的分组
    addGGCS(index) {
      console.log(this.myFormData.domains[index]);
      this.myFormData.domains[index].children.push({
        value: "",
        childValue: "",
        key: Date.now()
      });
    },
    //   提交form表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        console.log(this.myFormData);
        // 存储规格参数,连接接口
        this.axios
          .post("/product_api/backend/itemParam/insertItemParam", {
            itemCatId: this.leimuId,
            paramData: JSON.stringify(this.myFormData.domains)
          })
          .then(data => {
            console.log(data);
            this.outerVisible = false;
            this.innerVisible = false;
            this.getGGData();
            if (data.data.status == 200) {
              this.$message({
                message: "添加成功",
                type: "success"
              });
            } else {
              this.$message({
                message: "添加失败",
                type: "error"
              });
            }
          });
        /* if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        } */
      });
    },
    //   重置form表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //   添加大的分组
    addDomain() {
      this.myFormData.domains.push({
        value: "",
        key: Date.now(),
        children: [
          {
            childValue: "",
            value: "",
            key: Date.now()
          }
        ]
      });
    },
    // 删除大分组
    removeDomain(item) {
      var index = this.myFormData.domains.indexOf(item);
      if (index !== -1) {
        this.myFormData.domains.splice(index, 1);
      }
    },
    // 梳妆结构加载数据功能
    loadNode(node, resolve) {
      //   console.log(node, resolve);
      if (node.level == 0) {
        this.axios
          .get("/product_api/backend/itemCategory/selectItemCategoryByParentId")
          .then(data => {
            let shuju = data.data.data;
            resolve(shuju);
          });
      }
      if (node.level > 0 && node.level < 3) {
        let oid = node.data.id;
        this.axios
          .get(
            "/product_api/backend/itemCategory/selectItemCategoryByParentId?id=" +
              oid
          )
          .then(data => {
            let shuju = data.data.data;
            resolve(shuju);
          });
      }
      return resolve([]);
    },
    // 点击tree节点事件
    nodeClick(data, node) {
      this.leimuId = data.id;
      console.log(data);
    },
    //   打开对话框
    openDialog() {
      this.outerVisible = true;
    },
    // 获取列表数据
    getGGData() {
      this.axios
        .get("/product_api/backend/itemParam/selectItemParamAll")
        .then(data => {
          // console.log(data);
          if (data.data.status == 200) {
            this.tableData = data.data.data.result;
          }
        });
    },
    // 删除规格参数
    deleteClick(res) {
      console.log(res);
      // element中messageBox
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 请求删除数据，进行删除
          this.axios
            .get(
              "/product_api/backend/itemParam/deleteItemParamById?id=" + res.id
            )
            .then(data => {
              if (data.status == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.getGGData();
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