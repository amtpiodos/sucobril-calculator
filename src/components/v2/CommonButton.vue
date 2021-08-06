<template>
    <button type="button" class="bg-gray-500 p-4 align-middle text-white border rounded-md" v-on:click="routeTo()">
        <p class="font-bold"> {{ title }} </p>
        <p class="text-sm"> {{ description }} </p>
    </button>
</template>

<script>
    export default ({
        props: ['title', 'description', 'route_path'],
        methods: {
            routeTo() {
                console.log('route_path', this.route_path)
                 this.$router.push({ name: this.route_path})
            }
        }
    })
</script>