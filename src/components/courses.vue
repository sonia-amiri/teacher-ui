<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">صفحه اول</el-breadcrumb-item>
      <el-breadcrumb-item>همه دوره ها</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="6">
          <el-checkbox v-model="myChosenChecked" @change="query" v-if="state.userInfo.roleId===2">من انتخاب میکنم</el-checkbox>
          <el-checkbox v-model="myCreatedChecked" @change="query" v-if="state.userInfo.roleId===3">من ایجاد کردم</el-checkbox>
          <el-checkbox v-model="myTaughtChecked" @change="query" v-if="state.userInfo.roleId===3">یاد می دهم</el-checkbox>
        </el-col>
        <el-col :span="1" :offset="24-6-1">
          <el-button @click="editDialogOpen = true" type="primary" icon="el-icon-circle-plus-outline" circle
                     v-if="state.userInfo.roleId===3"></el-button>
        </el-col>
      </el-row>
      <paginate-table :data-list="courseTable" :pagination="pagination" :page-change="changePage">
        <el-table-column prop="id" label="شناسه دوره" width="60" ></el-table-column>
        <el-table-column prop="subjectId" label="شماره حساب" width="60" ></el-table-column>
        <el-table-column prop="subjectName" label="نام موضوع"></el-table-column>
        <el-table-column prop="subtitle" label="عنوان دوره"></el-table-column>
        <el-table-column prop="startTime" label="زمان شروع" :formatter="dateFormatter" width="100" ></el-table-column>
        <el-table-column prop="endTime" label="زمان پایان" :formatter="dateFormatter" width="100" ></el-table-column>
        <el-table-column prop="teacherNames" label="معلم" :formatter="typeFormatter"></el-table-column>
        <el-table-column v-if="state.userInfo.roleId===3" align="right" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="openEditExamPlan(scope.$index, scope.row)">创建考试
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-if="state.userInfo.roleId===2 && myChosenChecked===true"
          align="right" label="عمل کند">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="courseQuit(scope.row)">退课
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          v-if="state.userInfo.roleId===2 && myChosenChecked===false"
          align="right" label="عمل کند">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="coursePick(scope.row)">选课
            </el-button>
          </template>
        </el-table-column>
      </paginate-table>
    </el-card>

    <el-dialog title="دوره جدید" :visible.sync="editDialogOpen" width="40%">

      <el-form :inline="true" :model="courseForm" class="demo-form-inline">
        <el-form-item label="ایجاد یک موضوع جدید">
          <subject-selector v-model="courseForm.subjectId"></subject-selector>
        </el-form-item>
        <el-form-item label="مقدمه دوره">
          <el-input v-model="courseForm.subtitle" placeholder="عنوان"></el-input>
        </el-form-item>
        <el-form-item label="محدودیت زمانی">
          <el-date-picker
            v-model="courseForm.range"
            type="datetimerange"
            align="right"
            value-format="timestamp"
            start-placeholder="تاریخ شروع"
            end-placeholder="تاریخ پایان"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="其他任课教师">
          <user-selector v-model="courseForm.teacherIds"></user-selector>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">اضافه کردن به</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>

    <el-dialog title="طرح امتحان جدید" :visible.sync="editExamDialogOpen" width="40%">

      <el-form :inline="true" :model="examForm" class="demo-form-inline">
        <el-form-item label="试卷选择">
          <el-select v-model="examForm.paperId" placeholder="کاغذ تست را انتخاب کنید">
            <el-option v-for="paper in papers" :key="paper.id" :label="paper.title" :value="paper.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="محدودیت زمانی">
          <el-date-picker
            v-model="examForm.range"
            type="datetimerange"
            value-format="timestamp"
            start-placeholder="تاریخ شروع"
            end-placeholder="تاریخ پایان"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmitExam">اضافه کردن به</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>
  </div>
</template>

<script>
import PaginateTable from './PaginateTable'
import SubjectSelector from './SubjectSelector'
import UserSelector from './UserSelector'

