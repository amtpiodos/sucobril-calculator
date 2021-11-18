<template>
    <div class="h-screen">
        <main-header />
        <div class="mt-8 mb-2 mx-24">
            <!-- <div class="flex my-8 ">
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
            </div> -->
            <div class="flex">
                <div class="w-1/2">
                    <div class="text-xs font-bold"> TUMABINI REAL ESTATE DEVELOPMENT </div>
                    <div class="text-xs"> 133 MC Briones St., Hiway Bakilid, Mandaue City 6014 </div>
                    <div class="text-xs"> Contact: (032) 260-1522  Email: tumabinidevelopment@gmail.com </div>
                </div>
                <div class="w-1/2 flex items-right justify-right gap-2">
                    <!-- <div class="flex "> -->
                        <select v-model="project_id" @change="filterProject($event)" placeholder="Select Project" class="p-2 w-full border-2 border-gray-400 rounded-md my-1">
                            <option class="" value="" disabled selected><p class="text-gray-300">Select Project...</p></option>
                            <option value=1>MyHome </option>
                            <option value=2>MyHome Dos</option>
                            <option value=3>Gregory Homes</option>
                            <option value=4>Laurence Ville</option>
                            <option value=5>San Isidro Enclave</option>
                        </select>

                        <select v-model="status" @change="filterStatus($event)" placeholder="Select Project"  class="p-2 w-full border-2 border-gray-400 rounded-md my-1">
                            <option class="" value="2" disabled selected><p class="text-gray-300">All</p></option>
                            <option value=1>Active</option>
                            <option value=0>Inactive</option>
                        </select>

                        <!-- <button type="button" v-on:click="fetchAllBuyers"
                            class="bg-gray-500 p-4 w-1/3 items-center align-center text-white text-sm font-regular border rounded-md mb-4">
                            Export List
                        </button> -->
                        <!-- <button type="button" v-on:click="fetchAllBuyers"
                            class="bg-gray-500 p-4 w-1/3 items-center align-center text-white text-sm font-regular border rounded-md mb-4">
                            All Buyers
                        </button>
                        <button type="button" v-on:click="fetchActiveOrInactiveBuyers(1)"
                            class="bg-gray-500 p-4 w-1/3 items-center align-center text-white text-sm font-regular border rounded-md mb-4">
                            Active Buyers
                        </button>
                        <button type="button" v-on:click="fetchActiveOrInactiveBuyers(0)"
                            class="bg-gray-500 p-4 w-1/3 items-center align-center text-white text-sm font-regular border rounded-md mb-4">
                            Inactive Buyers
                        </button> -->
                    <!-- </div> -->
                </div>
            </div>
            <div class="flex my-4">
                <div class="w-1/4">
                    <div class="bg-white space-y-3 overflow-y-auto h-full">
                        <input class=" w-full bg-white border-2 border-light-blue-500 border-opacity-100 rounded-md px-3 py-2"
                            placeholder="SEARCH BUYER..."/>

                        <div v-for="buyer in buyers" :key="buyer.id">
                            <single-buyer v-bind:lastname="buyer.last_name"
                                        :firstname="buyer.first_name"
                                        v-on:click.native="hasClicked(buyer.id)"/>
                                        <!-- {{ buyer.first_name}} -->
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
                project_id: '',
                status: 2, // initial: ALL
                hasClickedBuyer: false,
                buyers: {},
                buyer_details: {},
                id: 0,
                isFetchingData: false
            }
        },
        mounted() {
            this.hasClickedBuyer = false
            console.log('hasClickedBuyer', this.hasClickedBuyer)
        },
        created() {
            console.log('HOME - created')
            this.fetchAllBuyers()
        },
        methods: {
            fetchAllBuyers() {
                ipcRenderer.send('fetchBuyersList')
                ipcRenderer.once('fetchedBuyersList', (event, data) => {
                    this.buyers = data
                })
                console.log('BUYERS LIST THIS.BUYERS', this.buyers)
            },
            filterProject(event) {
                console.log('Filter Project ID', event.target.value)
                this.project_id = event.target.value
                this.fetchBuyersByProjectList()
            },
            filterStatus(event) {
                console.log('Filter Status', event.target.value)
                this.status = event.target.value
                this.fetchBuyersByProjectList()
            },
            fetchBuyersByProjectList() {
                this.isFetchingData = true
                const dataToSubmit = {  project_id: this.project_id,
                                        status: this.status}
                ipcRenderer.send('fetchBuyersByProjectList', dataToSubmit)
                ipcRenderer.once('fetchedBuyersByProjectList', (event, data) => {
                    if(data.response == 1) {
                        console.log('Fetching Buyers by Project SUCCESS')
                        this.buyers = data.buyers
                        this.isFetchingData = false
                    } else {
                        this.isFetchingData = false
                        alert('Fetching Buyers by Project ERROR')
                    }
                })
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
            },
            fetchActiveOrInactiveBuyers(status) {
                ipcRenderer.send('fetchActiveOrInactiveBuyersList', status)
                ipcRenderer.once('fetchedActiveOrInactiveBuyersList', (event, data) => {
                    console.log('fetchedActiveOrInactiveBuyersList', data)
                    // add loading screen
                    this.buyers = data
                    this.isFetchingData = false
                })
            }
        }
    })
</script>