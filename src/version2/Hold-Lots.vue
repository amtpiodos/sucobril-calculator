<template>
    <div>
        <main-header />
        <div class="my-5 mx-24">
            <div class="full my-4 bg-gray-200">
                <p class="text-center pt-2 font-bold text-lg"> {{ project.project_name }} {{ phase.phase_name }} {{ block_name }} </p>
                <p class="text-center pb-2 font-regular text-xs"> Select Lots to Put On Hold </p>
            </div>
        </div>

        <div class="flex my-5 mx-24 ">
            <div class="w-1/2">
                <div class="text-xs font-bold"> TUMABINI REAL ESTATE DEVELOPMENT </div>
                <div class="text-xs"> 133 MC Briones St., Hiway Bakilid, Mandaue City 6014 </div>
            </div>
            <div class="w-1/2">
                <div class="text-xs">
                    <p class="text-right"> Contact No. / Landline: (032) 260-1522 </p> 
                    <p class="text-right"> Email: tumabinidevelopment@gmail.com </p>
                </div>
            </div>
        </div>

        <div v-if="lots.length > 0">
            <div class="my-8 mx-24 grid grid-cols-2 gap-4 lg:grid-cols-5 md:gap-8">
                <div v-for="lot in lots" :key="lot.id">
                    <div class="bg-gray-500 p-3 rounded-md">
                        <div class ="flex mx-2">
                            <input class="mx-2" type="checkbox" :id="lot.id" :value="lot.id" v-model="selected_lots">
                            <p class="mx-2 text-center text-white font-bold"> {{ lot.name }} </p>
                        </div>
                        
                        <p class="text-center text-white"> {{ getLotStatus(lot.status) }} </p>
                    </div>
                    <!-- <input type="checkbox" :id="lot.id" :value="lot.id" v-model="selected_lots">
                    <label> {{lot.name}} </label> -->
                </div>
            </div>

            <div class="w-full flex mx-auto justify-center items-center my-4 gap-4">
                <button type="button" v-on:click="holdLot()"
                    class="w-1/5 bg-gray-200 p-2 align-middle text-black font-bold border rounded-md my-2">
                    HOLD LOTS
                </button>
                <button type="button" v-on:click="goBackToLotsList()"
                    class="w-1/5 bg-gray-200 p-2 align-middle text-black font-bold border rounded-md my-2">
                    CANCEL
                </button>
            </div>
        </div>

        <div v-else>
            <div class="full my-4 mx-24">
                <p class="text-center p-2 font-bold text-lg"> THERE ARE NO LOTS TO PUT ON HOLD </p>
                <p class="text-center pb-2 font-regular text-xs"> All lots are either Sold Out or already put On Hold </p>
            </div>
            <div class="w-full flex mx-auto justify-center items-center my-4 gap-4">
                <button type="button" v-on:click="goBackToLotsList()"
                    class="w-1/5 bg-gray-200 p-2 align-middle text-black font-bold border rounded-md my-2">
                    BACK TO LOTS
                </button>
            </div>
        </div>
    </div>
</template>

<script>
    import Header from '../components/v2/Header'
    import Lot from '../components/v2/SingleLot'
    import { ipcRenderer } from 'electron'
    // import vSelect from 'vue-select'/
    // import 'vue-select/dist/vue-select.css';

    export default ({
        components: {
            'main-header': Header,
            'single-lot': Lot,
            // 'v-select': vSelect
        },
        data() {
            return {
                lots: '',
                filtered_lots: {},
                block_id: this.$route.params.id,
                block_name: this.$route.params.name,
                // project_name: this.$store.state.unit.project.project_name,
                // phase_name: this.$store.state.unit.phase.phase_name,
                // block_name: this.$store.state.unit.block.block_name,

                // phase_id: this.$store.state.unit.phase.phase_id

                project: this.$store.state.unit.project,
                phase: this.$store.state.unit.phase,
                block: this.$store.state.unit.block,

                selected_lots: [],
                option_lots: []
                

            }
        },
        created() {
            // this.$store.dispatch('unit/setLot', {})
            console.log('LOTS LIST THIS.ROUTE', this.$route)
            console.log('LOTS LIST State', this.$store.state)
            this.fetchLots()
        },
        methods: {
            getLotStatus(status) {
                switch(status) {
                    case 0: return 'Available'; break;
                    case 1: return 'Sold Out'; break;
                    case 2: return 'On Hold'; break;
                    default: return 'ERROR getting status'; break;
                }
            },
            fetchLots() {
                console.log('block_id', this.block_id)
                ipcRenderer.send('fetchLotsList', this.block_id)
                ipcRenderer.once('fetchedLotsList', (event, data) => {
                    this.lots = data.filter(function(lot) {
                        return lot.status == 0
                    })
                    
                })
            },

            holdLot() {
                // console.log('On Holding Lot id')
                const data = { selected_lots: this.selected_lots }
                if(confirm(`Are you sure you want to put the selected lots on hold?`)) {
                    console.log('OK')
                    ipcRenderer.send('onHoldLots', data)
                    ipcRenderer.once('heldLots', (event, data) => {
                    console.log('ON HOLD LOT REPLY', data)
                    data == 1 ? alert(`Selected Lots are now ON HOLD`)
                         : alert(`SELECTED LOTS ON HOLD ERROR`)
                    this.goBackToLotsList()

                })
                } else {
                    console.log('CANCELLED')
                }
            },
            goBackToLotsList() {
                this.$router.push({ name: "Lots", params: { id: this.block.block_id, name: this.block.block_name, project_id: this.project.project_id }})
            }
        }
    })
</script>
