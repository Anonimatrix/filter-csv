<template>
  <div class="home">
    <label for="csv">Archivo</label>
    <vue-csv-import v-model="csv" :fields="fields">
      <vue-csv-errors></vue-csv-errors>
      <vue-csv-input id="csv"></vue-csv-input>
      <vue-csv-map>
        <p></p>
      </vue-csv-map>
    </vue-csv-import>
    <h3>Order por:</h3>
    <select v-model="sortBy">
      <option v-for="field in fields" :key="field">{{ field }}</option>
    </select>
    <select v-model="sortOrder">
      <option value="asc">Ascendiente</option>
      <option value="desc">Descendiente</option>
    </select>
    <filter-component
      :title="'Palabras obligatorias'"
      :removeCallback="removeFilterWord"
      :addCallback="addFilterWord"
    ></filter-component>
    <filter-component
      :title="'Palabras excluyentes'"
      :removeCallback="removeExcludeWord"
      :addCallback="addExcludeWord"
    ></filter-component>
    <div class="filter-by-status-container">
      <h3>Solo grupos con publicacion libre:</h3>
      <input type="checkbox" v-model="filterByStatusCheck" />
    </div>
    <table>
      <th v-for="field in fields" :key="field">
        {{ field }}
      </th>
      <tbody>
        <tr
          v-for="field in exclude(filterByStatus(sorted)) ?? []"
          v-bind:key="field"
        >
          <td v-for="column in fields" :key="column">
            {{ field[column] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {
  VueCsvImport,
  VueCsvInput,
  VueCsvMap,
  VueCsvErrors,
} from "vue-csv-import";

import FilterComponent from "../components/FilterComponent.vue";
import sort from "../utils/sort";
import arrMatch from "../utils/arrMatch";
import fields from "../config/fields";

export default {
  name: "FilterView",
  data() {
    return {
      csv: null,
      filterWords: [],
      excludeWords: [],
      word: "",
      sortBy: "Group ID",
      sortOrder: "desc",
      fields,
      filterByStatusCheck: false,
    };
  },
  methods: {
    addFilterWord(words) {
      this.filterWords = words;
    },
    addExcludeWord(words) {
      this.excludeWords = words;
    },
    exclude(rows) {
      return rows?.filter(
        (filter) =>
          !filter.Name.toLowerCase().includes("venta") &&
          !filter.Name.toLowerCase().includes("compra") &&
          arrMatch(this.filterWords, filter) &&
          arrMatch(this.excludeWords, filter, true)
      );
    },
    filterByStatus(rows) {
      return rows.filter((row) => row["Post Status"] == "FREE");
    },
  },
  computed: {
    withoutHeaderCsv() {
      return this.csv?.slice(1) ?? [];
    },
    sorted() {
      return sort(this.withoutHeaderCsv, this.sortBy, this.sortOrder);
    },
  },
  components: {
    VueCsvImport,
    VueCsvInput,
    VueCsvMap,
    VueCsvErrors,
    FilterComponent,
  },
};
</script>

<style>
table,
th,
td,
tr {
  border: 1px solid black;
  border-collapse: collapse;
}

th,
td {
  padding: 5px 15px;
  font-size: 17px;
}

th {
  font-weight: bold;
}

table {
  margin: 20px auto;
}

select {
  margin: 10px 20px;
  padding: 8px 15px;
  font-size: 23px;
}

input[name="csv"] {
  opacity: 0;
  position: absolute;
  z-index: -1;
}

input[type="checkbox"] {
  width: 30px;
  height: 30px;
  margin-top: 11px;
}

label[for="csv"] {
  margin: 40px auto 20px auto;
  display: block;
  cursor: pointer;
  width: 100px;
  border-radius: 25px;
  background: rgb(255, 149, 67);
  background: linear-gradient(
    90deg,
    rgb(108, 111, 238) 0%,
    rgb(108, 37, 241) 28%,
    rgb(180, 18, 255) 73%,
    rgb(253, 31, 216) 100%
  );
  font-weight: bold;
  color: white;
  font-size: 23px;
  padding: 20px 10px;
}

.filter-by-status-container {
  display: flex;
  justify-content: center;
  align-content: center;
  gap: 20px;
}
</style>