<template>
    <div class="bg-gray-500 p-3 rounded-md" v-on:click="fetchLot(lot_id, lot_name)">
        <p class="text-center text-white font-bold"> {{ lot_name }} </p>
        <p class="text-center text-white"> {{ status }} </p>
    </div>
</template>

<script>
    import { ipcRenderer } from 'electron'
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
            fetchLot(lot_id, lot_name) {
                const lot = { lot_id, lot_name }
                this.$store.dispatch('unit/setLot', lot)
                ipcRenderer.send('fetchLot', lot_id)
                ipcRenderer.once('fetchedLot', (event, data) => {
                    const { lot_area, lot_type, price_per_sqm } = data
                    const unit_details = { lot_area, lot_type, price_per_sqm }
                    this.$store.dispatch('unit/setUnitDetails', unit_details)
                })

                // this.$router.replace({ name: "AddBuyerForm", params: { id: lot_id }})
                this.$router.push('/addbuyerform')
            }
        }
    })
</script>