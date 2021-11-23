<template>
    <div class="h-screen">
        <main-header />
        <div class="my-5 mx-24 px-5">
            <div v-if="!isFetchingData">

                <div class="flex">
                    <div class="w-1/2 px-4">
                        <div class="text-xs font-bold"> TUMABINI REAL ESTATE DEVELOPMENT </div>
                        <div class="text-xs"> 133 MC Briones St., Hiway Bakilid, Mandaue City 6014 </div>
                    </div>
                    <div class="w-1/2 px-4">
                        <div class="text-xs font-semibold"> <p class="text-right"> {{ buyer.project.name }} - {{ buyer.project.location }} </p> </div>
                        <div class="text-xs"> <p class="text-right"> Contact: (032) 260-1522 Email: tumabinidevelopment@gmail.com </p> </div>
                    </div>
                </div>

                <div class="full my-4 bg-gray-200">
                    <p class="text-center p-2 font-semibold text-lg"> STATEMENT OF ACCOUNT </p> <!-- add reservation type -->
                    <p class="text-center pb-2 font-bold text-sm text-red-700" v-if="!buyer.status">
                        This buyer has been forefeited and is now inactive.
                    </p>
                </div>

                <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 py-1" v-if="payment.reservation_type > 0 && payment.reservation_type < 5">
                    <div class="w-full">
                        <div class="flex gap-4 my-2">
                            <div class="w-2/5"> <readonly-form label="Last Name" :value="buyer.last_name" /> </div>
                            <div class="w-2/5"> <readonly-form label="First Name" :value="buyer.first_name" /> </div>
                            <div class="w-1/5"> <readonly-form label="M.I." :value="buyer.middle_initial" /> </div>
                        </div>
                        <div class="flex gap-4 my-2">
                            <div class="w-1/2"> <readonly-form label="Project" :value="buyer.project.name" /> </div>
                            <div class="w-1/2"> <readonly-form label="Phase" :value="buyer.phase" /> </div> <!-- check if phase exists -->
                        </div>
                        <div class="flex gap-4 my-2">
                            <div class="w-1/2"> <readonly-form label="Block" :value="buyer.block.name" /> </div>
                            <div class="w-1/2"> <readonly-form label="Lot" :value="buyer.lot.name" /> </div>
                        </div>
                        <div class="full my-2"> <readonly-form label="Reservation Fee" :value="payment.reservation_fee" /> </div>
                        <div class="full my-2"> <readonly-form label="Total Contract Price" :value="payment.total_contract_price" /> </div>
                    </div>

                    <!-- HL REGULAR RESERVATION  -->
                    <div class="w-full" v-if="payment.reservation_type == 1">
                        <div class="full my-2"> <readonly-form label="Required Equity" :value="payment.required_equity_amount" /> </div>
                        <div class="full my-2"> <readonly-form label="Equity Net of Reservation:" :value="payment.equity_net_of_reservation_fee" /> </div>
                        <div class="full my-2"> <readonly-form label="Required Loanable Amount" :value="payment.balance_loanable_amount" /> </div>
                        <div class="flex gap-4 my-2">
                            <div class="w-1/2">
                                <label-component label="Running Equity Balance:"/>
                                <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                    <input type="text"
                                        v-model="running_equity_balance"
                                        class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                        readonly disabled>
                                </div>
                            </div>
                             <div class="w-1/2">
                                <label-component label="Running TCP Balance:"/>
                                <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                    <input type="text"
                                        v-model="running_tcp_balance"
                                        class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                        readonly disabled>
                                </div>
                            </div>
                        </div>
                        <div class="full">
                            <label-component label="Total Payments Made:"/>
                            <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                <input type="text"
                                    v-model="total_payments_made"
                                    class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                    readonly disabled>
                            </div>
                        </div>
                    </div>

                    <!-- HL WITH SPOT EQUITY -->
                    <div class="w-full" v-if="payment.reservation_type == 2">
                        <div class="flex gap-4 my-2">
                            <div class="w-1/2"> <readonly-form label="Required Equity" :value="payment.required_equity_amount" /> </div>
                            <div class="w-1/2"> <readonly-form label="Equity Less of Reservation:" :value="payment.equity_net_of_reservation_fee" /> </div>
                        </div>
                        <div class="flex gap-4 my-2">
                            <div class="w-1/2"> <readonly-form label="Discount (%):" :value="payment.spot_cash_equity_less_percentage" /> </div>
                            <div class="w-1/2"> <readonly-form label="Total Discount (PHP)" :value="payment.spot_cash_equity_less_amount" /> </div>

                        </div>
                        <div class="flex gap-4 my-2">
                            <div class="w-1/2"> <readonly-form label="Net Equity Payable" :value="payment.net_equity_less_discount" /> </div>
                            <div class="w-1/2"> <readonly-form label="Required Loanable Amount" :value="payment.balance_loanable_amount" /> </div>

                        </div>
                        <div class="full my-2">
                            <label-component label="Running Balance:"/>
                            <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                <input type="text"
                                    v-model="running_balance"
                                    class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                    readonly disabled>
                            </div>
                        </div>
                        <div class="full">
                            <label-component label="Total Payments Made:"/>
                            <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                <input type="text"
                                    v-model="total_payments_made"
                                    class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                    readonly disabled>
                            </div>
                        </div>
                    </div>

                    <!-- HL SPOT CASH -->
                    <div class="w-full" v-if="payment.reservation_type == 3">
                        <div class="full my-2"> <readonly-form label="TCP Net of Reservation" :value="payment.net_total_contract_price" /> </div>
                        <div class="flex gap-4 my-2">
                            <div class="w-1/2"> <readonly-form label="Discount (%):" :value="payment.spot_cash_discount_less_percentage" /> </div>
                            <div class="w-1/2"> <readonly-form label="Discount Amount (PHP)" :value="payment.spot_cash_discount_less_amount" /> </div>
                        </div>
                        <div class="full my-2"> <readonly-form label="Total TCP Payable" :value="payment.balance_total_contract_price" /> </div>
                        <div class="full my-2">
                            <label-component label="TCP Balance:"/>
                            <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                <input type="text"
                                    v-model="running_balance"
                                    class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                    readonly disabled>
                            </div>
                        </div>
                        <div class="full my-2">
                            <label-component label="Total Payments Made:"/>
                            <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                <input type="text"
                                    v-model="total_payments_made"
                                    class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                    readonly disabled>
                            </div>
                        </div>
                    </div>

                    <!-- DEFERRED CASH -->
                    <div class="w-full" v-if="payment.reservation_type == 4">
                        <div class="full my-2"> <readonly-form label="TCP Net of Reservation" :value="payment.balance_amount_after_reservation" /> </div>
                        <div class="full my-2"> <readonly-form label="Number of months payable" :value="payment.installment_months" /> </div>
                        <div class="full my-2"> <readonly-form label="Monthly Amortization" :value="payment.monthly_installment" /> </div>
                        <div class="full my-2">
                            <label-component label="TCP Balance:"/>
                            <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                <input type="text"
                                    v-model="running_balance"
                                    class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                    readonly disabled>
                            </div>
                        </div>
                        <div class="full my-2">
                            <label-component label="Total Payments Made:"/>
                            <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                                <input type="text"
                                    v-model="total_payments_made"
                                    class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                    readonly disabled>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 py-1"
                    v-else-if="payment.reservation_type > 4 && payment.reservation_type < 8">
                    <div class="flex gap-4">
                        <div class="w-2/5"> <readonly-form label="Last Name" :value="buyer.last_name" /> </div>
                        <div class="w-2/5"> <readonly-form label="First Name" :value="buyer.first_name" /> </div>
                        <div class="w-1/5"> <readonly-form label="M.I." :value="buyer.middle_initial" /> </div>
                    </div>
                    <div class="full"> <readonly-form label="Total Contract Price" :value="payment.total_contract_price" /> </div>
                    <div class="flex gap-4">
                        <div class="w-1/2"> <readonly-form label="Project" :value="buyer.project.name" /> </div>
                        <div class="w-1/2"> <readonly-form label="Phase" :value="buyer.phase" /> </div>
                    </div>

                    <div class="full">
                        <label-component label="Running TCP Balance:"/>
                        <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                            <input type="text"
                                v-model="running_tcp_balance"
                                class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                readonly disabled>
                        </div>
                    </div>

                    <div class="flex gap-4">
                        <div class="w-1/2"> <readonly-form label="Block" :value="buyer.block.name" /> </div>
                        <div class="w-1/2"> <readonly-form label="Lot" :value="buyer.lot.name" /> </div>
                    </div>
                    <div class="full">
                        <label-component label="Total Payments Made:"/>
                        <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
                            <input type="text"
                                v-model="total_payments_made"
                                class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                                readonly disabled>
                        </div>
                    </div>
                </div>

                <!-- <div v-else> RESERVATION TYPE ERROR  </div> -->

                <div class="mb-8">
                    <div class="full my-4 bg-gray-200">
                        <p class="text-center p-2 font-semibold text-lg"> PAYMENT DETAILS </p>
                    </div>

                    <div class="flex">
                        <div class="w-3/5 flex">
                            <div class="w-full"> <p class="text-center border border-gray-500 bg-gray-100 text-sm font-semibold"> Payment Date </p> </div>
                            <div class="w-full"> <p class="text-center border border-gray-500 bg-gray-100 text-sm font-semibold"> Transaction/A.R. Date </p> </div>
                            <div class="w-full"> <p class="text-center border border-gray-500 bg-gray-100 text-sm font-semibold"> Reference No. </p> </div>
                            <div class="w-full"> <p class="text-center border border-gray-500 bg-gray-100 text-sm font-semibold"> OR/AR No. </p> </div>
                        </div>

                        <div class="w-1/5 flex">
                            <div class="w-1/2"> <p class="text-center border border-gray-500 bg-gray-100 text-sm font-semibold"> Amount </p> </div>
                            <div class="w-1/2"> <p class="text-center border border-gray-500 bg-gray-100 text-sm font-semibold"> Penalty </p> </div>
                        </div>
                        <div class="w-1/5">
                            <p class="text-center border border-gray-500 bg-gray-100 text-sm font-semibold"> Remarks </p>
                        </div>
                    </div>

                    <div v-for="buyer_payment in buyer_payments" :key="buyer_payment.id">
                        <single-payment v-bind:buyer_payment="buyer_payment"/>
                    </div>

                    <div class="flex items-center mx-auto justify-center gap-8 mt-8">
                        <button type="button" v-if="buyer.status" v-on:click="addPayment"
                            class="bg-gray-500 p-4 w-1/4 align-middle text-white font-regular border rounded-md mb-4">
                            + Add Payment
                        </button>
                        <button type="button" v-if="buyer.status" v-on:click="exportPayment"
                            class="bg-gray-500 p-4 w-1/4 align-middle text-white font-regular border rounded-md mb-4">
                            Export Payment
                        </button>
                    </div>

                    <div> ... </div>
                </div>

            </div>
        </div>
    </div>
