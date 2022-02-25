<template>
    <div class="h-screen">
        <main-header />
        <div class="my-5 mx-24">

            <div v-if="!isFetchingData">
                <div class="h-2/3 flex">
                    <div class="w-1/2 px-4">
                        <div class="text-xs font-bold"> TUMABINI REAL ESTATE DEVELOPMENT </div>
                        <div class="text-xs"> 133 MC Briones St., Hiway Bakilid, Mandaue City 6014 </div>
                    </div>
                    <div class="w-1/2 px-4">
                        <div class="text-xs font-semibold"> <p class="text-right"> {{ buyer.project.name }} - {{ buyer.project.location }} </p> </div>
                        <div class="text-xs"> <p class="text-right"> Contact: (032) 260-1522 Email: tumabinidevelopment@gmail.com </p> </div>
                    </div>
                </div>

                <!-- CHECK FOR MANAGER CREDENTIALS IF REQUESTING FOR EDIT -->
                <div class="full m-4 border-4 rounded-md" v-if="this.isRequestingEdit">
                    <p class="align-middle text-center text-md font-bold my-1 py-4 pt-8"> INPUT CREDENTIALS TO EDIT </p>
                    <div class="w-full flex mx-auto justify-center items-center my-2 gap-4">
                        <input-form label="Username:" v-model="inputtedCredentials.username"/>
                        <password-form label="Password: " v-model="inputtedCredentials.password"/>
                    </div>
                    <p class="align-middle text-center text-sm text-red-700 font-bold my-1 py-2" v-if="this.incorrectCredentials"> Incorrect credentials. Please try again. </p>
                    <div class="w-full flex mx-auto justify-center items-center my-4 gap-4">
                        <button type="button" v-on:click="checkCredentials"
                            class="w-1/5 bg-gray-200 p-2 align-middle text-black font-bold border rounded-md my-2">
                            SUBMIT
                        </button>
                        <button type="button" v-on:click="cancelEdit"
                            class="w-1/5 bg-gray-200 p-2 align-middle text-black font-bold border rounded-md my-2">
                            CANCEL
                        </button>
                    </div>
                </div>

                <!-- VIEW BUYER INFO WITHOUT EDIT REQUEST -->
                <div v-else>
                    <div class="full m-4 bg-gray-200">
                        <p class="text-center pt-2 font-bold text-lg"> BUYER'S INFORMATION </p>
                        <p class="text-center pb-2 font-regular text-sm" v-if="buyer.status" v-on:click="editPersonalInfo()"> Edit Information </p>
                        <p class="text-center pb-2 font-bold text-sm text-red-700" v-if="!buyer.status">
                            This buyer has been forefeited and is now inactive.
                        </p>
                    </div>

                    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 p-1">
                        <div class="flex px-4 gap-4">
                            <div class="w-2/5"> <readonly-form label="Last Name" :value="buyer.last_name" /> </div>
                            <div class="w-2/5"> <readonly-form label="First Name" :value="buyer.first_name" /> </div>
                            <div class="w-1/5"> <readonly-form label="M.I." :value="buyer.middle_initial" /> </div>
                        </div>
                        <div class="full px-4"> <readonly-form label="Reservation Date" :value="formatDate(buyer.payment.date)" /> </div>
                        <div class="full px-4"> <readonly-form label="Project Name" :value="buyer.project.name" /> </div>
                        <div class="grid grid-cols-5 gap-2 px-4">
                            <div class="full px-1"> <readonly-form label="Block" :value="buyer.block.name" /> </div>
                            <div class="full px-1"> <readonly-form label="Lot" :value="buyer.lot.name" /> </div>
                            <div class="full px-1"> <readonly-form label="Phase" :value="buyer.phase" /> </div>                            
                            <div class="full px-1"> <readonly-form label="Lot Area" :value="getLotArea()" /> </div>
                            <div class="full px-1"> <readonly-form label="Flr Area" :value="getFloorArea()" /> </div>
                        </div>
                        <div class="full px-4"> <readonly-form label="Project Address" :value="buyer.project.location" /> </div>
                        <div class="grid grid-cols-2 gap-4 px-4">
                            <div class="full"> <readonly-form label="Price/Sq.M (PHP)" :value="formatDisplay(buyer.lot.price_per_sqm)" /> </div>
                            <div class="full"> <readonly-form label="House Type" :value="buyer.lot.lot_type" /> </div>
                        </div>
                        <div class="full px-4"> <readonly-form label="Home Address" :value="buyer.home_address" />
                        </div>
                        <div class="flex px-4 gap-4">
                            <div class="w-1/2"> <readonly-form label="Contact No." :value="buyer.contact_number" /> </div>
                            <div class="w-1/2"> <readonly-form label="Email Address" :value="buyer.email_address" /> </div>
                        </div>
                        <div class="full px-4"> <readonly-form label="Realty's Name" :value="buyer.realty" /> </div>
                        <div class="flex px-4 gap-4">
                            <div class="w-1/2"> <readonly-form label= "Agent's Name" :value="buyer.agent" /> </div>
                            <div class="w-1/2"> <readonly-form label= "Agent's Number" :value="buyer.agent_number" /> </div>
                        </div>
                        <!-- <div class="full px-4"> <readonly-form label="Agent's Name" :value="buyer.agent" /> </div> -->
                    </div>
                    <div class="flex items-center mx-auto justify-center gap-8 my-4">
                        <button type="button" v-on:click="viewPayment"
                            class="bg-gray-600 p-4 w-1/4 align-middle text-white font-bold border rounded-md mb-4">
                            VIEW PAYMENTS
                        </button>
                        <button type="button" v-on:click="exportDetails"
                            class="bg-gray-600 p-4 w-1/4 align-middle text-white font-bold border rounded-md mb-4">
                            EXPORT INFORMATION
                        </button>
                    </div>

                    <!-- HOUSE AND LOT REGULAR RESERVATION -->
                    <div v-if="buyer.reservation_type==1">
                        <div class="full m-4 bg-gray-200">
                            <p class="text-center py-2 font-bold text-md"> REGULAR RESERVATION </p>
                            <!-- <p class="text-center pb-2 font-regular text-sm" v-if="buyer.status" v-on:click="editReservation()"> Edit Reservation </p> -->
                        </div>
                        <div class="full lg:container lg:mx-48px md:container md:mx-auto gap-4">
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2"> <p class="align-middle text-right text-xs font-bold">TOTAL CONTRACT PRICE: <br> (inclusive of transfer and move-in fees) </p> </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form :value="formatDisplay(buyer.payment.total_contract_price)" /> </div> </div>
                            </div>

                            <!-- REQUIRED EQUITY if reservation date is before 2021 and is Laurence Ville -->
                            <div class="flex px-4 gap-4 my-2" v-if="dateIsBefore2021 && buyer.project.id == 4">
                                <div class="w-1/4 items-center py-2 my-2"> <p class="align-middle text-right text-xs font-bold">Required Equity Amount: </p> </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4">
                                    <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                        <input type="text"
                                            :value="formatDisplay(buyer.payment.required_equity_amount)"
                                            class="w-full py-2 px-2 text-sm border border-gray-200 rounded-md uppercase"
                                            readonly disabled>
                                    </div> </div>
                                </div>
                            </div>

                            <!-- ELSE Normal Regular Reservation -->
                            <div class="flex px-4 gap-4 my-2" v-else>
                                <div class="w-1/4 items-center py-2 mt-1">
                                    <p class="align-middle text-right text-xs font-bold">Required Equity
                                        <input type="text"
                                            readonly disabled
                                            v-model="buyer.payment.required_equity_percentage"
                                            class=" border border-gray-200 rounded-md w-1/4 py-1 text-md text-center px-2 uppercase "
                                        > %:
                                    </p>
                                </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form :value="formatDisplay(buyer.payment.required_equity_amount)" /> </div> </div>
                            </div>

                            
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2 my-2"> <p class="align-middle text-right text-xs font-bold">Reservation Fee: </p></div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form :value="formatDisplay(buyer.payment.reservation_fee)" /> </div> </div>
                            </div>
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2 my-2"> <p class="align-middle text-right text-xs font-bold">Equity Net of Reservation Fee: </p></div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form :value="formatDisplay(buyer.payment.equity_net_of_reservation_fee)" /> </div> </div>
                            </div>
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2 mt-1">
                                    <p class="align-middle text-right text-xs font-bold">Required Monthly Equity <br/> for
                                        <input type="text"
                                            readonly disabled
                                            :value="buyer.payment.equity_months"
                                            class=" border border-gray-200 rounded-md w-1/4 py-1 text-md text-center px-2 uppercase "
                                        > months:
                                    </p>
                                </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form :value="formatDisplay(buyer.payment.monthly_equity_amount)" /> </div> </div>
                            </div>

                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2 my-2"> <p class="align-middle text-right text-xs font-bold">Equity Starts: </p></div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form :value="formatDate(buyer.payment.equity_start_date)" /> </div> </div>
                            </div>
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2 my-2"> <p class="align-middle text-right text-xs font-bold">Equity Ends: </p></div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form :value="formatDate(buyer.payment.equity_end_date)" /> </div> </div>
                            </div>

                            <!-- BALANCE LOANABLE if reservation date is before 2021 and is Laurence Ville -->
                            <div class="flex px-4 gap-4 my-2" v-if="dateIsBefore2021 && buyer.project.id == 4">
                                <div class="w-1/4 items-center py-2 my-2"> <p class="align-middle text-right text-xs font-bold">Balance Loanable Amount <br/> After Equity: </p> </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4">
                                    <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                        <input type="text"
                                            :value="formatDisplay(buyer.payment.balance_loanable_amount)"
                                            class="w-full py-2 px-2 text-sm border border-gray-200 rounded-md uppercase"
                                            readonly disabled>
                                    </div> </div>
                                </div>
                            </div>
                            
                            <!-- NORMAL BALANCE LOANABLE AMOUNT -->
                            <div class="flex px-4 gap-4 my-2" v-else>
                                <div class="w-1/4 items-center py-2">
                                    <p class="align-middle text-right text-xs font-bold">Balance Loanable Amount <br/> After Equity
                                        <input type="text"
                                            readonly disabled
                                            :value="buyer.payment.balance_loanable_percentage"
                                            class=" border border-gray-200 rounded-md w-1/4 py-1 text-md text-center px-2 uppercase "
                                        > %:
                                    </p>
                                </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form :value="formatDisplay(buyer.payment.balance_loanable_amount)" /> </div> </div>
                            </div>

                            <!-- NEW BALANCE LOANABLE if project is GREGORY HOMES -->
                            <div v-if="buyer.project_id == 3" class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2 my-2">
                                    <p class="align-middle text-right text-xs font-bold">
                                        New Balance Loanable Amount <br/> (Add-on Php 100,000.00):
                                    </p>
                                </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4">
                                    <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                        <input type="text"
                                            :value="formatDisplay(buyer.payment.new_balance_loanable_amount)"
                                            class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                            readonly disabled>
                                    </div>
                                </div></div>
                            </div>
                        </div>
                    </div>

                    <!-- HOUSE AND LOT WITH SPOT EQUITY -->
                    <div v-else-if="buyer.reservation_type==2">
                        <div class="full m-4 bg-gray-200"> <p class="text-center py-2 font-bold text-md"> WIH SPOT DOWNPAYMENT / ADVANCE DOWNPAYMENT </p> </div>
                        <div class="full lg:container lg:mx-48px md:container md:mx-auto gap-4">
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2"> <p class="align-middle text-right text-xs font-bold">TOTAL CONTRACT PRICE: <br> (inclusive of transfer and move-in fees) </p> </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form :value="formatDisplay(buyer.payment.total_contract_price)" /> </div> </div>
                            </div>
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2 mt-1">
                                    <p class="align-middle text-right text-xs font-bold">Required Equity
                                        <input type="text"
                                            v-model="buyer.payment.required_equity_percentage"
                                            class=" border border-gray-200 rounded-md w-1/4 py-1 text-md text-center px-2 uppercase "
                                            readonly disabled
                                        > %:
                                    </p>
                                </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form :value="formatDisplay(buyer.payment.required_equity_amount)" /> </div> </div>
                            </div>
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2 mt-1">
                                    <p class="align-middle text-right text-xs font-bold">Spot Cash Equity Less
                                        <input type="text"
                                            readonly disabled
                                            v-model="buyer.payment.spot_cash_equity_less_percentage"
                                            class=" border border-gray-200 rounded-md w-1/4 py-1 text-md text-center px-2 uppercase "
                                        > %:
                                    </p>
                                </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form :value="formatDisplay(buyer.payment.spot_cash_equity_less_amount)" /> </div> </div>
                            </div>
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2"> <p class="align-middle text-right text-xs font-bold">Net Equity Less Discount: </p> </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form :value="formatDisplay(buyer.payment.net_equity_less_discount)" /> </div> </div>
                            </div>
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2"> <p class="align-middle text-right text-xs font-bold">Reservation Fee: </p> </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form :value="formatDisplay(buyer.payment.reservation_fee)" /> </div> </div>
                            </div>
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2">
                                    <p class="align-middle text-right text-xs font-bold">Equity Net of Reservation Fee <br/>(shall be paid on or before 30 days from reservation): </p>
                                </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form :value="formatDisplay(buyer.payment.equity_net_of_reservation_fee)" /> </div> </div>
                            </div>
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2 mt-1">
                                    <p class="align-middle text-right text-xs font-bold">Balance Loanable Amount <br/> after Equity
                                        <input type="text"
                                            readonly disabled
                                            :value="buyer.payment.balance_loanable_percentage"
                                            class=" border border-gray-200 rounded-md w-1/4 py-1 text-md text-center px-2 uppercase "
                                        > %:
                                    </p>
                                </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form :value="formatDisplay(buyer.payment.balance_loanable_amount)" /> </div> </div>
                            </div>
                        </div>
                    </div>

                    <!-- HOUSE AND LOT WITH SPOT CASH TCP -->
                    <div v-else-if="buyer.reservation_type==3">
                        <div class="full m-4 bg-gray-200"> <p class="text-center py-2 font-bold text-md"> SPOT CASH TCP </p> </div>
                        <div class="full lg:container lg:mx-48px md:container md:mx-auto gap-4">
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2"> <p class="align-middle text-right text-xs font-bold">TOTAL CONTRACT PRICE: <br> (inclusive of transfer and move-in fees) </p> </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form :value="formatDisplay(buyer.payment.total_contract_price)" /> </div> </div>
                            </div>
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2">
                                    <p class="align-middle text-right text-xs font-bold">SPOT CASH Discount <br /> Less
                                        <input type="text"
                                            readonly disabled
                                            v-model="buyer.payment.spot_cash_discount_less_percentage"
                                            class=" border border-gray-200 rounded-md w-1/4 py-1 text-md text-center px-2 uppercase "
                                        > %:
                                    </p>
                                </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form :value="formatDisplay(buyer.payment.spot_cash_discount_less_amount)" /> </div> </div>
                            </div>
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2 my-2"> <p class="align-middle text-right text-xs font-bold">Net Total Contact Price: </p> </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form :value="formatDisplay(buyer.payment.net_total_contract_price)" /> </div> </div>
                            </div>
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2 my-2"> <p class="align-middle text-right text-xs font-bold">Reservation Fee: </p> </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form :value="formatDisplay(buyer.payment.reservation_fee)" /> </div> </div>
                            </div>
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2">
                                    <p class="align-middle text-right text-xs font-bold">Balance TCP (shall be paid on or <br/> before 30 days from reservation): </p>
                                </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form :value="formatDisplay(buyer.payment.balance_total_contract_price)" /> </div> </div>
                            </div>
                        </div>
                    </div>

                    <!-- HOUSE AND LOT WITH DEFERREd CASH -->
                    <div v-else-if="buyer.reservation_type==4">
                        <div class="full m-4 bg-gray-200"> <p class="text-center py-2 font-bold text-md"> DEFERRED CASH </p> </div>
                        <div class="full lg:container lg:mx-48px md:container md:mx-auto gap-4">
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2"> <p class="align-middle text-right text-xs font-bold">TOTAL CONTRACT PRICE: <br> (inclusive of transfer and move-in fees) </p> </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form :value="formatDisplay(buyer.payment.total_contract_price)" /> </div> </div>
                            </div>
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2 my-2"> <p class="align-middle text-right text-xs font-bold">Reservation Fee: </p> </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form :value="formatDisplay(buyer.payment.reservation_fee)" /> </div> </div>
                            </div>
                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2 my-2"> <p class="align-middle text-right text-xs font-bold">Balance Amount after Reservation Fee: </p> </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form :value="formatDisplay(buyer.payment.balance_amount_after_reservation)" /> </div> </div>
                            </div>

                            <div class="flex px-4 gap-4 my-2">
                                <div class="w-1/4 items-center py-2">
                                    <p class="align-middle text-right text-xs font-bold">Monthly Installment Amount <br /> payable in
                                        <input type="text"
                                            :value="buyer.payment.installment_months"
                                            class=" border border-gray-200 rounded-md w-1/4 py-1 text-md text-center px-2 uppercase "
                                            readonly disabled
                                        > months:
                                    </p>
                                </div>
                                <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form :value="formatDisplay(buyer.payment.monthly_installment)" /> </div> </div>
                            </div>
                        </div>

                        <div class="flex px-4 gap-4 my-2">
                            <div class="w-1/4 items-center py-2 my-2"> <p class="align-middle text-right text-xs font-bold">Equity Starts: </p></div>
                            <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form :value="formatDate(buyer.payment.equity_start_date)" /> </div> </div>
                        </div>
                        <div class="flex px-4 gap-4 my-2">
                            <div class="w-1/4 items-center py-2 my-2"> <p class="align-middle text-right text-xs font-bold">Equity Ends: </p></div>
                            <div class="w-3/4"> <div class="items-starts w-3/4"> <readonly-form :value="formatDate(buyer.payment.equity_end_date)" /> </div> </div>
                        </div>
                    </div>

                    <div v-else>
                        <div class="full m-4 bg-gray-200">
                            <p class="text-center py-2 font-bold text-md text-red-500">
                                ERROR Incorrect reservation type: {{ this.buyer.reservation_type }}
                            </p>
                        </div>
                    </div>

                    <div class="flex items-center mx-auto justify-center gap-8 my-4" v-if="buyer.status" >
                        <button type="button" v-on:click="confirmForefeit"
                            class="bg-gray-600 p-4 w-1/4 align-middle text-white font-bold border rounded-md mb-4">
                            FOREFEIT BUYER
                        </button>
                        <button type="button" v-on:click="assumeUnit"
                            class="bg-gray-600 p-4 w-1/4 align-middle text-white font-bold border rounded-md mb-4">
                            ASSUME UNIT
                        </button>
                    </div>
                </div>
            </div>
            <div v-if="isFetchingData" class="text-center mx-auto my-4 font-semibold text-lg">
                LOADING...
            </div>
        </div>

    </div>
