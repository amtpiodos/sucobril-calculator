<template>
    <div class="h-screen">
        <main-header />
        <div class="my-5 mx-24 px-5">
            <div class="full m-4 bg-gray-200"> <p class="text-center py-2 font-bold text-lg"> EDIT BUYER'S INFORMATION </p> </div>
            <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 p-1">
                <div class="flex px-4 gap-4">
                    <div class="w-2/5">
                        <readonly-form  label="Last Name" v-model="buyer.last_name" />
                    </div>
                    <div class="w-2/5">
                        <readonly-form  label="First Name" v-model="buyer.first_name" />
                    </div>
                    <div class="w-1/5">
                        <readonly-form label="M.I." v-model="buyer.middle_initial" />
                    </div>
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
                <div class="full px-4">
                    <input-form label="Home Address" v-model="buyer.home_address" />
                </div>
                <div class="flex px-4 gap-4">
                    <div class="w-1/2">
                        <input-form label="Contact No." v-model="buyer.contact_number" />
                    </div>
                    <div class="w-1/2">
                        <input-form label="Email Address" v-model="buyer.email_address" />
                    </div>
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
                    <div class="w-1/4 items-center py-2"> <p class="align-middle text-right text-xs font-bold">FIRST MONTHLY INSTALLMENT <br> FEE / RESERVATION FEE: </p> </div>
                    <div class="w-3/4 py-2"> <div class="items-starts w-3/4"> <readonly-form :value="buyer.reservation_fee" /> </div> </div>
                </div>
            </div>

            <div class="flex items-center mx-auto justify-center gap-8 my-4">
                <button type="button" class="bg-gray-500 p-4 w-1/4 align-middle text-white font-bold border rounded-md mb-4">
                    SAVE UPDATES
                </button>
                <!-- <button type="button" v-on:click="saveUpdates" class="bg-gray-500 p-4 w-1/4 align-middle text-white font-bold border rounded-md mb-4">
                    SAVE UPDATES
                </button> -->
                <button type="button" v-on:click="cancelUpdates" class="bg-gray-500 p-4 w-1/4 align-middle text-white font-bold border rounded-md mb-4">
                    CANCEL
                </button>
            </div>
        </div>

    </div>
</template>

<script>
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
                buyer: this.$route.params.buyer,
                isFetchingData: true
            }
        },
        mounted() {},
        methods: {
            getLotArea() {
                console.log('this.buyer.lot.lot_area', this.buyer.lot.lot_area)
                return `${this.buyer.lot.lot_area} sq.m`
            },
            saveUpdates() {

            },
            cancelUpdates() {
                // check payment type
                const reservation_type = this.buyer.reservation_type
                // const id = this.buyer.id
                if(reservation_type == 5
                    || reservation_type == 6
                    || reservation_type == 7) {
                        this.$router.push({name: 'View-Buyer-LO', params: { id: this.buyer.id }})
                } else if(reservation_type == 1
                    || reservation_type == 2
                    || reservation_type == 3
                    || reservation_type == 4) {
                        this.$router.push({name: 'View-Buyer-HL', params: { id: this.buyer.id }})
                } else {
                    alert(`VIEW BUYER ERROR: Incorrect reservation type ${reservation_type}`)
                }
                // this.$router.push({ name: 'View Buyer', params: { id: this.buyer.id, buyer: this.buyer} })
            }
        }
    })
</script>