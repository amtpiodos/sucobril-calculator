<template>
    <div :class="class_color" v-on:click="fetchLot(lot_id, lot_name)">
        <p :class="font1"> {{ lot_name }} </p>
        <p :class="font2"> {{ status }} </p>
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
                status: '',
                class_color: '',
                font1: '',
                font2: ''
                // status: this.lot_status === 0 ? 'Available' : 'Sold Out',
                // class_color: this.lot_status === 0 ? 'bg-gray-500 p-3 rounded-md' : 'bg-gray-100 p-3 rounded-md',
                // font1: this.lot_status === 0 ? 'text-center text-white font-bold' : 'text-center text-gray-500 font-bold',
                // font2: this.lot_status === 0 ?  'text-center text-white' : 'text-center text-gray-500'
            }
        },
        created() {
            switch(this.lot_status) {
                case 0:
                    this.status = 'Available'
                    this.class_color = 'bg-gray-500 p-3 rounded-md'
                    this.font1 = 'text-center text-white font-bold'
                    this.font2 = 'text-center text-white'
                    break
                case 1:
                    this.status = 'Sold Out'
                    this.class_color = 'bg-gray-100 p-3 rounded-md'
                    this.font1 = 'text-center text-gray-500 font-bold'
                    this.font2 = 'text-center text-gray-500'
                    break
                case 2:
                    this.status = 'On Hold'
                    this.class_color = 'bg-yellow-100 p-3 rounded-md'
                    this.font1 = 'text-center text-gray-500 font-bold'
                    this.font2 = 'text-center text-gray-500'
                    break
                case 3:
                    this.status = 'Not For Sale'
                    this.class_color = 'bg-red-100 p-3 rounded-md'
                    this.font1 = 'text-center text-gray-500 font-bold'
                    this.font2 = 'text-center text-gray-500'
                    break
                default: break
            } 
        },
        methods: {
            fetchLot(lot_id, lot_name) {
                if(this.lot_status === 0) {
                    const lot = { lot_id, lot_name }
                    this.$store.dispatch('unit/setLot', lot)
                    ipcRenderer.send('fetchLot', lot_id)
                    ipcRenderer.once('fetchedLot', (event, data) => {
                        const { lot_area, lot_type, price_per_sqm } = data
                        const unit_details = { lot_area, lot_type, price_per_sqm }
                        this.$store.dispatch('unit/setUnitDetails', unit_details)
                        this.$router.push({ name: "Choose-Reservation-Type"})
                        // this.$router.push('/addbuyerform')
                    })
                } else if(this.lot_status === 1) {
                    alert(`${this.lot_name} is already unavailable.`)
                } else if(this.lot_status === 2) {
                    alert(`${this.lot_name} is currently on hold.`)
                } else if(this.lot_status === 3) {
                    alert(`${this.lot_name} is not for sale.`)
                } else {
                    alert('Lot status error:', this.lot.id, this.lot.status)
                }
            }
        }
    })
</script>