<template>
    <div>
        <main-header />
        <div class="my-5 mx-24">
            <div class="full my-4 bg-gray-200"> <p class="text-center py-2 font-bold text-lg"> {{ project.project_name }} {{ phase.phase_name }} {{ block_name }} </p> </div>
        </div>

        <div class="flex my-5 mx-24 ">
            <div class="w-1/2">
                <div class="text-xs font-bold"> TUMABINI REAL ESTATE DEVELOPMENT </div>
                <div class="text-xs"> 133 MC Briones St., Hiway Bakilid, Mandaue City 6014 </div>
                <div class="text-xs"> Contact: (032) 260-1522  Email: tumabinidevelopment@gmail.com </div>
            </div>
            <div class="w-full">
                <div class="flex items-right justify-right gap-8">
                    <button class="w-1/3"> </button>
                    <button class="w-1/3"> </button>
                    <button type="button" v-on:click="backToBlocks()"
                        class="bg-gray-500 p-4 w-1/3 items-center align-center text-white font-regular border rounded-md mb-4">
                        Back To Blocks
                    </button>
                </div>
            </div>
        </div>

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
                block_id: this.$route.params.id,
                block_name: this.$route.params.name,
                // project_name: this.$store.state.unit.project.project_name,
                // phase_name: this.$store.state.unit.phase.phase_name,
                // block_name: this.$store.state.unit.block.block_name,

                // phase_id: this.$store.state.unit.phase.phase_id

                project: this.$store.state.unit.project,
                phase: this.$store.state.unit.phase,
                block: this.$store.state.unit.block,
                

            }
        },
        created() {
            this.$store.dispatch('unit/setLot', {})
            console.log('LOTS LIST THIS.ROUTE', this.$route)
            console.log('LOTS LIST State', this.$store.state)
            this.fetchLots()
        },
        methods: {
            backToBlocks() {
                this.phase.phase_id ? this.$router.push({ name: "Blocks-With-Phase",
                                    params: {   phase_id: this.phase.phase_id,
                                                name: this.phase.phase_name,
                                                project_id: this.project.project_id,
                                                has_phase: true }})
                        : this.$router.push({ name: "Blocks-Without-Phase",
                                    params: {   project_id: this.project.project_id,
                                                name: this.project.project_name,
                                                location: this.project.project_location,
                                                has_phase: false }})
                        
            },
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