<template>
    <div class="h-screen">
        <main-header />
        <div class="my-8 mx-24">
            <div class="flex h-screen">
                <div class="w-1/4">
                    <div class="bg-white space-y-3 overflow-y-auto h-full">
                        <input class=" w-full bg-white border-2 border-light-blue-500 border-opacity-100 rounded-md px-3 py-2"
                            placeholder="SEARCH BUYER..."/>

                        <div v-for="buyer in buyers" :key="buyer.id">
                            <single-buyer v-bind:lastname="buyer.last_name"
                                        :firstname="buyer.first_name"
                                        v-on:click.native="hasClicked(buyer.id)"/>
                        </div>
                    </div>
                </div>

                <div class="h-96 w-3/4 bg-white items-center content-center space-y-3">
                    <!-- <p class="text-xl leading-tight font-bold text-center mx-4 my-2" v-if="hasClickedBuyer"> Buyer's Information </p> -->
                    <div class="mx-auto h-full content-center grid grid-cols-1 space-y-6">
                        <div v-if="!hasClickedBuyer">
                            <p class="text-xl leading-tight font-bold text-center mx-4"> Buyer's Information </p>
                            <p class="text-center align-center"> CLICK ON A BUYER TO VIEW BUYER DETAILS </p>
                        </div>
                        <div class="my-5 mx-5 px-5" v-if="hasClickedBuyer">
                            <div class="my-32">
                                <p class="my-2 text-center align-center font-semibold uppercase text-xl"> {{ buyer_details.last_name }}, {{ buyer_details.first_name }} </p>
                                <p class="my-2 text-center align-center font-regular uppercase text-lg"> {{ buyer_details.home_address }} </p>
                            </div>
                            <div class="flex items-center mx-auto justify-center gap-4 mt-36">
                                <button
                                    v-on:click="viewFullDetails"
                                    type="button"
                                    class="bg-gray-500 p-4 w-1/4 align-middle text-white font-bold border rounded-md">
                                   VIEW FULL DETAILS
                                </button>
                                <!-- <button
                                    v-on:click="viewFullDetails"
                                    type="button"
                                    class="bg-gray-600 py-4 w-1/4 align-middle text-white font-bold border rounded-md">
                                   EXPORT FULL DETAILS
                                </button> -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { ipcRenderer } from 'electron'
    import Header from '../components/v2/Header'
    import SingleBuyer from '../components/v2/SingleBuyer'
    import ReadOnlyInput from '../components/v2/ReadonlyInput.vue'
    import Label from '../components/v2/Label.vue'

    export default ({
        components: {
            'main-header': Header,
            'single-buyer': SingleBuyer,
            'readonly-input': ReadOnlyInput,
            'label-component': Label
        },
        data() {
            return {
                hasClickedBuyer: false,
                buyers: {},
                buyer_details: {},
                id: 0
            }
        },
        mounted() {
            this.hasClickedBuyer = false
            console.log('hasClickedBuyer', this.hasClickedBuyer)
        },
        created() {
            console.log('HOME - created')
            this.fetchBuyers()
        },
        methods: {
            fetchBuyers() {
                ipcRenderer.send('fetchBuyersList')
                ipcRenderer.once('fetchedBuyersList', (event, data) => {
                    this.buyers = data
                })
                console.log('BUYERS LIST THIS.BUYERS', this.buyers)
            },
            hasClicked(id) {
                this.hasClickedBuyer = true
                this.id = id
                console.log('hasClickedBuyer', this.hasClickedBuyer, 'id', this.id)
                this.fetchBuyerDetails(id)
            },
            fetchBuyerDetails(id) {
                console.log('id', id)
                ipcRenderer.send('fetchBuyer', id)
                ipcRenderer.once('fetchedBuyer', (event, data) => {
                    this.buyer_details = data
                    ipcRenderer.send('fetchLot', this.buyer_details.lot_id)
                    ipcRenderer.once('fetchedLot', (event, data) => {
                        this.buyer_details.lot = data
                        ipcRenderer.send('fetchBlock', this.buyer_details.lot.block_id)
                        ipcRenderer.once('fetchedBlock', (event, data) => {
                            this.buyer_details.block = data
                            if(this.buyer_details.block.phase_id) {
                               ipcRenderer.send('fetchPhase', this.buyer_details.block.phase_id)
                               ipcRenderer.once('fetchedPhase', (event, data) => {
                                   this.buyer_details.phase = data.name
                               })
                            } else {
                                this.buyer_details.phase = "N/A"
                            }
                            ipcRenderer.send('fetchProject', this.buyer_details.block.id)
                            ipcRenderer.once('fetchedProject', (event, data) => {
                                this.buyer_details.project = data
                            })
                        })
                    })
                })
                return this.buyer_details
            },
            viewFullDetails() {
                console.log('VIEW DETAILS this.id', this.id, this.buyer_details)
                this.$router.push({ name: 'View Buyer', params: { id: this.id, buyer: this.buyer_details } })
            }
        }
    })
</script>