<template>
    <div class="h-screen">
        <main-header />
        <div class="my-5 mx-24 px-5">
            <div class="full m-4 bg-gray-200"> <p class="text-center py-2 font-bold text-lg"> VIEW BUYER'S INFORMATION </p> </div>
            
            <div v-if="!isFetchingData">
                <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 p-1">
                    <div class="flex px-4 gap-4">
                        <div class="w-2/5"> <readonly-form label="Last Name" :value="buyer.last_name" /> </div>
                        <div class="w-2/5"> <readonly-form label="First Name" :value="buyer.first_name" /> </div>
                        <div class="w-1/5"> <readonly-form label="M.I." :value="buyer.middle_initial" /> </div>
                    </div>
                    <div class="full px-4"> <readonly-form label="Reservation Date" value="" /> </div>
                    <div class="full px-4"> <readonly-form label="Project Name" :value="buyer.project.name" /> </div>
                    <div class="grid grid-cols-4 gap-4 px-4">
                        <div class="full px-1"> <readonly-form label="Block" :value="buyer.block.name" /> </div>
                        <div class="full px-1"> <readonly-form label="Lot" :value="buyer.lot.name" /> </div>
                        <div class="full px-1"> <readonly-form label="Phase" :value="buyer.phase" /> </div>
                        <div class="full px-1"> <readonly-form label="Lot Area" :value="getLotArea()" /> </div>
                    </div>
                    <div class="full px-4"> <readonly-form label="Project Address" :value="buyer.project.location" /> </div>
                    <div class="grid grid-cols-2 gap-4 px-4">
                        <div class="full"> <readonly-form label="Price/Sq.M" :value="buyer.lot.price_per_sqm" /> </div>
                        <div class="full"> <readonly-form label="Type of Lot" :value="buyer.lot.lot_type" /> </div>
                    </div>
                    <div class="full px-4"> <readonly-form label="Home Address" :value="buyer.home_address" />
                    </div>
                    <div class="flex px-4 gap-4">
                        <div class="w-1/2"> <readonly-form label="Contact No." :value="buyer.contact_number" /> </div>
                        <div class="w-1/2"> <readonly-form label="Email Address" :value="buyer.email_address" /> </div>
                    </div>
                    <div class="full px-4"> <readonly-form label="Realty's Name" :value="buyer.realty" /> </div>
                    <div class="full px-4"> <readonly-form label="Agent's Name" :value="buyer.agent" /> </div>
                </div>
                <div class="full m-4 bg-gray-200"> <p class="text-center py-2 font-bold text-md"> REGULAR RESERVATION / STRAIGHT MONTHLY </p> </div>

                <div class="full lg:container lg:mx-48px md:container md:mx-auto gap-4">
                    <div class="flex px-4 gap-4 my-4">
                        <div class="w-1/4 items-center py-2"> <p class="align-middle text-right text-xs font-bold">TOTAL CONTRACT PRICE: <br> (includes transfer fee) </p> </div>
                        <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form :value="buyer.total_contract_price" /> </div> </div>
                    </div>
                    <div class="flex px-4 gap-4 my-4">
                        <div class="w-1/4 items-center py-2">
                            <p class="align-middle text-right text-xs font-bold">MONTHLY INSTALLMENT for <br />
                                <input type="text"
                                    v-model="buyer.installment_months"
                                    class=" border border-gray-300 rounded-md w-1/4 py-1 text-md text-center px-2 uppercase "
                                    readonly disabled> months:
                            </p>
                        </div>
                        <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form :value="buyer.monthly_installment" /> </div> </div>
                    </div>
                    <div class="flex px-4 gap-4 my-4">
                        <div class="w-1/4 items-center py-2"> <p class="align-middle text-right text-xs font-bold">FIRST MONTHLY INSALLMENT <br> FEE / RESERVATION FEE: </p> </div>
                        <div class="w-3/4 py-2"> <div class="items-starts w-3/4"> <readonly-form :value="buyer.reservation_fee" /> </div> </div>
                    </div>
                </div>

                <div class="flex items-center mx-auto justify-center gap-8 my-4">
                    <button type="button" v-on:click="editDetails"
                        class="bg-gray-500 p-4 w-1/4 align-middle text-white font-bold border rounded-md mb-4">
                        EDIT INFORMATION
                    </button>
                    <button type="button" v-on:click="exportDetails"
                        class="bg-gray-500 p-4 w-1/4 align-middle text-white font-bold border rounded-md mb-4">
                        EXPORT INFORMATION
                    </button>
                </div>


            </div>
            <div v-if="isFetchingData">
                LOAIDNGGGGG
            </div>
        </div>

    </div>
</template>

<script>
    import { ipcRenderer } from 'electron'
    import Header from '../components/v2/Header'
    import Label from '../components/v2/Label.vue'
    import InputForm from '../components/v2/InputForm'
    import ReadOnlyForm from '../components/v2/ReadonlyInput'

    export default ({
        components: {
            'main-header': Header,
            'label-component': Label,
            'input-form': InputForm,
            'readonly-form': ReadOnlyForm
        },
        data() {
            return {
                // buyer: this.$route.params.buyer,
                buyer: {},
                isFetchingData: true,
                isEditing: false
            }
        },
        created() {
            this.getDetails(this.$route.params.id)
        },
        methods: {
            getDetails(id) {
                this.isFetching = true,
                ipcRenderer.send('fetchBuyer', id)
                ipcRenderer.once('fetchedBuyer', (event, data) => {
                    this.buyer = data
                    ipcRenderer.send('fetchLot', this.buyer.lot_id)
                    ipcRenderer.once('fetchedLot', (event, data) => {
                        this.buyer.lot = data
                        ipcRenderer.send('fetchBlock', this.buyer.lot.block_id)
                        ipcRenderer.once('fetchedBlock', (event, data) => {
                            this.buyer.block = data
                            if(this.buyer.block.phase_id) {
                               ipcRenderer.send('fetchPhase', this.buyer.block.phase_id)
                               ipcRenderer.once('fetchedPhase', (event, data) => {
                                   this.buyer.phase = data.name
                               })
                            } else {
                                this.buyer.phase = "N/A"
                            }
                            ipcRenderer.send('fetchProject', this.buyer.block.id)
                            ipcRenderer.once('fetchedProject', (event, data) => {
                                this.buyer.project = data
                                console.log('this.buyer in view details', this.buyer)
                                this.isFetchingData = false
                            })
                        })
                    })
                })
            },
            getLotArea() {
                console.log('this.buyer.lot.lot_area', this.buyer.lot.lot_area)
                return `${this.buyer.lot.lot_area} sq.m`
            },
            editDetails() {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                this.$router.push({ name: 'Edit Buyer', params: { id: this.buyer.id, buyer: this.buyer } })
            },
            exportDetails() {
            }
        }
    })
</script>