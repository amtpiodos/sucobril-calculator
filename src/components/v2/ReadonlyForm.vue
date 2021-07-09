<template>
    <div class="grid grid-cols-1 gap-4 mx-8 my-4 p-1">
        {{ buyer }}
        <div class="flex px-4 gap-4">
            <div class="w-2/5"> <readonly-input label="Last Name" v-bind:value="details.last_name" /> </div>
            <div class="w-2/5"> <readonly-input label="First Name" :value="details.first_name" /> </div>
            <div class="w-1/5"> <readonly-input label="M.I." :value="buyer.middle_initial" /> </div>
        </div>
    </div>
</template>

<script>

    import ReadOnlyInput from '../v2/ReadonlyInput.vue'

    export default ({
        props: ['details'],
        components: {
            'readonly-input': ReadOnlyInput
        },
        data() {
            return {
                buyer : this.details
            }
        },
        mounted() {
            console.log('READONLY FORM details', this.details)
        }
    })
</script>