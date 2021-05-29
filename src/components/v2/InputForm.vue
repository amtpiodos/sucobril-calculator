<template>
    <div>
        <label for="text" 
            class="block text-sm font-bold uppercase leading-5 text-black px-1">
            {{ label }}
        </label>
        <div class="mt-1 relative rounded-md shadow-sm">
            <input type="text"
                v-model="inputVal"
                class="form-input block border border-gray-200 rounded-md w-full py-2 text-lg px-4 uppercase " >
        </div>
    </div>
</template>

<script>
    export default ({
        props: ['label', 'value'],
        computed: {
            inputVal: {
                get() {
                    return this.value
                },
                set(val) {
                    this.$emit('input', val)
                }
            }
        },
    })
</script>