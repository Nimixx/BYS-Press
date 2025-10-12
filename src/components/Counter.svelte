<script lang="ts">
  let count = $state(0);

  function increment() {
    count++;
  }

  function decrement() {
    count--;
  }

  function reset() {
    count = 0;
  }
</script>

<div class="counter">
  <h2 class="counter__title">Interactive Counter</h2>
  <div class="counter__display">
    <span class="counter__value">{count}</span>
  </div>
  <div class="counter__buttons">
    <button class="counter__button counter__button--decrement" onclick={decrement}>
      -
    </button>
    <button class="counter__button counter__button--reset" onclick={reset}>
      Reset
    </button>
    <button class="counter__button counter__button--increment" onclick={increment}>
      +
    </button>
  </div>
</div>

<style scoped>
  .counter {
    margin: 3rem auto;
    padding: 0;
    max-width: 280px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .counter__title {
    margin: 0 0 2rem 0;
    font-size: 1rem;
    font-weight: 500;
    text-align: center;
    color: rgba(255, 255, 255, 0.6);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .counter__display {
    text-align: center;
    margin-bottom: 2rem;
  }

  .counter__value {
    font-size: 4rem;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.95);
    display: inline-block;
    min-width: 80px;
    font-variant-numeric: tabular-nums;
  }

  .counter__buttons {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
  }

  .counter__button {
    padding: 0.5rem 1.25rem;
    font-size: 1.125rem;
    font-weight: 400;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: rgba(255, 255, 255, 0.9);
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
  }

  .counter__button:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }

  .counter__button:active {
    transform: translateY(0);
  }

  .counter__button--reset {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    opacity: 0.7;
  }

  .counter__button--reset:hover {
    opacity: 1;
  }
</style>
