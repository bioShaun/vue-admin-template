<template>
  <div class="app-container">
    <el-table :data="list" border fit highlight-current-row>
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="数据名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="原始数据大小(G)" align="center">
        <template slot-scope="scope">
          {{ scope.row.bf.total_reads | toGb }}
        </template>
      </el-table-column>
      <el-table-column label="QC数据大小(G)" align="center">
        <template slot-scope="scope">
          {{ scope.row.af.total_reads | toGb }}
        </template>
      </el-table-column>
      <el-table-column label="Q30" align="center">
        <template slot-scope="scope">
          {{ scope.row.bf.q30_rate.toFixed(3) }}
        </template>
      </el-table-column>
      <el-table-column label="项目名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.project.name }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="$router.push(`/data/detail/${scope.row._id}`)"
            >详情</el-button
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
    toGb(val) {
      const gbNum = val / 1e9;
      return gbNum.toFixed(3);
    },
  },

  data() {
    return {
      list: [],
    };
  },

  methods: {
    async fetch() {
      const res = await this.$request.get("rest/fastps");
      this.list = res;
    },

    async remove(row) {
      this.$confirm(`是否确定删除该数据 "${row.name}"?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        await this.$request.delete(`rest/fastps/${row._id}`);
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
