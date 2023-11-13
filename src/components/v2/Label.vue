<template>
    <label for="text"
            class="block text-sm font-semibold uppercase leading-5 text-black px-1">
            {{ label }}
    </label>
</template>

<script>
    export default ({
        props: ['label']
    })
</script>