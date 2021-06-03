const buyer_info = {
    namespaced: true,
    state: {
        buyer_details: {
            name: '',
            address: ''
        },
        project_id: '',
        project_details: {
            block_id: '',
            lot_id: ''
        }

    },
    mutations: {
        reset: () => {},
        SET_BUYER_DETAILS(state, data) {
            state.buyer_details = data
        },
        SET_UNIT_DETAILS(state, data) {
            state.project_id = data
        },
        SET_BLOCK_DETAILS(state, data) {
            state.project_details.block_id = data
        },
        SET_LOT_DETAILS(state, data) {
            state.project_details.lot_id = data
        }
    },
    actions: {
        setBuyerDetails(context, data) {
            context.commit('SET_BUYER_DETAILS', data)
        },
        setUnitDetails(context, data) {
            context.commit('SET_UNIT_DETAILS', data)
        },
        setBlockId(context, data) {
            context.commit('SET_BLOCK_DETAILS', data)
        },
        setLotId(context, data) {
            context.commit('SET_LOT_DETAILS', data)
        }
    }
}

export default buyer_info;