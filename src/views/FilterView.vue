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
    <h4>Ordenar por:</h4>
    <select v-model="sortBy">
      <option v-for="field in fields" :key="field">{{ field }}</option>
    </select>
    <select v-model="sortOrder">
      <option value="asc">Ascendiente</option>
      <option value="desc">Descendiente</option>
    </select>
    <filter-component
      :title="'Palabras obligatorias'"
      :removeCallback="() => {}"
      :addCallback="addFilterWord"
    ></filter-component>
    <filter-component
      :title="'Palabras excluyentes'"
      :removeCallback="() => {}"
      :addCallback="addExcludeWord"
    ></filter-component>
    <div class="filter-by-status-container">
      <h4>Solo grupos con publicacion libre:</h4>
      <input type="checkbox" v-model="filterByStatusCheck" />
    </div>
    <div>
      <h4>Minimo de miembros</h4>
      <input type="number" v-model="minMembers" />
    </div>
    <button @click.prevent="() => this.excludesIndex = []" style="margin-top: 20px; margin-right: 20px">Limpiar eliminaciones manuales</button>
    <button @click.prevent="() => this.export()" style="margin-top: 20px">Exportar</button>
    <table>
      <th v-for="field in fields" :key="field">
        {{ field }}
      </th>
      <th>
        Acciones
      </th>
      <tbody>
        <tr
          v-for="field in getRows() ?? []"
          v-bind:key="field"
        >
          <td v-for="column in fields" :key="column">
            {{ field[column] || 0 }} 
          </td>
          <td>
            <button @click.prevent="() => addExcludeGroupId(field['Group ID'])">Eliminar</button>
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
import exportToCsv from "../utils/export";

export default {
  name: "FilterView",
  data() {
    return {
      csv: null,
      filterWords: [],
      excludeWords: [],
      excludesIndex: [],
      word: "",
      sortBy: "Group ID",
      sortOrder: "desc",
      fields,
      filterByStatusCheck: false,
      minMembers: 0
    };
  },
  methods: {
    addFilterWord(words) {
      this.filterWords = words;
    },
    addExcludeWord(words) {
      this.excludeWords = words;
    },
    addExcludeGroupId(id) {
      this.excludesIndex.push(id);
    },
    exclude(rows) {
      return rows?.filter(
        (row) =>
          !row.Name.toLowerCase().includes("venta") &&
          !row.Name.toLowerCase().includes("compra") &&
          arrMatch(this.filterWords, row) &&
          arrMatch(this.excludesIndex, row, "Group ID", true) &&
          arrMatch(this.excludeWords, row, "Name", true) &&
          (this.isValidToPublish(row) || !this.filterByStatusCheck) &&
          row["Members"] > this.minMembers
      );
    },
    getRows(){
      return this.exclude(this.sorted);
    },
    export(){
      exportToCsv(this.getRows())
    },
    isValidToPublish(row){
      return row["Post Status"] == "FREE" && row["Privacy"] == "PUBLIC" && (!row["Admins"] || row["Admins"] == 0);
    }
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
  font-size: 15px;
}

th {
  font-weight: bold;
}

table {
  margin: 20px auto;
}

select {
  margin: 10px 20px;
  padding: 6px 10px;
  font-size: 18px;
}

input[name="csv"] {
  opacity: 0;
  position: absolute;
  z-index: -1;
}

input[type="checkbox"] {
  width: 20px;
  height: 20px;
  margin-top: 20px;
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
  font-size: 18px;
  padding: 12px 5px;
}

.filter-by-status-container {
  display: flex;
  justify-content: center;
  align-content: center;
  gap: 20px;
}
</style>