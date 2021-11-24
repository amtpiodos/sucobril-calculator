<template>
    <div>
        <main-header />

        <div class="flex my-8 mx-24 ">
            <div class="w-1/2">
                <div class="text-xs font-bold"> TUMABINI REAL ESTATE DEVELOPMENT </div>
                <div class="text-xs"> 133 MC Briones St., Hiway Bakilid, Mandaue City 6014 </div>
            </div>
            <div class="w-1/2">
                <div class="text-xs">
                    <p class="text-right"> Contact No. / Landline: (032) 260-1522 </p>
                    <p class="text-right"> Email: tumabinidevelopment@gmail.com </p>
                </div>
            </div>
        </div>

        <div class=" my-4 flex mx-24">
            <div class="w-1/6 my-auto"> <p class="text-xs leading-tight font-semibold text-center"> DATE </p> </div>
            <!-- <div class="w-1/6 my-auto"> <p class="text-xs leading-tight font-semibold"> FIELD </p> </div> -->
            <div class="w-1/2 my-auto flex"> 
                <p class="w-1/2 text-xs leading-tight font-semibold text-center"> ACTION - TYPE - FIELD </p>
                <p class="w-1/2 text-xs leading-tight font-semibold text-center"> NAME </p>
            </div>

            <div class="w-1/6 my-auto"> <p class="text-xs leading-tight font-semibold text-center"> OLD VALUE </p> </div>
            <div class="w-1/6 my-auto"> <p class="text-xs leading-tight font-semibold text-center"> NEW VALUE </p> </div>
        </div>

        <div v-for="history_entry in history" :key="history_entry.id">
            <!-- <single-expense :expense="expense" v-on:click.native="openModal(expense.id)" /> -->
        </div>

    </div>
</template>

<script>
    import Header from '../components/v2/Header'

    export default({
        components: {
            'main-header': Header
        },
        created() {
            this.fetchHistory()
        },
        methods: {
            fetchHistory() {

            },
            openModal(id) {
                
            }
        }
    })

</script>