<template>
    <div class="flex m-">
        <div class="w-3/5 flex">
            <div class="w-full"> <p class="text-center border border-gray-500 bg-gray-100 text-sm font-regular uppercase"> {{ buyer_payment.payment_date.toDateString() }} </p> </div>
            <div class="w-full"> <p class="text-center border border-gray-500 bg-gray-100 text-sm font-regular uppercase"> {{ buyer_payment.transaction_date.toDateString() }} </p> </div>
            <div class="w-full"> <p class="text-center border border-gray-500 bg-gray-100 text-sm font-regular uppercase"> {{ buyer_payment.reference_no }} </p> </div>
            <div class="w-full"> <p class="text-center border border-gray-500 bg-gray-100 text-sm font-regular uppercase"> {{ buyer_payment.or_ar_no }} </p> </div>
        </div>
        <div class="w-1/5 flex">
            <div class="w-1/2"> <p class="text-center border border-gray-500 bg-gray-100 text-sm font-regular uppercase"> {{ buyer_payment.amount }} </p> </div>
            <div class="w-1/2"> <p class="text-center border border-gray-500 bg-gray-100 text-sm font-regular uppercase"> {{ buyer_payment.penalty }} </p> </div>
        </div>
        <div class="w-1/5">
            <p class="text-center border border-gray-500 bg-gray-100 text-sm font-regular uppercase"> {{ buyer_payment.remarks }} </p>
        </div>
    </div>
</template>

<script>
    export default ({
        props: ['buyer_payment']
    })
</script>