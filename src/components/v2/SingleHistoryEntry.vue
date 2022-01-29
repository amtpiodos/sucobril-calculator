<template>
    <div class="my-2 bg-gray-100 border-2 border-gray-100 border-opacity-100 rounded-md px-3 py-2 mx-24 flex
        hover:bg-gray-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50">

            <div class="w-2/3 my-auto flex"> 
                <p class="w-1/3 text-xs leading-tight font-regular text-center"> {{ entry.date_of_change.toDateString() }}
                <p class="w-1/3 text-xs leading-tight font-regular text-center"> {{ entry.action }} - {{ entry.object_type }} </p>
                <p class="w-1/3 text-xs leading-tight font-regular text-center"> {{ entry.object_field }} </p>
                <p class="w-1/2 text-xs leading-tight font-regular text-center"> {{ entry.object_name }} </p>
            </div>
            <div class="w-1/3 my-auto flex">
                <p class="w-1/3 text-xs leading-tight font-semibold text-center"> {{ entry.old_value }} </p>
                <p class="w-1/3 text-xs leading-tight font-semibold text-center"> {{ entry.new_value }} </p>
                <div class="w-1/3 items-center justify-center flex">
                        <input type="checkbox" class="form-checkbox" v-model="entry.isUpdatedInMasterList" readonly disabled/>
                    
                </div>
            </div>
    </div>
</template>

<script>
    export default ({
        props: ['entry']
    })
</script>