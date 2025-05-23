<script setup lang="ts">
import { ref } from 'vue'
import FeedbackModal from './components/FeedbackModal.vue'
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'

const selectedLanguage = ref('en')
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125">

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
      <div class="language-selector">
        <label for="language-select">Select Language: </label>
        <select id="language-select" v-model="selectedLanguage">
          <option value="en">
            English
          </option>
          <option value="es">
            Español
          </option>
        </select>
      </div>
    </div>
  </header>

  <main relative>
    <TheWelcome />
    <FeedbackModal :language="selectedLanguage" />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

.language-selector {
  margin-top: 1rem;
  margin-left: 1rem;
}

.language-selector label {
  margin-right: 0.5rem;
}

.feedback-button {
  padding: 0.5rem 1rem;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 1rem;
}

.feedback-button:hover {
  background-color: #369870;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  .language-selector {
    margin-left: 2rem;
    align-self: center;
  }
}
</style>
