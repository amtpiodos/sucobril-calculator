const buyer_info = {
    namespaced: true,
    state: {
        project: {},
        block: {},
        lot: {},
        phase: {},
        unit_details: {}

    },
    mutations: {
        reset: () => {},
        SET_PROJECT(state, data) {
            state.project = data
        },
        SET_BLOCK(state, data) {
            state.block = data
        },
        SET_LOT(state, data) {
            state.lot = data
        },
        SET_PHASE(state, data) {
            state.phase = data
        },
        SET_UNIT_DETAILS(state, data) {
            state.unit_details = data
        }
    },
    actions: {
        setProject(context, data) {
            context.commit('SET_PROJECT', data)
        },
        setBlock(context, data) {
            context.commit('SET_BLOCK', data)
        },
        setLot(context, data) {
            context.commit('SET_LOT', data)
        },
        setPhase(context, data) {
            context.commit('SET_PHASE', data)
        },
        setUnitDetails(context, data) {
            context.commit('SET_UNIT_DETAILS', data)
        }
    }
}

export default buyer_info;