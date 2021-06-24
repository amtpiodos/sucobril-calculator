<template>
    <div class="h-screen">
        <main-header />
        <div class="my-8 mx-24">
            <div class="flex h-screen">
                <div class="w-1/4">
                    <div class="bg-white space-y-3 overflow-y-auto h-full">
                        <input class=" w-full bg-white border-2 border-light-blue-500 border-opacity-100 rounded-md px-3 py-2 mx-2"
                            placeholder="SEARCH BUYER..."/>

                        <div class="mx-2" v-for="buyer in buyers" :key="buyer.id">
                            <single-buyer v-bind:lastname="buyer.last_name"
                                        :firstname="buyer.first_name"
                                        v-on:click.native="hasClicked(buyer.id)"/>
                        </div>
                    </div>
                </div>

                <div class="w-3/4 bg-white h-full">
                    <p class="text-xl leading-tight font-bold text-center mx-4"> Buyer's Information </p>
                    <div class="mx-auto">
                        <p class="text-center align-center" v-if="!hasClickedBuyer"> CLICK ON A BUYER TO VIEW BUYER DETAILS </p>
                        <div class="my-5 mx-5 px-5"  v-if="hasClickedBuyer">
                            <div class="flex px-4 gap-4">
                                <div class="w-2/5">
                                    <label-component label="LAST NAME"/>
                                    <input type="text"
                                        v-if="hasClickedBuyer"
                                        v-model="buyer_details.last_name"
                                        class="w-full my-2 py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                        readonly disabled >
                                </div>
                                <div class="w-2/5">
                                    <label-component label="FIRST NAME"/>
                                    <input type="text"
                                        v-if="hasClickedBuyer"
                                        v-model="buyer_details.first_name"
                                        class="w-full my-2 py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                        readonly disabled >
                                </div>
                                <div class="w-1/5">
                                    <label-component label="MIDDLE INITIAL"/>
                                    <input type="text"
                                        v-if="hasClickedBuyer"
                                        v-model="buyer_details.middle_initial"
                                        class="w-full my-2 py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                        readonly disabled >
                                </div>
                            </div>
                            <div class="flex px-4">
                                <div class="w-2/5 mr-4">
                                    <label-component label="PROJECT"/>
                                    <input type="text"
                                        v-if="hasClickedBuyer"
                                        v-model="buyer_details.middle_initial"
                                        class="w-full my-2 py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                        readonly disabled >
                                </div>
                                <div class="w-3/5 flex gap-4">
                                    <div class="w-1/3">
                                        <label-component label="PHASE"/>
                                        <input type="text"
                                            v-if="hasClickedBuyer"
                                            v-model="buyer_details.middle_initial"
                                            class="w-full my-2 py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                            readonly disabled >
                                    </div>
                                    <div class="w-1/3">
                                        <label-component label="BLOCK"/>
                                        <input type="text"
                                            v-if="hasClickedBuyer"
                                            v-model="buyer_details.middle_initial"
                                            class="w-full my-2 py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                            readonly disabled >
                                    </div>
                                    <div class="w-1/3">
                                        <label-component label="LOT"/>
                                        <input type="text"
                                            v-if="hasClickedBuyer"
                                            v-model="buyer_details.middle_initial"
                                            class="w-full my-2 py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                            readonly disabled >
                                    </div>
                                </div>
                            </div>
                            <div class="flex gap-4 px-4">
                                <div class="w-1/3">
                                    <label-component label="LOT AREA"/>
                                    <input type="text"
                                        v-if="hasClickedBuyer"
                                        v-model="buyer_details.middle_initial"
                                        class="w-full my-2 py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                        readonly disabled >
                                </div>
                                <div class="w-1/3">
                                    <label-component label="TYPE OF LOT"/>
                                    <input type="text"
                                        v-if="hasClickedBuyer"
                                        v-model="buyer_details.middle_initial"
                                        class="w-full my-2 py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                        readonly disabled >
                                </div>
                                <div class="w-1/3">
                                    <label-component label="PRICE/SQ.M"/>
                                    <input type="text"
                                        v-if="hasClickedBuyer"
                                        v-model="buyer_details.middle_initial"
                                        class="w-full my-2 py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                        readonly disabled >
                                </div>
                            </div>
                            <div class="full px-4">
                                <label-component label="HOME ADDRESS"/>
                                    <input type="text"
                                        v-if="hasClickedBuyer"
                                        v-model="buyer_details.home_address"
                                        class="w-full my-2 py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                        readonly disabled >
                            </div>
                            <div class="flex gap-4 px-4">
                                <div class="w-1/2">
                                    <label-component label="EMAIL ADDRESS"/>
                                    <input type="text"
                                        v-if="hasClickedBuyer"
                                        v-model="buyer_details.email_address"
                                        class="w-full my-2 py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                        readonly disabled >
                                </div>
                                <div class="w-1/2">
                                    <label-component label="CONTACT NUMBER"/>
                                    <input type="text"
                                        v-if="hasClickedBuyer"
                                        v-model="buyer_details.contact_number"
                                        class="w-full my-2 py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                        readonly disabled >
                                </div>
                            </div>
                            <div class="flex gap-4 px-4">
                                <div class="w-1/2">
                                    <label-component label="REALTY"/>
                                    <input type="text"
                                        v-if="hasClickedBuyer"
                                        v-model="buyer_details.realty"
                                        class="w-full my-2 py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                        readonly disabled >
                                </div>
                                <div class="w-1/2">
                                    <label-component label="AGENT"/>
                                    <input type="text"
                                        v-if="hasClickedBuyer"
                                        v-model="buyer_details.agent"
                                        class="w-full my-2 py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                        readonly disabled >
                                </div>
                            </div>
                            <div class="full m-4 bg-gray-200"> <p class="text-center py-2 font-bold text-md"> REGULAR RESERVATION / STRAIGHT MONTHLY </p> </div>
                            <div class="full lg:container lg:mx-48px md:container md:mx-auto gap-4">
                                <div class="flex px-4 gap-4 my-1">
                                    <div class="w-1/3 items-center ">
                                        <label-component label="TOTAL CONTRACT PRICE (includes transfer fee):"/>
                                    </div>
                                    <div class="w-2/3">
                                        <div class="items-starts">
                                            <input type="text"
                                                v-if="hasClickedBuyer"
                                                v-model="buyer_details.total_contract_price"
                                                class="w-full my-2 py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                                readonly disabled >
                                        </div>
                                    </div>
                                </div>
                                <div class="flex px-4 gap-4 my-1">
                                    <div class="w-3/5 items-center flex gap-2">
                                        <label-component label="MONTHLY INSTALLMENT for"/>
                                        <input type="text"
                                            v-model="buyer_details.installment_months"
                                            class=" border border-gray-200 rounded-md w-1/4 py-1 text-md text-center px-2 uppercase"
                                            readonly disabled >
                                        <label-component label="months:"/>
                                    </div>
                                    <div class="w-2/5 items-center ">
                                        <div class="items-starts">
                                            <input type="text"
                                                v-if="hasClickedBuyer"
                                                v-model="buyer_details.monthly_installment"
                                                class="w-full my-2 py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                                readonly disabled >
                                        </div>
                                    </div>
                                </div>
                                <div class="flex px-4 gap-4 my-1">
                                    <div class="w-1/3 items-center ">
                                        <label-component label="FIRST MONTHLY INSTALLMENT FEE / RESERVATION FEE:"/>
                                    </div>
                                    <div class="w-2/3">
                                        <div class="items-starts">
                                            <input type="text"
                                                v-if="hasClickedBuyer"
                                                v-model="buyer_details.reservation_fee"
                                                class="w-full my-2 py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                                readonly disabled >
                                        </div>
                                    </div>
                                </div>
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
                console.log('type of buyer_details', typeof(this.buyer_details), this.buyer_details)
                return this.buyer_details
            }
        }
    })
</script>