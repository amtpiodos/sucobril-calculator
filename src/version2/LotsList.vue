<template>
    <div>
        <main-header />
        <div class="my-8 mx-24 grid grid-cols-2 gap-4 lg:grid-cols-5 md:gap-8">
            <div v-for="lot in lots" :key="lot.id">
                <single-lot v-bind:lot_name="lot.name"
                            v-bind:lot_id="lot.id"
                            v-bind:lot_status="lot.status"/>
            </div>
        </div>
    </div>
</template>

<script>
    import Header from '../components/v2/Header'
    import Lot from '../components/v2/SingleLot'
    import { ipcRenderer } from 'electron'

    export default ({
        components: {
            'main-header': Header,
            'single-lot': Lot
        },
        data() {
            return {
                lots: '',
                block_id: this.$route.params.id
            }
        },
        created() {
            this.fetchLots()
        },
        methods: {
            fetchLots() {
                console.log('block_id', this.block_id)
                ipcRenderer.send('fetchLotsList', this.block_id)
                ipcRenderer.once('fetchedLotsList', (event, data) => {
                    this.lots = data
                    console.log('fetchedLotsList', typeof(this.lots), this.lots)
                })
            }
        }
    })
</script>
