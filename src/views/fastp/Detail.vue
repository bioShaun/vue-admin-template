<template>
  <div class="app-container">
    <div class="d-flex flex-1 jc-between ai-center">
      <span
        ><h3>{{ item.name }}</h3></span
      >
    </div>

    <el-tabs type="border-card" value="baseContents">
      <el-tab-pane label="summary" name="summary">
        <el-table :data="summary_bf" border fit highlight-current-row>
          <el-table-column label="Stats" align="center">
            <template slot-scope="scope">
              {{ scope.row.item }}
            </template>
          </el-table-column>
          <el-table-column label="before filtering" align="center">
            <template slot-scope="scope">
              {{ scope.row.itemBfVal }}
            </template>
          </el-table-column>
          <el-table-column label="after filtering" align="center">
            <template slot-scope="scope">
              {{ scope.row.itemAfVal }}
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="filtering result" name="filtering_result">
        <el-table :data="filter_stats" border fit highlight-current-row>
          <el-table-column label="Stats" align="center">
            <template slot-scope="scope">
              {{ scope.row.item }}
            </template>
          </el-table-column>
          <el-table-column label="Value" align="center">
            <template slot-scope="scope">
              {{ scope.row.itemVal }}
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="duplication" name="duplication">
        <div class="plot">
          <v-chart
            ref="dupPlot"
            :options="dupOptions"
            :auto-resize="true"
          ></v-chart>
        </div>
      </el-tab-pane>

      <el-tab-pane label="insert size" name="insertSize">
        <div class="plot-with-sub">
          <div class="plot">
            <v-chart
              ref="isPlot"
              :options="isOptions"
              :auto-resize="true"
            ></v-chart>
          </div>
          <div class="sub_section_tips fs-xs text-grey-1">
            This estimation is based on paired-end overlap analysis, and there
            are 27.426137% reads found not overlapped. <br />
            The nonoverlapped read pairs may have insert size &lt;30 or &gt;270,
            or contain too much sequencing errors to be detected as overlapped.
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="reads quality" name="readsQualityBf">
        <div class="plot">
          <v-chart
            ref="isPlot"
            :options="r1bfQualOptions"
            :auto-resize="true"
          ></v-chart>
        </div>

        <div class="plot">
          <v-chart
            ref="isPlot"
            :options="r2bfQualOptions"
            :auto-resize="true"
          ></v-chart>
        </div>
      </el-tab-pane>

      <el-tab-pane label="base contents" name="baseContents">
        <div class="plot">
          <v-chart
            ref="isPlot"
            :options="r1bfGCOptions"
            :auto-resize="true"
          ></v-chart>
        </div>

        <div class="plot">
          <v-chart
            ref="isPlot"
            :options="r2bfGCOptions"
            :auto-resize="true"
          ></v-chart>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import dayjs from "dayjs";
import sum from "ml-array-sum";

