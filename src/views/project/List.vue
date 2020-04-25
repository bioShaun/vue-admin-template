<template>
  <div class="app-container">
    <el-table :data="list" border fit highlight-current-row>
      <el-table-column align="center" label="ID">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="项目名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="项目类型" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目日期" align="center">
        <template slot-scope="scope">
          {{ scope.row.createdAt | formatdate }}
        </template>
      </el-table-column>
      <el-table-column label="客户名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.user.name }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="$router.push(`/project/edit/${scope.row._id}`)"
            >编辑</el-button
          >
          <el-button type="text" size="small" @click="remove(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import dayjs from "dayjs";

export default {
  filters: {
    formatdate(val) {
      return dayjs(val).format("YYYY-MM-DD");
    },
  },

  data() {
    return {
      list: [],
    };
  },

  methods: {
    async fetch() {
      const res = await this.$request.get("rest/projects");
      this.list = res;
    },

    async remove(row) {
      this.$confirm(`是否确定删除项目 "${row.name}"?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        await this.$request.delete(`rest/projects/${row._id}`);
        this.$message({
          type: "success",
          message: "删除成功!",
        });
        this.fetch();
      });
    },
  },

  created() {
    this.fetch();
  },
};
</script>
