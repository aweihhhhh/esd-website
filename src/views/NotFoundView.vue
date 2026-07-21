<template>
  <div class="container-x py-20 text-center">
    <div class="text-7xl md:text-9xl font-extrabold text-brand-500">404</div>
    <h1 class="mt-4 text-2xl font-bold text-brand-500">Page Not Found</h1>
    <p class="mt-2 text-gray-500 max-w-md mx-auto">
      The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
    </p>
    <div class="mt-6 flex items-center justify-center gap-3 flex-wrap">
      <router-link to="/" class="btn-primary">← Back to Home</router-link>
      <router-link to="/products" class="btn-outline">Browse Products</router-link>
    </div>
  </div>
</template>
