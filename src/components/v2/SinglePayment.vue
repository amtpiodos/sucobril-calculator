<template>
    <div class="flex m-">
        <div class="w-1/5">
            <div class="flex">
                <div class="w-1/4"> <p class="text-center border border-gray-500 bg-gray-100 text-sm font-semibold"> No. </p> </div>
                <div class="w-3/4"> <p class="text-center border border-gray-500 bg-gray-100 text-sm font-regular"> {{ buyer_payment.date.toDateString() }} </p> </div>
            </div>
        </div>
        <div class="w-1/5">
            <p class="text-center border border-gray-500 bg-gray-100 text-sm font-regular uppercase"> {{ buyer_payment.reference_no}} </p>
        </div>
        <div class="w-1/5">
            <p class="text-center border border-gray-500 bg-gray-100 text-sm font-regular uppercase"> {{ buyer_payment.or_ar_no }} </p>
        </div>
        <div class="w-1/5">
            <p class="text-center border border-gray-500 bg-gray-100 text-sm font-regular uppercase"> {{ buyer_payment.amount }} </p>
        </div>
        <div class="w-1/5">
            <p class="text-center border border-gray-500 bg-gray-100 text-sm font-regular uppercase"> {{ buyer_payment.penalty }} </p>
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