<template>
  <span class="export_excel" @click="exportExcel">{{title}}</span>
</template>

<script>
export default {
  props: ["title", "fileName", "filterTitle", "filterList"],
  data() {
    return {
      autoWidth: true
    };
  },
  created() {},
  watch: {
    filterList(newVal, oldVal) {
      const { fileName, filterTitle } = this;
      if (newVal.length > 0) {
        import("~/utils/vendor/Export2Excel").then(excel => {
          const filterHeader = filterTitle;
          const data = this.formatJson(filterTitle, newVal);
          excel.export_json_to_excel({
            header: filterHeader,
            data,
            filename: fileName,
            autoWidth: this.autoWidth
          });
        });
      }
    }
  },
  methods: {
    exportExcel() {
      this.$emit("exportExcel");
    },
    formatJson(filterVal, filterList) {
      return filterList.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    }
  }
};
</script>

<style lang="scss">
.export_excel {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 28px;
  background-color: #ffffff;
  border-radius: 14px;
  border: solid 1px #0c7ff5;
  color: #0c7ff5;
  font-size: 13px;
  margin-left: 126px;
  float: right;
  cursor: pointer;
}
</style>

