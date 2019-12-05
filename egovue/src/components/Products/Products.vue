<template>
  <div>
    <!-- 点击按钮后进入添加商品页面 -->
    <el-dialog :title="title" width="80%" :visible.sync="outerVisible" @close="close">
      <!-- 外层form表单 -->
      <el-form ref="form" :model="product" label-width="80px">
        <el-form-item label="商品类目">
          <el-button type="primary" @click="innerVisible=true">选择类目</el-button>
          <span>{{treeNodeName}}</span>
        </el-form-item>
        <el-form-item label="商品标题">
          <el-input v-model="product.title"></el-input>
        </el-form-item>
        <el-form-item label="商品卖点">
          <el-input v-model="product.sellPoint"></el-input>
        </el-form-item>
        <el-form-item label="商品价格">
          <el-input v-model="product.price"></el-input>
        </el-form-item>
        <el-form-item label="库存数量">
          <el-input v-model="product.num"></el-input>
        </el-form-item>
        <el-form-item label="条形码"></el-form-item>
        <el-form-item label="商品图片">
          <el-button type="primary" @click="innerVisible2 = true">点击上传</el-button>
          <img :src="product.image" alt />
        </el-form-item>
        <el-form-item label="商品描述">
          <!-- 富文本编辑安器 -->
          <vue-ueditor-wrap :config="myConfig" v-model="product.desc"></vue-ueditor-wrap>
        </el-form-item>
        <!-- 如果有规格参数，显示规格参数 -->
        <div v-if="product.paramData">
          <div v-for="(item,index) in product.paramData" :key="index">
            <h3>{{item.value}}</h3>
            <el-form-item v-for="(cs,idx) in item.children" :key="idx" :label="cs.childValue">
              <el-input v-model="cs.value"></el-input>
            </el-form-item>
          </div>
        </div>
        <div v-else>没有规格参数</div>
      </el-form>

      <!--上传图片 -->
      <el-dialog width="80%" title="上传图片" :visible.sync="innerVisible2" append-to-body>
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

      <!-- 内层类目选择 -->
      <el-dialog width="80%" title="商品类目选择" :visible.sync="innerVisible" append-to-body>
        <!-- 树状结构加载 -->
        <el-tree :props="props" :load="loadNode" @node-click="nodeClick" lazy></el-tree>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="queding">确认</el-button>
        </div>
      </el-dialog>

      <div slot="footer" class="dialog-footer">
        <el-button @click="outdelete">取 消</el-button>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Products",
  props: ["outerVisible", "getData", "title", "updateData"],
  data() {
    return {
      innerVisible: false,
      innerVisible2: false,
      fileList: [],
      product: {
        title: "",
        desc: "",
        num: "",
        price: "",
        sellPoint: "",
        cid: "",
        image: "",
        paramData: ""
      },
      props: {
        label: "name",
        children: "children"
      },
      treeNodeName: "",
      myConfig: {
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 240,
        // 初始容器宽度
        initialFrameWidth: "100%",
        // 上传文件接口（这个地址是我为了方便各位体验文件上传功能搭建的临时接口，请勿在生产环境使用！！！）
        // serverUrl: "http://35.201.165.105:8000/controller.php",
        // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项，vue-ueditor-wrap 会自动处理常见的情况，如果需要特殊配置，参考下方的常见问题2
        UEDITOR_HOME_URL: "UEditor/"
      }
    };
  },
  watch: {
    updateData: function() {
      // console.log(JSON.parse(decodeURIComponent(this.updateData.itemParamItem)))
      this.product = this.updateData.item;
      this.product.desc = this.updateData.itemDesc;
      this.treeNodeName = this.updateData.itemCat;
      if(this.updateData.itemParamItem){
        this.product.paramData=JSON.parse(decodeURIComponent(this.updateData.itemParamItem))
      }
    }
  },
  methods: {
    // 类目选择完毕后点击按钮，判断是否有类目下的规格参数
    queding() {
      this.innerVisible = false;
      console.log("类目的id是：" + this.product.cid);
      // 请求规格参数地址
      this.axios
        .get(
          "/product_api/backend/itemParam/selectItemParamByItemCatId/" +
            this.product.cid
        )
        .then(data => {
          console.log(data);
          if (data.data.status == 200) {
            this.product.paramData = JSON.parse(data.data.data.paramData);
            console.log(this.product.paramData);
          } else {
            this.product.paramData=""
          }
        });
    },

    // 解决点击关闭添加商品时，不能再打开问题
    close() {
      this.$emit("setVisible", false);
    },
    // 图片上传
    submitUpload() {
      this.$refs.upload.submit();
    },
    // 图片上传成功，关闭图片上传对话框，图片地址保存
    uploadSuccess(res) {
      this.innerVisible2 = false;
      this.product.image = res.data;
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
      this.treeNodeName = data.name;
      this.product.cid = data.id;
    },
    // 提交form表单
    onSubmit() {
      //   this.outerVisible = false;
      this.$emit("setVisible", false);
      // 这是添加条目的地址
      let url = "/product_api/backend/item/insertTbItem";
      // 添加条目的地址参数
      let paramsData = {
        title: this.product.title,
        desc: this.product.desc,
        num: this.product.num,
        price: this.product.price,
        sellPoint: this.product.sellPoint,
        cid: this.product.cid,
        image: this.product.image,
        itemParams:encodeURIComponent(JSON.stringify(this.product.paramData))
      };
      // 如果存在updateData,则证明进入修改条目，需要获取修改条目的地址
      if (this.updateData) {
        // 这是修改条目的地址
        url = "/product_api/backend/item/updateTbItem";
        // 修改条目的地址参数
        paramsData = {
          title: this.product.title,
          desc: this.product.desc,
          num: this.product.num,
          price: this.product.price,
          sellPoint: this.product.sellPoint,
          cid: this.product.cid,
          image: this.product.image,
          id: this.product.id,
          itemParams:encodeURIComponent(JSON.stringify(this.product.paramData))
        };
      }
      // 修改，添加条目数据请求
      this.axios
        .get(url, {
          params: paramsData
        })
        .then(data => {
          if (data.data.status == 200) {
            this.$message({
              type: "success",
              message: "添加成功"
            });
          }
          this.getData(1);
        });
    },
    // 点击取消事件 ,传给父组件
    outdelete() {
      this.$emit("setVisible", false);
    }
  }
};
</script>

<style scoped>
img {
  width: 200px;
}
</style>