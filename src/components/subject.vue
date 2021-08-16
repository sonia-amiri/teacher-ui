<template>
  <div>
    <el-row>
      <el-col :span="6">
        <div class="grid-content bg-purple">مدیریت موضوعات</div>
      </el-col>
      <el-col :span="1" :offset="24-6-1">
        <el-button @click="editDialogOpen = true" type="primary" icon="el-icon-circle-plus-outline" circle></el-button>
      </el-col>
    </el-row>

    <paginate-table :data-list="subjectList" :pagination="pagination" :page-change="changePage">
      <el-table-column label="id" prop="id" />
      <el-table-column label="نام موضوع" prop="name" />
      <el-table-column label="ایجاد کننده" prop="creatorName" />
      <el-table-column label="زمان ایجاد" prop="createdTime" :formatter="dateTimeFormatter" />
      <el-table-column
        align="right">
        <template slot="header">
          <el-checkbox @change="query">من ایجاد کردم</el-checkbox>
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.id)">Delete
          </el-button>
        </template>
      </el-table-column>
    </paginate-table>

    <el-dialog title="ایجاد حساب کاربری" :visible.sync="editDialogOpen" width="30%">

      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="نام موضوع" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="create">ايجاد كردن</el-button>
          <el-button @click="editDialogOpen = false">لغو کنید</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>

<script>
import getSubject from '@/api/subject/getSubject'
import { errorTip } from '@/utils/tips'
import store from '../store'
import { dateTimeFormatter } from '@/utils/time'
import PaginateTable from './PaginateTable'
import createSubject from '@/api/subject/createSubject'

export default {
  name: 'Subject',
  components: { PaginateTable },
  created () {
    this.query(true)
  },
  data () {
    return {
      state: store.state,
      myCreate: true,
      subjectList: [],
      pagination: {},
      dateTimeFormatter: dateTimeFormatter,
      editDialogOpen: false,
      form: {

      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 2, max: 32, message: '长度在 2 到 32 个字符', trigger: 'blur' },
          {
            transform (value) {
              return value.trim()
            }
          }
        ]
      }
    }
  },
  methods: {
    query (checked) {
      this.myCreate = checked === undefined ? this.myCreate : checked
      this.changePage(1)
    },
    changePage (pageNum) {
      const params = getSubject.initParams()
      params.personal = this.myCreate
      params.pageNum = pageNum
      getSubject.request(params)
        .then(resp => {
          this.subjectList = resp.results
          this.pagination = resp.pagination
        })
        .catch(errorTip)
    },
    create () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          createSubject.request(this.form)
            .then(value => {
              this.editDialogOpen = false
              this.query()
            })
            .catch(errorTip)
        } else {
          return false
        }
      })
    },
    handleDelete (id) {
      console.log(id)
      console.log()
    }
  }
}
</script>

<style lang="scss">
.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
