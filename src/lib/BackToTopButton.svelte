<script>
  import { onMount } from 'svelte';

  let showButton = $state(false);
  let scrollY = $state(0);

  // Show button when user scrolls down 2 viewport heights
  const threshold = $derived(typeof window !== 'undefined' ? window.innerHeight * 2 : 1600);

  $effect(() => {
    showButton = scrollY > threshold;
  });

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  onMount(() => {
    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>

{#if showButton}
  <button
    onclick={scrollToTop}
    class="fixed bottom-8 right-8 h-12 px-4 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white border-none rounded-full shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center transition-all duration-300 z-50 text-md font-medium whitespace-nowrap opacity-0 scale-75 animate-fade-in"
    title="Back to top"
    aria-label="Scroll back to top"
  >
    <span class="flex items-center gap-2">
      Back to top
      <svg 
        class="w-4 h-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </span>
  </button>
{/if}

<style>
  @keyframes fade-in {
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.3s ease forwards;
  }
</style>
