<template>
  <div>
    <!--添加商品按钮  -->
    <!-- <h3>商品查询</h3> -->
    <el-button type="primary" @click="outerVisible=true">添加商品</el-button>
    <!-- 引用组件 -->
    <Products
      :title="title"
      :getData="getData"
      :outerVisible="outerVisible"
      @setVisible="setVisible"
      :updateData="updateData"
    />
    <!-- 商品列表 start -->
    <el-table :data="tableData" style="width:90%;margin:0 auto;">
      <el-table-column :show-overflow-tooltip="true" prop="id" label="商品ID"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="title" label="商品标题"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="image" label="商品图片"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="sellPoint" label="商品卖点"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="price" label="商品价格"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="cid" label="商品类目"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="num" label="商品存储"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="barcode" label="条形码"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="status" label="状态"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="created" label="日期"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="updated" label="姓名"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="primary" size="small" circle>
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button @click="deleteClick(scope.row)" type="danger" size="small" circle>
            <i class="el-icon-delete"></i>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 商品列表 end -->
    <!-- 分页器 start -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="100"
      :current-page="curpage"
      @current-change="currentChange"
    ></el-pagination>

    <!-- 分页器 end -->
  </div>
</template>

<script>
import Products from "../../components/Products/Products";
export default {
  name: "SearchProduct",
  data() {
    return {
      tableData: [],
      outerVisible: false,
      title: "添加商品",
      updateData: "",
      curpage:1
    };
  },
  components: {
    Products
  },
  mounted() {
    this.getData(this.curpage);
  },
  methods: {
    // 分页器触发函数
    currentChange(page) {
      this.curpage=page
      this.getData(this.curpage);
    },
    // 封装请求
    getData(page) {
      this.axios
        .get("/product_api/backend/item/selectTbItemAllByPage?page=" + page)
        .then(data => {
          // console.log(data);
          if (data.data.status == 200) {
            this.tableData = data.data.data.result;
          } else {
            this.tableData = data.data.data;
            // alert(data.data.msg)
          }
        });
    },
    // 编辑功能
    handleClick(res) {
      console.log(res);
      // 弹出对话框
      this.outerVisible = true;
      // 改标题
      this.title = "修改商品";
      // 请求网络数据
      this.axios
        .post("/product_api/backend/item/preUpdateItem", {
          itemId: res.id
        })
        .then(data => {
          console.log(data);
          if (data.data.status == 200) {
            this.updateData = data.data.data;
          }
        });
    },
    // 删除商品
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
            .get("/product_api/backend/item/deleteItemById?itemId="+res.id)
            .then(data => {
              if (data.status == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.getData(this.curpage);
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
    },
    // 从子组件传递出来的数据
    setVisible(cs) {
      this.outerVisible = cs;
    }
  }
};
</script>

<style scoped>
</style>