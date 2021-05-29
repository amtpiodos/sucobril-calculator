<template>
    <div class="bg-gray-500 p-3 rounded-md" v-on:click="fetchLot(lot_id)">
        <p class="text-center text-white font-bold"> {{ lot_name }} </p>
        <p class="text-center text-white"> {{ status }} </p>
    </div>
</template>

<script>
    export default ({
        props: ['lot_name',
                'lot_status',
                'lot_id'],
        data() {
            return {
                status: this.lot_status === 0 ? 'Available' : 'Sold Out'
            }
        },
        methods: {
            fetchLot(lot_id) {
                console.log('fetching lot_id', lot_id)
                // this.$router.replace({ name: "AddBuyerForm", params: { id: lot_id }})
                this.$router.push('/addbuyerform')
            }
        }
    })
</script>