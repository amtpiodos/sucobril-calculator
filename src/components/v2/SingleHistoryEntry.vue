<template>
    <div class="my-2 bg-gray-100 border-2 border-gray-100 border-opacity-100 rounded-md px-3 py-2 mx-24 flex
        hover:bg-gray-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50">

        <!-- <div class="py-2 flex">
            <div class="w-1/6 my-auto mx-2"> <p class="text-xs leading-tight font-regular "> {{ entry.changed_date }} </p> </div>
            <div class="w-1/6 my-auto mx-2"> <p class="text-xs leading-tight font-regular"> {{ entry.asset_code }} </p> </div>
            <div class="w-2/6 my-auto mx-2"> <p class="text-xs leading-tight font-regular"> {{ entry.description }} </p> </div>
            <div class="w-1/6 my-auto mx-2"> <p class="text-xs leading-tight font-regular "> {{ entry.complex }} </p> </div>
            <div class="w-1/6 my-auto mx-2"> <p class="text-xs leading-tight font-regular"> {{ entry.month_period }} </p> </div>
            <div class="w-1/6 my-auto mx-2"> <p class="text-xs leading-tight font-semibold"> Php {{ entry.disbursed_amount - expense.returned_amount }} </p> </div>
        </div> -->

            <div class="w-1/6 my-auto"> <p class="text-xs leading-tight font-regular text-center"> {{ entry.date_of_change }} </p> </div>
            <div class="w-1/2 my-auto flex"> 
                <p class="w-2/3 text-xs leading-tight font-regular text-center"> {{ entry.action }} - {{ entry.object_type }} </p>
                <p class="w-1/3 text-xs leading-tight font-regular text-center"> {{ entry.object_field }} </p>
                <p class="w-1/2 text-xs leading-tight font-regular text-center"> {{ entry.object_name }} </p>
            </div>
            <div class="w-1/6 my-auto"> <p class="text-xs leading-tight font-regular text-center"> {{ entry.old_value }} </p> </div>
            <div class="w-1/6 my-auto"> <p class="text-xs leading-tight font-regular text-center"> {{ entry.new_value }} </p> </div>
     

    </div>
</template>

<script>
    export default ({
        props: ['entry']
    })
</script>