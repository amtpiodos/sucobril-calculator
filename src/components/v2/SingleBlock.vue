<template>
    <div class="bg-gray-500 p-3 rounded-md" v-on:click="fetchBlock(block_id)">
        <p class="text-center text-white font-bold"> {{ block_name }} </p>
        <p class="text-center text-white"> {{ status }} </p>
    </div>
</template>

<script>
    export default ({
        props: ['block_name',
                'block_id',
                'block_status'],
        data() {
            return {
                status: this.block_status === 0 ? 'Available' : 'Sold Out'
            }
        },
        methods: {
            fetchBlock(block_id) {
                console.log('fetching block id', block_id)
                this.$router.replace({ name: "Lots", params: {id: block_id }})
            }
        }
    })
</script>
