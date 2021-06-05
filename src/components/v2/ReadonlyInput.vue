<template>
    <div>
        <label for="text" 
            class="block text-sm font-bold uppercase leading-5 text-black px-1">
            {{ label }}
        </label>
        <div class="mt-1 relative rounded-md shadow-sm border-gray-200">
            <input type="text"
                v-model="input_value"
                class="w-full py-2 px-4 text-md border border-gray-200 rounded-md uppercase bg-gray-100"
                readonly disabled>
        </div>
    </div>
</template>

<script>
    export default ({
        props: ['label', 'value'],
        data() {
            return {
                input_value : this.value   
            }
        }
    })
</script>