export default {
  filters: {
    formatdate(val) {
      return dayjs(val).format("YYYY-MM-DD");
    }
  },

  props: {
    id: {}
  },

  data() {
    return {
      item: { duplication: { histogram: [] } },
      summary_bf: [],
      filter_stats: [],
      dupOptions: {},
      isOptions: {},
      r1bfQualOptions: {},
      r2bfQualOptions: {},
      r1bfGCOptions: {},
      r2bfGCOptions: {}
    };
  },

  methods: {
    async fetch() {
      const res = await this.$request.get(`rest/fastps/${this.id}`);
      this.item = res;
      // summary data
      for (let i in res.bf) {
        if (!i.startsWith("_")) {
          this.summary_bf.push({
            item: i,
            itemBfVal: res.bf[i],
            itemAfVal: res.af[i]
          });
        }
      }
      // filter data
      for (let i in res.filtering) {
        if (!i.startsWith("_")) {
          this.filter_stats.push({
            item: i,
            itemVal: res.filtering[i]
          });
        }
      }

      const dupPlotParams = {
        title: `Duplication rate (${this.item.duplication.rate * 100}%)`,
        x: this.item.duplication.histogram.map((v, index) => index + 1),
        xTitle: "Duplication level",
        y: this.item.duplication.histogram.map(
          v => (v * 100) / sum(this.item.duplication.histogram)
        ),
        yTitle: "Read percent",
        formatter: function(params) {
          const paramsObj = params[0];
          return `Duplication Level ${paramsObj.name}: ${paramsObj.data.toFixed(
            2
          )}%`;
        }
      };

      const insert_hist = this.item.insert.histogram.slice(0, 270);
      const isPlotParams = {
        title: `Insert size distribution (peak: ${this.item.insert.peak}bp)`,
        x: insert_hist.map((v, index) => index),
        xTitle: "Insert size",
        y: insert_hist.map(v => (v * 100) / sum(insert_hist)),
        yTitle: "Read percent",
        formatter: function(params) {
          const paramsObj = params[0];
          return `${paramsObj.name}bp: ${paramsObj.data.toFixed(2)}%`;
        }
      };

      this.dupOptions = this.barPlot(dupPlotParams);
      this.isOptions = this.barPlot(isPlotParams);

      // reads quality
      const [r1bfQualData, r1bfyMin, r1bfyMax] = this.parseLinePlotData(
        this.item.read1bf.quality_curves
      );

      const r1bfQualParams = {
        title: "Read1 Before Filtering Quality",
        x: r1bfQualData[0].data.map((v, index) => index + 1),
        xTitle: "Position",
        y: r1bfQualData,
        yTitle: "Quality",
        formatter: null,
        ymin: r1bfyMin,
        ymax: r1bfyMax
      };

      this.r1bfQualOptions = this.linePlot(r1bfQualParams);

      const [r2bfQualData, r2bfyMin, r2bfyMax] = this.parseLinePlotData(
        this.item.read2bf.quality_curves
      );

      const r2bfQualParams = {
        title: "Read2 Before Filtering Quality",
        x: r2bfQualData[0].data.map((v, index) => index + 1),
        xTitle: "Position",
        y: r2bfQualData,
        yTitle: "Quality",
        formatter: null,
        ymin: r2bfyMin,
        ymax: r2bfyMax
      };

      this.r2bfQualOptions = this.linePlot(r2bfQualParams);

      // base contents
      const [r1bfgcData, r1bfgcyMin, r1bfgcyMax] = this.parseLinePlotData(
        this.item.read1bf.content_curves
      );

      const r1bfGCParams = {
        title: "Read1 Before Filtering",
        x: r1bfgcData[0].data.map((v, index) => index + 1),
        xTitle: "Position",
        y: r1bfgcData,
        yTitle: "Base content ratio",
        formatter: null,
        ymin: r1bfgcyMin,
        ymax: null
      };

      this.r1bfGCOptions = this.linePlot(r1bfGCParams);

      const [r2bfgcData, r2bfgcyMin, r2bfgcyMax] = this.parseLinePlotData(
        this.item.read2bf.content_curves
      );

      const r2bfGCParams = {
        title: "Read2 Before Filtering",
        x: r2bfgcData[0].data.map((v, index) => index + 1),
        xTitle: "Position",
        y: r2bfgcData,
        yTitle: "Base content ratio",
        formatter: null,
        ymin: r2bfgcyMin,
        ymax: null
      };

      this.r2bfGCOptions = this.linePlot(r2bfGCParams);
    },

    parseLinePlotData(dbData) {
      dbData = JSON.parse(dbData);
      const plotData = [];
      const maxArr = [];
      const minArr = [];
      for (let key in dbData) {
        plotData.push({
          name: key,
          type: "line",
          data: dbData[key]
        });
        maxArr.push(Math.max.apply(null, dbData[key]));
        minArr.push(Math.min.apply(null, dbData[key]));
      }
      const yMax = Math.ceil(Math.max.apply(null, maxArr));
      const yMin = Math.floor(Math.min.apply(null, minArr));
      return [plotData, yMin, yMax];
    },

    barPlot(params) {
      return {
        color: ["#003366"],
        title: {
          text: params.title
        },
        tooltip: {
          trigger: "axis",
          formatter: params.formatter
        },
        xAxis: {
          type: "category",
          data: params.x,
          name: params.xTitle,
          nameLocation: "center",
          nameGap: 40
        },
        yAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value}%"
          },
          name: params.yTitle,
          nameLocation: "center",
          nameGap: 40
        },
        series: [
          {
            data: params.y,
            type: "bar",
            smooth: true
          }
        ]
      };
    },

    linePlot(params) {
      return {
        title: {
          text: params.title
        },
        tooltip: {
          trigger: "axis",
          formatter: params.formatter
        },
        xAxis: {
          type: "category",
          data: params.x,
          name: params.xTitle,
          nameLocation: "center",
          nameGap: 40
        },
        yAxis: {
          type: "value",
          name: params.yTitle,
          nameLocation: "center",
          nameGap: 40,
          min: params.ymin,
          max: params.ymax
        },
        series: params.y
      };
    }
  },

  created() {
    this.fetch();
  }
};
</script>

<style lang="scss">
.plot-with-sub {
  width: 700px;
  height: auto;
  margin: 0 auto;
}

.plot {
  width: 700px;
  height: 500px;
  margin: 0 auto;
}

.echarts {
  width: 700px;
  height: 500px;
}
</style>
