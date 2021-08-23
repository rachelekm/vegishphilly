import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import { install, StoreCreator } from "redux-loop";
import rootReducer, { initialState } from "./reducers";

const enhancedCreateStore = createStore as StoreCreator;

export default enhancedCreateStore(rootReducer, initialState, composeWithDevTools(install()));
