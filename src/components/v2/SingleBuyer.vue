<template>
    <div class="bg-gray-200 border-2 border-light-blue-500 border-opacity-100 rounded-md px-3 py-2
            hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50">
        <p class="text-l leading-tight font-bold uppercase"> {{ lastname }}, {{ firstname }} {{ middle_initial }}. </p>
        <!-- <p v-else class="text-l leading-tight font-bold uppercase"> {{ lastname }}, {{ firstname }} </p> -->
    </div>
</template>

<script>
    export default ({
        props: ['lastname', 'firstname', 'middle_initial']
    })
</script>
