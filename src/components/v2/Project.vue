<template>
    <div class="bg-gray-400 p-3 rounded-md">
        <img class="mb-2 object-scale-down h-48 w-full" v-bind:src="project_logo">
        <p class="text-center text-white font-bold"> {{ project_name }} </p>
        <p class="text-center text-white"> {{ project_location }} </p>
    </div>
</template>

<script>
    export default ({
        props: ['project_name', 'project_location',]
    })
</script>
