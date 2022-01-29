<template>
    <div>
        <main-header />
        <div class="flex mt-2 mx-24">
                <div class="w-2/5">
                    <div class="text-xs font-bold"> TUMABINI REAL ESTATE DEVELOPMENT </div>
                    <div class="text-xs"> 133 MC Briones St., Hiway Bakilid, Mandaue City 6014 </div>
                    <div class="text-xs"> Contact: (032) 260-1522  Email: tumabinidevelopment@gmail.com </div>
                </div>
                <div class="w-1/2 flex items-right justify-right gap-2"> </div>
                <div class="w-1/4 flex items-right justify-right gap-2">
                    <button type="button" 
                        class="bg-gray-500 mx-2 p-4 w-full items-center align-center text-white text-sm font-regular border rounded-md">
                        Export History
                    </button>
                </div>
                <div class="w-1/4 flex items-right justify-right gap-2">
                    <button type="button" v-on:click="requestUpdateMasterList"
                        class="bg-gray-500 mx-2 p-4 w-full items-center align-center text-white text-sm font-regular border rounded-md">
                        Update Masterlist
                    </button>
                </div>
            </div>

            <!-- CHECK FOR MANAGER CREDENTIALS IF REQUESTING FOR EDIT -->
            <div class="mx-24 full m-4 border-4 rounded-md" v-if="this.isRequestingEdit">
                <p class="align-middle text-center text-md font-bold my-1 py-4 pt-8"> INPUT CREDENTIALS TO EDIT </p>
                <div class="w-full flex mx-auto justify-center items-center my-2 gap-4">
                    <input-form label="Username:" v-model="inputtedCredentials.username"/>
                    <password-form label="Password: " v-model="inputtedCredentials.password"/>
                </div>
                <p class="align-middle text-center text-sm text-red-700 font-bold my-1 py-2" v-if="this.incorrectCredentials"> Incorrect credentials. Please try again. </p>
                <div class="w-full flex mx-auto justify-center items-center my-4 gap-4">
                    <button type="button" v-on:click="checkCredentials"
                        class="w-1/5 bg-gray-200 p-2 align-middle text-black font-bold border rounded-md my-2">
                        SUBMIT
                    </button>
                    <button type="button" v-on:click="cancelEdit"
                        class="w-1/5 bg-gray-200 p-2 align-middle text-black font-bold border rounded-md my-2">
                        CANCEL
                    </button>
                </div>
            </div>

        <div class="py-4 my-4 flex mx-24 bg-gray-300">
            <!-- <div class="w-1/6 my-auto"> <p class="text-xs leading-tight font-semibold text-center"> DATE </p> </div> -->
            <!-- <div class="w-1/6 my-auto"> <p class="text-xs leading-tight font-semibold"> FIELD </p> </div> -->
            <div class="w-2/3 my-auto flex"> 
                <p class="w-1/3 text-xs leading-tight font-semibold text-center"> DATE </p>
                <p class="w-1/3 text-xs leading-tight font-semibold text-center"> ACTION - TYPE  </p>
                <p class="w-1/3 text-xs leading-tight font-semibold text-center"> FIELD  </p>
                <p class="w-1/2 text-xs leading-tight font-semibold text-center"> NAME </p>
            </div>

            <div class="w-1/3 my-auto flex">
                <p class="w-1/3 text-xs leading-tight font-semibold text-center"> OLD VALUE </p>
                <p class="w-1/3 text-xs leading-tight font-semibold text-center"> NEW VALUE </p>
                <p class="w-1/3 text-xs leading-tight font-semibold text-center"> Updated in MasterList </p>
            </div>
        </div>

        <div v-for="entry in historyList" :key="entry.id">
            <!-- <single-entry :entry="entry" v-on:click.native="openModal(entry.id)" /> -->
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
                            <input type="checkbox" class="form-checkbox" v-model="entry.isUpdatedInMasterList"/>
                        
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import { ipcRenderer } from 'electron'
    import Header from '../components/v2/Header'
    import SingleEntry from '../components/v2/SingleHistoryEntry.vue'
    import InputForm from '../components/v2/InputForm'
    import PasswordForm from '../components/v2/PasswordForm'

    export default({
        components: {
            'main-header': Header,
            'single-entry': SingleEntry,
            'input-form': InputForm,
            'password-form': PasswordForm,
        },
        data() {
            return {
                historyList: {},
                updatedInMasterList: [],

                isRequestingEdit: false,
                incorrectCredentials: false,
                credentials: {
                    username: 'ACCOUNTANT',
                    password: 'password123'
                },
                inputtedCredentials: {
                    username: '',
                    password: ''
                },
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
                
            },
            updateMasterList() {

            },
            cancelEdit() {
                // this.clickedPaymentID = 0
                this.inputtedCredentials = { username: '', password: ''}
                this.incorrectCredentials = false
                this.isRequestingEdit = false
            },
            checkCredentials() {
                console.log('CHECKING CREDENTIALS', this.inputtedCredentials)
                if( this.credentials.username == this.inputtedCredentials.username.toUpperCase() &&
                    this.credentials.password == this.inputtedCredentials.password ) {
                        console.log('CREDENTIALS MATCHED')
                        // route to editing ?
                        this.$router.push({ name: 'Update-Masterlist',
                                            params: {   historyList: this.historyList }})
                        this.isRequestingEdit = false
                } else {
                    this.incorrectCredentials = true
                }
            },
            requestUpdateMasterList() {
                this.isRequestingEdit = true
            }
        }
    })

</script>