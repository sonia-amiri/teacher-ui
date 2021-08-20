<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">داشبورد </el-breadcrumb-item>
      <el-breadcrumb-item>لیست آزمون ها</el-breadcrumb-item>
      <!--      <el-button @click="editDialogOpen = true" type="primary" icon="el-icon-circle-plus-outline" circle style="float: right"></el-button>-->
    </el-breadcrumb>
        <el-button @click="addDialogOpen = true" type="primary" icon="el-icon-circle-plus-outline" circle
        ></el-button>
    <el-card>
      <el-table :data="examList">
        <!-- <el-table-column prop="id" label="شناسه" width="60"></el-table-column> -->
        <el-table-column prop="name" label="نام موضوع"></el-table-column>
        <el-table-column align="right" label="نمایش">
        <template slot-scope="scope">
            <el-button size="mini"
                       type="info"
                       @click="examQuestions(scope.row._id)">نمایش
            </el-button>
        </template>
        </el-table-column>
        <!-- <el-table-column prop="startTime" label="زمان شروع" :formatter="dateTimeFormatter" width="150"></el-table-column>
        <el-table-column prop="endTime" label="زمان پایان" :formatter="dateTimeFormatter" width="150"></el-table-column>
        <el-table-column prop="paperTitle" label="عنوان مقاله آزمایشی"></el-table-column>
        <el-table-column v-if="state.userInfo.roleId!==3" prop="examRecord" label="عنوان مقاله آزمایشی" :formatter="statusFormatter"
                         width="150"></el-table-column>
        <el-table-column v-if="state.userInfo.roleId===3" align="right" label="عمل کند">
          <template slot-scope="scope">
            <el-button v-if="false"
                       size="mini"
                       type="danger"
                       @click="handleDelete(scope.$index, scope.row)">حذف
            </el-button>
            <el-button
              size="mini"
              type="primary"
              @click="openStats(scope.row)">داده های آماری
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-if="state.userInfo.roleId===2"
          align="right" label="عمل کند">
          <template slot-scope="scope">
            <el-button v-if="(!scope.row.examRecord)||scope.row.examRecord.releaseStatusId<=1" size="mini"
                       type="primary" @click="joinExam(scope.row)">وارد امتحان شوید
            </el-button>
            <el-button v-if="scope.row.examRecord && scope.row.examRecord.releaseStatusId>1" size="mini" type="primary">
              نمره:{{ scope.row.examRecord.factScore }}
            </el-button>
          </template>
        </el-table-column> -->
      </el-table>
    </el-card>

    <el-dialog title="统计" :visible.sync="statsDialogOpen" width="50%">
      <el-progress :text-inside="true" :stroke-width="24" :percentage="stat._90/stat._all*100"></el-progress>>90%
      <el-progress :text-inside="true" :stroke-width="24" :percentage="stat._80/stat._all*100" status="success"></el-progress>>80%
      <el-progress :text-inside="true" :stroke-width="24" :percentage="stat._70/stat._all*100" status="warning"></el-progress>>70%
      <el-progress :text-inside="true" :stroke-width="24" :percentage="stat._60/stat._all*100" status="exception"></el-progress>>60%
      <el-progress :text-inside="true" :stroke-width="24" :percentage="stat._00/stat._all*100" status="exception"></el-progress>&lt;60%
    </el-dialog>

        <el-dialog title="آزمون جدید" :visible.sync="addDialogOpen" width="40%">

      <el-form :inline="true" :model="newExam" class="demo-form-inline">
        <el-form-item label="عنوان">
          <el-input v-model="newExam.name" type="textarea" placeholder="عنوان"></el-input>
        </el-form-item>
        <el-divider />
        <el-form-item inline-message>
          <el-button type="primary" @click="createExam">اضافه کردن </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import { errorTip, successTip } from '@/utils/tips'
import { dateTimeFormatter } from '@/utils/time'
import store from '../store'
import axios from 'axios'
export default {
  name: 'examPlan',
  components: {},
  data () {
    return {
      state: store.state,
      userType: '',
      pagination: {},
      dateTimeFormatter: dateTimeFormatter,
      examList: [],
      editDialogOpen: false,
      statsDialogOpen: false,
      examForm: {
        courseId: '',
        range: [],
        endTime: 0,
        paperId: '',
        startTime: 0
      },
      newExam: {
        name: ''
      },
      addDialogOpen: false,
      papers: [],
      statusFormatter (row, col, record, index) {
        const id = record ? record.releaseStatusId : 0
        // '0-未答卷，1-已开考，开始计时，2-已交卷，等待判卷，4-完成;
        if (id === 0) {
          return 'بی پاسخ'
        } else if (id === 1) {
          return 'پاسخگویی ، زمان بندی'
        } else if (id === 2) {
          return 'منتظر بررسی'
        } else if (id === 4) {
          return 'خارج از امتیاز'
        }
      },
      stat: {
        _80: 0,
        _90: 1,
        _60: 0,
        _70: 0,
        _00: 0,
        _all: 0
      }
    }
  },
  methods: {
    getUserType () {
      if (this.state.userInfo.roleId === 2) {
        this.userType = 'student'
      } else {
        this.userType = 'teacher'
      }
    },
    createExam () {
      const newExam = this.newExam
      this.$axios.post(process.env.VUE_APP_BACKEND_URL + '/exam/new', newExam)
        .then(data => {
          this.getExamList()
          successTip('با موفقیت ایجاد شد')
          this.addDialogOpen = false
        })
        .catch(errorTip)
    },
    examQuestions (id) {
      console.log(id)
      this.$router.push('/teacher/questions/' + id)
    },
    getExamList () {
      this.$axios.get(process.env.VUE_APP_BACKEND_URL + '/exam/list')
        .then(data => {
          this.examList = data
        })
        .catch(errorTip)
    },
    handleDelete (index, row) {
      this.$axios.delete('api/v1/teacher/plans/' + row.id)
        .then((data) => {
          this.$message.success('با موفقیت حذف شد')
          this.getExamList()
        })
        .catch(errorTip)
    },
    openStats (row) {
      console.log(row)
      this.statsDialogOpen = true

      axios.get('/api/v1/teacher/plans/' + row.id + '/stats')
        .then(value => {
          this.stat = value
        })
        .catch(errorTip)
    },
    joinExam (row) {
      console.log(row.id)
      this.$router.push('/home/plan/' + row.id + '/paper')
    },
    onSubmit () {
      this.examForm.startTime = this.examForm.range[0] / 1000
      this.examForm.endTime = this.examForm.range[1] / 1000
      console.log(this.examForm)
      this.$axios.post('api/v1/teacher/plans', this.examForm)
        .then(value => {
          this.editDialogOpen = false
          console.log(value)
          successTip('با موفقیت ایجاد شد')
          this.getExamList()
        })
        .catch(errorTip)
    },
    forStatusName (id) {
      // '0-未答卷，1-已开考，开始计时，2-已交卷，等待判卷，4-完成;
      if (id === 0) {
        return 'بی پاسخ'
      } else if (id === 1) {
        return 'پاسخگویی ، زمان بندی'
      } else if (id === 2) {
        return 'منتظر بررسی'
      } else if (id === 4) {
        return 'خارج از امتیاز'
      }
    },
    getStats (planId) {

    }
  },
  created () {
    this.getUserType()
    console.log(this.userType)
    this.getExamList()
  }
}
</script>

<style lang="less" scoped>
</style>
