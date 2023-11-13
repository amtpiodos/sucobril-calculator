const full_details = {
    namespaced: true,
    state: {
        details: {}
    },
    mutations: {
        reset: () => {},
        SET_DETAILS(state, data) {
            state.details = data
        }
    },
    actions: {
        setDetails(context, data) {
            context.commit('SET_DETAILS', data)
        }
    }
}

export default full_details;