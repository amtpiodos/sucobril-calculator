<template>
    <div class="bg-gray-200 border-2 border-light-blue-500 border-opacity-100 rounded-md px-3 py-2">
        <p class="text-l leading-tight font-bold"> {{ label }} </p>
    </div>
</template>

<script>
    export default ({
        props: ['label']
    })
</script>