</template>


<script>
    import Label from '../components/v2/Label.vue'
    import Header from '../components/v2/Header'
    import ReadOnlyForm from '../components/v2/ReadonlyInput'
    import SinglePayment from '../components/v2/SinglePayment'
    import { ipcRenderer } from 'electron'
    
    export default ({
        components: {
            'main-header': Header,
            'readonly-form': ReadOnlyForm,
            'single-payment': SinglePayment,
            'label-component': Label
        },
        data() {
            return {
                buyer: {},
                payment: {},
                buyer_payments: {},

                total_payments_made: 0,
                running_equity_balance: 0,
                running_tcp_balance: 0,
                running_balance: 0,
                isFetchingData: false // change to true
            }
        },
        created() {
            this.buyer = this.$route.params.buyer
            this.payment = this.$route.params.buyer.payment
            console.log('this.buyer', this.buyer)
            this.getPaymentDetails(this.$route.params.id)
        },
        methods: {
            getPaymentDetails(buyer_id) {
                console.log('getPaymentDetails HL', buyer_id)

                const dataToSubmit = { id: this.buyer.id, payment: this.new_payment}
                ipcRenderer.send('fetchPaymentsList', dataToSubmit)
                ipcRenderer.once('fetchedPaymentsList', (event, data) => {
                    console.log('fetchedPaymentsList', data)
                    if(data.response == 1) {
                        console.log('Fetch Buyer Payment Details SUCCESSFUL')
                        this.buyer_payments = data.buyer_payments
                        
                        console.log(this.buyer_payments, typeof(this.buyer_payments))
                        console.log('RESERVATION TYPE', this.payment.reservation_type)
                        if(this.buyer_payments.length > 0) {
                            this.buyer_payments.forEach(buyer_payment => {
                                if(buyer_payment.isDeductible) {
                                    this.total_payments_made = this.total_payments_made + buyer_payment.amount
                                    console.log('PAYMENTS MADE', this.total_payments_made, buyer_payment)
                                    this.running_tcp_balance = this.payment.total_contract_price - this.total_payments_made
                                    if(this.payment.reservation_type == 1) {
                                        this.running_equity_balance = this.payment.equity_net_of_reservation_fee - this.total_payments_made
                                    } else if(this.payment.reservation_type == 2) {
                                        this.running_balance = this.payment.equity_net_of_reservation_fee - this.total_payments_made
                                    } else if(this.payment.reservation_type == 3) {
                                        console.log('this.payment.balance_total_contract_price', this.payment.balance_total_contract_price)
                                        this.running_balance = this.payment.balance_total_contract_price - this.total_payments_made
                                    } else if(this.payment.reservation_type == 4) {
                                        this.running_balance = this.payment.balance_amount_after_reservation - this.total_payments_made
                                    } else {
                                        // reservation type for lot only
                                    }
                                }
                            })
                        } else {
                            console.log ('No payments yet')
                            if(this.payment.reservation_type == 1) {
                                this.running_equity_balance = this.payment.equity_net_of_reservation_fee
                            } else if(this.payment.reservation_type == 2) {
                                this.running_balance = this.payment.equity_net_of_reservation_fee
                            } else if(this.payment.reservation_type == 3) {
                                this.running_balance = this.payment.balance_total_contract_price
                            } else if(this.payment.reservation_type == 4) {
                                this.running_balance = this.payment.balance_amount_after_reservation
                            } else {

                            }
                        }
                        

                         setTimeout(() => {}, 2000)
                    } else {
                        alert('Fetch Buyer Payment Details ERROR')
                        console.log('Fetch Buyer Payment Details ERROR')
                    }

                    this.isFetchingData = false
                })
            },
            addPayment() {
                console.log('add payment', this.payment)
                this.$router.push({ name: "Add-Payment", params: { id: this.buyer.id, buyer: this.buyer, payment: this.payment }})
            },
            formatDisplay(value) {
               return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            },
            exportPayment() {
                console.log('Exporting Payment for Buyer', this.buyer)
                console.log('THIS.PAYMENT', this.buyer_payments)
                const { project, block, lot } = this.buyer
                const reservation = this.buyer.payment
                const buyer_payments = this.buyer_payments

                var xl = require('excel4node');
                var wb = new xl.Workbook();
                const ws = wb.addWorksheet('RA-Form 2A-LO Spot Cash');

                let r = 1   // row
                const s = 4 // initial size
                const col = { 'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9, 'J': 10, 'K': 11, 'L': 12, 'M': 13, 'N': 14 }

                // ws.column(col['A']).setWidth(s*2)
                // ws.column(col['B']).setWidth(s*2)
                // ws.column(col['C']).setWidth(s*2)
                // ws.column(col['D']).setWidth(s*2)
                // ws.column(col['E']).setWidth(s*2)
                // ws.column(col['F']).setWidth(s*2)
                // ws.column(col['G']).setWidth(s*2)
                // ws.column(col['H']).setWidth(s*4)
                // ws.column(col['I']).setWidth(s*4)

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
                ws.cell(r, col['I']).string(project.name).style(bold_header_style).style({font: {size: 10}, alignment: {horizontal: 'right'}})
                ws.cell(++r, col['A'], ++r, col['H'], true).string('133 MC Briones St., Hi-way Bakilid, Mandaue City 6014 Tel#: 032 414-5103, 09564791879 Email: tumabinidevelopment@gmail.com').style(regular_style).style(aligned_style).style({font: {size: 8}})
                ws.cell(r-1, col['I']).string(project.location).style(regular_style).style({font: {size: 8}, alignment: {horizontal: 'right'}})

                ws.cell(++r, col['A'], r, col['I'], true).string('STATEMENT OF ACCOUNT').style(bordered_style).style(aligned_style).style(header_style)

                ws.cell(++r, col['A'], r, col['I'], true).string('DETAILS OF PAYMENT').style(bordered_style).style(aligned_style).style(header_style)

                if(reservation.reservation_type == 1) {
                    // format
                }

                this.buyer_payments.forEach(buyer_payment => {
                    // s.cell(++r, col['A'], r, col['I'], true).string('sample').style(bordered_style).style(aligned_style).style(header_style)
                    let amount = this.formatDisplay(buyer_payment.amount.toString())
                    let penalty = this.formatDisplay(buyer_payment.penalty.toString())
                    let transaction_date = buyer_payment.transaction_date.toDateString()
                    let payment_date = buyer_payment.payment_date.toDateString()
                    let { reference_no, or_ar_no, remarks } = buyer_payment
                    

                    ws.cell(++r, col['A'], r, col['B'], true).string(payment_date).style(bordered_style).style(aligned_style).style(regular_style)
                    ws.cell(r, col['C'], r, col['D'], true).string(reference_no).style(bordered_style).style(aligned_style).style(regular_style)
                    ws.cell(r, col['E'], r, col['F'], true).string(or_ar_no).style(bordered_style).style(aligned_style).style(regular_style)
                    ws.cell(r, col['G'], r, col['H'], true).string(transaction_date).style(bordered_style).style(aligned_style).style(regular_style)
                    ws.cell(r, col['I'], r, col['J'], true).string(amount).style(bordered_style).style(aligned_style).style(regular_style)
                    ws.cell(r, col['K'], r, col['L'], true).string(penalty).style(bordered_style).style(aligned_style).style(regular_style)
                    ws.cell(r, col['M'], r, col['N'], true).string(remarks).style(bordered_style).style(aligned_style).style(regular_style)
                    
                })
                // to change destination path
                wb.write(`./sample-payment.xlsx`);
                // wb.write(`./outputs/${buyer_name}.xlsx`);
                console.log('Done Exporting Payment for Buyer', this.buyer.id)
            }
        }
    })
</script>