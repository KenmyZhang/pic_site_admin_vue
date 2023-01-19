<template>
  <div class="app-container">
    <el-card :bordered="false">
      <el-form  ref="formValidate" :rules="ruleValidate" :model="formValidate" label-width="130px" >
        <el-row :gutter="24">
          <el-col v-bind="grid2">
            <el-form-item label="手机号：" prop="mobile">
              <el-input v-model="formValidate.mobile" placeholder="请输入手机号"  />
            </el-form-item>
          </el-col>
          <el-col v-bind="grid2">
            <el-form-item label="微信：" prop="wechat">
              <el-input v-model="formValidate.wechat"  placeholder="请输入微信" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="轮播图：" prop="list_pic_url">
              <MaterialList v-model="formValidate.list_pic_url"  type="image" :num="4" :width="150" :height="150" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button type="primary" class="submission" @click="handleSubmit('formValidate')">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getCates } from '@/api/shop/StoreCategory'
import { add, edit, getInfo, isFormatAttr } from '@/api/shop/StoreProduct'
import editor from '../../components/Editor'
import picUpload from '@/components/pic-upload'
import mulpicUpload from '@/components/mul-pic-upload'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import MaterialList from '@/components/material'
import singlePic from '@/components/singlematerial'
import UeditorWrap from 'vue-ueditor-wrap';
export default {
  components: { editor, picUpload, mulpicUpload, Treeselect, MaterialList, UeditorWrap, singlePic },
  data() {
    return {
      spinShow: false,
      grid2: {
        xl: 10,
        lg: 12,
        md: 12,
        sm: 24,
        xs: 24
      },
      grid3: {
        xl: 18,
        lg: 18,
        md: 20,
        sm: 24,
        xs: 24
      },
      // 批量设置表格data
      oneFormBatch: [
        {
          image: '',
          price: 0,
          cost: 0,
          ot_price: 0,
          stock:0,
          bar_code: '',
          seckill_stock: 0,
          seckill_price: 0,
          pink_stock: 0,
          pink_price: 0,
          weight: 0,
          volume: 0,
          integral:0
        }
      ],
      // 规格数据
      formDynamic: {
        attrsName: '',
        attrsVal: ''
      },
      formDynamicNameData: [],
      isBtn: false,
      myConfig: {
        autoHeightEnabled: false, // 编辑器不自动被内容撑高
        initialFrameHeight: 500, // 初始容器高度
        initialFrameWidth: '100%', // 初始容器宽度
        UEDITOR_HOME_URL: '/UEditor/',
        serverUrl: ''
      },
      columns: [],
      formValidate: {
        mobile: '',
        wechat: '',
        card_id: 0,
        keyword: '',
        goods_brief: '',
        goods_number:'',
        imageArr:[],
        sliderImageArr: [],
        store_name: '',
        category_id: '',
        unit_name: '',
        primary_pic_url: '',
        list_pic_url: [],
        description: '',
        ficti: 0,
        give_integral: 0,
        sort_order: 0,
        is_show: 1,
        is_hot: 0,
        is_benefit: 0,
        is_best: 0,
        is_new: 0,
        is_good: 0,
        is_postage: 0,
        is_sub: 0,
        is_integral: 0,
        id: 0,
        spec_type: 0,
        temp_id: '',
        attrs: [],
        items: [
          {
            image: '',
            price: 0,
            cost: 0,
            ot_price: 0,
            stock: 0,
            bar_code: '',
            integral:0
          }
        ],
        header: [],
        selectRule: ''
      },
      ruleList: [],
      templateList: [],
      createBnt: false,
      showIput: false,
      manyFormValidate: [],
      // 单规格表格data
      oneFormValidate: [
        {
          imageArr: [],
          image: '',
          price: 0,
          cost:  0,
          ot_price:  0,
          stock:  0,
          seckill_stock: 0,
          seckill_price: 0,
          pink_stock: 0,
          pink_price: 0,
          bar_code: '',
          weight:  0,
          volume:  0,
          brokerage: 0,
          brokerage_two: 0,
          integral: 0
        }
      ],
      images: [],
      grid: {
        xl: 8,
        lg: 8,
        md: 12,
        sm: 24,
        xs: 24
      },
      loading: false,
      treeSelect: [],
      cardSelect: [],
      optionsMetaShow: [],
      optionsCardListShow: [],
      tableIndex: 0,
      ruleValidate: {
        store_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        category_id: [
          { required: true, message: '请选择商品分类', trigger: 'change' }
        ],
        card_id: [
        ],
        keywords: [
          { required: false, message: '请输入商品关键字', trigger: 'blur' }
        ],
        goods_unit: [
          { required: true, message: '请输入单位', trigger: 'blur' }
        ],
        goods_brief: [
          { required: true, message: '请输入商品简介', trigger: 'blur' }
        ],
        goods_desc: [
          { required: true, message: '请输入商品详情', trigger: 'blur' }
        ],
        primary_pic_url: [
          { required: true, message: '请上传主图', trigger: 'blur' }
        ],
        list_pic_url: [
          { required: true, message: '请上传商品轮播图', trigger: 'blur' }
        ],
        selectRule: [
          { required: true, message: '请选择商品规格属性', trigger: 'change' }
        ],
        temp_id: [
          { required: true, message: '请选择运费模板', trigger: 'change', type: 'number' }
        ]
      },
      attrs: []
    }
  },
  watch: {
    'formValidate.primary_pic_url': function(val) {
      console.log(val)
      if (val) {
        console.log("val")
        console.log(val)
        this.oneFormValidate[0].image = val
      }
    },
    'form.list_pic_url': function(val) {
      if (val) {
        this.formValidate.list_pic_url = val.join(',')
      }
    }
  },
  mounted () {
    this.getInfo();
  },
  methods: {
    dataFilter(val){
      this.value=val
      if(val){
        this.optionsMetaShow=this.treeSelect.filter((item=>{
          if (!!~item.label.indexOf(val) || !!~item.label.toUpperCase().indexOf(val.toUpperCase())) {
            return true
          }
        }))
      }else{
        this.optionsMetaShow=this.treeSelect
      }
    },

    cardDataFilter(val) {
      this.value=val
      console.log('aaa123423423423')
       console.log(val)
      if(val){
          console.log('123423423423')
        console.log(val)
        this.optionsCardListShow=this.cardSelect.filter((item=>{
          if (!!~item.title.indexOf(val) || !!~item.title.toUpperCase().indexOf(val.toUpperCase())) {
            return true
          }
        }))
      }else{
        this.optionsCardListShow=this.cardSelect
      }
    },
    confirm () {
      let that = this;
      that.createBnt = true;
      if (that.formValidate.selectRule.trim().length <= 0) {
        return this.$message({
          message:'请选择属性',
          type: 'error'
        });
      }
      that.ruleList.forEach(function (item, index) {
        if (item.ruleName === that.formValidate.selectRule) {
          that.attrs = item.ruleValue;
        }
      });
    },
    // 删除表格中的属性
    delAttrTable (index) {
      this.manyFormValidate.splice(index, 1);
    },

    // 添加按钮
    addBtn () {
      this.clearAttr();
      this.createBnt = false;
      this.showIput = true;
    },
    // 立即生成
    generate () {
      isFormatAttr(this.formValidate.id, { attrs: this.attrs }).then(res => {
        this.manyFormValidate = res.data.value;
        let headerdel = {
          title: '操作',
          slot: 'action',
          fixed: 'right',
          width: 220
        };
        res.data.header.push(headerdel);
        this.formValidate.header = res.data.header;
        //this.formValidate.attrs = res.attr;
        let header = res.data.header;
        header.pop();
        if (!this.$route.params.id && this.formValidate.spec_type === 1) {
          this.manyFormValidate.map((item) => {
            item.image = this.formValidate.primary_pic_url
          });
          this.oneFormBatch[0].image = this.formValidate.primary_pic_url;
        }
      }).catch(res => {
        // this.$message({
        //   message:res.msg,
        //   type: 'error'
        // });
      })
    },
    // 取消
    offAttrName () {
      this.showIput = false;
      this.createBnt = true;
    },
    clearAttr () {
      this.formDynamic.attrsName = '';
      this.formDynamic.attrsVal = '';
    },
    // 删除规格
    handleRemoveRole (index) {
      this.attrs.splice(index, 1);
      this.manyFormValidate.splice(index, 1);
    },
    // 删除属性
    handleRemove2 (item, index) {
      item.splice(index, 1);
    },
    // 添加规则名称
    createAttrName () {
      if (this.formDynamic.attrsName && this.formDynamic.attrsVal) {
        let data = {
          value: this.formDynamic.attrsName,
          detail: [
            this.formDynamic.attrsVal
          ]
        };
        this.attrs.push(data);
        var hash = {};
        this.attrs = this.attrs.reduce(function (item, next) {
          hash[next.value] ? '' : hash[next.value] = true && item.push(next);
          return item
        }, [])
        this.clearAttr();
        this.showIput = false;
        this.createBnt = true;
      } else {
        this.$message.warning('请添加完整的规格！');
      }
    },
    // 添加属性
    createAttr (num, idx) {
      if (num) {
        this.attrs[idx].detail.push(num);
        var hash = {};
        this.attrs[idx].detail = this.attrs[idx].detail.reduce(function (item, next) {
          hash[next] ? '' : hash[next] = true && item.push(next);
          return item
        }, [])
      } else {
        this.$message.warning('请添加属性！');
      }
    },

    // 改变规格
    changeSpec () {
    },
    // 详情
    getInfo () {
      let that = this;
      let id = that.$route.params.id || 0;
      getInfo(id).then(async res => {
        let data = res.data.productInfo;
        if(data){
          let category_id = parseInt(data.category_id) || 0;
          let card_id = parseInt(data.card_id) || 0;
          this.attrs = data.items || [];
          that.formValidate = data;
          that.formValidate.category_id = category_id;
          that.formValidate.card_id = card_id;
          that.oneFormValidate = data.attrs;
          that.formValidate.header = [];
          that.wechat = data.wechat;
          that.mobile = data.mobile;
          that.generate();
          that.manyFormValidate = data.attrs;
          if(data.spec_type === 0){
            that.manyFormValidate = [];
          }else {
            that.createBnt = true;
            that.oneFormValidate = [
              {
                image: '',
                price: 0,
                cost: 0,
                ot_price: 0,
                stock: 0,
                seckill_stock: 0,
                seckill_price: 0,
                pink_stock: 0,
                pink_price: 0,
                bar_code: '',
                weight:0,
                volume:0,
                brokerage:0,
                brokerage_two: 0,
                integral:0
              }
            ]
          }
        }

        that.treeSelect = res.data.cateList;
        that.cardSelect = res.data.cardList;
        that.ruleList = res.data.ruleList;
        that.optionsMetaShow  = that.treeSelect
        that.optionsCardListShow = that.cardSelect

      }).catch(res => {
        console.log('err:'+res)
        return this.$message({
          message:res.msg,
          type: 'error'
        });
      })
    },


    // 提交
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if(this.formValidate.spec_type ===0 ){
            this.formValidate.attrs = this.oneFormValidate;
            this.formValidate.header = [];
            this.formValidate.items = [];
          }else{
            this.formValidate.items = this.attrs;
            this.formValidate.attrs = this.manyFormValidate;
          }
          if(this.formValidate.spec_type === 1 && this.manyFormValidate.length===0){
            return this.$message.warning('请点击生成规格！');
          }
          add(this.formValidate).then(async res => {
            this.$message({
              message:'操作成功',
              type: 'success'
            });
            setTimeout(() => {
              this.$router.push({ path: '/mall/goods' });
            }, 500);
          }).catch(res => {
            // this.$message({
            //   message:res.message,
            //   type: 'error'
            // });
          })
        } else {
          if(!this.formValidate.store_name || !this.formValidate.category_id || !this.formValidate.keyword
            || !this.formValidate.unit_name || !this.formValidate.goods_brief
            || !this.formValidate.primary_pic_url || !this.formValidate.list_pic_url){
            this.$message.warning("请填写完整商品信息！");
          }
        }
      })
    },

    // 表单验证
    validate (prop, status, error) {
      if (status === false) {
        this.$message.warning(error);
      }
    },
    addCustomDialog () {
      window.UE.registerUI('yshop', function (editor, uiName) {
        let dialog = new window.UE.ui.Dialog({
          iframeUrl: '/#/yshop/materia/index',
          editor: editor,
          name: uiName,
          title: '上传图片',
          cssRules: 'width:1200px;height:500px;padding:20px;'
        });
        this.dialog = dialog;

        var btn = new window.UE.ui.Button({
          name: 'dialog-button',
          title: '上传图片',
          cssRules: `background-image: url(../../../assets/images/icons.png);background-position: -726px -77px;`,
          onclick: function () {
            dialog.render();
            dialog.open();
          }
        });

        return btn;
      }, 37);
    },


    cancel() {
      this.resetForm()
    }
  }
}
</script>

<style scoped lang="stylus">
  .submission
    margin-left 10px;
  .color-list .tip{
    color: #c9c9c9;
  }
  .color-list .color-item{
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    color:#fff;
    margin-right :10px;
  }
  .color-list .color-item.blue{
    background-color: #1E9FFF;
  }
  .color-list .color-item.yellow{
    background-color: rgb(254, 185, 0);
  }
  .color-list .color-item.green{
    background-color: #009688;
  }
  .columnsBox
    margin-right 10px
  .priceBox
    width 100%
  .rulesBox
    display flex
    flex-wrap: wrap;
  .curs
    cursor pointer
</style>
