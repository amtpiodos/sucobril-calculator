const buyer_info = {
    namespaced: true,
    state: {
        buyer_details: {
            name: '',
            address: ''
        },     
        project_id: ''

    },
    mutations: {
        reset: () => {},
        SET_BUYER_DETAILS(state, data) {
            state.buyer_details = data
        },
        SET_UNIT_DETAILS(state, data) {
            state.project_id = data
        }
    },
    actions: {
        setBuyerDetails(context, data) {
            context.commit('SET_BUYER_DETAILS', data)
        },
        setUnitDetails(context, data) {
            context.commit('SET_UNIT_DETAILS', data)
        }
    }
}

export default buyer_info;