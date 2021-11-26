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

        <div class="py-4 my-4 flex mx-24 bg-gray-300">
            <div class="w-1/6 my-auto"> <p class="text-xs leading-tight font-semibold text-center"> DATE </p> </div>
            <!-- <div class="w-1/6 my-auto"> <p class="text-xs leading-tight font-semibold"> FIELD </p> </div> -->
            <div class="w-1/2 my-auto flex"> 
                <p class="w-2/3 text-xs leading-tight font-semibold text-center"> ACTION - TYPE  </p>
                <p class="w-1/3 text-xs leading-tight font-semibold text-center"> FIELD  </p>
                <p class="w-1/2 text-xs leading-tight font-semibold text-center"> NAME </p>
            </div>

            <div class="w-1/6 my-auto"> <p class="text-xs leading-tight font-semibold text-center"> OLD VALUE </p> </div>
            <div class="w-1/6 my-auto"> <p class="text-xs leading-tight font-semibold text-center"> NEW VALUE </p> </div>
        </div>

        <div v-for="entry in historyList" :key="entry.id">
            <single-entry :entry="entry" v-on:click.native="openModal(entry.id)" />
        </div>

    </div>
</template>

<script>
    import { ipcRenderer } from 'electron'
    import Header from '../components/v2/Header'
    import SingleEntry from '../components/v2/SingleHistoryEntry.vue'

    export default({
        components: {
            'main-header': Header,
            'single-entry': SingleEntry
        },
        data() {
            return {
                historyList: {}
            }
        },
        created() {
            this.fetchHistory()
        },
        methods: {
            fetchHistory() {
                ipcRenderer.send('fetchHistoryList')
                ipcRenderer.once('fetchedHistoryList', (event, data) => {
                    console.log('fetchedHistoryList', data)
                    // add isFetching/isLoading
                    if(data.response && data.response == 1) {
                        this.historyList = data.list
                    } else {
                        alert('FETCHING HISTORY LIST ERROR')
                    }
                })
            },
            openModal(id) {
                
            }
        }
    })

</script>