// import queryPapers from '@/api/paper/queryPapers'
// import getCourse from '../api/course/getCourse'
import { errorTip, successTip } from '@/utils/tips'
import { forDate } from '@/utils/time'

import store from '../store'

export default {
  name: 'course',
  components: { PaginateTable, SubjectSelector, UserSelector },
  created () {
    this.query()
    this.$axios.get('api/v1/courses')
      .then((data) => {
        this.courseTable = data.results
      })
  },
  data () {
    return {
      state: store.state,
      pagination: {},
      myChosenChecked: false,
      myCreatedChecked: false,
      myTaughtChecked: false,
      courseTable: [
        {
          endTime: '',
          id: '',
          startTime: '',
          subjectName: '',
          subtitle: '',
          teacherNames: []
        }
      ],
      courseForm: {
        endTime: 0,
        range: [],
        startTime: 0,
        subjectId: 0,
        subtitle: '',
        teacherIds: []
      },
      editDialogOpen: false,
      editExamDialogOpen: false,
      examForm: {
        courseId: 0,
        range: [],
        paperId: null,
        endTime: 0,
        startTime: 0
      },
      papers: []
    }
  },
  methods: {
    changePage (pageNum) {
      const params = getCourse.initParams()
      params.myChosen = this.myChosenChecked
      params.myCreated = this.myCreatedChecked
      params.myTaught = this.myTaughtChecked
      params.pageNum = pageNum
      getCourse.request(params)
        .then((data) => {
          this.courseTable = data.results
          this.pagination = data.pagination
        })
        .catch(errorTip)
    },
    handleDelete (index, row) {
      this.$axios.delete('api/v1/teacher/courses/' + row.id)
        .then((data) => {
          this.$message.success('با موفقیت حذف شد')
        })
        .catch(errorTip)
      this.query()
    },
    coursePick (row) {
      this.$axios.post('api/v1/student/courses?courseId=' + row.id)
        .then((data) => {
          this.$message.success('موفقیت آمیز')
        })
        .catch(errorTip)
      this.query()
    },
    courseQuit (row) {
      console.log(row)
      this.$axios.delete('api/v1/student/courses?courseId=' + row.id)
        .then((data) => {
          this.$message.success('با موفقیت ترک کنید')
        })
        .catch(errorTip)
      this.query()
    },
    query () {
      this.changePage(1)
    },
    typeFormatter: function (row, column) {
      return row.teacherNames.join(',')
    },
    dateFormatter: function (row, column, cellValue, index) {
      return forDate(cellValue)
    },
    onSubmit () {
      this.courseForm.startTime = this.courseForm.range[0] / 1000
      this.courseForm.endTime = this.courseForm.range[1] / 1000
      this.$axios.post('api/v1/teacher/courses', this.courseForm)
        .then(value => {
          this.editDialogOpen = false
          successTip('با موفقیت ایجاد شد')
        })
        .catch(errorTip)
      this.query()
    },
    openEditExamPlan (index, row) {
      console.log(row)
      console.log(row.subjectId)
      this.editExamDialogOpen = true
      this.examForm.subjectId = row.subjectId
      this.setPapers()
      this.examForm.courseId = row.id
    },
    setPapers () {
      const subjectId = this.examForm.subjectId
      const params = queryPapers.initParams()
      params.subjectId = subjectId
      queryPapers.request(params)
        .then(resp => {
          this.papers = resp
        }).catch(errorTip)
    },
    onSubmitExam () {
      this.examForm.startTime = this.examForm.range[0] / 1000
      this.examForm.endTime = this.examForm.range[1] / 1000
      console.log(this.examForm)
      this.$axios.post('api/v1/teacher/plans', this.examForm)
        .then(value => {
          this.editDialogOpen = false
          console.log(value)
          successTip('با موفقیت ایجاد شد')
          this.$router.push('/home/exam')
        })
        .catch(errorTip)
    }
  }
}
</script>
<style type="less" scoped>
.teacher-operation {
  display: none;
}
</style>