</template>

<script>
    import { ipcRenderer } from 'electron'
    import Header from '../components/v2/Header'
    import Label from '../components/v2/Label.vue'
    import InputForm from '../components/v2/InputForm'
    import PasswordForm from '../components/v2/PasswordForm'
    import ReadOnlyForm from '../components/v2/ReadonlyInput'
    // import { VueTailwindModal } from 'vue-tailwind-modal'
    // import XLSX from 'xlsx'
    import excel4node from 'excel4node'

    export default ({
        components: {
            'main-header': Header,
            'label-component': Label,
            'input-form': InputForm,
            'password-form': PasswordForm,
            'readonly-form': ReadOnlyForm,
            // 'vue-tailwind-modal': VueTailwindModal
        },
        data() {
            return {
                dateToCheck: new Date('01/01/2021'),
                dateIsBefore2021: false,
                buyer: {},
                isFetchingData: true,
                isEditing: false,
                isRequestingEdit: false,
                requestEditType: 0,
                incorrectCredentials: false,
                credentials: {
                    username: 'MANAGER',
                    password: 'password123'
                },
                inputtedCredentials: {
                    username: '',
                    password: ''
                },

                previous_payees: [],
                previous_payees_payments: []
            }
        },
        created() {
            this.getDetails(this.$route.params.id)
        },
        methods: {
            assumeUnit() {
                console.log('buyer', this.buyer)
                this.$router.push({ name: 'Assume-Unit-Form',
                                    params: { buyer: this.buyer }})
                // route to input information for unit assumption

            },
            cancelEdit() {
                this.inputtedCredentials = { username: '', password: ''}
                this.incorrectCredentials = false
                this.isRequestingEdit = false
            },
            checkCredentials() {
                // console.log('INPUTTED CREDENTIALS', this.inputtedCredentials)
                if( this.credentials.username == this.inputtedCredentials.username.toUpperCase() &&
                    this.credentials.password == this.inputtedCredentials.password ) {
                        console.log('CREDENTIALS MATCHED')
                        // route to editing ?
                        this.$router.push({ name: 'Edit-Buyer-Info',
                                            params: {   id: this.buyer.id,
                                                        buyer: this.buyer }})
                        // this.isRequestingEdit = false
                } else {
                    this.incorrectCredentials = true
                }
            },
            editPersonalInfo() {
                console.log('edit personal info')
                // this.isRequestingEdit = true
                // remove this to add credentials again
                this.$router.push({ name: 'Edit-Buyer-Info',
                                            params: {   id: this.buyer.id,
                                                        buyer: this.buyer }})
                this.requestEditType = 1
            },
            editReservation() {
                this.isRequestingEdit = true
                this.requestEditType = 2
            },
            formatDate(value) {
                return value && value.toDateString() ? value.toDateString().replace(/^\S+\s/,'') : value
                // return value.toDateString().replace(/^\S+\s/,'')
            },
            formatDisplay(value) {
                return value ? value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : value
            //    return value.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            //    return `₱ ${(value.toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
            },
            
            viewPayment() {
                console.log('Viewing payment for buyer ', this.buyer.id)
                this.$router.push({ name: "View-Payment",
                                    params: {   id: this.buyer.id,
                                                buyer: this.buyer}})
            },
            getDetails(id) {
                this.isFetchingData = true,
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
                            ipcRenderer.send('fetchProject', this.buyer.block.project_id)
                            ipcRenderer.once('fetchedProject', (event, data) => {
                                this.buyer.project = data
                                ipcRenderer.send('fetchHouseAndLotPayment', this.buyer.id)
                                ipcRenderer.once('fetchedHouseAndLotPayment', (event, data) => {
                                    this.buyer.payment = data
                                    console.log('this.buyer in VIEW DETAILS HOUSE AND LOT BUYER', this.buyer)
                                    console.log('============= payment', data)
                                    this.dateIsBefore2021 = this.buyer.payment.date < this.dateToCheck ? true : false
                                    this.isFetchingData = false
                                })
                            })
                        })
                    })
                })
            },
            getLotArea() {
                console.log('this.buyer.lot.lot_area', this.buyer.lot.lot_area)
                return `${this.buyer.lot.lot_area} sq.m`
            },
            getFloorArea() {
                console.log('this.buyer.lot.floor_area', this.buyer.lot.floor_area)
                return `${this.buyer.lot.floor_area} sq.m`
            },
            editDetails() {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                this.$router.push({ name: 'Edit Buyer', params: { id: this.buyer.id, buyer: this.buyer } })
            },
            confirmForefeit() {
                if(confirm('Are you sure to forefeit this buyer?')) {
                    console.log('OK')
                    this.forefeitBuyer()
                } else {
                    console.log('CANCELLED')
                }
            },
            forefeitBuyer() {
                const data = {  id: this.buyer.id,
                                lot_id: this.buyer.lot.id }
                console.log('Forefeiting Buyer', data)
                ipcRenderer.send('forefeitBuyer', data)
                ipcRenderer.once('forefeitedBuyer', (event, data) => {
                    console.log('FOREFEITED BUYER REPLY', data)
                    data ? alert(`Buyer for ${this.buyer.project.name} ${this.buyer.block.name} ${this.buyer.lot.name} - ${this.buyer.first_name} ${this.buyer.project.name} ${this.buyer.middle_initial} ${this.buyer.lot.name} ${this.buyer.last_name} has been forefeited`)
                         : alert(`Forefeiting buyer for ${this.buyer.project.name} ${this.buyer.block.name} ${this.buyer.lot.name} - ${this.buyer.first_name} ${this.buyer.project.name} ${this.buyer.middle_initial} ${this.buyer.lot.name} ${this.buyer.last_name} failed`)
                    // refresh page

                    // setTimeout(() =>{
                    //     this.$router.push('/')
                    // }, 1000)
                    
                    this.$router.push({name: 'View-Buyer-HL', params: { id: this.buyer.id }})
                })
            },
            exportDetails() {
                // const buyer_name = `${(this.buyer.last_name.toUpperCase())}, ${this.buyer.first_name.toUpperCase()} ${this.buyer.middle_initial.toUpperCase()}`
                const file_name = `${this.buyer.block.name} ${this.buyer.lot.name} - ${(this.buyer.last_name.toUpperCase())}, ${this.buyer.first_name.toUpperCase()} ${this.buyer.middle_initial.toUpperCase()}`
                // const home_address = this.buyer.home_address.toUpperCase()
                // const email_address = this.buyer.email_address.toUpperCase()
                // const contact_number = this.buyer.contact_number.toUpperCase()


                const homedir = require('os').homedir();

                const reservationType = this.buyer.reservation_type
                const php = ` Php `
                const buyer_name = `${this.buyer.last_name}, ${this.buyer.first_name} ${this.buyer.middle_initial}`
                const block_name = `${this.buyer.block.name}`
                const project_name = `${this.buyer.project.name}`
                const lot_name = `${this.buyer.lot.name}`
                const price_per_sqm = `${this.buyer.lot.price_per_sqm}`
                const phase = `${this.buyer.phase}`
                const lot_area = `${this.buyer.lot.lot_area} SQ.M`
                const floor_area = `${this.buyer.lot.floor_area} SQ.M`
                const lot_type = this.buyer.lot.lot_type.toString()
                const realty = this.buyer.realty.toUpperCase()
                const agent = this.buyer.agent.toUpperCase()
                const agent_number = this.buyer.agent_number.toString()
                const project_address = this.buyer.project.location.toUpperCase()
                const home_address = this.buyer.home_address.toUpperCase()
                const email_address = this.buyer.email_address.toUpperCase()
                const contact_number = this.buyer.contact_number.toString()

                const reservation_date = this.formatDate(this.buyer.payment.date)
                const total_contract_price = this.buyer.payment.total_contract_price ? this.formatDisplay(this.buyer.payment.total_contract_price) : this.buyer.payment.total_contract_price
                
                // console.log('wrongtcp')
                const required_equity_percentage = this.buyer.payment.required_equity_percentage
                const required_equity_amount = this.buyer.payment.required_equity_amount ? this.formatDisplay(this.buyer.payment.required_equity_amount) : this.buyer.payment.required_equity_amount
                const equity_net_of_reservation_fee = this.buyer.payment.equity_net_of_reservation_fee ? this.formatDisplay(this.buyer.payment.equity_net_of_reservation_fee) : this.buyer.payment.equity_net_of_reservation_fee
                const equity_months = this.buyer.payment.equity_months
                const monthly_equity_amount = this.buyer.payment.monthly_equity_amount ? this.formatDisplay(this.buyer.payment.monthly_equity_amount) : this.buyer.payment.monthly_equity_amount
                const equity_start_date = this.formatDate(this.buyer.payment.equity_start_date)
                const equity_end_date = this.formatDate(this.buyer.payment.equity_end_date)
                const balance_loanable_percentage = this.buyer.payment.balance_loanable_percentage
                const balance_loanable_amount = this.buyer.payment.balance_loanable_amount ? this.formatDisplay(this.buyer.payment.balance_loanable_amount) : this.buyer.payment.balance_loanable_amount

                const spot_cash_equity_less_percentage = this.buyer.payment.spot_cash_equity_less_percentage
                const spot_cash_equity_less_amount = this.buyer.payment.spot_cash_equity_less_amount ? this.formatDisplay(this.buyer.payment.spot_cash_equity_less_amount) : this.buyer.payment.spot_cash_equity_less_amount
                const net_equity_less_discount = this.buyer.payment.net_equity_less_discount ? this.formatDisplay(this.buyer.payment.net_equity_less_discount) : this.buyer.payment.net_equity_less_discount

                const spot_cash_discount_less_percentage = this.buyer.payment.spot_cash_discount_less_percentage
                const spot_cash_discount_less_amount = this.buyer.payment.spot_cash_discount_less_amount ? this.formatDisplay(this.buyer.payment.spot_cash_discount_less_amount) : this.buyer.payment.spot_cash_discount_less_amount
                const net_total_contract_price = this.buyer.payment.net_total_contract_price ? this.formatDisplay(this.buyer.payment.net_total_contract_price) : this.buyer.payment.net_total_contract_price
                const balance_total_contract_price = this.buyer.payment.balance_total_contract_price ? this.formatDisplay(this.buyer.payment.balance_total_contract_price) : this.buyer.payment.balance_total_contract_price

                const balance_amount_after_reservation = this.buyer.payment.balance_amount_after_reservation ? this.formatDisplay(this.buyer.payment.balance_amount_after_reservation) : this.buyer.payment.balance_amount_after_reservation
                const installment_months = this.buyer.payment.installment_months
                const monthly_installment = this.buyer.payment.monthly_installment ? this.formatDisplay(this.buyer.payment.monthly_installment) : this.buyer.payment.monthly_installment
                const reservation_fee = this.buyer.payment.reservation_fee ? this.formatDisplay(this.buyer.payment.reservation_fee) : this.buyer.payment.reservation_fee
                
                var wb = new excel4node.Workbook()
                var ws = wb.addWorksheet('RA - FORM 1A HL');

                let r = 1   // row
                const s = 4 // initial size
                const col = { 'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9 }

                ws.column(col['A']).setWidth(s*4)
                ws.column(col['B']).setWidth(s*2)
                ws.column(col['C']).setWidth(s*3)
                ws.column(col['D']).setWidth(s*2)
                ws.column(col['E']).setWidth(s*2)
                ws.column(col['F']).setWidth(s*2)
                ws.column(col['G']).setWidth(s*2)
                ws.column(col['H']).setWidth(s*4)
                ws.column(col['I']).setWidth(s*4)

                const bold_header_style = wb.createStyle({ font: { color: '#000000', size: 13, bold: true }, alignment: { wrapText: true, horizontal: 'center', vertical: 'center' } })
                const bordered_style = wb.createStyle({ border: { left: { style: 'thin', color: '#000000' }, right: { style: 'thin', color: '#000000' }, top: { style: 'thin', color: '#000000' }, bottom: { style: 'thin', color: '#000000' }} })
                const aligned_style = wb.createStyle({ alignment: { wrapText: true, horizontal: 'center', vertical: 'center' } })
                const header_style = wb.createStyle({ font: { color: '#000000', size: 11, bold: true } })
                const bold_style = wb.createStyle({ font: { color: '#000000', size: 9, bold: true } })
                const regular_style = wb.createStyle({ font: { color: '#000000', size: 9, bold: false } })
                const center_bold = wb.createStyle({ alignment: { wrapText: true, horizontal: 'center', vertical: 'center' }, font: { color: '#000000', size: 11, bold: true } })
                const italic_rightaligned_style = wb.createStyle({ alignment: { wrapText: true, horizontal: 'right', vertical: 'center' }, font: { color: '#000000', size: 11, bold: false, italics: true}  })
                const italic_leftaligned_style = wb.createStyle({ alignment: { wrapText: true, horizontal: 'left', vertical: 'center' }, font: { color: '#000000', size: 11, bold: false, italics: true}  })

                ws.cell(r, col['A'], r, col['H'], true).string('TUMABINI REAL ESTATE DEVELOPMENT').style(bold_header_style)
                ws.cell(r, col['I']).string('LO-RA - FORM 2A').style(bold_header_style).style({font: {size: 12}, alignment: {horizontal: 'right'}})

                ws.cell(++r, col['A'], ++r, col['H'], true).string('133 MC Briones St., Hi-way Bakilid, Mandaue City 6014 Tel#: 032 414-5103, 09564791879 Email: tumabinidevelopment@gmail.com').style(regular_style).style(aligned_style).style({font: {size: 8}})
                ws.cell(r-1, col['I']).string('ANNEX A').style(bold_header_style).style({font: {size: 10}, alignment: {horizontal: 'right'}})

                ws.cell(++r, col['A'], r, col['I'], true).string('COMPUTATION SHEET').style(bordered_style).style(aligned_style).style(header_style)

                ws.cell(++r, col['A']).string(` BUYER'S NAME: `).style(bold_style)
                ws.cell(r, col['B'], r, col['D'], true).string(buyer_name).style(regular_style)
                ws.cell(r, col['E']).string(` BLOCK: `).style(bold_style)
                ws.cell(r, col['F'], r, col['G'], true).string(block_name).style(regular_style)
                ws.cell(r, col['H']).string(` RESERVATION DATE: `).style(bold_style)
                ws.cell(r, col['I']).string(reservation_date).style(regular_style)

                ws.cell(++r, col['A']).string(` PROJECT NAME: `).style(bold_style)
                ws.cell(r, col['B'], r, col['D'], true).string(project_name).style(regular_style)
                ws.cell(r, col['E']).string(` LOT: `).style(bold_style)
                ws.cell(r, col['F'], r, col['G'], true).string(lot_name).style(regular_style)
                ws.cell(r, col['H']).string(` PRICE PER SQ.M: `).style(bold_style)
                ws.cell(r, col['I']).string(price_per_sqm).style(regular_style)

                ws.cell(++r, col['A']).string(` PHASE: `).style(bold_style)
                ws.cell(r, col['B']).string(phase).style(regular_style)
                ws.cell(r, col['C']).string(` LOT AREA: `).style(bold_style)
                ws.cell(r, col['D']).string(lot_area).style(regular_style)
                ws.cell(r, col['E']).string(` FLR AREA: `).style(bold_style)
                ws.cell(r, col['F'], r, col['G'], true).string(floor_area).style(regular_style)
                ws.cell(r, col['H']).string(` TYPE OF HOUSE: `).style(bold_style)
                ws.cell(r, col['I']).string(lot_type).style(regular_style)

                ws.cell(++r, col['A']).string(` PROJECT ADDRESS: `).style(bold_style)
                ws.cell(r, col['B'], r, col['D'], true).string(project_address).style(regular_style)
                ws.cell(r, col['E'], r, col['F'], true).string(` HOME ADDRESS: `).style(bold_style)
                ws.cell(r, col['G'], r, col['I'], true).string(home_address).style(regular_style)

                ws.cell(++r, col['A']).string(` EMAIL ADDRESS: `).style(bold_style)
                ws.cell(r, col['B'], r, col['D'], true).string(email_address).style(regular_style)
                ws.cell(r, col['E'], r, col['F'], true).string(` CONTACT NUMBER: `).style(bold_style)
                ws.cell(r, col['G'], r, col['I'], true).string(contact_number).style(regular_style)

                ws.cell(++r, col['A']).string(` REALTY: `).style(bold_style)
                ws.cell(r, col['B'], r, col['D'], true).string(realty).style(regular_style)
                ws.cell(r, col['E'], r, col['F'], true).string(` AGENT: `).style(bold_style)
                ws.cell(r, col['G'], r, col['I'], true).string(agent).style(regular_style)

                ws.cell(++r, col['A'], r, col['I'], true).string('')

                if(reservationType == 1) {
                    ws.cell(++r, col['A'], r, col['I'], true).string('COMPUTATION SHEET - REGULAR RESERVATION').style(bordered_style).style(aligned_style).style(header_style)
                    ws.cell(++r, col['A'], r, col['I'], true).string('')

                    ws.cell(++r, col['A'], r, col['F'], true).string(` TOTAL CONTRACT PRICE (inclusive of transfer fee charges and move-in fee): `).style(italic_rightaligned_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).string(total_contract_price).style(center_bold)

                    ws.cell(++r, col['A'], r, col['E'], true).string(` REQUIRED EQUITY `).style(italic_rightaligned_style)
                    ws.cell(r, col['F']).string(`${required_equity_percentage}%`).style(bordered_style).style(aligned_style).style(header_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).string(required_equity_amount).style(center_bold)

                    ws.cell(++r, col['A'], r, col['F'], true).string(` Reservation Fee:`).style(italic_rightaligned_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).string(reservation_fee).style(center_bold)

                    ws.cell(++r, col['A'], r, col['F'], true).string(` Equity Net of Reservation Fee:`).style(italic_rightaligned_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).string(equity_net_of_reservation_fee).style(center_bold)

                    ws.cell(++r, col['A']).string('Equity Term: ').style(italic_leftaligned_style)
                    ws.cell(r, col['B']).number(equity_months).style(center_bold)
                    ws.cell(r, col['C']).string('months').style(italic_rightaligned_style)
                    
                    ws.cell(++r, col['A']).string('Equity Starts: ').style(italic_leftaligned_style)
                    ws.cell(r, col['B'], r, col['D'], true).string(equity_start_date).style(center_bold)

                    ws.cell(++r, col['A']).string('Equity Ends: ').style(italic_leftaligned_style)
                    ws.cell(r, col['B'], r, col['D'], true).string(equity_end_date).style(center_bold)

                    ws.cell(r-1, col['E'], r, col['F'], true).string('REQUIRED Monthly Equity: ').style(italic_rightaligned_style)
                    ws.cell(r-1, col['G'], r, col['G'], true).string(php).style(italic_rightaligned_style)
                    ws.cell(r-1, col['H'], r, col['I'], true).string(monthly_equity_amount).style(center_bold)
                    
                    ws.cell(++r, col['A'], r, col['E'], true).string(` Balance Loanable Amount after Equity: `).style(italic_rightaligned_style)
                    ws.cell(r, col['F']).string(`${balance_loanable_percentage}%`).style(bordered_style).style(aligned_style).style(header_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).string(balance_loanable_amount).style(center_bold)

                    ws.cell(++r, col['A'], r, col['I'], true).string('')
                    ws.cell(++r, col['A'], r, col['I'], true).string('NOTE/S').style(aligned_style).style(header_style)
                    ws.cell(++r, col['A'], r, col['I'], true).string(` 1. Failure to pay the first monthly equity after 30 days after reservation date shall mean cancelled & forefeited reservation. `).style(italic_leftaligned_style)
                    ws.cell(++r, col['A'], r, col['I'], true).string(` 2. The balance amount shall be loanable to bank / PAG-IBIG financinng.`).style(italic_leftaligned_style)
                    ws.cell(++r, col['A'], r, col['I'], true).string(` 3. For cash payment of balance amount, it shall be paid on or before 30 days after last payment of monthly equity.`).style(italic_leftaligned_style)
                   
                } else if(reservationType == 2) {
                    ws.cell(++r, col['A'], r, col['I'], true).string('COMPUTATION SHEET with SPOT CASH EQUITY').style(bordered_style).style(aligned_style).style(header_style)
                    ws.cell(++r, col['A'], r, col['I'], true).string('')

                    ws.cell(++r, col['A'], r, col['F'], true).string(` TOTAL CONTRACT PRICE (inclusive of transfer fee charges and move-in fee): `).style(italic_rightaligned_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).number(total_contract_price).style(center_bold)

                    ws.cell(++r, col['A'], r, col['E'], true).string(` REQUIRED EQUITY: `).style(italic_rightaligned_style)
                    ws.cell(r, col['F']).string(`${required_equity_percentage}%`).style(bordered_style).style(aligned_style).style(header_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).number(required_equity_amount).style(center_bold)

                    ws.cell(++r, col['A'], r, col['E'], true).string(` SPOT CASH Equity Less: `).style(italic_rightaligned_style)
                    ws.cell(r, col['F']).string(`${spot_cash_equity_less_percentage}%`).style(bordered_style).style(aligned_style).style(header_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).number(spot_cash_equity_less_amount).style(center_bold)
                    
                    ws.cell(++r, col['A'], r, col['F'], true).string(` Net Equity Less Discount:`).style(italic_rightaligned_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).number(net_equity_less_discount).style(center_bold)

                    ws.cell(++r, col['A'], r, col['F'], true).string(` Reservation Fee:`).style(italic_rightaligned_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).number(reservation_fee).style(center_bold)

                    ws.cell(++r, col['A'], r+1, col['F'], true).string(` Equity Net of Reservation Fee (shall be paid on or before thirty (30) days from reservation date):`).style(italic_rightaligned_style)
                    ws.cell(r, col['G'], r+1, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r++, col['H'], r, col['I'], true).number(equity_net_of_reservation_fee).style(center_bold)

                    ws.cell(++r, col['A'], r, col['E'], true).string(` Balance Loanable Amount after Equity: `).style(italic_rightaligned_style)
                    ws.cell(r, col['F']).string(`${balance_loanable_percentage}%`).style(bordered_style).style(aligned_style).style(header_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).number(balance_loanable_amount).style(center_bold)

                    ws.cell(++r, col['A'], r, col['I'], true).string('')
                    ws.cell(++r, col['A'], r, col['I'], true).string('NOTE/S').style(aligned_style).style(header_style)
                    ws.cell(++r, col['A'], r, col['I'], true).string(` 1. Failure to pay the first monthly equity after 30 days after reservation date shall mean cancelled & forefeited reservation. `).style(italic_leftaligned_style)
                    ws.cell(++r, col['A'], r, col['I'], true).string(` 2. The balance amount shall be loanable to bank / PAG-IBIG financinng.`).style(italic_leftaligned_style)
                    ws.cell(++r, col['A'], r, col['I'], true).string(` 3. For cash payment of balance amount, it shall be paid on or before 30 days after last payment of monthly equity.`).style(italic_leftaligned_style)
  
                } else if(reservationType == 3) {
                    ws.cell(++r, col['A'], r, col['I'], true).string('COMPUTATION SHEET with SPOT CASH TCP').style(bordered_style).style(aligned_style).style(header_style)
                    ws.cell(++r, col['A'], r, col['I'], true).string('')

                    ws.cell(++r, col['A'], r, col['F'], true).string(` TOTAL CONTRACT PRICE (inclusive of transfer fee charges and move-in fee): `).style(italic_rightaligned_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).number(total_contract_price).style(center_bold)

                    ws.cell(++r, col['A'], r, col['E'], true).string(` SPOT CASH Discount Less: `).style(italic_rightaligned_style)
                    ws.cell(r, col['F']).string(`${spot_cash_discount_less_percentage}%`).style(bordered_style).style(aligned_style).style(header_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).number(spot_cash_discount_less_amount).style(center_bold)

                    ws.cell(++r, col['A'], r, col['F'], true).string(`NET TOTAL Contract Price: `).style(italic_rightaligned_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).number(net_total_contract_price).style(center_bold)

                    ws.cell(++r, col['A'], r, col['F'], true).string(`Reservation Fee: `).style(italic_rightaligned_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).number(reservation_fee).style(center_bold)

                     ws.cell(++r, col['A'], r+1, col['F'], true).string(`Balance TCP (shall be paid on or before thirty (30) days from reservation date):`).style(italic_rightaligned_style)
                    ws.cell(r, col['G'], r+1, col['G'], true).string(php).style(italic_rightaligned_style)
                    ws.cell(r++, col['H'], r, col['I'], true).number(balance_total_contract_price).style(center_bold)

                    ws.cell(++r, col['A'], r, col['I'], true).string('')
                    ws.cell(++r, col['A'], r, col['I'], true).string('NOTE/S').style(aligned_style).style(header_style)
                    ws.cell(++r, col['A'], r, col['I'], true).string(` 1. Failure to pay the TCP Balance 30 days after reservation date shall mean cancelled & forefeited reservation. `).style(italic_leftaligned_style)
                
                } else if(reservationType == 4) {
                    ws.cell(++r, col['A'], r, col['I'], true).string('COMPUTATION SHEET with SPOT CASH TCP').style(bordered_style).style(aligned_style).style(header_style)
                    ws.cell(++r, col['A'], r, col['I'], true).string('')

                    ws.cell(++r, col['A'], r, col['F'], true).string(` TOTAL CONTRACT PRICE (inclusive of transfer fee charges and move-in fee): `).style(italic_rightaligned_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).number(total_contract_price).style(center_bold)

                    ws.cell(++r, col['A'], r, col['F'], true).string(`Reservation Fee: `).style(italic_rightaligned_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).number(reservation_fee).style(center_bold)

                    ws.cell(++r, col['A'], r, col['F'], true).string(`Balance Amount after Reservation Fee: `).style(italic_rightaligned_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).number(balance_amount_after_reservation).style(center_bold)

                    ws.cell(++r, col['A'], r, col['E'], true).string(` Balance Amount after Reservation Fee is payable in `).style(italic_rightaligned_style)
                    ws.cell(r, col['F']).number(installment_months).style(bordered_style).style(aligned_style).style(header_style)
                    ws.cell(r, col['G']).string('months').style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).string('').style(center_bold)
                    
                    ws.cell(++r, col['A'], r, col['F'], true).string(`Monthly Installment Amount: `).style(italic_rightaligned_style)
                    ws.cell(r, col['G']).string(php).style(italic_rightaligned_style)
                    ws.cell(r, col['H'], r, col['I'], true).number(balance_amount_after_reservation).style(center_bold)

                    ws.cell(++r, col['A'], r, col['I'], true).string('')
                    ws.cell(++r, col['A'], r, col['I'], true).string('NOTE/S').style(aligned_style).style(header_style)
                    ws.cell(++r, col['A'], r, col['I'], true).string(` 1. Failure to pay the the first monthly due 30 days after reservation date shall mean cancelled & forefeited reservation.`).style(italic_leftaligned_style)
                    ws.cell(++r, col['A'], r+1, col['I'], true).string(` 2. Any balance amount after last monthly due or (after 60 months) shall be loanable to bank / pag-ibig financing, or shall be paid in cash 30 days after last monthly installment ends.`).style(italic_leftaligned_style)
        
                } else {
                    ws.cell(++r, col['A'], r, col['I'], true).string(`ERROR: Reservation type ${reservationType} does not exist`).style(bordered_style).style(aligned_style).style(header_style)
                    ws.cell(++r, col['A'], r, col['I'], true).string('')
                }
                
                if(reservationType == 1 || reservationType == 4) {
                    // ws.cell(++r, col['A'], r, col['I'], true).string('')
                    // ws.cell(++r, col['A'], r, col['I'], true).string('NOTE/S').style(bordered_style).style(aligned_style).style(header_style)
                    // ws.cell(++r, col['A'], r, col['I'], true).string(` 1. Failure to pay the first monthly equity after 30 days after reservation date shall mean cancelled & forefeited reservation. `).style(italic_leftaligned_style)
                    // ws.cell(++r, col['A'], r, col['I'], true).string(` 2. The balance amount shall be loanable to bank / PAG-IBIG financinng.`).style(italic_leftaligned_style)
                    // ws.cell(++r, col['A'], r, col['I'], true).string(` 3. For cash payment of balance amount, it shall be paid on or before 30 days after last payment of monthly equity.`).style(italic_leftaligned_style)

                    const rate30 = this.formatDisplay((0.005995505 * parseFloat(this.buyer.payment.balance_loanable_amount)))
                    const rate25 = this.formatDisplay((0.006443014 * parseFloat(this.buyer.payment.balance_loanable_amount)))
                    const rate20 = this.formatDisplay((0.007164311 * parseFloat(this.buyer.payment.balance_loanable_amount)))
                    const rate15 = this.formatDisplay((0.008438568 * parseFloat(this.buyer.payment.balance_loanable_amount)))
                    const rate10 = this.formatDisplay((0.01110205 * parseFloat(this.buyer.payment.balance_loanable_amount)))
                    const rate5 = this.formatDisplay((0.0193328082 * parseFloat(this.buyer.payment.balance_loanable_amount)))

                    ws.cell(++r, col['A'], r, col['I'], true).string('Sample Computation for Bank/Pag-ibig Financing').style(bordered_style).style(aligned_style).style(header_style)
                    ws.cell(++r, col['A'], r, col['I'], true).string(`Sample Computation at 6.00% annual interest rate`).style(italic_leftaligned_style)
                    ws.cell(++r, col['B'], r, col['C'], true).string(`30 years`).style(italic_leftaligned_style)
                    ws.cell(r, col['D'], r, col['E'], true).string(`${rate30} / month`).style(italic_leftaligned_style)            
                    ws.cell(r, col['F'], r, col['G'], true).string(`15 years`).style(italic_leftaligned_style)
                    ws.cell(r, col['H']).string(`${rate15} / month`).style(italic_leftaligned_style)
                    
                    ws.cell(++r, col['B'], r, col['C'], true).string(`25 years`).style(italic_leftaligned_style)
                    ws.cell(r, col['D'], r, col['E'], true).string(`${rate25} / month`).style(italic_leftaligned_style)        
                    ws.cell(r, col['F'], r, col['G'], true).string(`10 years`).style(italic_leftaligned_style)
                    ws.cell(r, col['H']).string(`${rate10} / month`).style(italic_leftaligned_style)
                    
                    ws.cell(++r, col['B'], r, col['C'], true).string(`20 years`).style(italic_leftaligned_style)
                    ws.cell(r, col['D'], r, col['E'], true).string(`${rate20} / month`).style(italic_leftaligned_style)     
                    ws.cell(r, col['F'], r, col['G'], true).string(`5 years`).style(italic_leftaligned_style)
                    ws.cell(r, col['H']).string(`${rate5} / month`).style(italic_leftaligned_style)
                }
                

                ws.cell(++r, col['A'], r, col['I'], true).string('')
                ws.cell(++r, col['A'], r, col['I'], true).string('REQUIREMENTS').style(bordered_style).style(aligned_style).style(header_style)
                ws.cell(++r, col['A'], r, col['B'], true).string('Upon Reservation:').style(italic_leftaligned_style)
                ws.cell(++r, col['B'], r, col['I'], true).string(` 2 Valid IDs government issued with 3 speciment signature`).style(italic_leftaligned_style)
                ws.cell(++r, col['B'], r, col['I'], true).string(` TIN number/TIN ID `).style(italic_leftaligned_style)
                ws.cell(++r, col['B'], r, col['I'], true).string(` RESERVATION FEE / First Monthly `).style(italic_leftaligned_style)
                
                ws.cell(++r, col['A'], r, col['B'], true).string('FOR PAG-IBIG/BANK LOAN').style(italic_leftaligned_style)
                ws.cell(r, col['C'], r, col['I'], true).string("to be given upon developer's request (more or less 5 monts before EQUITY ENDS)").style(italic_leftaligned_style)
                
                ws.cell(++r, col['B'], r, col['I'], true).string(` Certificate of Employment with stated gross income `).style(italic_leftaligned_style)
                ws.cell(++r, col['B'], r, col['I'], true).string(` Latest 3 months payslip signed by HR or Compensation Personnel `).style(italic_leftaligned_style)
                ws.cell(++r, col['B'], r, col['I'], true).string(` 4 pcs 2x2 ID picture `).style(italic_leftaligned_style)
                ws.cell(++r, col['B'], r, col['I'], true).string(` Photocopy of NSO Marriage Certificate if married `).style(italic_leftaligned_style)
                ws.cell(++r, col['B'], r, col['I'], true).string(` Photocopy of NSO Birth Certificate `).style(italic_leftaligned_style)
                ws.cell(++r, col['B'], r, col['I'], true).string(` Proof Of Billing`).style(italic_leftaligned_style)
                ws.cell(++r, col['B'], r, col['I'], true).string(` Post dated Check (if Pag-ibig will request) and or needed if opt for IN-HOUSE FINANCING `).style(italic_leftaligned_style)
                ws.cell(++r, col['B'], r, col['I'], true).string(` Others as may be required by bank/Pag-ibig`).style(italic_leftaligned_style)
                
                r+=2
                ws.cell(++r, col['A'], r, col['C'], true).string(`Confirmed and Accepted By Buyer:`).style(bold_style)
                ws.cell(++r, col['D'], r, col['F'], true).string(buyer_name).style(bold_style).style(aligned_style)
                ws.cell(r, col['H']).string('Contact #:').style(italic_leftaligned_style)
                ws.cell(r, col['I']).string(contact_number).style(bold_style).style(aligned_style)
                
                r+=2
                ws.cell(++r, col['A'], r, col['C'], true).string(`Broker/Agent's Name and Signature:`).style(bold_style)
                ws.cell(r, col['D'], r, col['F'], true).string(agent).style(bold_style).style(aligned_style)
                ws.cell(r, col['H']).string('Contact #:').style(italic_leftaligned_style)
                ws.cell(r, col['I']).string(agent_number).style(bold_style).style(aligned_style)
                
                ws.cell(++r, col['A'], r, col['C'], true).string(`Realty Name:`).style(bold_style)
                ws.cell(r, col['D'], r, col['F'], true).string(realty).style(bold_style).style(aligned_style)

                r+=2
                ws.cell(++r, col['A']).string(`Account Officer:`).style(bold_style)
                ws.cell(r, col['B'], r, col['D'], true).string('_____________________________________').style(bold_style).style(aligned_style)

                ws.cell(r, col['E'], r, col['F'], true).string(`Confirmed By:`).style(bold_style)
                ws.cell(r, col['G'], r, col['I'], true).string('_____________________________________').style(bold_style).style(aligned_style)

                

                switch(this.buyer.project.id) {
                    case 1:
                        wb.write(`${homedir}/TUMABINI-PROJECTS/MYHOME/Reservations/${file_name}.xlsx`); break;
                    case 2:
                        wb.write(`${homedir}/TUMABINI-PROJECTS/MYHOME-DOS/Reservations/${file_name}.xlsx`); break;
                    case 3:
                        wb.write(`${homedir}/TUMABINI-PROJECTS/GREGORY-HOMES/Reservations/${file_name}.xlsx`); break;
                    case 4:
                        wb.write(`${homedir}/TUMABINI-PROJECTS/LAURENCE-VILLE/Reservations/${file_name}.xlsx`); break;
                    default: break;
                }

                // wb.write(`./${file_name}.xlsx`);
                
                // wb.write(`${homedir}/MYHOME/Reservations/${file_name}.xlsx`);
                alert('Done Exporting')
                console.log('Done Exporting Payment for Buyer', this.buyer.id)
            }
        }
    })
</script>