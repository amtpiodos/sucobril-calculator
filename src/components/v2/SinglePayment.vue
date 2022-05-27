<template>
    <div :class="style_class">
        <div class="w-4/6 flex">
            <div class="w-full"> <p class="text-center text-xs font-regular uppercase break-all"> {{ formatDate(buyer_payment.payment_date) }} </p> </div>
            <div class="w-full"> <p class="text-center text-xs font-regular break-all"> {{ buyer_payment.remarks }} </p> </div>
            <div class="w-full"> <p class="text-center text-xs font-regular break-all"> {{ buyer_payment.payment_via }} </p> </div>
            <div class="w-full"> <p class="text-center text-xs font-regular break-all uppercase"> {{ buyer_payment.transaction_code }} </p> </div>
            <div class="w-full"> <p class="text-center text-xs font-regular break-all uppercase"> {{ buyer_payment.reference_no }} </p> </div>
        </div>
        <div class="w-2/6 flex">
            <div class="w-full"> <p class="text-center text-xs font-semibold break-all uppercase"> ₱{{ formatDisplay(buyer_payment.amount.toFixed(2)) }} </p> </div>
            <div class="w-full"> <p class="text-center text-xs font-semibold break-all uppercase"> ₱{{ formatDisplay(buyer_payment.penalty.toFixed(2)) }} </p> </div>
            <div class="w-full"> <p class="text-center text-xs font-regular break-all uppercase"> {{ buyer_payment.or_ar_no }} </p> </div>
        </div>
        <!-- <div class="w-1/3">
            <p class="text-center border border-gray-500 bg-gray-100 text-xs font-regular"> {{ buyer_payment.remarks }} </p>
        </div> -->
    </div>
</template>

<script>
    export default ({
        props: ['buyer_payment'],
        data() {
            return {
                style_class: '',
           }
        },
        created() {
            if(this.buyer_payment.or_ar_no.length <= 0) {
                this.style_class = "my-1 flex overflow-auto bg-yellow-100 border border-gray-500 border-opacity-100 rounded-md px-3 py-2 hover:bg-yellow-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
            } else {
                this.style_class = this.buyer_payment.isDeductible
                    ? "my-1 flex overflow-auto bg-gray-100 border border-gray-500 border-opacity-100 rounded-md px-3 py-2 hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
                    : "my-1 flex overflow-auto bg-green-200 border border-gray-500 border-opacity-100 rounded-md px-3 py-2 hover:bg-green-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
            }
        },
        methods: {
            formatDisplay(value) {
                return value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : value
            },
            formatDate(value) {
                return value && value.toDateString() ? value.toDateString().replace(/^\S+\s/,'') : value
            },
        }
    })
</script>