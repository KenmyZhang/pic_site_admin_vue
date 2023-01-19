<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="名称">
        <el-input v-model="form.name" style="width: 370px;" />
      </el-form-item>

      <el-form-item label="跳转地址">
        <el-input v-model="form.url" style="width: 370px;" />
      </el-form-item>

      <el-form-item label="ICON图标">
        <single-pic v-model="form.icon_url"  type="image" :num="1" :width="150" :height="150" />
        <!-- <MaterialList v-model="form.image" style="width: 370px" type="image" :num="1" :width="150" :height="150" /> -->
      </el-form-item>

      <el-form-item
        label="排序"
        prop="sort"
      >
        <el-input-number
          v-model.number="form.sort_order"
          :min="0"
          :max="999"
          controls-position="right"
          style="width: 370px;"
        />
      </el-form-item>

      <el-form-item>
        <!--<el-button type="text" @click="cancel">取消</el-button>-->
        <el-button :loading="loading" type="primary" @click="doSubmit">保存</el-button>
      </el-form-item>
    </el-form>
    <!--<div slot="footer" class="dialog-footer">-->
    <!--<el-button type="text" @click="cancel">取消</el-button>-->
    <!--<el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>-->
    <!--</div>-->
  </div>
</template>

<script>
import { add, edit, get } from '@/api/channel/channel'
import picUpload from '@/components/pic-upload/index.vue'
import editor from '../../components/Editor'
import yamedit from '@/components/YamlEdit/index.vue'
import MaterialList from '@/components/material/index.vue'
import UeditorWrap from 'vue-ueditor-wrap';
import singlePic from '@/components/singlematerial/index.vue'
export default {
  components: { editor, picUpload, yamedit,MaterialList, UeditorWrap, singlePic},
  // props: {
  //   isAdd: {
  //     type: Boolean,
  //     required: true
  //   }
  // },
  data() {
    return {
      loading: false, dialog: false,
      form: {
        id: '',
        title: '',
        subtitle: '',
        image: '',
        content: '',
        is_show: 0,
      },
      rules: {
      },
      myConfig: {
        autoHeightEnabled: false, // 编辑器不自动被内容撑高
        initialFrameHeight: 500, // 初始容器高度
        initialFrameWidth: '100%', // 初始容器宽度
        UEDITOR_HOME_URL: '/UEditor/',
        serverUrl: ''
      }
    }
  },
  watch: {
  },
  created() {
    this.form.id = this.$route.params.id
    this.$nextTick(() => {
      //this.init()
      if(this.form.id){
        get(this.form.id).then(data => {
          this.form = data.data.content
        })
      }

    })
  },
  methods: {
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
    },
    doSubmit() {
      this.loading = true
      // if(this.form.imageArr.length > 0){
      //   this.form.imageInput = this.form.imageArr.join(',')
      // }else{
      //   this.form.imageInput = ''
      // }

      if (!this.form.id) {
        this.doAdd()
      } else this.doEdit()
    },
    doAdd() {
      add(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        // this.$parent.init()
        setTimeout(() => {
          this.$router.push({ path: '/channel/homechannel' });
        }, 500);
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    doEdit() {
      edit(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        // this.$parent.init()
        setTimeout(() => {
          this.$router.push({ path: '/channel/homechannel' });
        }, 500);
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        id: '',
        title: '',
        image: '',
        subtitle: '',
        content: '',
        is_show: 0,
      }
    }
  }
}
</script>

<style scoped>

</style>
