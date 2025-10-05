<script>
  import { onMount } from 'svelte';

  let showButton = $state(false);
  let scrollY = $state(0);
  let buttonElement = $state(null);

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
    
    // Announce the action to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = 'Scrolling to top of page';
    document.body.appendChild(announcement);
    
    // Remove the announcement after a short delay
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  const handleKeydown = (event) => {
    // Handle Enter and Space keys
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      scrollToTop();
    }
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

<!-- Screen reader only styles -->
<style>
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  @keyframes fade-in {
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .animate-fade-in {
    animation: fade-in 0.3s ease forwards;
  }

  /* Ensure button is focusable and has proper focus styles */
  button:focus {
    outline: 2px solid #ffffff;
    outline-offset: 2px;
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    button {
      border: 2px solid;
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    button {
      animation: none;
      transition: none;
    }
    
    /* Still allow the button to appear, just without animation */
    .animate-fade-in {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Ensure button remains visible in forced colors mode */
  @media (forced-colors: active) {
    button {
      forced-color-adjust: none;
      border: 1px solid ButtonText;
    }
  }
</style>

{#if showButton}
  <button
    bind:this={buttonElement}
    onclick={scrollToTop}
    onkeydown={handleKeydown}
    class="fixed bottom-8 right-8 h-12 px-4 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white border-none rounded-full shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center transition-all duration-300 z-50 text-md font-medium whitespace-nowrap opacity-0 scale-75 animate-fade-in"
    title="Scroll back to the top of the page"
    aria-label="Scroll back to the top of the page"
    type="button"
    tabindex="0"
  >
    <span class="flex items-center gap-2">
      <span class="sr-only">Scroll to </span>Back to top
      <svg 
        class="w-4 h-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        aria-hidden="true"
        focusable="false"
        role="img"
      >
        <title>Up arrow</title>
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
