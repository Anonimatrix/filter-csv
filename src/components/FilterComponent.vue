<template>
  <h4>{{ title }}</h4>
  <div>
    <input type="text" v-model="word" />
    <button @click="add">Añadir</button>
  </div>
  <div>
    <p v-for="(word, i) in words" :key="i">
      {{ word }}
      <button @click="() => this.remove(i)">Eliminar</button>
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      word: "",
      words: [],
    };
  },
  props: ["removeCallback", "addCallback", "title"],
  methods: {
    remove(i) {
      this.words.splice(i, 1);
      if (this.removeCallback) this.removeCallback(this.words);
    },
    add() {
      if (this.word) this.words.push(this.word.toLowerCase());
      this.word = "";
      this.addCallback(this.words);
    },
  },
};
</script>

<style scoped>
input {
  display: block;
  padding: 4px 7px;
  font-size: 16px;
  border-radius: 10px;
}
div {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 15px;
}
</style>