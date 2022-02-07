import { search } from '@/api/searchService';
import { createSession, deleteSession, refreshSession, SessionCreateParams } from '@/api/sessionService';
import { createSource, fetchSources, SourceCreateParams } from '@/api/sourceService';
import { createUser, UserCreateParams } from '@/api/userService';
// import { createBlankSearxResults } from '@/lib/searx-utils';
import { createBlankUser } from '@/lib/user-utils';
import { uniqInPlace } from '@/lib/utils';
import JsonApi from '@/types/JsonApi';
import SearxResult from '@/types/SearxResult';
// import SearxResults from '@/types/SearxResults';
import Source from '@/types/Source';
import User from '@/types/User';
import Comment from '@/types/Comment';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

(window as any).uniqInPlace = uniqInPlace;

// TODO: switch to pinia
export default new Vuex.Store({
  // TODO: this should be a function
  state: {
    query: "",
    // results: [] as SearchResult[],
    // results: createBlankSearxResults(),
    darkMode: localStorage.getItem("birdybop:settings:darkMode") === "true"
      || (!!window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches),
    results: [] as SearxResult[],
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
    db: {
      comment: [] as Comment[],
      searxResult: [] as SearxResult[],
      source: [] as Source[],
      user: [] as User[],
    },
  },

  getters: {
    isLoggedIn(state): boolean {
      return parseInt(state.user.id, 10) > 0;
    },
  },

  mutations: {
    setDarkMode(state, darkMode: boolean): void {
      localStorage.setItem("birdybop:settings:darkMode", `${darkMode}`);
      state.darkMode = darkMode;
    },

    addToDb(state, resourceData: JsonApi.ResourceData | JsonApi.ResourceData[]): void {
      const db = state.db as Record<string, JsonApi.ResourceData[]>;
      const types = new Set<string>();

      const addResource = (item: JsonApi.ResourceData): void => {
        types.add(item.type);
        const collection = db[item.type];
        collection.push(item);
      };

      if (Array.isArray(resourceData)) {
        resourceData.forEach(item => addResource(item));
      } else {
        addResource(resourceData);
      }

      types.forEach((itemType) => {
        const collection = db[itemType];
        uniqInPlace(collection, item => item.id);
      });
    },

    setQuery(state, query: string): void {
      state.query = query;
    },

    setResults(state, results: SearxResult[]): void {
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
      return search(q).then((results) => {
        // TODO: This, but for the other API calls
        const { data, included } = results;
        if (included) commit("addToDb", included);
        commit("setResults", data);
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
