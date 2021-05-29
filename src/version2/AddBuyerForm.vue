<template>
    <div>
        <main-header />
        <div class="my-8 mx-24 px-5">
            <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 p-1">
                <div class="full px-4"> <input-form label="Buyer's Name" v-model="buyer" /> </div>
                <div class="full px-4"> <readonly-form label="Date" v-bind:value="date" /> </div>
                <div class="full px-4"> <readonly-form label="Project Name" v-model="project" /> </div>
                <div class="full px-4"> <readonly-form label="Block" v-bind:value="block" /> </div>
                <div class="full px-4"> <readonly-form label="Phase" v-model="phase" /> </div>
                <div class="full px-4"> <readonly-form label="Price/Sq.M" v-bind:value="price" /> </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Header from '../components/v2/Header'
    import InputForm from '../components/v2/InputForm'
    import ReadOnlyForm from '../components/v2/ReadonlyInput'

    export default({
        components: {
            'main-header': Header,
            'input-form': InputForm,
            'readonly-form': ReadOnlyForm
        },
        data() {
            return {
                buyer: '',
                date: 'ajkds',
                project: this.$store.state.buyer_info.project_id,
                block: '3',
                phase: '',
                price: ''
            }
        }
    })
</script>