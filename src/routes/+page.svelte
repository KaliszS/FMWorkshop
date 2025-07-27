<script lang="ts">
  import { unpackRar } from "$lib/api";
  import Configuration from '../lib/components/Configuration.svelte';
  const appVersion = "0.1.0";

  let action = $state("");
  let edition = $state("");
  let modFile = $state("");
  let gameFolder = $state("");
</script>

<main class="container">
  <div class="header">
    <h1 class="app-title">FM Workshop</h1>
    <p class="app-description">
      A utility to help you install retro databases for Football Manager games.
    </p>
  </div>

  <div class="content">
    <Configuration bind:action bind:edition bind:modFile bind:gameFolder />
    <button onclick={() => unpackRar(modFile)}>Unpack RAR</button>
  </div>
</main>

<footer class="footer">
  <span class="version">v{appVersion}</span>
</footer>

<style>
  :root {
    font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
    font-size: 1rem;
    line-height: 1.6;
    font-weight: 400;
    color: #0f0f0f;
    background-color: #f6f6f6;
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
  }

  .container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: none;
  }

  .header {
    text-align: center;
    margin-bottom: 2rem;
    margin-top: 2rem;
  }

  .app-title {
    font-size: 3.5rem;
    font-weight: 800;
    margin: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .app-description {
    font-size: 1.5rem;
    color: #666;
    margin: 0 auto;
    line-height: 1.8;
  }

  .content {
    flex: 1;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 0 1rem;
  }

  .footer {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    padding: 0.5rem 1rem;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    backdrop-filter: blur(10px);
  }

  .version {
    font-size: 0.9rem;
    color: #666;
    font-weight: 500;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      color: #f6f6f6;
      background-color: #1a1a1a;
    }

    .app-description {
      color: #ccc;
    }

    .footer {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .version {
      color: #ccc;
    }
  }

  @media (max-width: 768px) {
    .container {
      padding: 1rem;
    }

    .app-title {
      font-size: 2.5rem;
    }

    .app-description {
      font-size: 1.1rem;
    }

    .content {
      padding: 0;
    }
  }
</style>
