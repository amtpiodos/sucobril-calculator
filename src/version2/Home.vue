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
                    <div class="mx-auto h-full content-center grid grid-cols-1 space-y-6">
                        <div v-if="!hasClickedBuyer">
                            <p class="text-xl leading-tight font-bold text-center mx-4"> Buyer's Information </p>
                            <p class="text-center align-center"> CLICK ON A BUYER TO VIEW BUYER DETAILS </p>
                        </div>
                        <div class="my-5 mx-5 px-5" v-if="hasClickedBuyer">
                            <div class="my-32">
                                <p class="my-2 text-center align-center font-semibold uppercase text-xl"> {{ buyer_details.last_name }}, {{ buyer_details.first_name }} </p>
                                <p class="my-2 text-center align-center font-regular uppercase text-md"> {{ buyer_details.home_address }} </p>
                                <p class="my-2 text-center align-center font-bold uppercase text-sm" v-if="buyer_details.status"> Status: Active</p>
                                <p class="my-2 text-center align-center font-bold uppercase text-sm text-red-500" v-else> Status: Inactive </p>
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
                })
            },
            viewFullDetails() {
                console.log('VIEW DETAILS this.id', this.id, this.buyer_details)
                if(this.buyer_details.reservation_type == 5
                    || this.buyer_details.reservation_type == 6
                    || this.buyer_details.reservation_type == 7) {
                        this.$router.push({name: 'View-Buyer-LO', params: { id: this.id }})
                } else if(this.buyer_details.reservation_type == 1
                    || this.buyer_details.reservation_type == 2
                    || this.buyer_details.reservation_type == 3
                    || this.buyer_details.reservation_type == 4) {
                        this.$router.push({name: 'View-Buyer-HL', params: { id: this.id }})
                } else {
                    alert(`VIEW BUYER ERROR: Incorrect reservation type ${this.buyer_details.reservation_type}`)
                }
            }
        }
    })
</script>