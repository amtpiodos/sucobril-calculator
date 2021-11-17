<template>
    <div>
        <div v-if="hasLabel">
            <label-component :label="label"/>
        </div>

         <div class="mt-1 relative rounded-md shadow-sm h-32 w-full" v-if="readOnly">
            <input type="text"
                v-model="inputVal"
                class="h-full form-input block border border-gray-200 rounded-md w-full py-2 text-md px-4" readonly disabled >
        </div>
        <div class="mt-1 relative rounded-md shadow-sm h-32 w-full" v-else>
            <input type="text"
                v-model="inputVal"
                class="h-full form-input block border border-gray-200 rounded-md w-full py-2 text-md px-4" >
        </div> 
    </div>
</template>

<script>
    import Label from './Label.vue'
    export default ({
        components: {
            'label-component': Label
        },
        props: ['label', 'value', 'readonly'],
        data() {
            return {
                hasLabel: this.label ? true : false,
                readOnly: this.readonly ? true : false
            }
        },
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