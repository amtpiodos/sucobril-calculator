<template>
    <div>
        <div class="mt-8 mx-24 pt-8 pb-4 bg-gray-700 rounded-md">
            <p class="text-xl leading-tight font-bold text-center text-white">
                TUMABINI REAL ESTATE
            </p>
            <div class="justify-items-center flex mx-24 items-center">
                <!-- <div class="items-center flex"> -->
                <button class="w-1/3 mt-1 mx-2 text-white text-center p-2"
                    v-on:click="$router.push('/')">Buyers </button>
                <p class="mt-2 text-white text-center"> | </p>
                <button class="w-1/3 mt-1 mx-2 text-white text-center p-2"
                    v-on:click="$router.push('/projects')">Projects </button>
                <p class="mt-2 text-white text-center"> | </p>
                <button class="w-1/3 mt-1 mx-2 text-white text-center p-2"
                    v-on:click="$router.push('/history')">History </button>
                <!-- </div> -->
            </div>
        </div>
    </div>
    
</template>