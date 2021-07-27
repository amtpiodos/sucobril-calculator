<template>
    <div :class="class_color" v-on:click="fetchBlock(block_id, block_name)">
        <p :class="font1"> {{ block_name }} </p>
        <p :class="font2"> {{ status }} </p>
    </div>
</template>

<script>
    export default ({
        props: ['block_name',
                'block_id',
                'block_status',
                'project_id',
                'has_phase'],
        data() {
            return {
                status: this.block_status === 0 ? 'Available' : 'Sold Out',
                class_color: this.block_status === 0 ? 'bg-gray-500 p-3 rounded-md' : 'bg-gray-100 p-3 rounded-md',
                font1: this.block_status === 0 ? 'text-center text-white font-bold' : 'text-center text-gray-500 font-bold',
                font2: this.block_status === 0 ?  'text-center text-white' : 'text-center text-gray-500'
            }
        },
        methods: {
            fetchBlock(block_id, block_name) {
                const block = { block_id, block_name }
                this.$store.dispatch('unit/setBlock', block)
                this.$router.push({ name: "Lots", params: { id: block_id, name: block_name, project_id: this.project_id }})
            }
        }
    })
</script>