import { searchSourcePages } from '@/api/searchService';
import { createSession, deleteSession, refreshSession, SessionCreateParams } from '@/api/sessionService';
import { createSource, fetchSources, SourceCreateParams } from '@/api/sourceService';
import { createUser, UserCreateParams } from '@/api/userService';
import { createBlankUser } from '@/lib/user-utils';
import SearchResult from '@/types/SearchResult';
import Source from '@/types/Source';
import User from '@/types/User';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// TODO: switch to pinia
export default new Vuex.Store({
  // TODO: this should be a function
  state: {
    query: "",
    results: [] as SearchResult[],
    searching: false,
    sources: [] as Source[],
    loadingSources: false,
    user: createBlankUser(),
    creatingUser: false,
    creatingSession: false,
    refreshingSession: false,
    deletingSession: false,
    intendedDestination: "",
    creatingSource: false,
  },

  getters: {
    isLoggedIn(state): boolean {
      return parseInt(state.user.id, 10) > 0;
    },
  },

  mutations: {
    setQuery(state, query: string): void {
      state.query = query;
    },

    setResults(state, results: SearchResult[]): void {
      state.results = results;
    },

    setSearching(state, searching: boolean): void {
      state.searching = searching;
    },

    setSources(state, sources: Source[]): void {
      state.sources = sources;
    },

    setLoadingSources(state, loadingSources: boolean): void {
      state.loadingSources = loadingSources;
    },

    setUser(state, user: User): void {
      state.user = user;
    },

    setCreatingUser(state, creatingUser: boolean): void {
      state.creatingUser = creatingUser;
    },

    setCreatingSession(state, creatingSession: boolean): void {
      state.creatingSession = creatingSession;
    },

    setRefreshingSession(state, refreshingSession: boolean): void {
      state.refreshingSession = refreshingSession;
    },

    setDeletingSession(state, deletingSession: boolean): void {
      state.deletingSession = deletingSession;
    },

    setIntendedDestination(state, intendedDestination: string): void {
      state.intendedDestination = intendedDestination;
    },

    clearIntendedDestination(state): void {
      state.intendedDestination = "";
    },

    setCreatingSource(state, creatingSource: boolean): void {
      state.creatingSource = creatingSource;
    },

    addSource(state, source: Source): void {
      state.sources.unshift(source);
    },
  },

  actions: {
    search({ commit }, query: string): Promise<void> {
      const q = query.trim();
      commit("setQuery", q);
      commit("setSearching", true);
      commit("setResults", []);
      return searchSourcePages(q).then((results) => {
        commit("setResults", results);
      }).finally(() => {
        commit("setSearching", false);
      });
    },

    fetchSources({ commit }): Promise<void> {
      commit("setLoadingSources", true);
      return fetchSources().then((sources) => {
        commit("setSources", sources);
      }).finally(() => {
        commit("setLoadingSources", false);
      });
    },

    createUser({ commit }, params: UserCreateParams): Promise<void> {
      commit("setCreatingUser", true);
      return createUser(params).then((user) => {
        commit("setUser", user);
      }).finally(() => {
        commit("setCreatingUser", false);
      });
    },

    createSession({ commit }, params: SessionCreateParams): Promise<void> {
      commit("setCreatingSession", true);
      return createSession(params).then((user) => {
        commit("setUser", user);
      }).finally(() => {
        commit("setCreatingSession", false);
      });
    },

    refreshSession({ commit }): Promise<void> {
      commit("setRefreshingSession", true);
      return refreshSession().then((user) => {
        commit("setUser", user);
      }).finally(() => {
        commit("setRefreshingSession", false);
      });
    },

    deleteSession({ commit }): Promise<void> {
      commit("setDeletingSession", true);
      return deleteSession().then(() => {
        commit("setUser", createBlankUser());
      }).finally(() => {
        commit("setDeletingSession", false);
      });
    },

    createSource({ commit }, params: SourceCreateParams): Promise<void> {
      commit("setCreatingSource", true);
      return createSource(params).then((source) => {
        commit("addSource", source);
      }).finally(() => {
        commit("setCreatingSource", false);
      });
    },
  },

  modules: {
    // ...
  },
});
