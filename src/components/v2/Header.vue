<template>
    <div>
        <div class="mt-8 mx-24 p-8 bg-gray-700 rounded-md">
            <p class="text-xl leading-tight font-bold text-center text-white">
                TUMABINI REAL ESTATE
            </p>
            <div class="justify-items-center flex mx-24">
                <button class="w-1/2 mt-2 mx-2 text-white text-right"
                        v-on:click="$router.push('/')">Buyers </button>
                <p class="mt-2 text-white text-center"> | </p>
                <button class="w-1/2 mt-2 mx-2 text-white text-left"
                        v-on:click="$router.push('/projects')">Projects </button>
            </div>
        </div>
    </div>
    
</template>