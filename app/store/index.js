import Vue from 'nativescript-vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import * as ApplicationSettings from "application-settings";

const state = {
  token: null,
  info: {}
}

const getters = {
  token: (state) => {
    return state.token;
  },
  info: (state) => {
    return state.info;
  }
}

const mutations = {
  SET_TOKEN: (state, payload) => {
    state.token = payload;
  },
  SET_INFO: (state, payload) => {
    state.info = payload;
  },
  CLEAR_AUTH: (state) => {
    state.token = null;
    state.info = {};
  }
}

const actions = {
  setToken: ({ commit, state }, payload) => {
    commit('SET_TOKEN', payload);
    ApplicationSettings.setString("cz_token", JSON.stringify(payload));
    return state.token;
  },
  setInfo: ({commit, state}, payload) => {
    commit('SET_INFO', payload);
    ApplicationSettings.setString("info", user);
    return state.info;
  },
  clearAuth: ({ commit }) => {
    commit('CLEAR_AUTH');
    ApplicationSettings.remove("cz_token");
    ApplicationSettings.remove("info");
  },
  loadFromStorage: (state) => {
    const storedState = ApplicationSettings.getString("cz_token");
    const storedUser = ApplicationSettings.getString("info");
    if(storedState && storedUser) {
      const token = JSON.parse(storedState);
      const user = JSON.parse(storedUser);
      state.token = token;
      state.info = user;
    }
  }
}

export default new Vuex.Store({ state, mutations, actions, getters });